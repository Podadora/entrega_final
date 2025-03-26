Backend de Tienda - Proyecto Final 
Este es el backend de una tienda en línea desarrollado con Node.js, Express, MongoDB y Mongoose. Incluye la gestión de productos y carritos de compras, con funcionalidades avanzadas como paginación, filtros, ordenamiento y WebSockets para actualización en tiempo real.

Instalar dependencias

npm install

Configurar MongoDB

Asegúrate de tener MongoDB ejecutándose en localhost:27017.

El servidor correrá en http://localhost:8080 🚀

📜 Endpoints principales

🔹 Productos (/api/products)
📌 GET /api/products → Lista productos con paginación, filtros y ordenamiento
📌 POST /api/products → Agrega un nuevo producto
📌 GET /api/products/:pid → Obtiene un producto por ID
📌 PUT /api/products/:pid → Actualiza un producto
📌 DELETE /api/products/:pid → Elimina un producto

📌 Query params soportados:

?limit=10 → Número de productos por página (default: 10)

?page=2 → Página solicitada (default: 1)

?query=categoria → Filtrar por categoría o disponibilidad

?sort=asc/desc → Ordenar por precio ascendente o descendente


🔹 Carritos (/api/carts)
📌 POST /api/carts → Crea un nuevo carrito
📌 GET /api/carts/:cid → Obtiene un carrito
📌 PUT /api/carts/:cid → Reemplaza productos en un carrito
📌 PUT /api/carts/:cid/products/:pid → Modifica la cantidad de un producto
📌 DELETE /api/carts/:cid/products/:pid → Elimina un producto del carrito
📌 DELETE /api/carts/:cid → Vacía el carrito

🖥️ Vistas con Handlebars
🔹 /products → Lista todos los productos con paginación
🔹 /products/:pid → Muestra detalles de un producto
🔹 /carts/:cid → Muestra los productos de un carrito

