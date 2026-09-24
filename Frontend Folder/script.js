/* =================================================================
   SISTEMA CENTRALIZADO - EL GARAJE (GA3-220501096-AA2-EV02)
   Buscador dinámico, gestión de favoritos y protección de vistas.
   El módulo de autenticación (formLogin) vive ahora en login.js,
   usando la arquitectura POO de ApiService/UsuarioService
   (GA4-220501096-AA1-EV02). Este archivo se mantiene por
   compatibilidad: protegerVista()/cerrarSesion() siguen siendo
   usados por admin.html, cocina.html y mesero.html.
   ================================================================= */

const API_BASE_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    inicializarBuscador();
    inicializarFavoritos();
});


/* =================================================================
   MÓDULO DE PROTECCIÓN DE VISTAS (admin.html / cocina.html / mesero.html)
   Es la única fuente real de autorización: exige haber pasado por el
   login (POST /api/usuarios/login) y tener el rol correcto guardado
   en sessionStorage. Sin esto, cualquiera podía entrar a un panel
   solo escribiendo la URL con ?rol=admin, sin nunca dar la clave.
   ================================================================= */
function protegerVista(rolRequerido) {
    let usuario = null;
    try {
        usuario = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    } catch (error) {
        usuario = null;
    }

    if (!usuario || usuario.rol !== rolRequerido) {
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}


/* =================================================================
   2. MÓDULO DE BÚSQUEDA DINÁMICA EN TIEMPO REAL (destinos.html / menu.html)
   ================================================================= */
function inicializarBuscador() {
    const inputBuscador = document.getElementById("inputBuscador");
    const tarjetasDestinos = document.querySelectorAll(".card-destino");
    const alertaSinResultados = document.getElementById("alertaSinResultados");

    if (!inputBuscador) return;

    inputBuscador.addEventListener("input", (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();
        let encontrados = 0;

        tarjetasDestinos.forEach((tarjeta) => {
            const tituloCard = tarjeta.querySelector(".card-title").textContent.toLowerCase();

            if (tituloCard.includes(textoBusqueda)) {
                tarjeta.style.display = "block";
                encontrados++;
            } else {
                tarjeta.style.display = "none";
            }
        });

        if (alertaSinResultados) {
            const sinCoincidencias = encontrados === 0 && textoBusqueda !== "";
            alertaSinResultados.classList.toggle("d-none", !sinCoincidencias);
        }
    });
}


/* =================================================================
   3. MÓDULO DE GESTIÓN DE FAVORITOS Y PERSISTENCIA (destinos.html)
   ================================================================= */
function inicializarFavoritos() {
    const botonesFavorito = document.querySelectorAll(".btn-favorito");
    if (botonesFavorito.length === 0) return;

    let favoritos = JSON.parse(localStorage.getItem("favoritosElGaraje")) || [];

    botonesFavorito.forEach((boton) => {
        const idDestino = boton.getAttribute("data-id");
        const tarjeta = boton.closest(".card-destino");
        const badgeFavorito = tarjeta ? tarjeta.querySelector(".badge-favorito") : null;

        if (favoritos.includes(idDestino)) {
            marcarComoFavoritoUI(boton, badgeFavorito, true);
        }

        boton.addEventListener("click", () => {
            const esFavoritoActual = favoritos.includes(idDestino);

            if (esFavoritoActual) {
                favoritos = favoritos.filter((id) => id !== idDestino);
                marcarComoFavoritoUI(boton, badgeFavorito, false);
            } else {
                favoritos.push(idDestino);
                marcarComoFavoritoUI(boton, badgeFavorito, true);
            }

            localStorage.setItem("favoritosElGaraje", JSON.stringify(favoritos));
        });
    });
}

function marcarComoFavoritoUI(boton, badge, esFavorito) {
    if (esFavorito) {
        boton.classList.remove("btn-outline-danger");
        boton.classList.add("btn-danger");
        boton.innerHTML = "❤️ Favorito";
        if (badge) badge.classList.remove("d-none");
    } else {
        boton.classList.remove("btn-danger");
        boton.classList.add("btn-outline-danger");
        boton.innerHTML = "🤍 Marcar Favorito";
        if (badge) badge.classList.add("d-none");
    }
}
