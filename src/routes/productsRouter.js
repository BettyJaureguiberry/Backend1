import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", (req, res) => {
    let products = PM.getProducts();
    
    res.send(products)
})

productsRouter.get("/:pid", (req, res) => {
    let pid = req.params.pid;
    let product = PM.getProductById(pid);
    
    res.send(product)
})

productsRouter.post("/", (req, res) => {
    const { title, description, code, price, status, category, thumbnails } = req.body;

    const validateField = (field, fieldName, type) => {
        if (!field || (type && typeof field !== type)) {
            res.status(400).send({ "estado": "ERROR", "mensaje": `El campo '${fieldName}' está vacío o no es correcto!` });
            return false;
        }
        return true;
    };

    if (!validateField(title, 'title', 'string') ||
        !validateField(description, 'description') ||
        !validateField(code, 'code') ||
        !validateField(price, 'price', 'number') ||
        !validateField(status, 'status') ||
        !validateField(category, 'category')) {
        return;
    }

    try {
        let product = { title, description, code, price, status, category, thumbnails };
        PM.addProduct(product);
        res.send({ "estado": "OK", "mensaje": `${title} se agregó correctamente!` });
    } catch (error) {
        res.status(500).send({ "estado": "ERROR", "mensaje": "Ocurrió un error al agregar el producto" });
    }
});


productsRouter.put("/:pid", (req, res) => {
    const pid = req.params.pid;
    const { title, description, code, price, status, category, thumbnails } = req.body;

    const validateField = (field, fieldName, res) => {
        if (!field) {
            res.status(400).send({ "estado": "ERROR", "mensaje": `El campo '${fieldName}' está vacío!` });
            return false;
        }
        return true;
    };

    if (!validateField(title, 'title', res) ||
        !validateField(description, 'description', res) ||
        !validateField(code, 'code', res) ||
        !validateField(price, 'price', res) ||
        !validateField(status, 'status', res) ||
        !validateField(category, 'category', res)) {
        return;
    }

    let product = { title, description, code, price, status, category, thumbnails };
    PM.editProduct(pid, product);
    res.send({ "estado": "OK", "mensaje": `${title} se modifico correctamente!` });
});



productsRouter.delete("/:pid", (req, res) => {
    const pid = req.params.pid;
    const product = PM.getProductById(pid);

    if (!product || product.error) {
        return res.status(404).send({ "estado": "ERROR", "mensaje": "El producto no se encontró!" });
    }

    const title = product.title;
    PM.deleteProduct(pid);
    res.send({ "estado": "OK", "mensaje": `El producto '${title}' se eliminó correctamente!` });
});


export default productsRouter
