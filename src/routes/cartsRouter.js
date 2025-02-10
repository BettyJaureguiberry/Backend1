import { Router } from "express";
import CartManager from "../classes/CartManager.js";
import { getTitleById } from "../classes/ProductManager.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.get("/", (req, res) => {
    const carts = CM.getCarts();
    res.send(carts);
})
/*cartsRouter.post("/", (req, res) => {
    CM.createCart();
    res.send({"estado":"OK", "mensaje":"El carrito se creó correctamente!"});
})*/

cartsRouter.post("/", (req, res) => {
    try {
        const newCart = CM.createCart();
        res.status(201).send({ "estado": "OK", "mensaje": `El carrito con ID ${newCart.id} se creó correctamente!`, "cart": newCart });
    } catch (error) {
        res.status(500).send({ "estado": "ERROR", "mensaje": "Hubo un error al crear el carrito.", "error": error.message });
    }
});

cartsRouter.get("/:cid", (req, res) => {
    const cid = req.params.cid;
    const cart = CM.getCartById(cid);
    
    res.send(cart);
})
cartsRouter.post("/:cid/product/:pid", (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const title = getTitleById(pid);
    CM.addCartProduct(cid, pid);
    res.send({"estado":"OK", "mensaje":`${title} se agrego correctamente!`});
})

export default cartsRouter