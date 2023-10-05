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
socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Escuchar el evento "newProduct" para crear un nuevo producto
  socket.on("newProduct", async (product) => {
    const newProduct = await manager.createProduct(product); 
    // Emitir un evento "productOK" para notificar a todos los clientes
    socketServer.emit("productOK", newProduct);
  });

  // Escuchar el evento "deleteProduct" para eliminar un producto
  socket.on("deleteProduct", async (pid) => {
    const deletedProduct = await manager.deleteProduct(pid);
    // Emitir un evento "deleteOK" para notificar a todos los clientes
    socketServer.emit("deleteOK", deletedProduct);
  });
});