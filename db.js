const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Root123",
    database: "software",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
