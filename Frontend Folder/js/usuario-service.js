/* =================================================================
   CLASE: UsuarioService (GA4-220501096-AA1-EV02)
   Usa ApiService para hablar con /api/usuarios (login, registro,
   perfil, cierre de sesion). Requiere api-service.js cargado antes.

   Claves de sessionStorage usadas (deben coincidir con script.js /
   login.js para no romper protegerVista() en admin/cocina/mesero):
     - "usuarioActivo": JSON con { id, nombre, correo, rol }
     - "token": JWT devuelto por /api/usuarios/login
   ================================================================= */

class UsuarioService {
    constructor() {
        this.api = new ApiService();
    }

    login(credenciales) {
        return this.api.post("/usuarios/login", credenciales);
    }

    registro(datosUsuario) {
        return this.api.post("/usuarios", datosUsuario);
    }

    obtenerPerfil() {
        let usuarioActivo = null;
        try {
            usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
        } catch (error) {
            usuarioActivo = null;
        }

        if (!usuarioActivo || !usuarioActivo.id) {
            return Promise.reject(new Error("No hay una sesión activa."));
        }

        return this.api.get(`/usuarios/${usuarioActivo.id}`);
    }

    cerrarSesion() {
        sessionStorage.removeItem("usuarioActivo");
        sessionStorage.removeItem("token");
        window.location.href = "login.html";
    }
}
