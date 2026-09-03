const express = require("express");
const crearUsuarioRoutes = require("./usuarioRoutes");
const crearConexionRoutes = require("./conexionRoutes");
const crearVerificacionRoutes = require("./verificacionRoutes");

function registrarRutas({ usuarioService, db }) {
    const router = express.Router();

    router.use(crearUsuarioRoutes(usuarioService));
    router.use(crearConexionRoutes(db));
    router.use(crearVerificacionRoutes(usuarioService));

    return router;
}

module.exports = registrarRutas;
