// =================================================================
// MIDDLEWARE: Autenticación y Autorización
// Protege rutas sensibles (POST/PUT/DELETE) mediante JWT emitido en
// el login. Las rutas de lectura (GET) del catálogo NO usan esto:
// deben permanecer 100% públicas.
// =================================================================
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "el_garaje_secret_dev";

/**
 * Exige un token válido en el encabezado Authorization: Bearer <token>.
 * Si es válido, deja los datos del usuario en req.usuario para que los
 * middlewares/controladores siguientes (p.ej. verificarRol) los usen.
 */
function verificarAutenticacion(req, res, next) {
    const encabezado = req.headers["authorization"];

    if (!encabezado || !encabezado.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Acceso no autorizado. Debes iniciar sesión." });
    }

    const token = encabezado.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuario = payload; // { id, nombre, correo, rol }
        return next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Sesión inválida o expirada. Inicia sesión nuevamente." });
    }
}

/**
 * Exige que el usuario autenticado tenga uno de los roles indicados.
 * Uso: verificarRol("admin") o verificarRol("admin", "cocina").
 * Debe ir SIEMPRE después de verificarAutenticacion en la ruta.
 */
function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: "Acceso no autorizado. Debes iniciar sesión." });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción." });
        }

        return next();
    };
}

module.exports = { verificarAutenticacion, verificarRol };
