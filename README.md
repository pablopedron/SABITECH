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
