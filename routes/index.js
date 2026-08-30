const express = require("express");
const crearUsuarioRoutes = require("./usuarioRoutes");
const crearConexionRoutes = require("./conexionRoutes");

function registrarRutas({ usuarioService, db }) {
    const router = express.Router();

    router.use(crearUsuarioRoutes(usuarioService));
    router.use(crearConexionRoutes(db));

    return router;
}

module.exports = registrarRutas;
