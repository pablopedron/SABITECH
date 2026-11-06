-- =====================================================================
-- SABITECH WEB - Script de base de datos (MySQL 8 / InnoDB / utf8mb4)
-- >>> REFERENCIA DEL MODELO. Docker ya NO carga este fichero. <<<
-- La base de datos se crea con las migraciones de Laravel:
--     php artisan migrate:fresh --seed
-- (app/database/migrations y app/database/seeders). Este script es el
-- equivalente en SQL puro, útil para la memoria y para mirar el modelo.
-- Si cambias una migración, actualiza también este fichero.
--
-- Proyecto intermodular 2.º DAW
-- Regla: solo se usa el tipo INT para los campos numéricos enteros.
--
-- Script ÚNICO: crea la base de datos con el esquema ya actualizado (v2)
-- e inserta al final datos ficticios para pruebas y demostración.
-- Contraseña de TODOS los usuarios de prueba: Sabitech2026!
-- =====================================================================

DROP DATABASE IF EXISTS sabitech_web;

CREATE DATABASE sabitech_web
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sabitech_web;

-- ---------------------------------------------------------------------
-- 1. USERS
--    zip_code y accessibility_needs: campos para analítica / Big Data
--    accessibility_needs es un dato sensible (RGPD): solo se guarda si
--    el usuario ha dado su consentimiento (accessibility_consent_at)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                       INT NOT NULL AUTO_INCREMENT,
    name                     VARCHAR(150) NOT NULL,
    email                    VARCHAR(190) NOT NULL,
    password                 VARCHAR(255) NOT NULL,       -- hash (bcrypt/argon2)
    is_active                INT NOT NULL DEFAULT 1,      -- 1 = activo, 0 = inactivo
    zip_code                 VARCHAR(10)  NULL,           -- BIG DATA: procedencia geográfica
    accessibility_needs      VARCHAR(255) NULL,           -- BIG DATA: necesidades de accesibilidad
    accessibility_consent_at DATETIME NULL
        COMMENT 'Fecha en que el usuario consintió guardar accessibility_needs',
    created_at               TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_zip_code (zip_code),
    CONSTRAINT chk_users_is_active CHECK (is_active IN (0, 1)),
    CONSTRAINT chk_users_accessibility_consent
        CHECK (accessibility_needs IS NULL OR accessibility_consent_at IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. ROLES y ROLE_USER (relación N:M)
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id          INT NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)  NOT NULL,                    -- asistente, organizacion, personal_acceso
    description VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_user (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),                       -- evita duplicados en la N:M
    KEY idx_role_user_role (role_id),
    CONSTRAINT fk_role_user_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_role_user_role FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles por defecto
INSERT INTO roles (name, description) VALUES
    ('asistente',       'Usuario que se inscribe y asiste a las charlas'),
    ('organizacion',    'Gestiona charlas, ubicaciones y consulta estadísticas'),
    ('personal_acceso', 'Valida el acceso de los asistentes mediante QR');

