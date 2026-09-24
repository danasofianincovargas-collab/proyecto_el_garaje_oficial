// =================================================================
// CONTROLADOR: Categoria
// Logica de negocio: CRUD de categorias del menu
// =================================================================
const Categoria = require("../models/Categoria");

class CategoriaController {
    // GET /api/categorias
    static async listar(req, res) {
        try {
            const categorias = await Categoria.obtenerTodas();
            return res.json(categorias);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener las categorías." });
        }
    }

    // GET /api/categorias/:id
    static async obtener(req, res) {
        try {
            const categoria = await Categoria.obtenerPorId(req.params.id);
            if (!categoria) return res.status(404).json({ mensaje: "Categoría no encontrada." });
            return res.json(categoria);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener la categoría." });
        }
    }

    // POST /api/categorias
    static async crear(req, res) {
        try {
            const { nombreCategoria } = req.body;

            if (!nombreCategoria) {
                return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio." });
            }

            const existente = await Categoria.obtenerPorNombre(nombreCategoria);
            if (existente) {
                return res.status(409).json({ mensaje: "Ya existe una categoría con ese nombre." });
            }

            const idCategoria = await Categoria.crear(nombreCategoria);
            return res.status(201).json({ mensaje: "Categoría creada con éxito.", id: idCategoria });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensaje: "Ya existe una categoría con ese nombre." });
            }
            console.error(error);
            return res.status(500).json({ mensaje: "Error al crear la categoría." });
        }
    }

    // PUT /api/categorias/:id
    static async actualizar(req, res) {
        try {
            const { nombreCategoria } = req.body;

            if (!nombreCategoria) {
                return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio." });
            }

            const filasAfectadas = await Categoria.actualizar(req.params.id, nombreCategoria);

            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Categoría no encontrada." });
            }

            return res.json({ mensaje: "Categoría actualizada con éxito." });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensaje: "Ya existe una categoría con ese nombre." });
            }
            console.error(error);
            return res.status(500).json({ mensaje: "Error al actualizar la categoría." });
        }
    }

    // DELETE /api/categorias/:id
    static async eliminar(req, res) {
        try {
            const filasAfectadas = await Categoria.eliminar(req.params.id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Categoría no encontrada." });
            }
            return res.json({ mensaje: "Categoría eliminada con éxito." });
        } catch (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED") {
                return res.status(409).json({ mensaje: "No se puede eliminar: hay productos asociados a esta categoría." });
            }
            console.error(error);
            return res.status(500).json({ mensaje: "Error al eliminar la categoría." });
        }
    }
}

module.exports = CategoriaController;
