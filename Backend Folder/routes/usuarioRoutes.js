// =================================================================
// RUTAS: /api/usuarios
// =================================================================
const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const { verificarAutenticacion, verificarRol } = require("../middlewares/auth");

// Login publico (es el punto de entrada para obtener el token)
router.post("/login", UsuarioController.login);

// Registro publico (alta de personal). Gestion/listado y escritura
// posterior quedan protegidas: solo admin.
router.post("/", UsuarioController.crear);
router.get("/", verificarAutenticacion, verificarRol("admin"), UsuarioController.listar);
router.get("/:id", verificarAutenticacion, UsuarioController.obtener);
router.put("/:id", verificarAutenticacion, verificarRol("admin"), UsuarioController.actualizar);
router.delete("/:id", verificarAutenticacion, verificarRol("admin"), UsuarioController.eliminar);

module.exports = router;
