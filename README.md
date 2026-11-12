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

Guía pensada para levantar todo desde cero en Windows (PowerShell). En Linux o macOS los comandos son los mismos; solo cambia `Copy-Item` por `cp`.

### 0. Qué necesitas antes de empezar
- **Git** y **Docker Desktop** (abierto y en marcha antes de ejecutar nada).
- **Node.js** (solo para el frontend React).
- Estos puertos de tu ordenador libres: `8080`, `8081`, `8025`, `1025` y `3307`.

Servicios de Docker (`compose.yaml`):

| Servicio | Qué es | Dirección |
|---|---|---|
| `web` | Laravel sobre PHP 8.4 + Apache | http://localhost:8080 |
| `db` | MySQL 8.4 | solo por dentro de Docker (y `127.0.0.1:3307` para Workbench) |
| `phpmyadmin` | Ver la base de datos en el navegador | http://localhost:8081 |
| `mailpit` | Buzón de laboratorio: aquí llegan los correos de prueba | http://localhost:8025 |

### 1. Primera vez: preparar el proyecto
Solo hay que hacerlo **una vez en cada ordenador**. Hay ficheros que no se suben a Git (`.env`, `app/.env`, `app/vendor/`, permisos de `storage`) y cada uno debe crearlos en su máquina.

**1.1. Clonar y cambiar de rama**
```
git clone https://github.com/pablopedron/SABITECH.git
cd SABITECH
git checkout develop/backend
```

**1.2. Variables de Docker.** Copia la plantilla y cambia las contraseñas:
```
Copy-Item .env.example .env
```
El `.env` de la raíz debe quedar así (con tus contraseñas):
```
MYSQL_DATABASE=sabitech_web
MYSQL_USER=sabitechUser
MYSQL_PASSWORD=tu_password
MYSQL_ROOT_PASSWORD=tu_password_root
MYSQL_HOST_PORT=3307
```

**1.3. Variables de Laravel.** Los datos de conexión a la base de datos los pasa Docker desde el `.env` de la raíz, así que aquí solo hay que copiar la plantilla:
```
Copy-Item app/.env.example app/.env
```

**1.4. Instalar Laravel, generar la clave y dar permisos.** Puede tardar varios minutos:
```
docker compose run --rm --no-deps -e COMPOSER_PROCESS_TIMEOUT=0 web composer install --no-scripts
docker compose run --rm --no-deps web php artisan key:generate
docker compose run --rm --no-deps web php artisan package:discover
docker compose run --rm --no-deps -u root web mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
docker compose run --rm --no-deps -u root web touch storage/logs/laravel.log
docker compose run --rm --no-deps -u root web chown -R www-data:www-data storage bootstrap/cache
docker compose run --rm --no-deps -u root web chmod -R ug+rwX storage bootstrap/cache
```

**1.5. Levantar los contenedores**
```
docker compose up -d
docker compose ps
```
Deben aparecer `web`, `db` (con `healthy`), `phpmyadmin` y `mailpit` en `running`. Si `db` aún no está `healthy`, espera medio minuto y repite `docker compose ps`.

**1.6. Crear las tablas y cargar los datos de prueba**
```
docker compose exec web php artisan migrate:fresh --seed
```
Deben salir 10 migraciones con `DONE` y al final `Seeding database`.

