// Dirección de la API del backend (Laravel en Docker).
// Por defecto apunta a http://localhost:8080/api. Para cambiarla sin tocar código,
// crea frontend/.env con VITE_API_URL=... (ver .env.example) y reinicia "npm run dev".
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
