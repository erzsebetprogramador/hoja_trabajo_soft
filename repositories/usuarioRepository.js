class UsuarioRepository {
    constructor(db) {
        this.db = db;
    }

    async crear(usuario) {
        const sql = `
            INSERT INTO usuarios
            (correo_electronico, nombre, apellido, edad, contrasena)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await this.db.execute(sql, [
            usuario.correo,
            usuario.nombre,
            usuario.apellido,
            usuario.edad,
            usuario.contrasenaHash
        ]);

        return resultado.insertId;
    }
}

module.exports = UsuarioRepository;
