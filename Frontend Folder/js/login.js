/* =================================================================
   MODULO: Login (login.html) — GA4-220501096-AA1-EV02
   Reemplaza la logica de fetch() que antes vivia en script.js,
   ahora usando UsuarioService (POO). Requiere, en este orden:
   api-service.js, usuario-service.js, login.js.

   Guarda la sesion en sessionStorage bajo la clave "usuarioActivo"
   (sin password) y "token" (JWT) — mismas claves que usa
   protegerVista()/cerrarSesion() en script.js, para no romper el
   acceso a admin.html / cocina.html / mesero.html.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    if (!formLogin) return;

    const usuarioService = new UsuarioService();

    const inputCorreo = document.getElementById("correo");
    const inputPassword = document.getElementById("password");
    const btnTogglePassword = document.getElementById("btnTogglePassword");
    const iconoOjo = document.getElementById("iconoOjo");
    const chkRecordar = document.getElementById("chkRecordar");
    const alertaError = document.getElementById("alertaError");

    // Recordar solo el correo (nunca la contraseña) si el usuario lo pidió
    const correoRecordado = localStorage.getItem("correoRecordado");
    if (correoRecordado && inputCorreo && chkRecordar) {
        inputCorreo.value = correoRecordado;
        chkRecordar.checked = true;
    }

    // Mostrar u ocultar la contraseña
    if (btnTogglePassword && inputPassword && iconoOjo) {
        btnTogglePassword.addEventListener("click", () => {
            const esPassword = inputPassword.getAttribute("type") === "password";
            inputPassword.setAttribute("type", esPassword ? "text" : "password");
            iconoOjo.classList.toggle("bi-eye");
            iconoOjo.classList.toggle("bi-eye-slash");
        });
    }

    formLogin.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        if (alertaError) alertaError.classList.add("d-none");

        if (!inputCorreo || !inputPassword) return;

        const correo = inputCorreo.value.trim();
        const password = inputPassword.value.trim();

        if (chkRecordar && chkRecordar.checked) {
            localStorage.setItem("correoRecordado", correo);
        } else {
            localStorage.removeItem("correoRecordado");
        }

        try {
            const datos = await usuarioService.login({ correo, password });

            // Sesión activa en memoria de pestaña (sin contraseña).
            // Fuente real de autorización: cada panel valida contra
            // esto, no contra parámetros de la URL.
            sessionStorage.setItem("usuarioActivo", JSON.stringify(datos.usuario));
            if (datos.token) {
                sessionStorage.setItem("token", datos.token);
            }

            window.location.href = `${datos.usuario.rol}.html`;
        } catch (error) {
            // Servidor caído (GitHub Pages) o error de la API: intenta
            // el modo demo con las credenciales de prueba publicadas.
            const usuarioDemo = validarCredencialesDemo(correo, password);
            if (usuarioDemo) {
                iniciarSesionDemo(usuarioDemo);
                return;
            }
            mostrarErrorLogin(alertaError, error.message || "Correo o contraseña incorrectos.");
        }
    });
});

/* =================================================================
   MODO DEMO (GitHub Pages sin backend)
   Solo credenciales de prueba ya visibles en login.html.
   ================================================================= */
const USUARIOS_DEMO = [
    { id: 1, nombre: "Administrador General", correo: "admin@elgaraje.com", password: "Garaje2026*", rol: "admin" },
    { id: 2, nombre: "Jefe de Cocina", correo: "cocina@elgaraje.com", password: "Cocina2026*", rol: "cocina" },
    { id: 3, nombre: "Mesero Principal", correo: "mesero@elgaraje.com", password: "Mesero2026*", rol: "mesero" }
];

function validarCredencialesDemo(correo, password) {
    const encontrado = USUARIOS_DEMO.find(
        (u) => u.correo === correo.toLowerCase() && u.password === password
    );
    if (!encontrado) return null;
    const { password: _omitida, ...usuarioSinPassword } = encontrado;
    return usuarioSinPassword;
}

function iniciarSesionDemo(usuario) {
    // sessionStorage: lo que lee protegerVista() en admin/cocina/mesero.
    // localStorage: copia pedida para el modo demo.
    sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    localStorage.setItem("usuarioDemo", JSON.stringify(usuario));
    window.location.href = `${usuario.rol}.html`;
}

function mostrarErrorLogin(alertaError, mensaje) {
    if (!alertaError) {
        alert(mensaje);
        return;
    }
    alertaError.textContent = mensaje;
    alertaError.classList.remove("d-none");
}
