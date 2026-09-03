const express = require("express");

function escaparHtml(cadena) {
    return cadena
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function crearVerificacionRoutes(usuarioService) {
    const router = express.Router();

    router.get("/verificar/:token", async (req, res) => {
        try {
            const resultado = await usuarioService.verificarCuenta(req.params.token);
            res.status(200).send(`<h2>${escaparHtml(resultado.mensaje)}</h2>`);
        } catch (error) {
            if (error.tipo === "VALIDACION") {
                return res.status(400).send(`<h2>${escaparHtml(error.message)}</h2>`);
            }
            console.error(error);
            res.status(500).send("<h2>Error al verificar la cuenta.</h2>");
        }
    });

    return router;
}

module.exports = crearVerificacionRoutes;