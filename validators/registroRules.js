/**
 * Reglas de validación del registro.
 * OCP: para extender la validación se agrega una regla nueva
 * sin modificar el motor de validación.
 */
const reglasRegistro = [
    {
        nombre: "campos-obligatorios",
        validar: (datos) => {
            const { correo, nombre, apellido, edad, password } = datos;

            if (!correo || !nombre || !apellido || !edad || !password) {
                return {
                    valido: false,
                    mensaje: "Todos los campos son obligatorios."
                };
            }

            return { valido: true };
        }
    },
    {
        nombre: "correo-valido",
        validar: (datos) => {
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo);

            return correoValido
                ? { valido: true }
                : { valido: false, mensaje: "El correo electrónico no es válido." };
        }
    },
    {
        nombre: "nombres-no-vacios",
        validar: (datos) => {
            if (!datos.nombre.trim() || !datos.apellido.trim()) {
                return {
                    valido: false,
                    mensaje: "El nombre y el apellido son obligatorios."
                };
            }

            return { valido: true };
        }
    },
    {
        // Regla Actualizada: rango de edad ajustado de 18-100 a 18-65.
        nombre: "edad-valida",
        validar: (datos) => {
            const edad = Number(datos.edad);
            const valida = Number.isInteger(edad) && edad >= 18 && edad <= 65;

            return valida
                ? { valido: true }
                : { valido: false, mensaje: "La edad debe estar entre 18 y 65 años." };
        }
    },
    {
        // Regla Actualizada: antes solo pedia 8 caracteres.
        // Ahora exige mayuscula, minuscula, numero y caracter especial.
        nombre: "password-segura",
        validar: (datos) => {
            const password = typeof datos.password === "string" ? datos.password : "";

            const tieneLongitud = password.length >= 8;
            const tieneMayuscula = /[A-Z]/.test(password);
            const tieneMinuscula = /[a-z]/.test(password);
            const tieneNumero = /\d/.test(password);
            const tieneEspecial = /[^A-Za-z0-9]/.test(password);

            const valida = tieneLongitud && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial;

            return valida
                ? { valido: true }
                : {
                    valido: false,
                    mensaje: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo."
                };
        }
    }
];

module.exports = reglasRegistro;