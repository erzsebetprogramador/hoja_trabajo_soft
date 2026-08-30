# Proyecto JavaScript + MySQL con OCP

## Estructura

proyecto/
├── server.js
├── db.js
├── package.json
├── crear_tabla.sql
├── controllers/
│   └── usuarioController.js
├── repositories/
│   └── usuarioRepository.js
├── routes/
│   └── usuarioRoutes.js
├── services/
│   ├── bcryptPasswordHasher.js
│   └── usuarioService.js
├── validators/
│   ├── registroRules.js
│   └── validationEngine.js
└── public/
    ├── index.html
    └── app.js

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
