import mongoose from 'mongoose';
import { cartModel } from "../models/cart.model.js";
const { ObjectId } = mongoose.Types;

class CartManager {
    async getCarts() {
        return await cartModel.find().lean().populate("products.product");
    }

    async getCartById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Identificador no válido.");
        }
        return await cartModel.findOne({ _id: id }).lean().populate("products.product");
    }

    async createCart() {
        return await cartModel.create({ products: [] });
    }

    async addProductToCart(cid, pid) {
        try {
            if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
                throw new Error("Identificador no válido.");
            }
    
            let cart = await cartModel.findOne({ _id: cid }).lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
    
            let product = cart.products.find(item => item.product.toString() === pid);
    
            if (product) {
                product.quantity += 1; // Incrementa la cantidad en 1
            } else {
                product = { product: new ObjectId(pid), quantity: 1 };
                cart.products.push(product);
            }
    
            await cartModel.updateOne({ _id: cid }, { products: cart.products });
        } catch (error) {
            console.error("Error agregando producto al carrito:", error);
        }
    }
    
    async addProductsToCart(cid, products) {
        try {
            if (!ObjectId.isValid(cid)) {
                throw new Error("Identificador no válido.");
            }

            let cart = await cartModel.findOne({ _id: cid }).lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            products.forEach(item => {
                let product = cart.products.find(item2 => item2.product.toString() === item.product.toString());
                if (product) {
                    product.quantity += item.quantity;
                } else {
                    product = { product: new ObjectId(item.product), quantity: item.quantity };
                    cart.products.push(product);
                }
            });

            await cartModel.updateOne({ _id: cid }, { products: cart.products });
        } catch (error) {
            console.error("Error agregando productos al carrito:", error);
        }
    }

    async updateProductFromCart(cid, pid, quantity) {
        try {
            if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid) || isNaN(quantity)) {
                throw new Error("Parámetros inválidos");
            }
    
            let cart = await cartModel.findOne({ _id: cid }).lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
    
            let product = cart.products.find(item => item.product.toString() === pid);
    
            if (product) {
                product.quantity += quantity; // Incrementa la cantidad en la cantidad especificada
            } else {
                product = { product: new ObjectId(pid), quantity: quantity };
                cart.products.push(product);
            }
    
            await cartModel.updateOne({ _id: cid }, { products: cart.products });
        } catch (error) {
            console.error("Error actualizando producto en el carrito:", error);
        }
    }
    

    async deleteProductFromCart(cid, pid) {
        try {
            if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
                throw new Error("Identificador no válido.");
            }

            await cartModel.updateOne(
                { _id: cid },
                { $pull: { products: { product: new ObjectId(pid) } } }
            );
        } catch (error) {
            console.error("Error eliminando producto del carrito:", error);
        }
    }

    async deleteProductsFromCart(cid) {
        try {
            if (!ObjectId.isValid(cid)) {
                throw new Error("Identificador no válido.");
            }

            await cartModel.updateOne({ _id: cid }, { products: [] });
        } catch (error) {
            console.error("Error eliminando productos del carrito:", error);
        }
    }
}

export default CartManager;
















/*import { cartModel } from "../models/cart.model.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;


class CartManager {
    async getCarts() {
        return await cartModel.find().lean().populate("products.product");
    }

    async getCartById(id) {        
        return await cartModel.find({_id:id}).lean();
    }

    async createCart() {
        await cartModel.create({products:[]});
    }
    async addProductToCart(cid, pid) {
        try {
            // Asegúrate de que los identificadores sean válidos ObjectId
            if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
                throw new Error("Identificador no válido.");
            }
    
            let cart = await cartModel.findOne({_id: cid}).lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
    
            let product = cart.products.find(item => item.product.toString() === pid);
    
            if (product) {
                product.quantity += 1;
            } else {
                product = { product: new ObjectId(pid), quantity: 1 };
                cart.products.push(product);
            }
    
            await cartModel.updateOne({_id: cid}, { products: cart.products });
        } catch (error) {
            console.error("Error agregando producto al carrito:", error);
        }
    }
    

    
    async addProductToCart(cid, pid) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let product = cart.products.find(item => item.product._id == pid);        

        if (product) {
            product.quantity += 1;
        } else {
            product = {product:pid, quantity:1};            
            cart.products.push(product);
        }

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }
    async addProductsToCart(cid, products) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        
        products.forEach(item => {            
            let product = cart.products.find(item2 => item2.product == item.product);                    

            if (product) {
                product.quantity += item.quantity;                        
            } else {
                product = {product:item.product, quantity:item.quantity};
                cart.products.push(product);
            }            
        });

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }

    async updateProductFromCart(cid, pid, quantity) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let product = cart.products.find(item => item.product._id == pid);        

        if (product) {
            product.quantity += quantity;
        } else {
            product = {product:pid, quantity:quantity};
            cart.products.push(product);
        }

        await cartModel.updateOne({_id:cid}, {products:cart.products});
    }

    async deleteProductFromCart(cid, pid) {
        let cart = await cartModel.findOne({_id:cid}).lean();
        let products = cart.products.filter(item => item.product != pid);
            
        await cartModel.updateOne({_id:cid}, {products:products});
    }

    async deleteProductsFromCart(cid) {            
        await cartModel.updateOne({_id:cid}, {products:[]});
    }
}

export default CartManager*/