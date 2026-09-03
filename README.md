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

<style>
#cd3 svg.classDiagram .divider path { stroke-opacity: 0.5; }
#cd3 svg.classDiagram .row-rect-odd path,
#cd3 svg.classDiagram .row-rect-odd rect,
#cd3 svg.classDiagram .row-rect-even path,
#cd3 svg.classDiagram .row-rect-even rect { stroke: none !important; }
</style>
<div id="cd3"></div>
<script type="module">
import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
const themeMode = document.documentElement.dataset.mode;
const dark = themeMode ? themeMode === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
await document.fonts.ready;
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: '"anthropic-sans", sans-serif',
  themeVariables: {
    darkMode: dark,
    fontSize: '13px',
    fontFamily: '"anthropic-sans", sans-serif',
    lineColor: dark ? '#9c9a92' : '#73726c',
    textColor: dark ? '#c2c0b6' : '#3d3d3a',
  },
});

const def = `classDiagram
  direction TB

  namespace Frontend_Validacion {
    class FormularioRegistro {
      +validarFormulario(evento) void
    }
    class MotorValidacion {
      +ejecutarValidaciones(reglas, valores) ReglaValidacion
    }
    class ReglaValidacion {
      <<interface>>
      +validar(valores) boolean
    }
    class ReglaCorreo {
      +validar(valores) boolean
    }
  }

  namespace Logica_de_negocio {
    class ControladorRegistro {
      +registrar(peticion) Response
      +verificarCuenta(token) Response
    }
    class ServicioRegistro {
      +registrarUsuario(datos) Usuario
    }
    class ServicioVerificacion {
      +verificarCuenta(token) boolean
    }
    class Usuario {
      +string correo
      +boolean verificado
    }
    class TokenVerificacion {
      +string token
      +esValido() boolean
    }
  }

  namespace Persistencia {
    class UsuarioRepositorio {
      <<interface>>
      +guardar(usuario) Usuario
      +buscarPorCorreo(correo) Usuario
    }
    class UsuarioRepositorioSQL {
      +guardar(usuario) Usuario
      +buscarPorCorreo(correo) Usuario
    }
    class BaseDeDatos {
      +ejecutarConsulta(sql, params) ResultSet
    }
  }

  namespace Envio_de_correo {
    class EnviadorCorreo {
      <<interface>>
      +enviar(usuario, token) void
    }
    class EnviadorCorreoSMTP {
      +enviar(usuario, token) void
    }
  }

  note for ReglaValidacion "Tambien implementada por:
ReglaNombre, ReglaApellido,
ReglaEdad, ReglaPassword"
  note for EnviadorCorreo "Cambiar de proveedor no
afecta a ServicioRegistro"

  ReglaCorreo ..|> ReglaValidacion
  FormularioRegistro --> MotorValidacion : usa
  MotorValidacion --> ReglaValidacion : recorre
  FormularioRegistro ..> ControladorRegistro : envia datos

  ControladorRegistro --> ServicioRegistro : usa
  ControladorRegistro --> ServicioVerificacion : usa
  ServicioRegistro --> TokenVerificacion : genera
  ServicioVerificacion --> TokenVerificacion : valida
  TokenVerificacion --> Usuario : referencia

  ServicioRegistro --> UsuarioRepositorio : usa
  ServicioVerificacion --> UsuarioRepositorio : usa
  UsuarioRepositorioSQL ..|> UsuarioRepositorio
  UsuarioRepositorioSQL --> BaseDeDatos : usa
  UsuarioRepositorio --> Usuario : maneja

  ServicioRegistro --> EnviadorCorreo : usa
  EnviadorCorreoSMTP ..|> EnviadorCorreo`;

const { svg } = await mermaid.render('cd3-svg', def);
document.getElementById('cd3').innerHTML = svg;

document.querySelectorAll('#cd3 svg.classDiagram .node, #cd3 svg.classDiagram g[class*="classGroup"]').forEach(node => {
  const firstPath = node.querySelector('path[d]');
  if (!firstPath) return;
  const d = firstPath.getAttribute('d');
  const nums = d.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 8) return;
  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', w); rect.setAttribute('height', h);
  rect.setAttribute('rx', '8');
  for (const a of ['fill', 'stroke', 'stroke-width', 'class', 'style']) {
    if (firstPath.hasAttribute(a)) rect.setAttribute(a, firstPath.getAttribute(a));
  }
  firstPath.replaceWith(rect);
});

document.querySelectorAll('#cd3 svg.classDiagram .row-rect-odd path, #cd3 svg.classDiagram .row-rect-even path').forEach(p => {
  p.setAttribute('stroke', 'none');
});
</script>

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
