import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

// GET /api/products - Obtener todos los productos con filtros y paginación
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query ? { category: query } : {}; //Filtrar por categoría si se envía "query"
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = { 
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption
        };

        const products = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });

    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// GET /api/products/:pid - Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

// POST /api/products - Agregar un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        //Verificar si el código ya existe (para evitar duplicados)
        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ error: "Código de producto ya existente" });
        }

        const newProduct = new Product({ title, description, code, price, stock, category });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

// PUT /api/products/:pid - Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// DELETE /api/products/:pid - Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await Product.findByIdAndDelete(req.params.pid);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;