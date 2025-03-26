import { Router } from "express";
import Product from "../models/product.js";
import Cart from "../models/cart.js";

const router = Router();

// GET /products - Renderiza la lista de productos con paginación
router.get("/products", async (req, res) => {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {}; 
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = { 
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
            lean: true
        };

        const products = await Product.paginate(filter, options);

        res.render("products", {
            title: "Lista de Productos",
            products: products.docs,
            cartId: global.defaultCartId,  //Pasamos el carrito global
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
        });

    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

//GET /products/:pid - Renderiza el detalle de un producto
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }
        res.render("productDetail", { product, cartId: global.defaultCartId });
    } catch (error) {
        res.status(500).render("error", { message: "Error al obtener el producto" });
    }
});

//GET /carts - Redirige al carrito global
router.get("/carts", (req, res) => {
    res.redirect(`/carts/${global.defaultCartId}`);
});

//GET /carts/:cid - Renderiza un carrito específico
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product").lean();

        if (!cart) return res.status(404).render("error", { message: "Carrito no encontrado" });

        res.render("cartDetail", {
            title: "Carrito de Compras",
            cartId: cart._id,
            products: cart.products
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

export default router;