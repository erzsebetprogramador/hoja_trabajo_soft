const { Pool } = require("pg");

// Motor Actualizado: antes se usaba mysql2 (MySQL).
// Ahora se usa pg (PostgreSQL).

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "8263772Lg.",
    database: process.env.DB_NAME || "software"
});

function convertirPlaceholders(sql) {
    let contador = 0;
    return sql.replace(/\?/g, () => `$${++contador}`);
}

module.exports = {
    // Se mantiene el nombre "execute" y la forma de retorno [filas]
    // para respetar la interfaz que ya usaba UsuarioRepository con mysql2.
    async execute(sql, params = []) {
        const consulta = convertirPlaceholders(sql);
        const resultado = await pool.query(consulta, params);
        return [resultado.rows, resultado.fields];
    },

    async query(sql, params = []) {
        return this.execute(sql, params);
    }
};