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
        nombre: "edad-valida",
        validar: (datos) => {
            const edad = Number(datos.edad);
            const valida = Number.isInteger(edad) && edad >= 18 && edad <= 100;

            return valida
                ? { valido: true }
                : { valido: false, mensaje: "La edad debe estar entre 18 y 100 años." };
        }
    },
    {
        nombre: "password-minimo",
        validar: (datos) => {
            const valida = typeof datos.password === "string" && datos.password.length >= 8;

            return valida
                ? { valido: true }
                : { valido: false, mensaje: "La contraseña debe tener al menos 8 caracteres." };
        }
    }
];

module.exports = reglasRegistro;
