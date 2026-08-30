const crypto = require("crypto");

class UsuarioService {
    constructor({ repository, passwordHasher, validationEngine, reglas, emailService }) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.validationEngine = validationEngine;
        this.reglas = reglas;
        this.emailService = emailService;
    }

    async registrar(datos) {
        const validacion = this.validationEngine(this.reglas, datos);

        if (!validacion.valido) {
            const error = new Error(validacion.mensaje);
            error.tipo = "VALIDACION";
            throw error;
        }

        const contrasenaHash = await this.passwordHasher.hash(datos.password);
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        const idUsuario = await this.repository.crear({
            correo: datos.correo.trim(),
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            edad: Number(datos.edad),
            contrasenaHash,
            token,
            tokenExpira
        });

        await this.emailService.enviarVerificacion(datos.correo.trim(), token);

        return {
            idUsuario,
            mensaje: "Usuario registrado. Revisa tu correo para verificar tu cuenta."
        };
    }

    async verificarCuenta(token) {
        const usuario = await this.repository.buscarPorToken(token);

        if (!usuario) {
            const error = new Error("Token de verificación inválido.");
            error.tipo = "VALIDACION";
            throw error;
        }

        if (new Date(usuario.token_expira) < new Date()) {
            const error = new Error("El token de verificación ha expirado.");
            error.tipo = "VALIDACION";
            throw error;
        }

        await this.repository.marcarComoVerificado(usuario.id_usuario);
        return { mensaje: "Cuenta verificada correctamente." };
    }
}

module.exports = UsuarioService;
