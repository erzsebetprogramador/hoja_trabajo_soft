/**
 * Motor genérico de validación.
 * OCP: no necesita modificarse al agregar nuevas reglas.
 */
function validarConReglas(reglas, datos) {
    for (const regla of reglas) {
        const resultado = regla.validar(datos);

        if (!resultado.valido) {
            return resultado;
        }
    }

    return { valido: true };
}

module.exports = validarConReglas;
