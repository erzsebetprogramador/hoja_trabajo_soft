const nodemailer = require("nodemailer"); 
const transportador = nodemailer.createTransport({ 
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io", 
    port: process.env.SMTP_PORT || 2525, 
    auth: { user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS } }); 
    
    module.exports = transportador;
