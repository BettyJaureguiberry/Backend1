import { Router } from "express";
import mongoose from 'mongoose';
import CartManager from "../classes/CartManager.js";
import { getTitleById} from "../classes/ProductManager.js";

const { ObjectId } = mongoose.Types;
const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await CM.getCarts();
        res.send(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un problema al obtener los carritos", "Error": error.message });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        if (!ObjectId.isValid(cid)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Identificador de carrito no válido" });
        }

        const cart = await CM.getCartById(cid);
        
        if (!cart) {
            return res.status(404).send({ "Estado": "ERROR", "Mensaje": "El carrito no se encontró!" });
        }

        res.render('cartView', { cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un problema al obtener el carrito", "Error": error.message });
    }
});

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await CM.createCart();
        res.status(201).send({ "Estado": "OK", "Mensaje": `El carrito con ID ${newCart._id} se creó correctamente!`, "Cart #": newCart });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un error al crear el carrito.", "Error": error.message });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Identificador no válido" });
        }

        const title = await getTitleById(pid);
        await CM.addProductToCart(cid, pid);
        res.send({ "Estado": "OK", "Mensaje": `${title} se agregó correctamente!` });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un error al agregar el producto al carrito.", "Error": error.message });
    }
});

cartsRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;

    try {
        if (!ObjectId.isValid(cid)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Identificador de carrito no válido" });
        }

        await CM.addProductsToCart(cid, products);
        res.send({ "Estado": "OK", "Eensaje": "Se actualizó el Carrito!" });
    } catch (error) {
        console.error("Error al actualizar los productos del carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un error al actualizar el carrito.", "Error": error.message });
    }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = parseInt(req.body.quantity, 10);
        const title = await getTitleById(pid);

        if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid) || isNaN(quantity)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Parámetros inválidos" });
        }

        await CM.updateProductFromCart(cid, pid, quantity);
        res.send({ "Estado": "OK", "Mensaje": `${title} se agrego al carrito correctamente!` });
    } catch (error) {
        console.error("Error actualizando el producto en el carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Error actualizando el carrito", "Error": error.message });
    }
});


cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Identificador no válido" });
        }

        const title = await getTitleById(pid);
        await CM.deleteProductFromCart(cid, pid);
        res.send({ "Estado": "OK", "Mensaje": `${title} se eliminó correctamente!` });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un error al eliminar el producto del carrito.", "Error": error.message });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        if (!ObjectId.isValid(cid)) {
            return res.status(400).send({ "Estado": "ERROR", "Mensaje": "Identificador de carrito no válido" });
        }

        await CM.deleteProductsFromCart(cid);
        res.send({ "Estado": "OK", "Mensaje": "Se vació el Carrito!" });
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un error al vaciar el carrito.", "Error": error.message });
    }
});

export default cartsRouter;


