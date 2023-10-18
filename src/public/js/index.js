// Crear una instancia del cliente Socket.io
const socketClient = io();

const form = document.getElementById("product-form");
const containerProducts = document.getElementById("container-products");
const userName = document.getElementById("name");


// -------------------------BLOQUE GESTION USUARIOS ------------------------
Swal.fire({
  title: "Bienvenido a la tienda de Productos.",
  text: "Ingrese su nombre de cliente",
  input: "text",
  inputValidator: (value) => {
    if (!value) {
      return "Es necesario utilizar un nombre";
    }
  },
  confirmButtonText: "Enter",
}).then((input) => {
  user = input.value;
  userName.innerText = user;
  socketClient.emit("newUser", user);
});

socketClient.on("userConnected", (user) => {
  Toastify({
    text: `${user} se conectó  a la tienda.`,
    style: {
      color: "#fff",
      background: ""
    },
    duration: 5000,
  }).showToast();
});


socketClient.on("connected", () => {
  Toastify({
    text: `Estas conectado.`,
    style: {
      color: "#fff",
      background: ""
    },
    duration: 5000,
  }).showToast();
});


//------------------------------BLOQUE NUEVO PRODUCTO-----------------------------------------


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
}
// Escuchar el evento "addedProduct" del servidor y enviar mensaje al cliente que agrego el producto
socketClient.on("addedProduct", () => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Producto Agregado',
    showConfirmButton: false,
    timer: 3500
  })
});

// Escuchar el evento "addedProductOthers" del servidor y enviar mensaje al resto de clientes conectados
// el agregado de un nuevo producto
socketClient.on("addedProductOthers", (user) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: `Un producto ha sido agregado a la tienda por otro cliente`,
    showConfirmButton: false,
    timer: 3500
  })
});


//------------------------------BLOQUE LISTADO PRODUCTOS-----------------------------------------


//Evento que gestiona el listado de todos los productos en pantalla.
socketClient.on("listProducts", (productList) => {
  const products = productList
    .map((p) => {
      return `    <article id="product-${p.id}" class="container">
            <div class="card">
                <div class="imgBx">
                    <img src="${p.thumbnail}" height="200" width="20" />
                </div>
                <div class="contentBx">
                    <h2>${p.title}</h2>
                    <div class="price">
                        <h3>Precio: ${p.price}</h3>
                    </div>
                    <div class="stock">
                        <h3>Cantidad: ${p.stock}</h3>
                    </div>
                    <input type="button" onclick="eliminar(${p.id})" value="Eliminar Producto"></input>
                </div>
            </div>
        </article>`;
    })
    .join(" ");
  containerProducts.innerHTML = products;
});


//------------------------------BLOQUE ELIMINACION PRODUCTO-----------------------------------------

// Función para eliminar un producto de la tienda
function eliminar(pid) {
  // Emitir un evento "deleteProduct" al servidor con el ID del producto a eliminar
  socketClient.emit("deleteProduct", pid);
}

// Escuchar el evento "deletedProduct" del servidor y enviar mensaje al cliente que agrego el producto
socketClient.on("deletedProduct", () => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Producto Eliminado',
    showConfirmButton: false,
    timer: 3500
  })
});

// Escuchar el evento "deletedProductOthers" del servidor y enviar mensaje al resto de clientes conectados
// el agregado de un nuevo producto
socketClient.on("deletedProductOthers", (user) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: `Un producto ha sido eliminado de la tienda por otro cliente`,
    showConfirmButton: false,
    timer: 3500
  })
});
