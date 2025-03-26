import express from "express";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.js"; 
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import Cart from "./models/cart.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

//Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce")
    .then(async () => {
        console.log("Conectado a MongoDB");

        //Verificamos si ya existe un carrito, si no, lo creamos
        const existingCart = await Cart.findOne();
        if (!existingCart) {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            global.defaultCartId = newCart._id.toString();  // Guardamos el ID globalmente
        } else {
            global.defaultCartId = existingCart._id.toString();  // Usamos el carrito existente
        }
    })
    .catch(err => console.error("Error al conectar a MongoDB:", err));

//Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Rutas
app.use("/", viewsRouter);  // Habilitamos las vistas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});