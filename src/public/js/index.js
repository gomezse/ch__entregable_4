// Crear una instancia del cliente Socket.io
const socketClient = io();

// Obtener elementos del formulario y del contenedor de productos del DOM
const form = document.getElementById("product-form");
const containerProducts = document.getElementById("container-products");

// Escuchar el evento "submit" del formulario
form.onsubmit = (e) => {
    e.preventDefault();

    // Obtener los valores del formulario y crear un nuevo producto
    const newProduct = {
        title: form.elements['title'].value,
        description: form.elements['description'].value,
        price: form.elements['price'].value,
        thumbnail: form.elements['thumbnail'].value,
        code: form.elements['code'].value,
        stock: form.elements['stock'].value,
    };

    // Limpiar los campos del formulario
    form.elements['title'].value = '';
    form.elements['description'].value = '';
    form.elements['price'].value = '';
    form.elements['thumbnail'].value = '';
    form.elements['code'].value = '';
    form.elements['stock'].value = '';

    // Emitir un evento "newProduct" al servidor con el nuevo producto
    socketClient.emit("newProduct", newProduct);

    // Escuchar el evento "productOK" del servidor y agregar el producto a la lista
    socketClient.on("productOK", (product) => {

        if(product){
            
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

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto Agregado',
            showConfirmButton: false,
            timer: 1500
          })

        //agregar elemento al DOM
        containerProducts.appendChild(article);

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el producto',    
            })
        }

    })
};

// Función para eliminar un producto
function eliminar(pid) {
    // Emitir un evento "deleteProduct" al servidor con el ID del producto a eliminar
    socketClient.emit("deleteProduct", pid);

    // Escuchar el evento "deleteOK" del servidor y eliminar el producto de la lista
    socketClient.on("deleteOK", (product) => {
        
        // Buscar y eliminar el producto del DOM
        const productToDelete = document.getElementById('product-'+product.id);

        if(productToDelete){
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto Eliminado',
                showConfirmButton: false,
                timer: 1500
              })

            //remover producto del DOM              
            containerProducts.removeChild(productToDelete);
        }else{            
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el producto',    
        })
        }
        
    });
}

