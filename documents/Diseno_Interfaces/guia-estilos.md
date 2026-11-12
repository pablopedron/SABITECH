# SABITECH · Guía de estilos

**Proyecto:** SABITECH WEB · frontend React + Vite (`frontend/`)
**Versión:** 2 — 12/11/2026. Parte de la primera versión de David Clemente (rama `feature/guia_de_estilos`) y la actualiza con la nueva estética, que sigue el prototipo de draw.io y añade los logos.
**Objetivo:** mantener una interfaz coherente, responsive, accesible y fácil de ampliar.

Todo lo que describe esta guía ya está aplicado en `frontend/src/index.css`. Si se cambia un color, un tamaño o un componente, hay que actualizar también esta guía.

---

## 1. Identidad visual

SABITECH usa una identidad tecnológica sencilla. El **morado** es el color de marca: aparece en la portada, el pie y las acciones principales. El **logo** aporta un degradado de colores que se usa solo como detalle decorativo. Las tarjetas y formularios son blancos sobre un fondo lavanda muy claro.

### 1.1. Logos

Los ficheros y cómo se han preparado están en `documents/Diseno_Interfaces/logos/` (ver su README).

| Logo | Dónde se usa | Fichero en la web |
|---|---|---|
| Horizontal (texto azul marino) | Cabecera, sobre fondo blanco | `src/assets/logos/logo-sabitech.webp` |
| Horizontal claro (texto blanco) | Pie de página, sobre morado oscuro | `src/assets/logos/logo-sabitech-claro.webp` |
| «X» sola | Favicon, icono de móvil y detalle de la portada | `public/favicon-32.png`, `public/apple-touch-icon.png`, `src/assets/logos/icono-sabitech.webp` |

Reglas:

- Sobre fondos claros, el logo normal. Sobre fondos morados u oscuros, **siempre** el logo claro: el texto azul marino no se lee sobre morado.
- No deformar el logo: cambiar solo la altura y dejar `width: auto`.
- Altura en la cabecera: 46 px (34 px en móviles). En el pie: 44 px.
- El logo de la cabecera es un botón que lleva al inicio; su nombre accesible es «SABITECH, ir al inicio».
- Usar WebP en la web. Los PNG quedan para documentos y presentaciones.

### 1.2. Paleta de colores

Todos los colores están definidos como variables al principio de `index.css`. En el código se usa la variable, nunca el valor suelto.

| Uso | Variable | Código |
|---|---|---|
| Morado corporativo (marca y acciones principales) | `--morado` | `#5f137b` |
| Morado oscuro (pie, hover de botones, degradado de la portada) | `--morado-oscuro` | `#3f0b53` |
| Morado muy claro (etiquetas, fechas, enlace activo) | `--morado-claro` | `#f3ecf7` |
| Gris lavanda (bloques informativos) | `--lavanda` | `#b9b9c4` |
| Texto principal | `--texto` | `#1d1724` |
| Texto de apoyo | `--texto-suave` | `#5c5566` |
| Fondo de la página | `--fondo` | `#f7f5fa` |
| Tarjetas, formularios y cabecera | `--blanco` | `#ffffff` |
| Bordes | `--borde` | `#e4dfe9` |
| Foco de teclado | `--foco` | `#f0a500` |
| Error (texto) | `--error` | `#b00020` |
| Error (fondo / borde) | `--error-fondo` / `--error-borde` | `#fde8e8` / `#d62828` |
| Correcto (texto y borde / fondo) | `--ok` / `--ok-fondo` | `#2e7d32` / `#e3f6e8` |
| Últimas plazas (texto / fondo) | `--aviso` / `--aviso-fondo` | `#8a5a00` / `#fff4dc` |
| Botón desactivado | `--desactivado` | `#6b6b6b` |

**Colores del logo** (solo decorativos):

