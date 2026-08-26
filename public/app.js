const formulario = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const datos = {
        correo: document.getElementById("correo").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        edad: Number(document.getElementById("edad").value),
        password: document.getElementById("password").value
    };

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
        } else {
            mensaje.textContent = resultado.error;
        }
    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor.";
        console.error(error);
    }
});
