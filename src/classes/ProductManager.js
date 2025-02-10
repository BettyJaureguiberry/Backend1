import fs from "fs"

class ProductManager {
    constructor() {
        this.products = [],
        this.file = "productos.json",
        this.createFile()
    }

    createFile() {
        if (!fs.existsSync(this.file)) {
            fs.writeFileSync(this.file, JSON.stringify(this.products))
        }
    }

    getId() {
        this.getProducts();
        let max = 0;

        this.products.forEach(item => {
            if (item.id > max) {
                max = item.id;
            }
        })

        return max + 1;
    }

    getTitleById(id) {
        const product = this.getProductById(id);
        return product.title;
    }
    getProducts() {
        this.products = JSON.parse(fs.readFileSync(this.file, "utf-8"));
        
        return this.products;
    }

    getProductById(id) {        
        this.getProducts();
        let product = this.products.find(item => item.id == id);
        
        return product ? product : {"Error":"No se encontró el Producto!"};
    }

    addProduct(product) {
        this.getProducts();
        let newProduct = {id:this.getId(), ...product};
        this.products.push(newProduct);
        this.saveProducts();
        
    }

    editProduct(id, product) {
        this.getProducts();
        let actualProduct = this.products.find(item => item.id == id);

        if (!actualProduct) {
            console.error("Producto no encontrado");
            return;
        }
        
        Object.assign(actualProduct, product);
        this.saveProducts();
    }

    deleteProduct(id) {
        this.getProducts();
        this.products = this.products.filter(item => item.id != id);
        this.saveProducts();
    }

    saveProducts() {
        fs.writeFileSync(this.file, JSON.stringify(this.products));
    }
}

export default ProductManager;
const PM = new ProductManager();
export const getTitleById = (id) => PM.getTitleById(id);
