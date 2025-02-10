import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

const viewsRouter = Router();
const PM = new ProductManager();

viewsRouter.get("/", (req, res) => {
    let products = PM.getProducts();    

    res.render("home", {products:products});
})

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

export default viewsRouter