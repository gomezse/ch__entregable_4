const socketClient = io();
const form = document.getElementById("product-form");
const containerProducts = document.getElementById("container-products");

form.onsubmit = (e) => {
    e.preventDefault();
    const newProduct = {
        title: form.elements['title'].value,
        description: form.elements['description'].value,
        price: form.elements['price'].value,
        thumbnail: form.elements['thumbnail'].value,
        code: form.elements['code'].value,
        stock: form.elements['stock'].value,
    };
    form.elements['title'].value = '';
    form.elements['description'].value = '';
    form.elements['price'].value = '';
    form.elements['thumbnail'].value = '';
    form.elements['code'].value = '';
    form.elements['stock'].value = '';

    socketClient.emit("newProduct", newProduct);

    socketClient.on("productOK", (product) => {

        const article = document.createElement('article');
        article.classList.add('container');
        article.id=`product-${product.id}`;

        const card = document.createElement('div');
        card.classList.add('card');

        const imgBx = document.createElement('div');
        imgBx.classList.add('imgBx');
        const img = document.createElement('img');
        img.src = product.thumbnail;
        img.height = 200;
        img.width = 150;

        const contentBx = document.createElement('div');
        contentBx.classList.add('contentBx');

        const h2 = document.createElement('h2');
        h2.textContent = product.title;

        const price = document.createElement('div');
        price.classList.add('price');
        const h3Price = document.createElement('h3');
        h3Price.textContent = `Precio: $${product.price}`;
        price.appendChild(h3Price);

        const stock = document.createElement('div');
        stock.classList.add('stock');
        const h3Stock = document.createElement('h3');
        h3Stock.textContent = `Cantidad: ${product.stock}`;
        stock.appendChild(h3Stock);

        const eliminarProducto = document.createElement('input');
        eliminarProducto.type = 'button';
        eliminarProducto.value = 'Eliminar Producto';
        eliminarProducto.onclick = ()=> {
            eliminar(product.id); 
        };
        

        // Agregar elementos al componentes
        imgBx.appendChild(img);
        contentBx.appendChild(h2);
        contentBx.appendChild(price);
        contentBx.appendChild(stock);
        contentBx.appendChild(eliminarProducto);
        card.appendChild(imgBx);
        card.appendChild(contentBx);
        article.appendChild(card);

        containerProducts.appendChild(article);
    })
};

function eliminar(pid){
    socketClient.emit("deleteProduct", pid);

    socketClient.on("deleteOK", (product) => {
        
        const productToDelete = document.getElementById('product-'+product.id);

        if(productToDelete){
            containerProducts.removeChild(productToDelete);
        }
        
    });
}

