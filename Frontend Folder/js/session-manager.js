/* =================================================================
   MODULO: Estado de sesion en la navegacion — GA4-220501096-AA1-EV02
   Lee sessionStorage("usuarioActivo") -- misma clave que usa
   login.js / script.js -- y, si existe, actualiza el area de
   navegacion con "Hola, [Nombre]" + Cerrar sesión; si no hay sesión,
   muestra "Iniciar Sesión / Registrarse". Totalmente defensivo: si
   la página no tiene el contenedor esperado, no hace nada (no
   reescribe maquetación existente).

   ID esperado en la barra de navegación (agregar solo si se quiere
   este comportamiento en una página pública, p.ej. menu.html):
     <span id="areaSesion"></span>
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const areaSesion = document.getElementById("areaSesion");
    if (!areaSesion) return;

    let usuarioActivo = null;
    try {
        usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    } catch (error) {
        usuarioActivo = null;
    }

    if (usuarioActivo && usuarioActivo.nombre) {
        areaSesion.innerHTML = `
            <span class="text-light me-2">Hola, ${usuarioActivo.nombre}</span>
            <button type="button" id="btnCerrarSesionNav" class="btn btn-outline-light btn-sm">Cerrar Sesión</button>
        `;
        const btnCerrarSesionNav = document.getElementById("btnCerrarSesionNav");
        if (btnCerrarSesionNav) {
            btnCerrarSesionNav.addEventListener("click", () => {
                const usuarioService = new UsuarioService();
                usuarioService.cerrarSesion();
            });
        }
    } else {
        areaSesion.innerHTML = `
            <a href="login.html" class="text-decoration-none text-light small">Iniciar Sesión / Registrarse</a>
        `;
    }
});
