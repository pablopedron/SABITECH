# Pruebas del servidor

- **Fecha:** 19/11/2026
- **Quién:** Pablo
- **Versión:** rama `MainPruebasV4`
- **Base de datos de los tests:** `sabitech_test`, separada de la de desarrollo

## Tests automáticos (PHPUnit)

`docker compose exec web php artisan test` → **24 tests superados (91 comprobaciones)**. La salida completa está en [phpunit.txt](phpunit.txt) y la captura en [01_phpunit.png](01_phpunit.png).

| Fichero | Casos | Resultado |
|---|---|---|
| `ReservasTest` | Reserva válida, repetida (409), sin plazas (409), sigue guardada al volver a consultar, sin sesión (401), cancelar libera la plaza, cancelar una reserva ajena (404) | ✔ 7/7 |
| `CorreoTest` | Se envía el correo y queda en `email_logs`, lleva los datos de la reserva, si falla el correo la reserva se guarda igual | ✔ 3/3 |
| `QrTest` | Código de la propia reserva, cambia cada 30 s, QR ajeno (404), código vigente (201), repetir el escaneo (409), caducado (422), margen de 5 s, manipulado (422), reserva cancelada (409), asistente que escanea (403) | ✔ 10/10 |
| `PermisosTest` | Asistente (403), personal de acceso (403), sin sesión (401), organización (200) | ✔ 4/4 |

Después de corregir la zona horaria se volvieron a pasar: 24 de 24 ([04_phpunit_tras_zona_horaria.png](04_phpunit_tras_zona_horaria.png)).

## Correo de confirmación (prueba manual)

| Qué hicimos | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|
| Reservar «IA generativa» desde la web con Ana y abrir Mailpit | Llega un correo a ana@sabitech.test con la charla, la fecha, el horario, el lugar y la referencia | ✔ Llega «Reserva confirmada SBT-EAAKQO» con todos los datos | [02_mailpit_bandeja.png](02_mailpit_bandeja.png), [03_mailpit_correo.png](03_mailpit_correo.png) |
| Comparar la hora del correo con la de la web | La misma hora en los dos | ✘ El correo decía 11:00-12:00 y la web 12:00-13:00 → incidencia I-21, corregida en la PR #113 | [03_mailpit_correo.png](03_mailpit_correo.png) y [../../Desarrollo_Cliente/pruebas/12_hora_corregida.png](../../Desarrollo_Cliente/pruebas/12_hora_corregida.png) |

## Fallos encontrados

- **I-20:** al principio los 24 tests fallaban porque usaban la base de datos de desarrollo (`sabitechDB`). El seguro de `tests/TestCase.php` los paró antes de borrar nada. Se corrigió en la PR #112.
- **I-21:** la web y el correo mostraban horas distintas por la zona horaria. Se corrigió en la PR #113.

La colección de Postman (`../SABITECH_API.postman_collection.json`) documenta la API, pero no se ha ejecutado en esta ronda de pruebas.
