// =================================================================
// RUTAS: /api/categorias
// Lectura (GET) publica. Escritura (POST/PUT/DELETE) protegida: solo
// admin.
// =================================================================
const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/categoriaController");
const { verificarAutenticacion, verificarRol } = require("../middlewares/auth");

router.get("/", CategoriaController.listar);
router.get("/:id", CategoriaController.obtener);
router.post("/", verificarAutenticacion, verificarRol("admin"), CategoriaController.crear);
router.put("/:id", verificarAutenticacion, verificarRol("admin"), CategoriaController.actualizar);
router.delete("/:id", verificarAutenticacion, verificarRol("admin"), CategoriaController.eliminar);

module.exports = router;
