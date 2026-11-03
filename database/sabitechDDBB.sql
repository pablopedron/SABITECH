-- =====================================================================
-- SABITECH WEB - Script de base de datos (MySQL 8 / InnoDB / utf8mb4)
-- Proyecto intermodular 2.º DAW
-- Regla: solo se usa el tipo INT para los campos numéricos enteros.
-- =====================================================================

DROP DATABASE IF EXISTS sabitech_web;

CREATE DATABASE sabitech_web
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sabitech_web;

-- ---------------------------------------------------------------------
-- 1. USERS
--    zip_code y accessibility_needs: campos para analítica / Big Data
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                    INT NOT NULL AUTO_INCREMENT,
    name                  VARCHAR(150) NOT NULL,
    email                 VARCHAR(190) NOT NULL,
    password              VARCHAR(255) NOT NULL,          -- hash (bcrypt/argon2)
    is_active             INT NOT NULL DEFAULT 1,         -- 1 = activo, 0 = inactivo
    zip_code              VARCHAR(10)  NULL,              -- BIG DATA: procedencia geográfica
    accessibility_needs   VARCHAR(255) NULL,              -- BIG DATA: necesidades de accesibilidad
    created_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_zip_code (zip_code),
    CONSTRAINT chk_users_is_active CHECK (is_active IN (0, 1))
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
-- ---------------------------------------------------------------------
CREATE TABLE talks (
    id              INT NOT NULL AUTO_INCREMENT,
    location_id     INT NOT NULL,
    created_by      INT NOT NULL,                         -- usuario de organización que la crea
    category_id     INT NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NULL,
    speaker_name    VARCHAR(150) NOT NULL,
    speaker_company VARCHAR(150) NULL,
    speaker_bio     TEXT NULL,
    starts_at       DATETIME NOT NULL,
    ends_at         DATETIME NOT NULL,
    capacity        INT NOT NULL,
    seats_taken     INT NOT NULL DEFAULT 0,               -- plazas ocupadas (aforo)
    is_published    INT NOT NULL DEFAULT 0,               -- 1 = publicada, 0 = borrador
    created_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    CONSTRAINT chk_talks_is_published CHECK (is_published IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. TALK_USER (inscripciones; sustituye a la tabla de reservas)
-- ---------------------------------------------------------------------
CREATE TABLE talk_user (
    id                   INT NOT NULL AUTO_INCREMENT,
    user_id              INT NOT NULL,
    talk_id              INT NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'confirmada',   -- confirmada | cancelada
    cancellation_reason  VARCHAR(255) NULL,                           -- BIG DATA: motivo de cancelación
    registered_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_talk_user (user_id, talk_id),           -- un usuario, una inscripción por charla
    KEY idx_talk_user_talk (talk_id),
    KEY idx_talk_user_status (status),
    CONSTRAINT fk_talk_user_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_talk_user_talk FOREIGN KEY (talk_id) REFERENCES talks (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_talk_user_status CHECK (status IN ('confirmada', 'cancelada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. USER_TALK_QR (control de asistencia, QR y valoración)
-- ---------------------------------------------------------------------
CREATE TABLE user_talk_qr (
    id               INT NOT NULL AUTO_INCREMENT,
    user_id          INT NOT NULL,
    talk_id          INT NOT NULL,
    token_hash       VARCHAR(255) NOT NULL,               -- hash del token QR (nunca el token en claro)
    checked_in_at    DATETIME NULL,                       -- BIG DATA: momento real de entrada
    validated_by     INT NULL,                            -- personal_acceso que validó el QR
    rating           INT NULL,                            -- puntuación de 1 a 5
    feedback_comment TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_talk_qr (user_id, talk_id),        -- asistencia única por persona y charla
    KEY idx_user_talk_qr_talk (talk_id),
    KEY idx_user_talk_qr_validated_by (validated_by),
    KEY idx_user_talk_qr_token (token_hash),
    CONSTRAINT fk_utq_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_utq_talk FOREIGN KEY (talk_id) REFERENCES talks (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_utq_validated_by FOREIGN KEY (validated_by) REFERENCES users (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_utq_rating CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. EMAIL_LOGS (control de correos enviados)
-- ---------------------------------------------------------------------
CREATE TABLE email_logs (
    id            INT NOT NULL AUTO_INCREMENT,
    user_id       INT NULL,
    talk_id       INT NULL,
    type          VARCHAR(50)  NOT NULL,                  -- confirmacion, cancelacion, recordatorio...
    recipient     VARCHAR(190) NOT NULL,
    subject       VARCHAR(255) NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'enviado', -- enviado | fallido
    error_message VARCHAR(255) NULL,
    sent_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_email_logs_user (user_id),
    KEY idx_email_logs_talk (talk_id),
    KEY idx_email_logs_type (type),
    CONSTRAINT fk_email_logs_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_email_logs_talk FOREIGN KEY (talk_id) REFERENCES talks (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_email_logs_status CHECK (status IN ('enviado', 'fallido'))
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