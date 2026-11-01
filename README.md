# SABITECH

SABITECH WEB · Gestión de jornadas tecnológicas (2.º DAW, XTART).

## Puesta en marcha

### 1. Contenedores Docker (backend, base de datos, phpMyAdmin)

1. Copia las variables: `copy .env.example .env` (Linux/Mac: `cp .env.example .env`) y cambia las contraseñas.
2. Arranca: `docker compose up --build`
3. Servicios:
   - Backend PHP 8.4 + Apache: http://localhost:8080
   - phpMyAdmin: http://localhost:8081 (usuario y contraseña del `.env`)
   - MySQL 8.4: accesible solo desde la red de Docker (host `db`).
4. Parar: `docker compose down` (con `-v` borra también los datos de la BD).

### 2. Frontend React (en local, requiere Node 20+)

```
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173. Las llamadas a `/api` se redirigen al backend.

Alternativa con Docker: `docker compose --profile frontend up --build`.
