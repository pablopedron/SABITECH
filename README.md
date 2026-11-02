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


# SABITECH

SABITECH WEB · Gestión de jornadas tecnológicas (2.º DAW, XTART).

## Cómo arrancar el proyecto

### 1. Backend y base de datos (Docker)

1. Crea tu archivo de variables: copia `.env.example` y llámalo `.env` (cambia las contraseñas).
2. Ejecuta: `docker compose up --build`
3. Abre:
   - Backend: http://localhost:8080
   - phpMyAdmin: http://localhost:8081 (usuario y contraseña de tu `.env`)
4. Para parar: `docker compose down`

### 2. Frontend React (en tu ordenador, necesita Node.js)

```
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173
