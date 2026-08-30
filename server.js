require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path");
const db = require("./config/db");
const transportador = require("./config/mailer");
const UsuarioRepository = require("./repositories/usuarioRepository");
const BcryptPasswordHasher = require("./services/bcryptPasswordHasher");
const EmailService = require("./services/emailService");
const UsuarioService = require("./services/usuarioService");
const reglasRegistro = require("./validators/registroRules");
const validarConReglas = require("./validators/validationEngine");
const registrarRutas = require("./routes/index");

const repository = new UsuarioRepository(db);
const passwordHasher = new BcryptPasswordHasher();
const emailService = new EmailService(transportador);

const usuarioService = new UsuarioService({
    repository,
    passwordHasher,
    validationEngine: validarConReglas,
    reglas: reglasRegistro,
    emailService
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(registrarRutas({ usuarioService, db }));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
