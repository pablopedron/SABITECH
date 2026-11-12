# SABITECH WEB · Frontend

Frontend en **React 19 + Vite**. Consume la API de Laravel del backend.

## Arrancar

Necesita Node.js y que el backend esté levantado con Docker (ver el README principal).

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Por defecto llama a la API en `http://localhost:8080/api`. Para cambiarla, copia `.env.example` como `.env` y edita `VITE_API_URL`.

Otros comandos:

```bash
npm run build      # versión para publicar, en dist/
npm run lint       # revisión del código con oxlint
```

## Organización

| Carpeta / fichero | Qué contiene |
|---|---|
| `src/App.jsx` | Estado de la aplicación (pantalla actual, usuario, charlas, reservas) y navegación |
| `src/services/api.js` | Todas las peticiones a la API, el token de sesión y los errores |
| `src/data/charlas.js` | Clase `Charla`: convierte el JSON de la API al formato del frontend |
| `src/utils/charlas.js` | Formato de fechas y estado de plazas |
| `src/components/` | Cabecera, pie, avisos, tarjeta y lista de charlas |
| `src/pages/` | Una por pantalla: Inicio, Charlas, Detalle, Reserva, Login, Registro, Cuenta y Admin |
| `src/index.css` | Todos los estilos |
| `src/assets/logos/`, `public/` | Logos, favicon e icono de móvil |

## Estilos

Antes de tocar el diseño, consulta la **guía de estilos**: `documents/Diseno_Interfaces/guia-estilos.md`. Las comprobaciones de responsive y accesibilidad están en `documents/Diseno_Interfaces/RESPONSIVE.md`.
