// Importar Express y otros módulos necesarios
import express from "express";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import { manager } from './ProductManager.js'

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Configurar las rutas de la aplicación
app.use("/", viewsRouter);

// Definir el puerto en el que se ejecutará el servidor
const PORT = 8080;

// Crear un servidor HTTP de Express y escuchar en el puerto especificado
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

// Crear un servidor de sockets (Socket.io) y asociarlo al servidor HTTP
const socketServer = new Server(httpServer);


// Gestionar eventos de conexión de clientes
socketServer.on("connection", async (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  const productsList = await manager.getProducts();
  socketServer.emit("listProducts", productsList);

  socket.on("newUser", (user) => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("connected");
  });

  //Gestionar agregado de un nuevo producto a la tienda. 
  socket.on("newProduct", async (product) => {
    const newProduct = await manager.createProduct(product);

    if (newProduct) {
      //generar aviso a clientes de que se ha agregado nuvo producto.
      socket.broadcast.emit("addedProductOthers");//avisar al resto que se agrego producto
      socket.emit("addedProduct"); //avisar que la adicion salio "ok"

      //generar el nuevo listado
      const productsList = await manager.getProducts();
      socketServer.emit("listProducts", productsList);
    }

  });

  //Gestionar eliminacion de un producto de la tienda. 
  socket.on("deleteProduct", async (idProduct) => {
    const deletedProduct = await manager.deleteProduct(idProduct);

    if (deletedProduct) {
      //generar aviso a clientes de que se ha eliminado un producto.
      socket.broadcast.emit("deletedProductOthers");//avisar al resto que se elimino producto
      socket.emit("deletedProduct"); //avisar que la eliminacion salio "ok"

      //generar el nuevo listado
      const productsList = await manager.getProducts();
      socketServer.emit("listProducts", productsList);
    }

  });


});
