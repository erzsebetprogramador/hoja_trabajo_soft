# Proyecto JavaScript + MySQL con OCP

## Estructura
proyecto/
├── server.js
├── package.json
├── crear_tabla.sql
├── .env.example
├── .gitignore
├── config/
│   ├── db.js
│   └── mailer.js
├── repositories/
│   └── usuarioRepository.js
├── routes/
│   ├── index.js
│   ├── usuarioRoutes.js
│   ├── conexionRoutes.js
│   └── verificacionRoutes.js
├── services/
│   ├── bcryptPasswordHasher.js
│   ├── emailService.js
│   └── usuarioService.js
├── validators/
│   ├── registroRules.js
│   └── validationEngine.js
└── public/
    ├── index.html
    └── app.js

<img width="1887" height="772" alt="Captura de pantalla 2026-09-02 203932" src="https://github.com/user-attachments/assets/ce6dea2b-f93e-4d7e-bcd7-4929bd02a4bf" />

enlace para mejor visualización del diagrama:

[diagrama_clases_ordenado_por_capas.html](https://github.com/user-attachments/files/31765280/diagrama_clases_ordenado_por_capas.html)



## Base de datos

La conexión está configurada en `db.js`:

- Host: localhost
- Usuario: root
- Contraseña: Root123
- Base de datos: software

La tabla esperada es:

- id_usuario
- correo_electronico
- nombre
- apellido
- edad
- contrasena

## Ejecutar

1. Asegúrate de que la base `software` exista en MySQL.
2. Si necesitas crear la tabla, ejecuta `crear_tabla.sql`.
3. En la carpeta del proyecto ejecuta:

   npm install

4. Inicia el servidor:

   npm start

5. Abre:

   http://localhost:3000

6. Para comprobar únicamente la conexión con MySQL:

   http://localhost:3000/probar-conexion

## Cómo se aplica OCP

- `validationEngine.js` no cambia cuando agregas nuevas reglas.
- `registroRules.js` permite extender validaciones agregando objetos.
- `UsuarioService` depende de componentes inyectados.
- `UsuarioRepository` concentra el acceso a MySQL.
- `UsuarioController` se limita a manejar HTTP.
- `server.js` solo ensambla los componentes.
- En `public/app.js` el motor de validación también está cerrado a modificación y las reglas están abiertas a extensión.
