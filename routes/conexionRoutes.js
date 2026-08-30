const express = require("express");

function crearConexionRoutes(db) {
    const router = express.Router();

    router.get("/probar-conexion", async (req, res) => {
        try {
            const [filas] = await db.query("SELECT DATABASE() AS base_datos");
            res.json({
                mensaje: "Conexión correcta con MySQL.",
                base_datos: filas[0].base_datos
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo conectar con MySQL." });
        }
    });

    return router;
}

module.exports = crearConexionRoutes;
