// =================================================================
// MODELO: Categoria (POO)
// Encapsula todo el acceso a datos de la tabla `categorias`
// =================================================================
const pool = require("./db");

class Categoria {
    static async obtenerTodas() {
        const [filas] = await pool.query(
            `SELECT id_categoria, nombre_categoria FROM categorias ORDER BY id_categoria`
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            `SELECT id_categoria, nombre_categoria FROM categorias WHERE id_categoria = ?`,
            [id]
        );
        return filas[0];
    }

    static async obtenerPorNombre(nombreCategoria) {
        const [filas] = await pool.query(
            `SELECT id_categoria FROM categorias WHERE nombre_categoria = ?`,
            [nombreCategoria]
        );
        return filas[0];
    }

    static async crear(nombreCategoria) {
        const [resultado] = await pool.query(
            `INSERT INTO categorias (nombre_categoria) VALUES (?)`,
            [nombreCategoria]
        );
        return resultado.insertId;
    }

    static async actualizar(id, nombreCategoria) {
        const [resultado] = await pool.query(
            `UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?`,
            [nombreCategoria, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            `DELETE FROM categorias WHERE id_categoria = ?`,
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Categoria;