| Variable | Código |
|---|---|
| `--logo-turquesa` | `#47d8ca` |
| `--logo-morado` | `#7820d0` |
| `--logo-rosa` | `#f71284` |
| `--logo-naranja` | `#f54538` |
| `--degradado-logo` | turquesa → morado → rosa → naranja |

Reglas de uso:

- Reservar el morado para la marca y las acciones principales.
- Texto blanco sobre morado; texto `--texto` sobre blanco o lavanda.
- Los colores del logo se usan **solo** en la franja bajo la cabecera y en el propio logo. No usarlos en textos ni botones: no tienen contraste suficiente para leerse.
- Los colores de error, correcto y últimas plazas comunican estados, no decoran. Siempre van acompañados de texto.
- No introducir colores nuevos sin añadirlos a `index.css` y a esta guía.

### 1.3. Tipografía

Una sola familia, la del sistema: `system-ui, "Segoe UI", Roboto, sans-serif` (variable `--sans`). No usar Arial ni otras fuentes en componentes nuevos. Monoespaciada solo para referencias de reserva (`SBT-XXXXXX`).

| Elemento | Tamaño | Peso |
|---|---|---|
| Texto base | 16 px, interlineado 1,55 | 400 |
| `h1` (título de cada pantalla) | `clamp(2rem, 5vw, 3.2rem)`: de 32 a 51 px según el ancho | 700 |
| `h2` (secciones) | `clamp(1.4rem, 3vw, 1.9rem)`: de 22 a 30 px | 700 |
| `h3` (títulos de tarjeta) | 1,15rem (≈18 px) | 700 |
| Antetítulo (texto pequeño en mayúsculas sobre el título) | 0,8rem, espaciado 0,08em | 700 |
| Ayudas de formulario y datos secundarios | 0,85–0,95rem | 400 |

Cada pantalla tiene **un solo `h1`** y los títulos siguen el orden h1 → h2 → h3 sin saltos.

---

## 2. Estructura y composición

### 2.1. Contenedores

| Clase | Uso | Ancho máximo |
|---|---|---|
| `.contenedor` | Centra el contenido de cabecera, pie y secciones del inicio | 1200 px |
| `.pagina` | Contenido de cada pantalla, con margen superior e inferior | 1200 px |
| `.pagina--estrecha` | Pantallas de lectura o un solo formulario (reserva) | 760 px |
| `.acceso` | Login y registro | 460 px |

El padding lateral se adapta con `clamp(16px, 4vw, 32px)`. Nunca usar anchos fijos que provoquen scroll horizontal.

### 2.2. Espaciado

- 6–10 px entre una etiqueta y su campo, o entre botones relacionados.
- 14–20 px dentro de tarjetas y paneles.
- 20–24 px entre tarjetas o paneles.
- 40–72 px entre secciones (`.seccion` usa `clamp(40px, 7vw, 72px)`).
- Separar con `margin`, `padding` o `gap`, nunca con `<br>`.

### 2.3. Bordes y sombras

| Elemento | Radio | Sombra |
|---|---|---|
| Bloques grandes (llamada final) | 16 px (`--radio-grande`) | — |
| Tarjetas y paneles | 12 px (`--radio`) | `--sombra`; al pasar el ratón por una tarjeta, `--sombra-alta` |
| Botones, campos, avisos y fechas | 8 px (`--radio-pequeno`) | — |
| Etiquetas y estado de plazas | 999 px (forma de píldora) | — |

---

## 3. Componentes de interfaz

### 3.1. Cabecera (`Header.jsx`)

- Fondo **blanco** con una **franja de 4 px con el degradado del logo** debajo.
- Fija arriba al hacer scroll (`position: sticky`).
- Izquierda: logo (lleva al inicio), Inicio y Charlas.
- Derecha sin sesión: «Iniciar sesión» y el botón principal «Registrarse».
- Derecha con sesión, como en el prototipo: «Bienvenid@, *nombre*», «Mi cuenta» y «Cerrar sesión».
- La pantalla actual se marca con `aria-current="page"`: fondo morado claro y línea morada debajo.
- **Hasta 860 px** la navegación se pliega en un botón «☰ Menú» que abre un panel blanco con los enlaces en columna. El botón indica si está abierto con `aria-expanded`.

