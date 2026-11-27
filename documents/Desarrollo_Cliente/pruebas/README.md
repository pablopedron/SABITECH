# Pruebas del frontend en el navegador

- **Fecha:** 19/11/2026
- **Quién:** Pablo
- **Entorno:** Chrome en Windows 11, `docker compose up -d` y datos limpios con `php artisan migrate:fresh --seed`
- **Cuenta de prueba:** `ana@sabitech.test` (contraseña en el README principal)

| # | Qué hicimos | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|
| 1 | Abrir Charlas | Se ven las charlas de la base de datos | ✔ 9 charlas publicadas, con los estados «ya celebrada», «plazas libres» y «completa» | [01](01_charlas.png) |
| 2 | Filtrar por Tech | Solo las charlas de Tech | ✔ «3 charlas de Tech» | [02](02_filtro_tech.png) |
| 3 | Pedir cita sin sesión | Pide iniciar sesión | ✔ Lleva a Iniciar sesión con el aviso «Debes iniciar sesión para reservar una cita.» | [03](03_sin_sesion.png) |
| 4 | Entrar con Ana | Lleva a Mi cuenta con «Bienvenid@» | ✔ «Bienvenid@, Ana Asistente», sus datos y sus 3 citas | [04](04_login.png) |
| 5 | Reservar «IA generativa» | Mensaje con la referencia y reserva en Mis citas | ✔ «¡Tu reserva se ha realizado correctamente! Referencia: SBT-EAAKQO» y 4 confirmadas | [05](05_reserva.png) |
| 6 | Cerrar sesión y volver a entrar | La reserva sigue en Mis citas | ✔ Sigue SBT-EAAKQO y 4 confirmadas | [06](06_reserva_guardada.png) |
| 7 | Reservar otra vez la misma charla | «Ya tienes una reserva para esta charla.» | ✔ Sale el error y no se crea otra reserva (79 plazas libres) | [07](07_repetida.png) |
| 8 | Ver «Taller de seguridad web» | Aparece como sin plazas | ✔ «Completa» y botón «Sin plazas» desactivado | [08](08_sin_plazas.png) |
| 9 | Darse de baja de «IA generativa» | Reserva cancelada y suben las plazas | ✔ «Reserva cancelada. La plaza ha quedado libre.», 3 confirmadas y vuelve a tener 80 plazas libres | [09](09_cancelar.png), [09b](09b_plaza_liberada.png) |
| 10 | Parar la API (`docker compose stop web`) y recargar | Error de conexión y botón Reintentar | ✔ «No se han podido cargar las charlas…» con Reintentar; al arrancar la API y pulsarlo vuelven las 9 charlas | [10](10_sin_api.png), [10b](10b_parar_arrancar_api.png), [10c](10c_reintentar.png) |
| 11 | Vista de móvil (iPhone 16, 440 px) | Menú plegado y tarjetas a todo el ancho | ✔ Menú «☰ Menú» que se abre y se cierra, tarjetas en una columna y sin scroll horizontal | [11](11_movil.png), [11b](11b_movil_menu.png) |
| 12 | Comprobar la hora de «IA generativa» después de corregir la zona horaria | La misma hora que en el correo (11:00 - 12:00) | ✔ 11:00 - 12:00 | [12](12_hora_corregida.png) |

## Observaciones

- **Caso 10:** con la API caída, al recargar la página el usuario aparece como visitante, porque no se puede comprobar su sesión. El token no se borra: al recargar con la API funcionando vuelve a salir como Ana. **Mejora:** que el botón Reintentar también recupere la sesión, sin tener que recargar.
- **Caso 12:** esta prueba se añadió al encontrar la incidencia I-21 (ver las pruebas del servidor).
