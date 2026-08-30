const express = require("express");

function crearUsuarioRoutes(usuarioService) {
    const router = express.Router();

    router.post("/registro", async (req, res) => {
        try {
            const resultado = await usuarioService.registrar(req.body);
            res.status(201).json(resultado);
        } catch (error) {
            if (error.tipo === "VALIDACION") {
                return res.status(400).json({ error: error.message });
            }
            console.error(error);
            res.status(500).json({ error: "Error al registrar el usuario." });
        }
    });

    return router;
}

module.exports = crearUsuarioRoutes;