**1.7. Comprobar que todo funciona**
- http://localhost:8080/api/health debe mostrar `{"estado":"ok","base_de_datos":"sabitech_web"}`.
- `docker compose exec web php artisan db:show --counts` lista las tablas con sus filas (por ejemplo `users` 8, `talks` 5, `talk_user` 11).
- En phpMyAdmin (http://localhost:8081, usuario y contraseña de tu `.env`) aparece la base `sabitech_web` con 11 tablas.

### 2. Datos de prueba
Todos los datos son ficticios. **Contraseña de todos los usuarios: `Sabitech2026!`**

| Usuario | Email | Rol |
|---|---|---|
| Lucía Organizadora | `organizacion@sabitech.test` | organizacion |
| Mario Acceso | `acceso@sabitech.test` | personal_acceso |
| Ana, Bruno, Carla, Diego, Elena | `ana@`, `bruno@`, `carla@`, `diego@`, `elena@` + `sabitech.test` | asistente |
| Fabio Inactivo | `fabio@sabitech.test` | asistente (cuenta desactivada) |

Casos que cubren las 5 charlas de prueba: una charla pasada con asistencias, una con plazas libres, una **completa** (para probar "reserva sin plazas"), un borrador no publicado y una publicada sin reservas. También hay correos de prueba en estado enviado, fallido y pendiente.

### 3. Día a día

| Qué quiero hacer | Comando |
|---|---|
| Encender el proyecto | `docker compose up -d` |
| Apagarlo (conserva la base de datos) | `docker compose down` |
| Ver si todo está en marcha | `docker compose ps` |
| Ver los mensajes de un servicio | `docker compose logs web --tail 40` |
| Borrar la base y cargarla de nuevo con datos | `docker compose exec web php artisan migrate:fresh --seed` |
| Ver qué migraciones están aplicadas | `docker compose exec web php artisan migrate:status` |
| Ver todas las rutas de la API | `docker compose exec web php artisan route:list` |
| Ejecutar cualquier comando de Laravel | `docker compose exec web php artisan ...` |
| Instalar una librería PHP nueva | `docker compose exec web composer require nombre/paquete` |
| Borrar TODO (contenedores y base de datos) | `docker compose down -v` |

Notas importantes:
- `migrate:fresh` **borra todas las tablas** y las vuelve a crear. Úsalo solo en desarrollo.
- Después de cambiar el `.env` de la raíz, ejecuta `docker compose up -d` para que los contenedores lo lean.
- Cuando alguien cambie una migración, hay que ejecutar `migrate:fresh --seed` para ver el cambio.

### 4. Base de datos
La base de datos se crea **solo con Laravel**: las tablas con las migraciones (`app/database/migrations`) y los datos ficticios con el seeder (`app/database/seeders/DatabaseSeeder.php`). `documents/Desarrollo_Servidor/sabitechDDBB.sql` es solo la **constancia del modelo en SQL puro** para la memoria; ni Docker ni Laravel lo ejecutan. Si cambia una migración, hay que actualizar también ese fichero.

### 5. Pruebas automáticas del backend
Los tests están en `app/tests/Feature` y usan **MySQL**, en una base de datos propia (`sabitech_test`), **nunca la de desarrollo**. Si la configuración apuntara a otra base de datos, los tests se paran antes de tocar nada.

`ReservasTest.php` comprueba lo mínimo del checkpoint: reserva válida, reserva repetida (409), charla sin plazas (409) y que la reserva sigue guardada al volver a consultarla. También las primeras pruebas de permisos: sin sesión no se puede reservar (401), nadie puede cancelar una reserva ajena (404) y cancelar libera la plaza.

**Primera vez** (la base de datos `sabitech_test` hay que crearla una vez; si acabas de crear el volumen con `docker compose down -v`, ya la crea Docker solo):
```
docker compose up -d
docker compose exec db sh /docker-entrypoint-initdb.d/01-crear-bd-test.sh
```

**Ejecutar los tests:**
```
docker compose exec web php artisan test
```
Cada prueba se ejecuta dentro de una transacción que se deshace al terminar, así que no se mezclan datos. Para ejecutar solo un fichero: `docker compose exec web php artisan test --filter=ReservasTest`.

### 6. Frontend React (en tu ordenador, necesita Node.js)
```
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

El frontend habla con la API del backend, así que **Docker debe estar levantado** (`docker compose up -d`) y la base de datos cargada (paso 1.7). Por defecto usa `http://localhost:8080/api`. Si tu API está en otra dirección, copia `frontend/.env.example` como `frontend/.env`, cambia `VITE_API_URL` y reinicia `npm run dev`.

Cuentas para probar (contraseña `Sabitech2026!`): `ana@sabitech.test` (asistente) y `organizacion@sabitech.test` (panel de organización).

### 7. Problemas frecuentes

**`ports are not available ... 3307` al hacer `docker compose up -d`**
Windows tiene ese puerto reservado. Añade `MYSQL_HOST_PORT=3310` a tu `.env` y vuelve a ejecutar `docker compose up -d`. Ese puerto solo se usa para MySQL Workbench; Laravel no lo necesita.

**`Fatal error: Uncaught ReflectionException: Class "view" does not exist` en http://localhost:8080**
Es el síntoma de que Laravel no ha podido arrancar y el error real queda escondido. Sigue este orden:
1. Mira si `web` está en marcha: `docker compose ps -a`. Si `web` no está `running`, lo que ves en el puerto 8080 **no es SABITECH**, sino otro programa (por ejemplo un contenedor de otro proyecto). Lista los contenedores con `docker ps`, para el que use el `8080` con `docker stop NOMBRE` y ejecuta `docker compose up -d`.
2. Comprueba que existen `app/.env` y `app/vendor/autoload.php` (`Test-Path app/.env`, `Test-Path app/vendor/autoload.php`). Si alguno da `False`, repite el paso **1.3** y el **1.4**.
3. Mira el error real: `docker compose exec web tail -n 30 storage/logs/laravel.log` y `docker compose logs web --tail 40`.
4. Limpia las cachés viejas y reinstala si hace falta:
```
Remove-Item -Recurse -Force app/vendor
Remove-Item -Force app/bootstrap/cache/*.php -ErrorAction SilentlyContinue
Remove-Item -Force app/storage/framework/views/*.php -ErrorAction SilentlyContinue
docker compose build web
```
y repite el paso **1.4** y `docker compose up -d`.

Reiniciar Docker o hacer `docker compose down -v` **no arregla** este error: lo que falla vive en la carpeta `app/`, que Docker no toca.

**Error 1419 (`You do not have the SUPER privilege...`) al hacer `migrate:fresh`**
MySQL se creó sin la opción que permite crear triggers. Ejecuta `docker compose down -v` y `docker compose up -d`, y repite el paso **1.6**.

**Antes usaba la base `sabitechDB`**
Cambia `MYSQL_DATABASE` a `sabitech_web` en tu `.env` y ejecuta `docker compose down -v` y `docker compose up -d` (borra el volumen de MySQL), y repite el paso **1.6**.

**`composer install` da error de timeout**
`COMPOSER_PROCESS_TIMEOUT=0` (ya incluido en el comando) lo evita; puede tardar varios minutos. Si el proyecto está en una carpeta sincronizada con OneDrive (por ejemplo `Desktop`), muévelo a algo como `C:\dev\SABITECH`: OneDrive bloquea ficheros mientras los sincroniza.

**`ERROR: service "web" is not running` al ejecutar `docker compose exec web ...`**
Los contenedores no están arrancados. Ejecuta `docker compose up -d` y mira `docker compose ps`.

### 8. Organización del repositorio
```
SABITECH/
├── app/            Backend Laravel (API, migraciones, seeders)
├── frontend/       Frontend React + Vite
├── documents/      Documentación, una carpeta por módulo:
│   ├── Desarrollo_Cliente/      Frontend
│   ├── Desarrollo_Servidor/     Diccionario de datos y modelo en SQL
│   ├── Despliegue/              Diagrama de arquitectura y plan de publicación
│   ├── Diseno_Interfaces/       Prototipos y responsive
│   ├── IPE/                     Empresa PGD
│   ├── Digitalizacion/
│   ├── Ingles/                  Informe de vídeos sobre IA
│   └── Proyecto_Intermodular/   Memoria, Gantt e informe de IA
├── docker/         Configuración de Apache (web) y script que crea la BD de pruebas (MySQL)
├── compose.yaml    Servicios de Docker
├── dockerfile      Imagen del contenedor web (PHP 8.4 + Apache)
├── openapi.json    Contrato de la API
└── .env.example    Plantilla de variables de Docker
```

Ramas: `main` es la versión estable; `develop/backend` y `develop/frontend` son las ramas de integración de cada parte. El trabajo se hace en ramas `feature/...` (o `fix/...`, `docs/...`) creadas a partir de la `develop` correspondiente y se integra con un *Pull Request* revisado por otra persona del equipo.

Los ficheros `.env`, `app/.env` y `app/vendor/` no se suben a GitHub (están en `.gitignore`).
