/* =================================================================
   MODULO: Detalle de producto — GA4-220501096-AA1-EV02
   No existe todavia una pagina detalle-producto.html en el proyecto.
   Script defensivo: si no existe el contenedor, no hace nada.

   IDs esperados si se agrega la pagina:
     #detalleProducto (contenedor a llenar dinamicamente)

   URL esperada: detalle-producto.html?id=5

   Requiere, en este orden: api-service.js, producto-service.js,
   detalle-producto.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("detalleProducto");
    if (!contenedor) return;

    const productoService = new ProductoService();
    const idProducto = new URLSearchParams(window.location.search).get("id");

    if (!idProducto) {
        mostrarNoEncontrado(contenedor);
        return;
    }

    cargarDetalle(contenedor, productoService, idProducto);
});

async function cargarDetalle(contenedor, productoService, idProducto) {
    contenedor.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    try {
        const producto = await productoService.obtenerPorId(idProducto);
        renderizarDetalle(contenedor, producto);
    } catch (error) {
        if (error.status === 404) {
            mostrarNoEncontrado(contenedor);
        } else {
            contenedor.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    ⚠️ No fue posible cargar el producto: ${error.message || "el servidor no está disponible."}
                </div>
            `;
        }
    }
}

function renderizarDetalle(contenedor, producto) {
    contenedor.innerHTML = `
        <div class="card shadow-sm">
            ${producto.imagen_url ? `<img src="${producto.imagen_url}" class="card-img-top" alt="${producto.nombre}">` : ""}
            <div class="card-body">
                <span class="badge bg-secondary mb-2">${producto.categoria || ""}</span>
                <h3 class="card-title">${producto.nombre}</h3>
                <p class="card-text text-muted">${producto.descripcion || ""}</p>
                <p class="fw-bold fs-4">$${Number(producto.precio).toLocaleString()} COP</p>
                <a href="menu.html" class="btn btn-outline-secondary">← Volver al menú</a>
            </div>
        </div>
    `;
}

function mostrarNoEncontrado(contenedor) {
    contenedor.innerHTML = `
        <div class="text-center py-5">
            <h3>😕 Producto no encontrado</h3>
            <p class="text-muted">El producto que buscas no existe o fue eliminado.</p>
            <a href="menu.html" class="btn btn-warning fw-bold">← Volver al menú</a>
        </div>
    `;
}