### 3.2. Pie de página (`Footer.jsx`)

- Fondo morado oscuro con texto blanco al 88 %.
- Tres columnas: logo claro y descripción, enlaces de la web y redes sociales. Pasan a dos columnas en tableta y a una en móvil.
- Abajo, la línea legal: «© 2026 SABITECH · Web desarrollada por PGD Technologies S.L.», para distinguir la marca de las jornadas de la empresa que ha hecho la web.
- Los enlaces externos llevan `target="_blank"` y `rel="noreferrer"`.

### 3.3. Botones

Todos usan la clase base `.boton`: alto mínimo de 44 px (cómodo para el dedo), radio de 8 px y texto en negrita.

| Clase | Aspecto | Uso |
|---|---|---|
| `.boton` | Fondo morado, texto blanco | Acción principal: «Pedir cita», «Confirmar reserva», «Entrar» |
| `.boton--secundario` | Fondo blanco, borde y texto morados | Acción secundaria: «Info», «Cerrar sesión» |
| `.boton--claro` | Fondo blanco, texto morado | Acción principal sobre fondo morado (portada) |
| `.boton--borde-claro` | Transparente con borde blanco | Acción secundaria sobre fondo morado |
| `.boton--peligro` | Fondo blanco, borde y texto rojos | Acción que borra algo: «Darse de baja» |
| `.boton--enlace` | Texto morado subrayado | Acciones dentro de un texto: «Regístrate», «Volver a las charlas» |
| `.boton--ancho` | Ocupa todo el ancho | Envío de formularios |
| `:disabled` | Fondo gris, cursor `not-allowed` | Charla completa o ya celebrada |

Reglas:

- Verbos claros y cortos: «Pedir cita», «Info», «Entrar», «Registrarme», «Darse de baja».
- Un botón desactivado lleva el atributo `disabled` **y** un texto que explica por qué («Sin plazas», «Ya celebrada»), no solo el color gris.
- Mientras se espera al servidor, el botón se desactiva y cambia el texto: «Entrando...», «Reservando...».
- Si el texto visible no basta para saber a qué se refiere (por ejemplo, varios «Info»), añadir `aria-label`: «Ver información de *título de la charla*».

### 3.4. Tarjetas de charla (`TarjetaCharla.jsx`)

Siguen las tarjetas del prototipo («charla · info · pedir cita»):

1. Arriba: la **categoría** (etiqueta) y la **fecha en forma de calendario** (día y mes).
2. Título y ponente con su empresa.
3. Hora y lugar en una lista de datos (`<dl>`).
4. **Estado de plazas** en forma de píldora, con texto y color:

   | Estado | Texto | Color |
   |---|---|---|
   | Más de 5 libres | «28 plazas libres» | Verde |
   | 5 o menos | «Últimas 3 plazas» | Ámbar |
   | Ninguna | «Completa» | Gris |
   | Ya ha empezado | «Charla ya celebrada» | Gris (y la tarjeta se ve algo más apagada) |

5. Botones **Info** (secundario) y **Pedir cita** (principal). «Pedir cita» se desactiva si la charla está completa o ya celebrada, aunque el servidor también lo comprueba.

La cuadrícula (`.charlas-grid`) usa `repeat(auto-fill, minmax(280px, 1fr))`: el número de columnas se ajusta solo al ancho.

### 3.5. Carrusel de próximas charlas (inicio)

Es el «esto gira con las charlas» del prototipo.

- Una fila de tarjetas que se desplaza en horizontal con el dedo, la rueda o las flechas «←» y «→» (con `aria-label` «Charlas anteriores» / «Charlas siguientes»).
- Muestra 3 tarjetas en escritorio, 2 en tableta y 1 y un trozo de la siguiente en móvil, para que se note que se puede deslizar.
- Solo muestra las charlas que no han empezado.

