# Desarrollo web en entorno cliente (0612)

Documentación del frontend de SABITECH WEB. El código está en la carpeta [`frontend/`](../../frontend).

## 1. Tecnología elegida

| | |
|---|---|
| Framework | React 19 |
| Lenguaje | JavaScript (JSX) |
| Herramienta de desarrollo | Vite 8 |
| Comprobación de código | oxlint (`npm run lint`) |
| Comunicación con el servidor | `fetch` contra la API REST de Laravel |

Elegimos React porque organiza la interfaz en componentes reutilizables (por ejemplo, la tarjeta de una charla se usa en el inicio y en el programa) y porque actualiza solo la parte de la página que cambia, sin recargar toda la aplicación. Es además el framework que el equipo conoce mejor.

Todo lo que se muestra se ejecuta en el navegador. Las reglas importantes (aforo, permisos, reservas duplicadas) las decide siempre el servidor: el frontend solo avisa antes al usuario.

## 2. Cómo arrancarlo

```bash
cd frontend
npm install
npm run dev
```

La web se abre en `http://localhost:5173` y se conecta a la API en `http://localhost:8080/api` (los contenedores de Docker tienen que estar levantados). Para cambiar la dirección de la API se copia `frontend/.env.example` como `.env`.

## 3. Organización del código

```
frontend/src/
├── App.jsx            Estado global, navegación entre pantallas y acciones (login, reservar, cancelar...)
├── config.js          Dirección de la API
├── services/api.js    Todas las peticiones al backend y la gestión del token
├── data/charlas.js    Clase Charla: convierte el JSON de la API al formato del frontend
├── utils/charlas.js   Funciones de apoyo: fechas, estado de plazas, si se puede reservar
├── components/        Piezas reutilizables
│   ├── Header.jsx         Menú (con botón ☰ en móvil)
│   ├── Footer.jsx
│   ├── Aviso.jsx          Mensajes de éxito o error
│   ├── ListaCharlas.jsx   Lista de tarjetas con estados de carga, error y vacío
│   └── TarjetaCharla.jsx  Tarjeta de una charla
└── pages/             Una pantalla por fichero
    ├── Inicio.jsx  Charlas.jsx  Detalle.jsx  Reserva.jsx
    ├── Login.jsx   Registro.jsx Cuenta.jsx   Admin.jsx
```

`App.jsx` guarda el estado de la aplicación con `useState` (página actual, usuario, reservas, charlas, filtro y avisos) y se lo pasa a cada pantalla. Cuando el estado cambia, React vuelve a pintar solo los componentes afectados.

## 4. Comunicación con el servidor

Todas las peticiones pasan por `services/api.js`, que añade el token de sesión (`Authorization: Bearer ...`) cuando hace falta y convierte cualquier fallo en un error con su código HTTP.

| Acción | Petición | Pantalla |
|---|---|---|
| Ver el catálogo | `GET /talks` | Inicio, Charlas, Reserva, Panel de organización |
| Ver una charla | `GET /talks/{id}` | Detalle |
| Crear cuenta | `POST /register` | Registro |
| Iniciar sesión | `POST /login` | Login |
| Recuperar la sesión al abrir la web | `GET /me` | App |
| Cerrar sesión | `POST /logout` | Cabecera y Mi cuenta |
| Reservar | `POST /talks/{id}/inscribe` | Reserva |
| Ver mis reservas | `GET /me/reservations` | Mi cuenta |
| Cancelar una reserva | `POST /reservations/{id}/cancel` | Mi cuenta |

Después de reservar o cancelar se vuelven a pedir las reservas y las charlas, para que las plazas libres que se ven coincidan con lo que ha guardado el servidor.

El token se guarda en `localStorage`, así la sesión sigue abierta al recargar la página. Si el navegador no deja usar `localStorage`, se guarda solo en memoria.

## 5. Eventos implementados

| Evento | Dónde | Qué hace |
|---|---|---|
| Clic en **Todas / Salud / Business / Tech** | Charlas | Filtra las charlas por área sin pedir nada al servidor |
| Clic en **Info** | Tarjeta de charla | Abre el detalle y pide esa charla a la API |
| Clic en **Pedir cita** | Tarjeta y Detalle | Abre la pantalla de reserva con la charla elegida |
| Cambio en el desplegable de charla | Reserva | Actualiza el resumen (día, hora, sala, plazas) |
| Envío del formulario (**Confirmar reserva**) | Reserva | Envía la reserva; mientras tanto el botón se desactiva |
| Envío del formulario (**Entrar**) | Login | Inicia sesión y lleva a Mi cuenta o al panel de organización |
| Envío del formulario (**Registrarme**) | Registro | Crea la cuenta y entra directamente |
| Clic en **Darse de baja** | Mi cuenta | Cancela la reserva y libera la plaza |
| Clic en **Cerrar sesión** | Cabecera y Mi cuenta | Cierra la sesión en el servidor y en el navegador |
| Clic en **☰ Menú** | Cabecera (móvil) | Abre y cierra el menú |
| Clic en **Reintentar** | Listas y Detalle | Vuelve a pedir los datos tras un error |
| Cierre del aviso (**×**) | Aviso | Oculta el mensaje |

## 6. Estados que se muestran