-- ---------------------------------------------------------------------
-- 3. LOCATIONS
-- ---------------------------------------------------------------------
CREATE TABLE locations (
    id            INT NOT NULL AUTO_INCREMENT,
    name          VARCHAR(150) NOT NULL,
    address       VARCHAR(255) NOT NULL,
    room_capacity INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT chk_locations_room_capacity CHECK (room_capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. CATEGORIES (necesaria para la FK talks.category_id)
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id   INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TALKS
--    Los datos del ponente se integran directamente (sin tabla speakers)
--    Si hay foto del ponente, el texto alternativo es obligatorio (accesibilidad)
--    Que capacity no supere room_capacity lo controlan los triggers del final
-- ---------------------------------------------------------------------
CREATE TABLE talks (
    id                INT NOT NULL AUTO_INCREMENT,
    location_id       INT NOT NULL,
    created_by        INT NOT NULL,                       -- usuario de organización que la crea
    category_id       INT NOT NULL,
    title             VARCHAR(200) NOT NULL,
    description       TEXT NULL,
    speaker_name      VARCHAR(150) NOT NULL,
    speaker_company   VARCHAR(150) NULL,
    speaker_bio       TEXT NULL,
    speaker_photo     VARCHAR(255) NULL,
    speaker_photo_alt VARCHAR(255) NULL,
    starts_at         DATETIME NOT NULL,
    ends_at           DATETIME NOT NULL,
    capacity          INT NOT NULL,
    seats_taken       INT NOT NULL DEFAULT 0,             -- plazas ocupadas (aforo)
    is_published      INT NOT NULL DEFAULT 0,             -- 1 = publicada, 0 = borrador
    created_at        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_talks_location (location_id),
    KEY idx_talks_created_by (created_by),
    KEY idx_talks_category (category_id),
    KEY idx_talks_starts_at (starts_at),
    CONSTRAINT fk_talks_location FOREIGN KEY (location_id) REFERENCES locations (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_talks_created_by FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_talks_category FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_talks_dates        CHECK (ends_at > starts_at),
    CONSTRAINT chk_talks_capacity     CHECK (capacity > 0),
    CONSTRAINT chk_talks_seats_taken  CHECK (seats_taken >= 0 AND seats_taken <= capacity),
    CONSTRAINT chk_talks_is_published CHECK (is_published IN (0, 1)),
    CONSTRAINT chk_talks_photo_alt    CHECK (speaker_photo IS NULL OR speaker_photo_alt IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. TALK_USER (inscripciones; sustituye a la tabla de reservas)
--    Las FK son RESTRICT para no perder el histórico (baja lógica con is_active)
-- ---------------------------------------------------------------------
CREATE TABLE talk_user (
    id                   INT NOT NULL AUTO_INCREMENT,
    reference            VARCHAR(20) NOT NULL
        COMMENT 'Referencia legible de la reserva (aparece en el correo)',
    user_id              INT NOT NULL,
    talk_id              INT NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'confirmada',   -- confirmada | cancelada
    qr_secret            CHAR(64) NOT NULL
        COMMENT 'Secreto por reserva (hex). El token QR = HMAC(secret, ventana de 30 s). Nunca se expone',
    cancellation_reason  VARCHAR(255) NULL,                           -- BIG DATA: motivo de cancelación
    cancelled_at         DATETIME NULL,
    registered_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_talk_user (user_id, talk_id),           -- un usuario, una inscripción por charla
    UNIQUE KEY uq_talk_user_reference (reference),
    KEY idx_talk_user_talk_status (talk_id, status),
    KEY idx_talk_user_status (status),
    CONSTRAINT fk_talk_user_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_talk_user_talk FOREIGN KEY (talk_id) REFERENCES talks (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_talk_user_status CHECK (status IN ('confirmada', 'cancelada')),
    CONSTRAINT chk_talk_user_cancel CHECK (cancelled_at IS NULL OR status = 'cancelada')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. USER_TALK_QR (registro de asistencia y valoración)
--    Solo existe fila cuando hay check-in. El QR rotativo NO se guarda:
--    el servidor lo calcula a partir de talk_user.qr_secret.
--    La asistencia exige una reserva (user_id, talk_id) en talk_user; que
--    esté 'confirmada' lo comprueba el servidor.
-- ---------------------------------------------------------------------
CREATE TABLE user_talk_qr (
    id               INT NOT NULL AUTO_INCREMENT,
    user_id          INT NOT NULL,
    talk_id          INT NOT NULL,
    checked_in_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- BIG DATA: momento real de entrada
    validated_by     INT NULL,                            -- personal_acceso que validó el QR
    method           VARCHAR(10) NOT NULL DEFAULT 'qr'
        COMMENT 'qr = escaneado; manual = validado por personal sin QR',
    qr_window        INT NULL
        COMMENT 'Ventana de 30 s (epoch/30) del token aceptado; NULL si manual',
    rating           INT NULL,                            -- puntuación de 1 a 5
    feedback_comment TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_talk_qr (user_id, talk_id),        -- asistencia única por persona y charla
    KEY idx_user_talk_qr_talk (talk_id),
    KEY idx_user_talk_qr_validated_by (validated_by),
    CONSTRAINT fk_utq_reservation FOREIGN KEY (user_id, talk_id)
        REFERENCES talk_user (user_id, talk_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_utq_validated_by FOREIGN KEY (validated_by) REFERENCES users (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_utq_rating CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    CONSTRAINT chk_utq_method CHECK (method IN ('qr', 'manual')),
    CONSTRAINT chk_utq_window CHECK (method = 'manual' OR qr_window IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. EMAIL_LOGS (control de correos enviados)
--    Enlaza con la reserva; 'pendiente' + attempts permiten reintentar
-- ---------------------------------------------------------------------
CREATE TABLE email_logs (
    id            INT NOT NULL AUTO_INCREMENT,
    user_id       INT NULL,
    talk_id       INT NULL,
    talk_user_id  INT NULL,
    type          VARCHAR(50)  NOT NULL,                  -- confirmacion, cancelacion, recordatorio...
    recipient     VARCHAR(190) NOT NULL,
    subject       VARCHAR(255) NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'enviado', -- pendiente | enviado | fallido
    error_message VARCHAR(255) NULL,
    attempts      INT NOT NULL DEFAULT 1,
    sent_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_email_logs_user (user_id),
    KEY idx_email_logs_talk (talk_id),
    KEY idx_email_logs_talk_user (talk_user_id),
    KEY idx_email_logs_type (type),
    KEY idx_email_logs_status (status),
    CONSTRAINT fk_email_logs_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_email_logs_talk FOREIGN KEY (talk_id) REFERENCES talks (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_email_logs_talk_user FOREIGN KEY (talk_user_id) REFERENCES talk_user (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_email_logs_status   CHECK (status IN ('pendiente', 'enviado', 'fallido')),
    CONSTRAINT chk_email_logs_attempts CHECK (attempts >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. MIGRATIONS (control de migraciones del framework)
-- ---------------------------------------------------------------------
CREATE TABLE migrations (
    id        INT NOT NULL AUTO_INCREMENT,
    migration VARCHAR(255) NOT NULL,
    batch     INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9b. PERSONAL_ACCESS_TOKENS (tokens de sesión de la API; los usa Laravel Sanctum)
--     Mismo esquema que la migración de Sanctum, con INT como en el resto de tablas
-- ---------------------------------------------------------------------
CREATE TABLE personal_access_tokens (
    id             INT NOT NULL AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id   INT NOT NULL,
    name           TEXT NOT NULL,
    token          VARCHAR(64) NOT NULL,
    abilities      TEXT NULL,
    last_used_at   TIMESTAMP NULL,
    expires_at     TIMESTAMP NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY personal_access_tokens_token_unique (token),
    KEY personal_access_tokens_tokenable (tokenable_type, tokenable_id),
    KEY personal_access_tokens_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. TRIGGERS: reglas que un CHECK no puede expresar (miran otras tablas)
--     - talks.capacity no puede superar locations.room_capacity
--     - user_talk_qr.validated_by debe tener el rol personal_acceso
-- ---------------------------------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_talks_capacity_ins BEFORE INSERT ON talks
FOR EACH ROW
BEGIN
    IF NEW.capacity > (SELECT room_capacity FROM locations WHERE id = NEW.location_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El aforo de la charla supera la capacidad de la sala';
    END IF;
END$$

CREATE TRIGGER trg_talks_capacity_upd BEFORE UPDATE ON talks
FOR EACH ROW
BEGIN
    IF NEW.capacity > (SELECT room_capacity FROM locations WHERE id = NEW.location_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El aforo de la charla supera la capacidad de la sala';
    END IF;
END$$

CREATE TRIGGER trg_utq_validator_ins BEFORE INSERT ON user_talk_qr
FOR EACH ROW
BEGIN
    IF NEW.validated_by IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM role_user ru JOIN roles r ON r.id = ru.role_id
        WHERE ru.user_id = NEW.validated_by AND r.name = 'personal_acceso') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'validated_by debe tener el rol personal_acceso';
    END IF;
END$$

CREATE TRIGGER trg_utq_validator_upd BEFORE UPDATE ON user_talk_qr
FOR EACH ROW
BEGIN
    IF NEW.validated_by IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM role_user ru JOIN roles r ON r.id = ru.role_id
        WHERE ru.user_id = NEW.validated_by AND r.name = 'personal_acceso') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'validated_by debe tener el rol personal_acceso';
    END IF;
END$$

DELIMITER ;

-- =====================================================================
-- DATOS FICTICIOS para pruebas y demostración
-- Todos los datos son inventados. Contraseña de TODOS los usuarios: Sabitech2026!
-- (hash bcrypt compatible con Laravel; solo para el entorno de demostración).
--
-- Escenarios que cubre:
--   Charla 1: PASADA, con asistencias (2 por QR, 1 manual), valoraciones y 1 cancelación
--   Charla 2: con plazas libres (2 de 30), una reserva cancelada que puede volver a reservar
--   Charla 3: COMPLETA (4/4)  -> probar "reserva sin plazas"
--   Charla 4: BORRADOR (no publicada, no visible al público)
--   Charla 5: publicada, sin reservas
--   Correos: enviado, fallido (2 intentos) y pendiente -> probar reintento
-- =====================================================================

-- Usuarios: 1 organización, 2 personal de acceso, 3-7 asistentes, 8 asistente inactivo
INSERT INTO users (id, name, email, password, is_active, zip_code, accessibility_needs, accessibility_consent_at) VALUES
 (1, 'Lucía Organizadora', 'organizacion@sabitech.test', '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28001', NULL, NULL),
 (2, 'Mario Acceso',       'acceso@sabitech.test',       '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28002', NULL, NULL),
 (3, 'Ana Asistente',      'ana@sabitech.test',          '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28010', NULL, NULL),
 (4, 'Bruno Asistente',    'bruno@sabitech.test',        '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28020', NULL, NULL),
 (5, 'Carla Asistente',    'carla@sabitech.test',        '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28030', 'Movilidad reducida (ficticio)', '2026-10-01 09:00:00'),
 (6, 'Diego Asistente',    'diego@sabitech.test',        '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '45001', NULL, NULL),
 (7, 'Elena Asistente',    'elena@sabitech.test',        '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 1, '28040', NULL, NULL),
 (8, 'Fabio Inactivo',     'fabio@sabitech.test',        '$2y$10$bbqKNsieFmKFkHDiBDVofew4ndvmeoApoUxSuRoHe0bIXfZDt4C86', 0, '28050', NULL, NULL);

INSERT INTO role_user (user_id, role_id)
SELECT u.id, r.id FROM (
    SELECT 1 AS id, 'organizacion' AS rn UNION ALL SELECT 2, 'personal_acceso'
    UNION ALL SELECT 3, 'asistente' UNION ALL SELECT 4, 'asistente' UNION ALL SELECT 5, 'asistente'
    UNION ALL SELECT 6, 'asistente' UNION ALL SELECT 7, 'asistente' UNION ALL SELECT 8, 'asistente'
) u JOIN roles r ON r.name = u.rn;

INSERT INTO categories (id, name) VALUES
 (1, 'Inteligencia artificial'), (2, 'Ciberseguridad'), (3, 'Cloud y DevOps'),
 (4, 'Desarrollo web'), (5, 'Datos');

INSERT INTO locations (id, name, address, room_capacity) VALUES
 (1, 'Salón de actos', 'Calle Ficticia 1, Madrid', 100),
 (2, 'Aula 2.1',       'Calle Ficticia 1, planta 2, Madrid', 30),
 (3, 'Sala taller',    'Calle Ficticia 1, planta baja, Madrid', 4);

-- seats_taken coincide con las reservas 'confirmada' de talk_user
INSERT INTO talks (id, location_id, created_by, category_id, title, description,
                   speaker_name, speaker_company, speaker_bio, speaker_photo, speaker_photo_alt,
                   starts_at, ends_at, capacity, seats_taken, is_published) VALUES
 (1, 1, 1, 1, 'IA generativa en el desarrollo de software', 'Casos reales de uso de asistentes de código.',
     'Sara Ficticia', 'Empresa Demo SL', 'Ingeniera de software (perfil ficticio).',
     'ponentes/sara.webp', 'Retrato de Sara Ficticia sonriendo',
     '2026-10-20 10:00:00', '2026-10-20 11:00:00', 100, 3, 1),
 (2, 2, 1, 4, 'Angular o React: cómo elegir', 'Comparativa práctica para proyectos medianos.',
     'Pablo Muestra', 'Frontend Co', 'Desarrollador frontend (perfil ficticio).',
     NULL, NULL,
     '2026-12-10 10:00:00', '2026-12-10 11:00:00', 30, 2, 1),
 (3, 3, 1, 2, 'Taller de seguridad web', 'Taller práctico con aforo reducido.',
     'Irene Test', 'SecLab', 'Auditora de seguridad (perfil ficticio).',
     NULL, NULL,
     '2026-12-10 12:00:00', '2026-12-10 13:30:00', 4, 4, 1),
 (4, 2, 1, 3, 'Despliegue con contenedores (borrador)', 'Pendiente de confirmar ponente.',
     'Por confirmar', NULL, NULL, NULL, NULL,
     '2026-12-11 09:00:00', '2026-12-11 10:00:00', 30, 0, 0),
 (5, 1, 1, 5, 'Introducción al análisis de datos', 'De hoja de cálculo a dashboard.',
     'Tomás Ejemplo', 'Datos Demo', 'Analista de datos (perfil ficticio).',
     NULL, NULL,
     '2026-12-11 11:00:00', '2026-12-11 12:00:00', 80, 0, 1);

-- Reservas (reference y qr_secret ficticios y deterministas; en producción los genera el backend)
INSERT INTO talk_user (id, reference, user_id, talk_id, status, qr_secret, cancellation_reason, cancelled_at, registered_at) VALUES
 ( 1, 'SBT-DEMO0001', 3, 1, 'confirmada', SHA2('seed-1',256), NULL, NULL, '2026-10-05 09:00:00'),
 ( 2, 'SBT-DEMO0002', 4, 1, 'confirmada', SHA2('seed-2',256), NULL, NULL, '2026-10-05 09:10:00'),
 ( 3, 'SBT-DEMO0003', 5, 1, 'confirmada', SHA2('seed-3',256), NULL, NULL, '2026-10-05 09:20:00'),
 ( 4, 'SBT-DEMO0004', 6, 1, 'cancelada',  SHA2('seed-4',256), 'Coincide con otra actividad', '2026-10-18 18:00:00', '2026-10-05 09:30:00'),
 ( 5, 'SBT-DEMO0005', 3, 2, 'confirmada', SHA2('seed-5',256), NULL, NULL, '2026-11-02 10:00:00'),
 ( 6, 'SBT-DEMO0006', 4, 2, 'confirmada', SHA2('seed-6',256), NULL, NULL, '2026-11-02 10:05:00'),
 ( 7, 'SBT-DEMO0007', 5, 2, 'cancelada',  SHA2('seed-7',256), 'Problemas de agenda', '2026-11-03 08:00:00', '2026-11-02 10:10:00'),
 ( 8, 'SBT-DEMO0008', 3, 3, 'confirmada', SHA2('seed-8',256), NULL, NULL, '2026-11-02 11:00:00'),
 ( 9, 'SBT-DEMO0009', 4, 3, 'confirmada', SHA2('seed-9',256), NULL, NULL, '2026-11-02 11:05:00'),
 (10, 'SBT-DEMO0010', 5, 3, 'confirmada', SHA2('seed-10',256), NULL, NULL, '2026-11-02 11:10:00'),
 (11, 'SBT-DEMO0011', 6, 3, 'confirmada', SHA2('seed-11',256), NULL, NULL, '2026-11-02 11:15:00');

-- Asistencias de la charla 1 (validadas por el usuario 2, personal_acceso)
INSERT INTO user_talk_qr (user_id, talk_id, checked_in_at, validated_by, method, qr_window, rating, feedback_comment) VALUES
 (3, 1, '2026-10-20 09:52:10', 2, 'qr',     FLOOR(UNIX_TIMESTAMP('2026-10-20 09:52:10')/30), 5, 'Muy útil, ejemplos claros.'),
 (4, 1, '2026-10-20 09:55:40', 2, 'qr',     FLOOR(UNIX_TIMESTAMP('2026-10-20 09:55:40')/30), 4, NULL),
 (5, 1, '2026-10-20 09:58:00', 2, 'manual', NULL, NULL, NULL);

-- Correos: enviado, fallido (2 intentos) y pendiente
INSERT INTO email_logs (user_id, talk_id, talk_user_id, type, recipient, subject, status, error_message, attempts, sent_at) VALUES
 (3, 2, 5,  'confirmacion', 'ana@sabitech.test',   'Reserva confirmada SBT-DEMO0005', 'enviado',   NULL, 1, '2026-11-02 10:00:02'),
 (4, 2, 6,  'confirmacion', 'bruno@sabitech.test', 'Reserva confirmada SBT-DEMO0006', 'fallido',  'SMTP timeout', 2, '2026-11-02 10:05:30'),
 (6, 3, 11, 'confirmacion', 'diego@sabitech.test', 'Reserva confirmada SBT-DEMO0011', 'pendiente', NULL, 1, '2026-11-02 11:15:01');

-- AUTO_INCREMENT coherente tras insertar ids explícitos
ALTER TABLE talk_user AUTO_INCREMENT = 12;

-- =====================================================================
-- Comprobación de coherencia (debe devolver 0 filas):
--   SELECT t.id, t.seats_taken, COUNT(tu.id) AS confirmadas
--   FROM talks t LEFT JOIN talk_user tu ON tu.talk_id = t.id AND tu.status = 'confirmada'
--   GROUP BY t.id HAVING t.seats_taken <> confirmadas;
-- =====================================================================
