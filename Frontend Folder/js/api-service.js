/* =================================================================
   CLASE BASE: ApiService (GA4-220501096-AA1-EV02)
   Encapsula fetch() hacia la API REST de El Garaje: headers, envio
   automatico del token de sesion y manejo centralizado de errores.
   Script clasico (sin bundler ni type="module"): la clase queda
   disponible globalmente para producto-service.js / usuario-service.js.
   ================================================================= */

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || "http://localhost:3000/api";
    }

    // Arma los encabezados: JSON siempre, y el token de sessionStorage
    // si existe (lo guarda login.js tras un login exitoso).
    _obtenerEncabezados() {
        const encabezados = { "Content-Type": "application/json" };
        const token = sessionStorage.getItem("token");
        if (token) {
            encabezados["Authorization"] = `Bearer ${token}`;
        }
        return encabezados;
    }

    // Valida response.ok. Si el backend respondio con error (400, 401,
    // 404, 409, 500...), captura el JSON y lanza una excepcion con el
    // mensaje real del Back-End (o uno generico si no vino JSON).
    async _procesarRespuesta(respuesta) {
        let datos = null;
        try {
            datos = await respuesta.json();
        } catch (errorParseo) {
            datos = null;
        }

        if (!respuesta.ok) {
            const mensaje = (datos && datos.mensaje) ? datos.mensaje : `Error HTTP ${respuesta.status}`;
            const error = new Error(mensaje);
            error.status = respuesta.status;
            error.datos = datos;
            throw error;
        }

        return datos;
    }

    async get(endpoint) {
        const respuesta = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: this._obtenerEncabezados()
        });
        return this._procesarRespuesta(respuesta);
    }

    async post(endpoint, data) {
        const respuesta = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: this._obtenerEncabezados(),
            body: JSON.stringify(data)
        });
        return this._procesarRespuesta(respuesta);
    }

    async put(endpoint, data) {
        const respuesta = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "PUT",
            headers: this._obtenerEncabezados(),
            body: JSON.stringify(data)
        });
        return this._procesarRespuesta(respuesta);
    }

    async delete(endpoint) {
        const respuesta = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "DELETE",
            headers: this._obtenerEncabezados()
        });
        return this._procesarRespuesta(respuesta);
    }
}