### 3.6. Formularios

- Cada campo va en un `.campo`: `<label>` visible encima, asociado con `htmlFor` e `id`.
- Campos de 46 px de alto con borde de 2 px; el borde se vuelve morado al recibir el foco.
- Usar el tipo correcto (`email`, `password`) y `autoComplete` (`email`, `current-password`, `new-password`, `postal-code`).
- Las indicaciones van debajo del campo en `.campo__ayuda` y se enlazan con `aria-describedby` («Mínimo 8 caracteres»).
- No usar el placeholder como sustituto de la etiqueta; solo como ejemplo (`nombre@correo.com`).
- Los errores aparecen encima del botón de envío, con fondo rojo claro y `role="alert"`.
- El botón de envío ocupa todo el ancho y se desactiva mientras se envía.

### 3.7. Avisos (`Aviso.jsx`)

- Aparecen bajo la cabecera, con un borde izquierdo grueso.
- **Correcto:** fondo verde claro, borde verde, empieza por «Hecho:» y lleva `role="status"`.
- **Error:** fondo rojo claro, borde rojo, empieza por «Error:» y lleva `role="alert"`.
- Se cierran con el botón «✕» (`aria-label="Cerrar el mensaje"`).
- Mensajes breves que digan qué ha pasado y cómo seguir: «¡Tu reserva se ha realizado correctamente! Referencia: SBT-7K2Q9M».

### 3.8. Estados de carga, vacío y error

Clase `.estado`: una caja con borde discontinuo y el texto centrado.

- Cargando: «Cargando charlas...» con `role="status"`.
- Vacío: «Todavía no tienes ninguna reserva.»
- Error (`.estado--error`): fondo rojo claro, el mensaje y un botón «Reintentar».

### 3.9. Paneles, Mi cuenta y organización

- `.panel`: caja blanca con borde, radio de 12 px y sombra suave. Se usa para formularios, fichas y bloques de Mi cuenta.
- **Mi cuenta** (prototipo «mi cuenta»): a la izquierda, la tarjeta de perfil con la inicial, los datos y «Cerrar sesión»; a la derecha, **Mis citas** en tarjetas con la referencia, la fecha, la hora, el lugar, «Info» y «Darse de baja». En móvil se apilan.
- **Panel de organización** (prototipo «admin»): lo mismo para los datos, una tabla de charlas con una barra de ocupación y un espacio reservado para la gráfica de usuarios por ciudad. En móvil la tabla se desplaza dentro de su caja, sin mover la página.

---

## 4. Responsive

Se diseña primero para el móvil y se amplía. Los puntos de cambio están al final de `index.css`:

| Ancho | Qué cambia |
|---|---|
| Hasta 1024 px | La portada pasa a una columna; el carrusel muestra 2 tarjetas; Mi cuenta y el panel se apilan |
| Hasta 860 px | Menú plegable; el detalle de charla pasa a una columna; el pie a dos columnas |
| Hasta 600 px | Logo más pequeño; botones de la portada a todo el ancho; carrusel de 1 tarjeta; botones de las tarjetas uno debajo del otro; pie en una columna |

Criterios:

- Nada debe provocar scroll horizontal. En una cuadrícula, los hijos llevan `min-width: 0` para que una tabla o un texto largo no estiren la columna.
- Las tablas anchas van dentro de `.tabla-contenedor`, que se desplaza por sí misma.
- Los textos largos se parten (`overflow-wrap: anywhere`).
- Las imágenes llevan `max-width: 100%` y `height: auto`.
- Comprobar al menos a **320, 390, 768, 1024 y 1280 px** (ver `RESPONSIVE.md`).

---

## 5. Accesibilidad

