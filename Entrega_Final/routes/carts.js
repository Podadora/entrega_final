import { Router } from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

const router = Router();

// GET /api/carts/:cid - Obtener un carrito con productos completos
router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");

        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

//POST /api/carts - Crear un carrito vacío
router.post("/", async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

// POST /api/carts/:cid/products/:pid - Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });

        const existingProduct = cart.products.find(p => p.product.equals(product._id));

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => !p.product.equals(req.params.pid));

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});

// DELETE /api/carts/:cid - Vaciar el carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();
        res.json({ message: "Carrito vaciado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
});

//PUT /api/carts/:cid - Reemplazar todo el carrito
router.put("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const { products } = req.body;

        // Validar que products sea un array y que cada producto tenga un ID y una cantidad
        if (!Array.isArray(products) || products.some(p => !p.product || !p.quantity)) {
            return res.status(400).json({ error: "Formato de productos incorrecto" });
        }

        // Verificar que todos los productos existen en la base de datos
        const productIds = products.map(p => p.product);
        const existingProducts = await Product.find({ _id: { $in: productIds } });

        if (existingProducts.length !== productIds.length) {
            return res.status(400).json({ error: "Uno o más productos no existen" });
        }

        //Reemplazar los productos del carrito
        cart.products = products;
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

export default router;