# Diccionario de datos · SABITECH WEB

Base de datos MySQL 8.4 (`sabitech_web`). Se crea con las migraciones de Laravel (`app/database/migrations`) y se carga con datos ficticios con el seeder (`php artisan migrate:fresh --seed`). Las pruebas usan otra base, `sabitech_test`.

**Convenciones**

- Todas las claves primarias son `id` INT autoincremental, salvo `role_user` (clave compuesta).
- PK = clave primaria · FK = clave foránea · UQ = único · NN = obligatorio (NOT NULL).
- Los campos marcados como *dato analítico* se guardan para el análisis posterior (Big Data).
- Las reglas que la base de datos no puede comprobar sola (por ejemplo, que una reserva esté confirmada antes de registrar la asistencia) las comprueba el backend.

## Resumen de tablas

| Tabla | Qué guarda | Relaciones |
|---|---|---|
| `users` | Personas registradas (asistentes, organización y personal de acceso) | 1:N con `talk_user`; N:M con `roles` |
| `roles` | Perfiles de la aplicación | N:M con `users` a través de `role_user` |
| `role_user` | Qué roles tiene cada usuario | Tabla intermedia `users` ↔ `roles` |
| `locations` | Salas donde se dan las charlas | 1:N con `talks` |
| `categories` | Temáticas de las charlas | 1:N con `talks` |
| `talks` | Charlas de las jornadas | N:1 con `locations`, `categories` y `users` (creador) |
| `talk_user` | Reservas (inscripciones) | N:1 con `users` y `talks` |
| `user_talk_qr` | Asistencias registradas y valoraciones | N:1 con una reserva de `talk_user` |
| `email_logs` | Correos enviados y su estado | N:1 con `users`, `talks` y `talk_user` |
| `personal_access_tokens` | Tokens de sesión de la API (Laravel Sanctum) | Pertenece a un usuario |

## users

Usuarios de la aplicación. No se borran: se dan de baja con `is_active = 0` para conservar el histórico de reservas.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `name` | VARCHAR(150) | NN | Nombre completo |
| `email` | VARCHAR(190) | NN, UQ `uq_users_email` | Correo; sirve para iniciar sesión y recibir confirmaciones |
| `password` | VARCHAR(255) | NN | Hash bcrypt de la contraseña (nunca en texto plano) |
| `is_active` | INT | NN, defecto 1, CHECK 0 o 1 | 1 = activo, 0 = dado de baja (no puede iniciar sesión) |
| `zip_code` | VARCHAR(10) | Índice | Código postal. *Dato analítico*: procedencia |
| `accessibility_needs` | VARCHAR(255) | | Necesidades de accesibilidad. *Dato analítico* |
| `accessibility_consent_at` | DATETIME | CHECK: obligatorio si hay `accessibility_needs` | Fecha en que el usuario consintió guardar ese dato |
| `created_at` / `updated_at` | TIMESTAMP | Los pone la base de datos | Alta y última modificación |

## roles

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `name` | VARCHAR(50) | NN, UQ `uq_roles_name` | `asistente`, `organizacion` o `personal_acceso` |
| `description` | VARCHAR(255) | | Qué puede hacer el perfil |

Los tres roles los inserta la propia migración, porque la aplicación no funciona sin ellos. Al registrarse, todo usuario recibe el rol `asistente`.

## role_user

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `user_id` | INT | PK compuesta, FK → `users.id` (borrado en cascada) | Usuario |
| `role_id` | INT | PK compuesta, FK → `roles.id` (borrado en cascada) | Rol |

La clave primaria (`user_id`, `role_id`) impide asignar dos veces el mismo rol a la misma persona.

## locations

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `name` | VARCHAR(150) | NN | Nombre de la sala |
| `address` | VARCHAR(255) | NN | Dirección |
| `room_capacity` | INT | NN, CHECK > 0 | Aforo físico de la sala |

## categories

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `name` | VARCHAR(100) | NN, UQ `uq_categories_name` | Temática (IA, Ciberseguridad…) |

## talks

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `location_id` | INT | NN, FK → `locations.id` (RESTRICT) | Sala |
| `created_by` | INT | NN, FK → `users.id` (RESTRICT) | Usuario de organización que la creó |
| `category_id` | INT | NN, FK → `categories.id` (RESTRICT) | Temática |
| `title` | VARCHAR(200) | NN | Título |
| `description` | TEXT | | Contenido de la charla |
| `speaker_name` | VARCHAR(150) | NN | Ponente |
| `speaker_company` | VARCHAR(150) | | Empresa del ponente |
| `speaker_bio` | TEXT | | Biografía del ponente |
| `speaker_photo` | VARCHAR(255) | | Ruta de la foto |
| `speaker_photo_alt` | VARCHAR(255) | CHECK: obligatorio si hay foto | Texto alternativo (accesibilidad) |
| `starts_at` | DATETIME | NN, índice | Inicio |
| `ends_at` | DATETIME | NN, CHECK `ends_at > starts_at` | Fin |
| `capacity` | INT | NN, CHECK > 0; trigger: ≤ `room_capacity` de la sala | Plazas ofrecidas |
| `seats_taken` | INT | NN, defecto 0, CHECK 0 ≤ `seats_taken` ≤ `capacity` | Plazas ocupadas por reservas confirmadas |
| `is_published` | INT | NN, defecto 0, CHECK 0 o 1 | 1 = visible al público, 0 = borrador |
| `created_at` / `updated_at` | TIMESTAMP | | Alta y última modificación |

