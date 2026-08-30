class UsuarioRepository {
    constructor(db) {
        this.db = db;
    }

    async crear(usuario) {
        const sql = `
        INSERT INTO usuarios
        (correo_electronico, nombre, apellido, edad, contrasena, verificado, token_verificacion, token_expira)
        VALUES (?, ?, ?, ?, ?, false, ?, ?)
    `;

        const [resultado] = await this.db.execute(sql, [
            usuario.correo,
            usuario.nombre,
            usuario.apellido,
            usuario.edad,
            usuario.contrasenaHash,
            usuario.token,
            usuario.tokenExpira
        ]);

        return resultado.insertId;
    }

    async buscarPorToken(token) {
        const [filas] = await this.db.execute(
            "SELECT * FROM usuarios WHERE token_verificacion = ?",
            [token]
        );
        return filas[0] || null;
    }

    async marcarComoVerificado(idUsuario) {
        await this.db.execute(
            "UPDATE usuarios SET verificado = true, token_verificacion = NULL, token_expira = NULL WHERE id_usuario = ?",
            [idUsuario]
        );
    }
}

module.exports = UsuarioRepository;