- **Foco visible:** contorno amarillo de 3 px (`:focus-visible`) en todo lo que se puede usar con el teclado. No quitarlo nunca.
- **«Saltar al contenido»:** primer elemento de la página. Aparece al pulsar Tab y lleva directamente al contenido, sin pasar por la navegación.
- **Elementos semánticos:** `header`, `nav` (con `aria-label`), `main`, `section`, `article`, `aside` y `footer`.
- **Página actual** marcada con `aria-current="page"` en la navegación.
- **Menú móvil** con `aria-expanded` y `aria-controls`.
- **Imágenes:** el logo de la cabecera lleva `alt=""` porque el botón ya se llama «SABITECH, ir al inicio»; el del pie lleva `alt="SABITECH"`; la «X» de la portada es decorativa (`alt=""` y `aria-hidden`).
- **Estados con texto,** no solo con color (plazas, botones desactivados, avisos).
- **Tamaño táctil:** botones y enlaces del menú de al menos 44 px de alto.
- **Contraste:** todo el texto tiene 4,5:1 o más (nivel AA de WCAG). Valores calculados con la fórmula de WCAG:

  | Texto sobre fondo | Contraste |
  |---|---|
  | Morado `#5f137b` sobre blanco | 11,3:1 |
  | Texto de apoyo `#5c5566` sobre blanco / sobre el fondo | 7,1:1 / 6,6:1 |
  | Texto `#1d1724` sobre lavanda `#b9b9c4` | 9,0:1 |
  | Blanco sobre el pie `#3f0b53` | 15,2:1 |
  | Blanco sobre botón desactivado `#6b6b6b` | 5,3:1 |
  | Error `#b00020` sobre `#fde8e8` | 6,2:1 |
  | «Últimas plazas» `#8a5a00` sobre `#fff4dc` | 5,4:1 |
  | «Plazas libres» `#2e7d32` sobre `#e3f6e8` | 4,5:1 (justo en el límite: no aclarar este verde) |
- **Menos movimiento:** si el sistema tiene activado «reducir movimiento» (`prefers-reduced-motion`), se quitan las animaciones y el desplazamiento suave.

---

## 6. Contenido y tono

Claro, directo, cercano pero profesional y orientado a la acción. Pensado para estudiantes, trabajadores y cualquier persona interesada en la tecnología.

- «Consulta el programa y reserva tu plaza en un minuto.»
- «Tu plaza en tres pasos.»
- «28 plazas libres» / «Completa» / «Charla ya celebrada».
- «No se han podido cargar las charlas.» + «Reintentar».
- «¡Tu reserva se ha realizado correctamente! Referencia: …»

Evitar textos largos en botones y mensajes técnicos dirigidos al usuario («Error 409», «SQLSTATE…»).

---

## 7. Organización técnica

| Fichero | Qué contiene |
|---|---|
| `src/index.css` | **Todos los estilos**: variables (colores, radios, sombras), estilos base, clases de componentes y responsive al final |
| `src/components/` | Piezas que se repiten: `Header`, `Footer`, `Aviso`, `TarjetaCharla`, `ListaCharlas` |
| `src/pages/` | Una por pantalla: `Inicio`, `Charlas`, `Detalle`, `Reserva`, `Login`, `Registro`, `Cuenta`, `Admin` |
| `src/utils/charlas.js` | Formato de fechas («Jueves, 10 de diciembre de 2026») y estado de plazas y de la charla |
| `src/assets/logos/` | Logos en WebP |
| `public/` | Favicon e icono de móvil |

Reglas:

1. Los estilos van en clases de `index.css`. **No** añadir objetos de estilos inline en los componentes; solo se admite `style` para un valor calculado (por ejemplo, el ancho de la barra de ocupación) o un ajuste puntual de un elemento.
2. Nombres de clase en castellano con el formato `bloque__elemento--variante`: `.tarjeta__acciones`, `.boton--secundario`.
3. Reutilizar las clases existentes antes de crear otras nuevas.
4. Cada color, radio o sombra nuevo se añade como variable en `:root` y se documenta aquí.
