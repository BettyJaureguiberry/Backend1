import express from "express";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./classes/ProductManager.js";

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => {
    console.log("Servidor activo: " + port);
})
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

socketServer.on("connection", socket => {
    const PM = new ProductManager();
    const products = PM.getProducts();
    
    socket.emit("realtimeproducts", products);

    socket.on("nuevoProducto", data => {
        const product = {title:data.title, description:data.description, code:data.code, price:data.price, category:data.category, thumbnails:[data.image]};
        PM.addProduct(product);
        console.log("Se agregó un nuevo Producto!");
        const products = PM.getProducts();
        socket.emit("realtimeproducts", products);
    })

    socket.on("eliminarProducto", data => {
        PM.deleteProduct(data);
        console.log("Se eliminó un Producto!");
        const products = PM.getProducts();
        socket.emit("realtimeproducts", products);
    })
})