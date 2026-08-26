// script.js
// Logica del formulario: mostrar/ocultar contrasena, medir su fortaleza
// y validar los datos antes de "enviar" (todo funciona solo en el navegador,
// sin conexion a ningun servidor).

// Se espera a que el DOM este completamente cargado antes de buscar los
// elementos, para evitar errores si el script se carga antes que el HTML.
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del formulario que vamos a manipular.
    const form = document.getElementById('formRegistro');
    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePw');
    const bars = document.querySelectorAll('#strength span');
    const correoInput = document.getElementById('correo');
    const edadInput = document.getElementById('edad');

    // Colores para cada nivel de fortaleza (1 a 4).
    // Indice 0 = fortaleza 1 (rojo), indice 3 = fortaleza 4 (verde).
    const colores = ['#e05d44', '#e0a544', '#a3c94a', '#3fa34d'];

    // ---------------------------------------------------------------
    // Funcion: alternar visibilidad de la contrasena
    // ---------------------------------------------------------------
    function toggleVisibilidadContrasena() {
        // type === 'password' significa que el texto esta oculto.
        const estaOculta = pwInput.type === 'password';

        // Si estaba oculta, la mostramos como texto plano, y viceversa.
        pwInput.type = estaOculta ? 'text' : 'password';

        // Actualizamos el texto del boton segun el nuevo estado.
        toggleBtn.textContent = estaOculta ? 'Ocultar' : 'Mostrar';
    }

    // ---------------------------------------------------------------
    // Funcion: calcular la fortaleza de la contrasena
    // ---------------------------------------------------------------
    // Devuelve un numero de 0 a 4 segun cuantos criterios cumple:
    //   1) longitud minima de 8 caracteres
    //   2) contiene mayusculas Y minusculas
    //   3) contiene al menos un numero
    //   4) contiene al menos un caracter especial
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
            // Las primeras "score" barras se pintan con el color correspondiente,
            // el resto vuelve al color neutro gris.
            bar.style.background = i < score ? colores[score - 1] : '#ddd';
        });
    }

    // ---------------------------------------------------------------
    // Funcion: validar el formulario al enviarlo
    // ---------------------------------------------------------------
    // Revisa correo, edad minima (18) y largo de la contrasena.
    // Si algo falla, cancela el envio y muestra un mensaje. Si todo
    // esta correcto, muestra un mensaje de exito (sin enviar datos
    // a ningun servidor, ya que este formulario es solo HTML/CSS/JS).
    function validarFormulario(evento) {
        evento.preventDefault();

        if (!correoInput.value.includes('@')) {
            alert('Ingresa un correo electronico valido.');
            correoInput.focus();
            return;
        }

        if (parseInt(edadInput.value, 10) < 18) {
            alert('Debes tener al menos 18 anios para registrarte.');
            edadInput.focus();
            return;
        }

        if (pwInput.value.length < 8) {
            alert('La contrasena debe tener al menos 8 caracteres.');
            pwInput.focus();
            return;
        }

        alert('Formulario valido. Listo para procesarse.');
        form.reset();
        actualizarBarraFortaleza(0);
        pwInput.type = 'password';
        toggleBtn.textContent = 'Mostrar';
    }

    // ---------------------------------------------------------------
    // Eventos
    // ---------------------------------------------------------------

    // Clic en el boton "Mostrar/Ocultar"
    toggleBtn.addEventListener('click', toggleVisibilidadContrasena);

    // Cada vez que el usuario escribe en el campo de contrasena,
    // recalculamos la fortaleza y actualizamos la barra visual.
    pwInput.addEventListener('input', () => {
        const score = calcularFortaleza(pwInput.value);
        actualizarBarraFortaleza(score);
    });

    // Al enviar el formulario, validamos los datos en el navegador.
    form.addEventListener('submit', validarFormulario);

});