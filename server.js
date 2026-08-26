const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/registro", async (req, res) => {
    const { correo, nombre, apellido, edad, password } = req.body;

    if (!correo || !nombre || !apellido || !edad || !password) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios."
        });
    }

    if (edad < 18 || edad > 100) {
        return res.status(400).json({
            error: "La edad debe estar entre 18 y 100 años."
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO usuarios
            (correo, nombre, apellido, edad, password)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [
            correo,
            nombre,
            apellido,
            edad,
            passwordHash
        ]);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente."
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "Ese correo ya está registrado."
            });
        }

        console.error(error);
        res.status(500).json({
            error: "Error al registrar el usuario."
        });
    }
});

app.get("/probar-conexion", async (req, res) => {
    try {
        const [filas] = await db.query("SELECT DATABASE() AS base_datos");
        res.json({
            mensaje: "Conexión correcta con MySQL.",
            base_datos: filas[0].base_datos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "No se pudo conectar con MySQL."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