**Triggers** `trg_talks_capacity_ins` y `trg_talks_capacity_upd`: impiden que el aforo de la charla supere la capacidad de su sala (un CHECK no puede consultar otra tabla).

**Control de aforo**: el CHECK sobre `seats_taken` es la última barrera. Además, al reservar, el backend bloquea la fila de la charla (`SELECT … FOR UPDATE` dentro de una transacción), así que dos peticiones a la vez por la última plaza no pueden concederla dos veces.

## talk_user (reservas)

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `reference` | VARCHAR(20) | NN, UQ `uq_talk_user_reference` | Referencia legible (`SBT-XXXXXX`) que aparece en el correo |
| `user_id` | INT | NN, FK → `users.id` (RESTRICT) | Quién reserva |
| `talk_id` | INT | NN, FK → `talks.id` (RESTRICT) | Qué charla |
| `status` | VARCHAR(20) | NN, defecto `confirmada`, CHECK `confirmada` o `cancelada` | Estado de la reserva |
| `qr_secret` | CHAR(64) | NN | Secreto de la reserva para firmar el QR. Nunca sale en la API |
| `cancellation_reason` | VARCHAR(255) | | Motivo de cancelación. *Dato analítico* |
| `cancelled_at` | DATETIME | CHECK: solo si `status = cancelada` | Cuándo se canceló |
| `registered_at` | DATETIME | NN, defecto ahora | Cuándo se reservó (o reactivó) |

- **UQ `uq_talk_user` (`user_id`, `talk_id`)**: una sola reserva por persona y charla. Si alguien cancela y vuelve a reservar, se reactiva la misma fila.
- Índices `idx_talk_user_talk_status` y `idx_talk_user_status` para contar reservas por charla y estado.
- Tener una reserva **no** significa haber asistido: la asistencia está en `user_talk_qr`.

## user_talk_qr (asistencias)

Solo existe una fila cuando se ha registrado la entrada. El código QR no se guarda: el servidor lo calcula a partir de `talk_user.qr_secret` y de la ventana de 30 segundos.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `user_id`, `talk_id` | INT | NN, FK compuesta → `talk_user(user_id, talk_id)` (RESTRICT) | Reserva a la que corresponde la asistencia |
| `checked_in_at` | DATETIME | NN, defecto ahora | Momento real de entrada. *Dato analítico* |
| `validated_by` | INT | FK → `users.id`; trigger: debe tener rol `personal_acceso` | Quién validó la entrada |
| `method` | VARCHAR(10) | NN, defecto `qr`, CHECK `qr` o `manual` | `manual` = validado por personal sin QR |
| `qr_window` | INT | CHECK: obligatorio si `method = qr` | Ventana de 30 s del código aceptado |
| `rating` | INT | CHECK entre 1 y 5 | Valoración de la charla. *Dato analítico* |
| `feedback_comment` | TEXT | | Comentario. *Dato analítico* |

- **UQ `uq_user_talk_qr` (`user_id`, `talk_id`)**: una persona solo puede tener una asistencia por charla. Un segundo escaneo responde 409 y no crea otra fila.
- La FK compuesta obliga a que exista la reserva; que esté **confirmada** lo comprueba el backend.
- **Triggers** `trg_utq_validator_ins` y `trg_utq_validator_upd`: rechazan una asistencia validada por alguien sin el rol `personal_acceso`.

## email_logs

Registro de cada correo. Permite saber si la confirmación llegó a enviarse y reintentarla sin crear otra reserva.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | INT | PK | Identificador |
| `user_id` | INT | FK → `users.id` (SET NULL) | Destinatario como usuario |
| `talk_id` | INT | FK → `talks.id` (SET NULL) | Charla |
| `talk_user_id` | INT | FK → `talk_user.id` (SET NULL) | Reserva |
| `type` | VARCHAR(50) | NN, índice | `confirmacion` (más adelante: `cancelacion`, `recordatorio`) |
| `recipient` | VARCHAR(190) | NN | Dirección a la que se envió |
| `subject` | VARCHAR(255) | NN | Asunto |
| `status` | VARCHAR(20) | NN, defecto `enviado`, CHECK `pendiente`, `enviado` o `fallido` | Resultado del envío |
| `error_message` | VARCHAR(255) | | Error del servidor de correo si falló |
| `attempts` | INT | NN, defecto 1, CHECK ≥ 1 | Intentos de envío |
| `sent_at` | DATETIME | NN, defecto ahora | Fecha del último intento |

## personal_access_tokens

Tabla estándar de Laravel Sanctum. Guarda el hash de cada token de sesión de la API (`token`, UQ), a quién pertenece (`tokenable_type`, `tokenable_id`), cuándo se usó por última vez y cuándo caduca. Al cerrar sesión se borra el token.
