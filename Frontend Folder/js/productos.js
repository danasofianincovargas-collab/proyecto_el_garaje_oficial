/* =================================================================
   MODULO: Renderizado dinamico del catalogo — GA4-220501096-AA1-EV02
   menu.html hoy trae las tarjetas de producto escritas a mano en el
   HTML (regla de oro: no se reescribe esa maquetacion). Este script
   es defensivo: si no existe un contenedor con id
   "contenedorProductos", no hace nada y el menu estatico sigue
   funcionando igual que siempre.

   Para activar el catalogo dinamico via API, agrega en menu.html
   un contenedor vacio, p.ej.:
     <div id="contenedorProductos" class="row g-4"></div>

   Requiere, en este orden: api-service.js, producto-service.js,
   productos.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorProductos");
    if (!contenedor) return;

    const productoService = new ProductoService();
    cargarProductos(contenedor, productoService);
});

async function cargarProductos(contenedor, productoService) {
    mostrarCargando(contenedor);

    try {
        const productos = await productoService.obtenerTodos();

        if (!productos || productos.length === 0) {
            mostrarCatalogoVacio(contenedor);
            return;
        }

        renderizarProductos(contenedor, productos);
    } catch (error) {
        mostrarError(contenedor, error.message);
    }
}

function mostrarCargando(contenedor) {
    contenedor.innerHTML = `
        <div class="text-center w-100 py-5">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted mt-2">Cargando el menú...</p>
        </div>
    `;
}

function mostrarCatalogoVacio(contenedor) {
    contenedor.innerHTML = `
        <div class="alert alert-warning text-center w-100" role="alert">
            🍽️ Todavía no hay productos registrados en el menú.
        </div>
    `;
}

function mostrarError(contenedor, mensaje) {
    contenedor.innerHTML = `
        <div class="alert alert-danger text-center w-100" role="alert">
            ⚠️ No fue posible cargar el menú: ${mensaje || "el servidor no está disponible."}
        </div>
    `;
}

function renderizarProductos(contenedor, productos) {
    contenedor.innerHTML = productos.map((producto) => `
        <div class="col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm" data-plato="${producto.nombre}">
                ${producto.imagen_url ? `<img src="${producto.imagen_url}" class="card-img-top" alt="${producto.nombre}">` : ""}
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary align-self-start mb-2">${producto.categoria || ""}</span>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${producto.descripcion || ""}</p>
                    <p class="fw-bold">$${Number(producto.precio).toLocaleString()} COP</p>
                    <a href="detalle-producto.html?id=${producto.id_producto}" class="btn btn-outline-secondary btn-sm">Ver detalle</a>
                </div>
            </div>
        </div>
    `).join("");
}
