// =================================================================
// RUTAS: /api/productos
// =================================================================
const express = require("express");
const router = express.Router();
const ProductoController = require("../controllers/productoController");
const { verificarAutenticacion, verificarRol } = require("../middlewares/auth");

// Lectura publica: el cliente explora el menu sin iniciar sesion
router.get("/", ProductoController.listar);
router.get("/:id", ProductoController.obtener);

// Escritura protegida: admin gestiona el catalogo, cocina puede
// actualizar disponibilidad
router.post("/", verificarAutenticacion, verificarRol("admin"), ProductoController.crear);
router.put("/:id", verificarAutenticacion, verificarRol("admin", "cocina"), ProductoController.actualizar);
router.delete("/:id", verificarAutenticacion, verificarRol("admin"), ProductoController.eliminar);

module.exports = router;