| Estado | Dónde | Qué ve el usuario |
|---|---|---|
| Cargando | Catálogo, Reserva, Panel y Detalle | «Cargando charlas...» o «Cargando charla...» |
| Lista vacía | Catálogo | «Todavía no hay charlas publicadas.» |
| Error de carga | Catálogo y Detalle | Mensaje de error y botón **Reintentar** |
| Charla que no existe | Detalle | «Esta charla no existe o ya no está disponible.» (404) |
| Enviando | Login, Registro y Reserva | Botón desactivado para no enviar dos veces |
| Últimas plazas | Tarjeta y Detalle | «Últimas N plazas» cuando quedan 5 o menos |
| Completa | Tarjeta, Detalle y Reserva | Botón **Sin plazas** desactivado |
| Ya celebrada | Tarjeta, Detalle, Reserva y Mi cuenta | Botón **Ya celebrada** desactivado |
| Reserva confirmada o cancelada | Mi cuenta | Separadas en **Mis citas** y **Reservas canceladas** |
| Sesión iniciada | Cabecera | «Bienvenid@» y el nombre del usuario |

## 7. Errores que se gestionan

| Error | Código | Qué hace el frontend |
|---|---|---|
| Sin conexión con el servidor | — | «No se puede conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.» |
| Sesión caducada o token no válido | 401 | Borra el token, cierra la sesión, muestra «Tu sesión ha caducado. Inicia sesión de nuevo.» y lleva al login |
| Sin plazas, reserva repetida o charla ya empezada | 409 | Muestra el mensaje del servidor y vuelve a pedir las charlas para enseñar las plazas reales |
| Datos de registro no válidos | 422 | Muestra la lista de errores de cada campo |
| Correo o contraseña incorrectos | 401 | Muestra «Credenciales incorrectas.» debajo del formulario |
| Charla no encontrada | 404 | «Esta charla no existe o ya no está disponible.» |
| Reservar sin haber iniciado sesión | — | «Debes iniciar sesión para reservar una cita.» y lleva al login |

## 8. Validaciones en el navegador

Estas validaciones solo ayudan al usuario; el servidor vuelve a comprobarlo todo.

- **Registro:** todos los campos son obligatorios, el correo tiene que tener formato de correo, la contraseña al menos 8 caracteres y el código postal 5 números.
- **Login:** correo y contraseña obligatorios.
- **Reserva:** las charlas completas o ya celebradas aparecen desactivadas en el desplegable y no se pueden elegir.

## 9. Accesibilidad aplicada

- Enlace **Saltar al contenido** al principio de la página.
- Los avisos usan `role="alert"` (errores) y `role="status"` (éxito), así los lectores de pantalla los anuncian.
- El menú indica la página actual con `aria-current` y el botón del menú móvil usa `aria-expanded`.
- Los filtros por área usan `aria-pressed` y anuncian cuántas charlas se muestran.
- Las barras de ocupación de plazas tienen una descripción en texto (`aria-label`).

Más detalle en [`Diseno_Interfaces/RESPONSIVE.md`](../Diseno_Interfaces/RESPONSIVE.md).

## 10. Pruebas del recorrido principal

Se hacen con los datos de prueba del seeder (contraseña `Sabitech2026!`). La columna «Resultado obtenido» se rellena al repetir la prueba antes de cada entrega.

| # | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | Abrir **Charlas** | Se ven las charlas de la base de datos con fecha, ponente y plazas libres | |
| 2 | Filtrar por **Tech** | Solo aparecen las charlas de Tech | |
| 3 | Pulsar **Info** en una charla | Se abre el detalle con descripción, sala y ocupación | |
| 4 | Pulsar **Pedir cita** sin sesión | Pide iniciar sesión | |
| 5 | Entrar con `ana@sabitech.test` | Lleva a **Mi cuenta** y la cabecera muestra «Bienvenid@» con el nombre | |
| 6 | Reservar «IA generativa» | Mensaje con referencia SBT-… y la reserva aparece en **Mis citas** | |
| 7 | Cerrar sesión y volver a entrar | La reserva sigue en **Mis citas** | |
| 8 | Reservar otra vez la misma charla | «Ya tienes una reserva para esta charla.» y no se crea otra | |
| 9 | Intentar reservar «Taller de seguridad web» | Aparece como **Sin plazas** y no se puede elegir | |
| 10 | Ver «Bienestar digital» | Aparece como **Ya celebrada** | |
| 11 | Pulsar **Darse de baja** | «Reserva cancelada. La plaza ha quedado libre.» y suben las plazas libres | |
| 12 | Parar el contenedor de la API y recargar | Error de conexión y botón **Reintentar** | |
| 13 | Probar en móvil (390 px) | El menú se recoge en **☰ Menú** y las tarjetas ocupan todo el ancho | |
| 14 | Probar en Chrome y Firefox | El recorrido funciona igual en los dos | |

## 11. Pendiente para la entrega final

- Pantalla de la acreditación con el QR que cambia cada 30 segundos.
- Pantalla del personal de acceso para escanear el QR.
- Gestión de charlas desde el panel de organización (crear, editar y publicar).
- Consulta más cómoda de las inscripciones en el panel de organización (mejora pedida en la validación con usuarios).
