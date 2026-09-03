class EmailService {
    constructor(transportador) {
        this.transportador = transportador;
    }

    async enviarVerificacion(correoDestino, token) {
        const urlVerificacion = `${process.env.APP_URL || "http://localhost:3000"}/verificar/${token}`;

        await this.transportador.sendMail({
            from: process.env.SMTP_USER,
            to: correoDestino,
            subject: "Verifica tu cuenta",
            html: `
                <p>Gracias por registrarte.</p>
                <p>Haz clic en el siguiente enlace para verificar tu cuenta (válido por 1 hora):</p>
                <a href="${urlVerificacion}">${urlVerificacion}</a>
            `
        });
    }
}

module.exports = EmailService;