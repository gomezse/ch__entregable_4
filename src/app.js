import express from "express";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import {Server} from 'socket.io';
import {manager} from './ProductManager.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/", viewsRouter);
// app.use("/", productRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
 
  console.log(`Cliente conectado: ${socket.id}`);
  
  
  socket.on("newProduct", async (product) => {
    const newProduct = await manager.createProduct(product); 
    socketServer.emit("productOK",newProduct);
  });

  socket.on("deleteProduct", async (pid) => {
    const deletedProduct= await manager.deleteProduct(pid);

    socketServer.emit("deleteOK",deletedProduct);
  });

});
