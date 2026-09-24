/* =================================================================
   MODULO: Registro — GA4-220501096-AA1-EV02
   No existe todavia una pagina registro.html en el proyecto (regla
   de oro: no se crea/edita maquetacion sin pedirlo). Este script es
   defensivo: si el formulario no existe en la pagina, no hace nada.

   IDs esperados si se agrega el formulario (formulario "registro"):
     #formRegistro, #nombre, #correo, #password, #confirmarPassword,
     #rol (select con admin/cocina/mesero), #alertaRegistro

   Requiere, en este orden: api-service.js, usuario-service.js,
   registro.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("formRegistro");
    if (!formRegistro) return;

    const usuarioService = new UsuarioService();

    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputPassword = document.getElementById("password");
    const inputConfirmar = document.getElementById("confirmarPassword");
    const inputRol = document.getElementById("rol");
    const alertaRegistro = document.getElementById("alertaRegistro");

    formRegistro.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        ocultarAlerta(alertaRegistro);

        if (!inputNombre || !inputCorreo || !inputPassword || !inputConfirmar) return;

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const password = inputPassword.value.trim();
        const confirmarPassword = inputConfirmar.value.trim();
        const rol = inputRol ? inputRol.value : undefined;

        if (password !== confirmarPassword) {
            mostrarAlerta(alertaRegistro, "Las contraseñas no coinciden.");
            return;
        }

        try {
            await usuarioService.registro({ nombre, correo, password, rol });
            mostrarAlerta(alertaRegistro, "Registro exitoso. Ya puedes iniciar sesión.", "alert-success");
            formRegistro.reset();
            setTimeout(() => { window.location.href = "login.html"; }, 1500);
        } catch (error) {
            // 409 correo ya registrado / 400 datos incompletos: el
            // mensaje ya viene claro desde el Back-End.
            mostrarAlerta(alertaRegistro, error.message || "No fue posible completar el registro.");
        }
    });
});

function mostrarAlerta(elemento, mensaje, claseExito) {
    if (!elemento) {
        alert(mensaje);
        return;
    }
    elemento.textContent = mensaje;
    elemento.classList.remove("d-none", "alert-danger", "alert-success");
    elemento.classList.add(claseExito || "alert-danger");
}

function ocultarAlerta(elemento) {
    if (elemento) elemento.classList.add("d-none");
}
