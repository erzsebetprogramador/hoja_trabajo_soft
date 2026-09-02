const express = require("express");

function crearConexionRoutes(db) {
    const router = express.Router();

    router.get("/probar-conexion", async (req, res) => {
        try {
            // CAMBIO POR MOTOR DE BASE DE DATOS: en MySQL era "SELECT DATABASE()",
            // en PostgreSQL la funcion equivalente es "current_database()".
            const [filas] = await db.query("SELECT current_database() AS base_datos");
            res.json({
                mensaje: "Conexión correcta con PostgreSQL.",
                base_datos: filas[0].base_datos
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo conectar con PostgreSQL." });
        }
    });

    return router;
}

module.exports = crearConexionRoutes;