Configurar MongoDB
Tener MongoDB ejecutándose en localhost:27017.

Iniciar el servidor
El servidor correrá en:
🔗 http://localhost:8080 🚀

📌 Endpoints principales
🛍️ Productos (/api/products)
GET /api/products → Lista productos con paginación, filtros y ordenamiento.

POST /api/products → Agrega un nuevo producto.

GET /api/products/:pid → Obtiene un producto por ID.

PUT /api/products/:pid → Actualiza un producto.

DELETE /api/products/:pid → Elimina un producto.

🔎 Query params soportados:
Parámetro	Descripción
?limit=10	Número de productos por página (default: 10)
?page=2	Página solicitada (default: 1)
?query=cat	Filtrar por categoría o disponibilidad
?sort=asc/desc	Ordenar por precio ascendente o descendente
🛒 Carritos (/api/carts)
POST /api/carts → Crea un nuevo carrito.

GET /api/carts/:cid → Obtiene un carrito.

PUT /api/carts/:cid → Reemplaza los productos en un carrito.

PUT /api/carts/:cid/products/:pid → Modifica la cantidad de un producto en el carrito.

DELETE /api/carts/:cid/products/:pid → Elimina un producto del carrito.

DELETE /api/carts/:cid → Vacía el carrito.

🎨 Vistas con Handlebars
/products → Lista todos los productos con paginación.

/products/:pid → Muestra detalles de un producto.

/carts/:cid → Muestra los productos de un carrito.
