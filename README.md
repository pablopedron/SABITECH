# 🚀 SABITECH WEB | PGD Technologies S.L.

> Plataforma tecnológica avanzada para la gestión integral de eventos, control de aforos y optimización de flujos de asistencia, desarrollada bajo un enfoque estricto *Data-Driven* y rigurosos estándares de arquitectura de software, ciberseguridad y gestión empresarial.

---

## 🏢 Sobre la Empresa: PGD Technologies S.L.

**PGD Technologies S.L.** es una microempresa de base tecnológica constituida legalmente bajo la forma de **Sociedad Limitada**, con sede estratégica en **Paterna (Valencia)**. El accionariado y la dirección se estructuran de forma equitativa entre tres socios fundadores (33,3% cada uno):
* **G:** Project Manager, Arquitecto de Sistemas y Diseñador de Bases de Datos.
* **P:** Lead Backend Developer (Lógica de servidor, API REST y Seguridad).
* **D:** Lead Frontend Developer & UI/UX (Interfaces, maquetación y Accesibilidad Web).

### ⚖️ Marco Legal, Laboral y Financiero
* **Régimen de Cotización:** Encuadramiento de los socios bajo el régimen especial de **autónomos societarios (RETA)**, diferenciando formalmente las responsabilidades de administración, gerencia y desarrollo técnico.
* **Estructura Financiera:** Capital social inicial de 3.000 € complementado mediante mecanismos de financiación interna (préstamos de socios) para optimizar la tesorería de puesta en marcha.
* **Apoyo Institucional:** Empresa alineada con los planes de dinamización local, contemplando el acceso a iniciativas como el *Cheque Emprendedor/a del Ayuntamiento de Paterna*.

---

## 🎯 ¿En qué consiste SABITECH WEB?

**SABITECH WEB** es nuestro producto de referencia, concebido como solución digital integral para resolver los retos operativos en la organización de congresos, ponencias y eventos corporativos:
* **Catálogo y Transparencia:** Consulta centralizada de ponencias, categorización avanzada y horarios.
* **Inscripción y Control de Aforo:** Sistema de registro unificado con restricciones estrictas de plazas para prevenir aglomeraciones y desbordamientos de sala.
* **Control de Accesos Inteligente:** Validación de asistencia física mediante códigos QR dinámicos temporales sincronizados con el servidor.
* **Enfoque *Data-Driven* Avanzado:** Incorporación de campos analíticos de alto valor en la base de datos para medir la satisfacción de los asistentes (`rating`), motivos de cancelación (`cancellation_reason`), control de marcas de tiempo de entrada (`checked_in_at`) y necesidades de accesibilidad (`accessibility_needs`).

---

## 🛠️ Stack Tecnológico y Arquitectura

El desarrollo técnico se apoya en tecnologías modernas y robustas de la industria:

* **Backend:** PHP (Framework Laravel), estructurado bajo el patrón MVC, con APIs RESTful seguras y control estricto de sesiones.
* **Frontend:** Interfaces interactivas de alto rendimiento con maquetación *Responsive* (Mobile-First) y cumplimiento estricto de accesibilidad universal (WCAG).
* **Base de Datos:** MySQL / MariaDB con un modelo relacional normalizado de 11 tablas optimizado para la explotación analítica.
* **Contenedores y Entorno:** Orquestación local mediante **Docker Compose**, desacoplando totalmente las credenciales del código fuente.
* **DevOps y Control de Versiones:** Metodología estricta de *GitHub Flow* con ramas temporales (`feature/...`), revisiones mediante *Pull Requests* y un sistema de seguridad blindado en el `.gitignore`.

---

## 🔒 Seguridad y Buenas Prácticas (*Security by Design*)

Siguiendo las directrices de ciberseguridad del ciclo formativo y los estándares corporativos:
* **Credenciales Ocultas:** El repositorio cuenta con un archivo `.gitignore` avanzado que bloquea de forma recursiva variantes de ficheros de entorno (`.env.*`), claves privadas (`*.key`, `*.pem`) y credenciales.
* **Plantilla de Configuración:** Se incluye el fichero `.env.example` en la raíz para facilitar un despliegue local seguro en las máquinas de los desarrolladores (**P** y **D**).

