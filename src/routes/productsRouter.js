import { Router } from "express";
import ProductManager from "../classes/ProductManager.js";
import { getProductById } from '../classes/ProductManager.js';


const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => { 
    try {
    let products = await PM.getProducts();
    
    res.send(products)
} catch (error) {
    console.log ("Error en obtener los productos");
} 
 })

productsRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let product = await PM.getProductById(pid);
    
    res.send(product)
})
productsRouter.get("/:pid", async (req, res) => {
    const productId = req.params.pid;

    try {
        const product = await getProductById(productId);

        // Verificar que el producto exista
        if (!product || product.error) {
            return res.status(404).send({ "Estado": "ERROR", "Mensaje": "No se encontró el Producto!" });
        }

        res.status(200).send({ "Estado": "OK", "Producto": product });
    } catch (error) {
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Hubo un problema al obtener el producto", "Error": error.message });
    }
});

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, category, thumbnails } = req.body;

    const validateField = (field, fieldName, type) => {
        if (!field || (type && typeof field !== type)) {
            res.status(400).send({ "Estado": "ERROR", "Mensaje": `El campo '${fieldName}' está vacío o no es correcto!` });
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
        await PM.addProduct(product);
        res.send({ "Estado": "OK", "Mensaje": `${title} se agregó correctamente!` });
    } catch (error) {
        res.status(500).send({ "Estado": "ERROR", "Mensaje": "Ocurrió un error al agregar el producto" });
    }
});


productsRouter.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const { title, description, code, price, status, category, thumbnails } = req.body;

    const validateField = (field, fieldName, res) => {
        if (!field) {
            res.status(400).send({ "Estado": "ERROR", "Mensaje": `El campo '${fieldName}' está vacío!` });
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
     await PM.editProduct(pid, product);
    res.send({ "Estado": "OK", "Mensaje": `${title} se modifico correctamente!` });
});



productsRouter.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const product = await PM.getProductById(pid);

    if (!product || product.error) {
        return res.status(404).send({ "Estado": "ERROR", "Mensaje": "El producto no se encontró!" });
    }

    const title = product.title;
    await PM.deleteProduct(pid);
    res.send({ "Estado": "OK", "Mensaje": `El producto '${title}' se eliminó correctamente!` });
});


export default productsRouter
