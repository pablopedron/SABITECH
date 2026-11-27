# Pruebas del entorno (Despliegue)

Comprobación de que el proyecto arranca desde cero con Docker Compose en el ordenador de un integrante (Windows 11, Docker Desktop).

- **Fecha:** 19/11/2026
- **Quién:** Pablo
- **Versión:** rama `MainPruebasV4` (después de la PR #111)

| # | Qué hicimos | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|
| 1 | `docker compose up -d` y `php artisan migrate:fresh --seed` | Arrancan los 5 servicios y se crean las tablas con los datos de prueba | ✔ Los 5 contenedores arrancan (db en estado *Healthy*) y las 10 migraciones terminan en DONE | [01_docker_compose_up.png](01_docker_compose_up.png) |
| 2 | `docker compose logs -f frontend` | El contenedor del frontend instala las dependencias y arranca Vite | ✔ `npm install` correcto y `VITE v8.3.5 ready` en el puerto 5173 | [02_frontend_vite.png](02_frontend_vite.png) |
| 3 | Abrir http://localhost:8080/api/health | La API responde y está conectada a la base de datos | ✔ `{"estado":"ok","base_de_datos":"sabitechDB"}` | [03_api_health.png](03_api_health.png) |
| 4 | Abrir http://localhost:5173 | Se ve la web | ✔ Se ve la página de inicio | [04_frontend_inicio.png](04_frontend_inicio.png) |
| 5 | Abrir http://localhost:8025 | Mailpit funciona y está vacío antes de reservar | ✔ Bandeja vacía | [05_mailpit.png](05_mailpit.png) |

Es la primera prueba del frontend dentro de Docker (PR #108) en un ordenador del equipo.