---

## 👥 Equipo de Desarrollo y Colaboradores

* **G** — Project Manager & Lead Architect
* **P** — Backend Developer
* **D** — Frontend & UI/UX Developer

---

## 📄 Licencia y Propiedad Intelectual

Desarrollado en el marco del proyecto intermodular del ciclo superior de Desarrollo de Aplicaciones Web (DAW) por **PGD Technologies S.L.** Todos los derechos reservados © 2026.

---

## 🚀 Cómo arrancar el proyecto

Servicios de Docker: **web** (Laravel sobre PHP 8.4 + Apache), **db** (MySQL 8.4), **phpMyAdmin** y **Mailpit** (buzón de laboratorio para los correos).

### 1. Variables de Docker
Copia `.env.example` como `.env` (en la raíz) y cambia las contraseñas. `MYSQL_DATABASE` debe ser `sabitech_web`.

### 2. Backend Laravel (carpeta `app/`)
Solo la primera vez, desde la raíz del proyecto (PowerShell):

```
Copy-Item app/.env.example app/.env
```
Edita `app/.env` y deja estos valores (base de datos, usuario y contraseña deben ser los de tu `.env` de la raíz):

```
APP_NAME="SabiTech app"
APP_URL=http://localhost:8080
APP_LOCALE=es
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sabitech_web
DB_USERNAME=sabitechUser
DB_PASSWORD="tu_password"
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```
Después instala las dependencias, genera la clave y da permisos:

```
docker compose run --rm --no-deps -e COMPOSER_PROCESS_TIMEOUT=0 web composer install --no-scripts
docker compose run --rm --no-deps web php artisan key:generate
docker compose run --rm --no-deps -u root web mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
docker compose run --rm --no-deps -u root web touch storage/logs/laravel.log
docker compose run --rm --no-deps -u root web chown -R www-data:www-data storage bootstrap/cache
docker compose run --rm --no-deps -u root web chmod -R ug+rwX storage bootstrap/cache
```

### 3. Arrancar los contenedores
```
docker compose up -d
docker compose ps
```
- Laravel: http://localhost:8080
- Mailpit (correos de prueba): http://localhost:8025
- phpMyAdmin: http://localhost:8081 (usuario y contraseña de tu `.env`)
- MySQL Workbench: host `127.0.0.1`, puerto `3307` (o el `MYSQL_HOST_PORT` de tu `.env`), usuario y contraseña de tu `.env`, esquema `sabitech_web`
- Parar: `docker compose down`
- Versión de Laravel: `docker compose exec web php artisan --version`

### 4. Crear las tablas y cargar los datos de prueba
La base de datos se crea con las **migraciones** de Laravel (`app/database/migrations`) y los datos ficticios con el **seeder** (`app/database/seeders`):

```
docker compose exec web php artisan migrate:fresh --seed
```
- `migrate:fresh` **borra todas las tablas** y las vuelve a crear; úsalo cuando quieras empezar de cero.
- Contraseña de todos los usuarios de prueba: `Sabitech2026!` (por ejemplo `organizacion@sabitech.test`, `acceso@sabitech.test`, `ana@sabitech.test`).
- `documents/sabitechDDBB.sql` es solo la **constancia del modelo en SQL puro** (para la memoria); ni Docker ni Laravel lo ejecutan.
- Si ya tenías el proyecto creado con la base `sabitechDB`, cambia `MYSQL_DATABASE` a `sabitech_web` en tu `.env` y ejecuta `docker compose down -v` (borra el volumen de MySQL) antes de volver a levantar.

### 5. Frontend React (en tu ordenador, necesita Node.js)
```
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

### Notas
- Si `docker compose up -d` dice *"ports are not available ... 3307"*, Windows tiene ese puerto reservado: añade `MYSQL_HOST_PORT=3310` a tu `.env` y vuelve a ejecutar `docker compose up -d`.
- `.env`, `app/.env` y `app/vendor/` no se suben a GitHub (están en `.gitignore`).
- Si `composer install` da un error de *timeout*, `COMPOSER_PROCESS_TIMEOUT=0` ya lo evita; puede tardar varios minutos.
