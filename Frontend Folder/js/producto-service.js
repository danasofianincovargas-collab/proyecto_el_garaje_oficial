/* =================================================================
   CLASE: ProductoService (GA4-220501096-AA1-EV02)
   Usa ApiService para hablar con /api/productos. Requiere que
   api-service.js este cargado ANTES en el HTML.
   ================================================================= */

class ProductoService {
    constructor() {
        this.api = new ApiService();
    }

    obtenerTodos() {
        return this.api.get("/productos");
    }

    obtenerPorId(id) {
        return this.api.get(`/productos/${id}`);
    }

    crear(productoData) {
        return this.api.post("/productos", productoData);
    }

    actualizar(id, productoData) {
        return this.api.put(`/productos/${id}`, productoData);
    }

    eliminar(id) {
        return this.api.delete(`/productos/${id}`);
    }
}
