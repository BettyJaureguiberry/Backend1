import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./classes/ProductManager.js";
import mongoose from "mongoose";
import path from "path";

const app = express();
const port = 8081;

const httpServer = app.listen(port, () => {
  console.log("Servidor ejecutándose en http://localhost:8081");
});

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Configuración para servir archivos estáticos
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      }
    },
  })
);

// Ruta para los archivos JavaScript
app.get("/realtimeproducts/js/realtimeproducts.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/realtimeproducts/js/realtimeproducts.js"));
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Conexión a MongoDB
const mongoURI =
  "mongodb+srv://Sole:Sole@cluster0.mcyln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("¡MongoDB conectado!");
  })
  .catch((err) => {
    console.log("Error de conexión a MongoDB:", err);
  });

socketServer.on("connection", async (socket) => {
  const PM = new ProductManager();
  const products = await PM.getProducts();

  socket.emit("realtimeproducts", products);

  socket.on("nuevoProducto", async (data) => {
    const product = {
      title: data.title,
      description: data.description,
      code: data.code,
      price: data.price,
      category: data.category,
      thumbnails: [data.image],
    };
    await PM.addProduct(product);
    console.log("Se agregó un nuevo Producto!");
    const products = await PM.getProducts();
    socket.emit("realtimeproducts", products);
  });

  socket.on("eliminarProducto", async (data) => {
    await PM.deleteProduct(data);
    console.log("Se eliminó un Producto!");
    const products = await PM.getProducts();
    socket.emit("realtimeproducts", products);
  });
});
