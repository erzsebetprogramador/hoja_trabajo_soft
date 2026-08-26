// script.js
// Logica del formulario: mostrar/ocultar contrasena, medir su fortaleza
// y validar los datos antes de "enviar" (todo funciona solo en el navegador).
//
// La validacion esta disenada para cumplir el principio Abierto/Cerrado
// (la "O" de SOLID): el motor que recorre y aplica las reglas nunca se
// modifica; para agregar una validacion nueva solo se agrega un objeto
// mas al arreglo "reglasValidacion", sin tocar el resto del codigo.

document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del formulario que vamos a manipular.
    const form = document.getElementById('formRegistro');
    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePw');
    const bars = document.querySelectorAll('#strength span');
    const correoInput = document.getElementById('correo');
    const edadInput = document.getElementById('edad');

    // Colores para cada nivel de fortaleza (1 a 4).
    const colores = ['#e05d44', '#e0a544', '#a3c94a', '#3fa34d'];

    // ---------------------------------------------------------------
    // Funcion: alternar visibilidad de la contrasena
    // ---------------------------------------------------------------
    function toggleVisibilidadContrasena() {
        const estaOculta = pwInput.type === 'password';
        pwInput.type = estaOculta ? 'text' : 'password';
        toggleBtn.textContent = estaOculta ? 'Ocultar' : 'Mostrar';
    }

    // ---------------------------------------------------------------
    // Funcion: calcular la fortaleza de la contrasena
    // ---------------------------------------------------------------
    function calcularFortaleza(valor) {
        let score = 0;

        if (valor.length >= 8) score++;
        if (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) score++;
        if (/\d/.test(valor)) score++;
        if (/[^A-Za-z0-9]/.test(valor)) score++;

        return score;
    }

    // ---------------------------------------------------------------
    // Funcion: pintar la barra de fortaleza segun el puntaje
    // ---------------------------------------------------------------
    function actualizarBarraFortaleza(score) {
        bars.forEach((bar, i) => {
            bar.style.background = i < score ? colores[score - 1] : '#ddd';
        });
    }

    // =================================================================
    // MOTOR DE VALIDACION (parte "CERRADA" a modificacion)
    // =================================================================
    //
    // Cada regla es un objeto con esta forma:
    //   {
    //     campo:    el elemento <input> que se debe enfocar si falla,
    //     validar:  funcion que recibe los valores del formulario y
    //               devuelve true (paso) o false (fallo),
    //     mensaje:  texto a mostrar si la regla falla
    //   }
    //
    // Esta funcion NUNCA necesita cambiar cuando se agregan reglas
    // nuevas: solo recorre el arreglo "reglas" en orden y se detiene
    // en la primera que falle. Para extender el comportamiento del
    // formulario (abierto a extension) basta con agregar objetos al
    // arreglo "reglasValidacion" definido mas abajo.
    function ejecutarValidaciones(reglas, valores) {
        for (const regla of reglas) {
            const esValida = regla.validar(valores);
            if (!esValida) {
                return regla; // devolvemos la primera regla que fallo
            }
        }
        return null; // ninguna regla fallo: los datos son validos
    }

    // =================================================================
    // REGLAS DE VALIDACION (parte "ABIERTA" a extension)
    // =================================================================
    //
    // Para agregar un campo nuevo (por ejemplo "telefono" o "confirmar
    // contrasena"), NO se modifica ninguna funcion existente: solo se
    // agrega un objeto nuevo a este arreglo, con su propio "campo",
    // "validar" y "mensaje".
    const reglasValidacion = [
        {
            campo: correoInput,
            validar: (valores) => valores.correo.includes('@') && valores.correo.includes('.'),
            mensaje: 'Ingresa un correo electronico valido.'
        },
        {
            campo: document.getElementById('nombre'),
            validar: (valores) => valores.nombre.trim().length > 0,
            mensaje: 'El nombre es obligatorio.'
        },
        {
            campo: document.getElementById('apellido'),
            validar: (valores) => valores.apellido.trim().length > 0,
            mensaje: 'El apellido es obligatorio.'
        },
        {
            campo: edadInput,
            validar: (valores) => parseInt(valores.edad, 10) >= 18,
            mensaje: 'Debes tener al menos 18 anios para registrarte.'
        },
        {
            campo: edadInput,
            validar: (valores) => parseInt(valores.edad, 10) <= 100,
            mensaje: 'Ingresa una edad valida.'
        },
        {
            campo: pwInput,
            validar: (valores) => valores.password.length >= 8,
            mensaje: 'La contrasena debe tener al menos 8 caracteres.'
        }

        // Ejemplo de como se extenderia sin tocar el motor ni las
        // reglas anteriores (queda comentado a modo de referencia):
        //
        // {
        //     campo: document.getElementById('telefono'),
        //     validar: (valores) => /^\d{8}$/.test(valores.telefono),
        //     mensaje: 'El telefono debe tener 8 digitos.'
        // }
    ];

    // ---------------------------------------------------------------
    // Funcion: recolectar los valores actuales del formulario
    // ---------------------------------------------------------------
    // Centraliza la lectura de los inputs para que las reglas reciban
    // siempre un mismo objeto "valores", en lugar de leer el DOM
    // directamente dentro de cada regla.
    function obtenerValoresFormulario() {
        return {
            correo: correoInput.value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: edadInput.value,
            password: pwInput.value
        };
    }

    // ---------------------------------------------------------------
    // Funcion: manejar el envio del formulario
    // ---------------------------------------------------------------
    function validarFormulario(evento) {
        evento.preventDefault();

        const valores = obtenerValoresFormulario();
        const reglaFallida = ejecutarValidaciones(reglasValidacion, valores);

        if (reglaFallida) {
            alert(reglaFallida.mensaje);
            reglaFallida.campo.focus();
            return;
        }

        // Si ninguna regla fallo, los datos son validos.
        alert('Formulario valido. Listo para procesarse.');
        form.reset();
        actualizarBarraFortaleza(0);
        pwInput.type = 'password';
        toggleBtn.textContent = 'Mostrar';
    }

    // ---------------------------------------------------------------
    // Eventos
    // ---------------------------------------------------------------
    toggleBtn.addEventListener('click', toggleVisibilidadContrasena);

    pwInput.addEventListener('input', () => {
        const score = calcularFortaleza(pwInput.value);
        actualizarBarraFortaleza(score);
    });

    form.addEventListener('submit', validarFormulario);

});
