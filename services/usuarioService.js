class UsuarioService {
    constructor({ repository, passwordHasher, validationEngine, reglas }) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.validationEngine = validationEngine;
        this.reglas = reglas;
    }

    async registrar(datos) {
        const validacion = this.validationEngine(this.reglas, datos);

        if (!validacion.valido) {
            const error = new Error(validacion.mensaje);
            error.tipo = "VALIDACION";
            throw error;
        }

        const contrasenaHash = await this.passwordHasher.hash(datos.password);

        const idUsuario = await this.repository.crear({
            correo: datos.correo.trim(),
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            edad: Number(datos.edad),
            contrasenaHash
        });

        return {
            idUsuario,
            mensaje: "Usuario registrado correctamente."
        };
    }
}

module.exports = UsuarioService;
