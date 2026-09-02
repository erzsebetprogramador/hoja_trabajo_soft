document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formRegistro");
    const mensaje = document.getElementById("mensaje");
    const correoInput = document.getElementById("correo");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const edadInput = document.getElementById("edad");
    const passwordInput = document.getElementById("password");
    const togglePw = document.getElementById("togglePw");
    const barras = document.querySelectorAll("#strength span");

    // Motor cerrado a modificación.
    function ejecutarValidaciones(reglas, datos) {
        for (const regla of reglas) {
            const resultado = regla.validar(datos);

            if (!resultado.valido) {
                return resultado;
            }
        }

        return { valido: true };
    }

    // Reglas abiertas a extensión.
    // Para agregar una nueva validación basta con agregar otro objeto.
    const reglasValidacion = [
        {
            validar: (datos) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)
                    ? { valido: true }
                    : { valido: false, mensaje: "Ingresa un correo electrónico válido." }
        },
        {
            validar: (datos) =>
                datos.nombre.trim().length > 0
                    ? { valido: true }
                    : { valido: false, mensaje: "El nombre es obligatorio." }
        },
        {
            validar: (datos) =>
                datos.apellido.trim().length > 0
                    ? { valido: true }
                    : { valido: false, mensaje: "El apellido es obligatorio." }
        },
        {
            // Regla Actualizada: rango de edad ajustado de 18-100 a 18-65.
            validar: (datos) => {
                const edad = Number(datos.edad);

                return Number.isInteger(edad) && edad >= 18 && edad <= 65
                    ? { valido: true }
                    : { valido: false, mensaje: "La edad debe estar entre 18 y 65 años." };
            }
        },
        {
            // Regla Actualizada: antes solo pedia 8 caracteres.
            // Ahora exige mayuscula, minuscula, numero y caracter especial,
            // igual que en el backend (registroRules.js).
            validar: (datos) => {
                const password = datos.password;

                const tieneLongitud = password.length >= 8;
                const tieneMayuscula = /[A-Z]/.test(password);
                const tieneMinuscula = /[a-z]/.test(password);
                const tieneNumero = /\d/.test(password);
                const tieneEspecial = /[^A-Za-z0-9]/.test(password);

                return tieneLongitud && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial
                    ? { valido: true }
                    : {
                        valido: false,
                        mensaje: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo."
                    };
            }
        }
    ];

    function obtenerDatos() {
        return {
            correo: correoInput.value.trim(),
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            edad: Number(edadInput.value),
            password: passwordInput.value
        };
    }

    function calcularFortaleza(password) {
        let puntos = 0;

        if (password.length >= 8) puntos++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) puntos++;
        if (/\d/.test(password)) puntos++;
        if (/[^A-Za-z0-9]/.test(password)) puntos++;

        return puntos;
    }

    function actualizarFortaleza(puntos) {
        const colores = ["#e05d44", "#e0a544", "#a3c94a", "#3fa34d"];

        barras.forEach((barra, indice) => {
            barra.style.background =
                indice < puntos ? colores[puntos - 1] : "#ddd";
        });
    }

    togglePw.addEventListener("click", () => {
        const oculta = passwordInput.type === "password";
        passwordInput.type = oculta ? "text" : "password";
        togglePw.textContent = oculta ? "Ocultar" : "Mostrar";
    });

    passwordInput.addEventListener("input", () => {
        actualizarFortaleza(calcularFortaleza(passwordInput.value));
    });

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const datos = obtenerDatos();
        const validacion = ejecutarValidaciones(reglasValidacion, datos);

        if (!validacion.valido) {
            mensaje.textContent = validacion.mensaje;
            return;
        }

        try {
            const respuesta = await fetch("/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                mensaje.textContent = resultado.mensaje;
                formulario.reset();
                actualizarFortaleza(0);
                passwordInput.type = "password";
                togglePw.textContent = "Mostrar";
            } else {
                mensaje.textContent = resultado.error;
            }

        } catch (error) {
            console.error(error);
            mensaje.textContent = "No se pudo conectar con el servidor.";
        }
    });
});