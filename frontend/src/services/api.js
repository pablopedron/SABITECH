import { API_BASE_URL } from "../config";
import { Charla } from "../data/charlas";

// Todas las peticiones al backend pasan por este fichero.

const CLAVE_TOKEN = "sabitech_token";

// Respaldo SOLO por si el navegador no deja usar localStorage.
let tokenEnMemoria = null;

// Función que App registra para enterarse de que la sesión ha caducado (401).
let alCaducarSesion = null;

export function registrarManejadorSesionCaducada(manejador) {
    alCaducarSesion = manejador;
}

// Error de la API: guarda el código HTTP (estado) y los errores de validación (422).
export class ErrorApi extends Error {
    constructor(estado, mensaje, errores = {}) {
        super(mensaje);
        this.estado = estado;
        this.errores = errores;
    }
}

export function guardarToken(token) {
    try {
        localStorage.setItem(CLAVE_TOKEN, token);
    } catch {
        // sin localStorage: se usa solo la memoria
        tokenEnMemoria = token;
    }
}

export function obtenerToken() {
    try {
        return localStorage.getItem(CLAVE_TOKEN);
    } catch {
        return tokenEnMemoria;
    }
}

export function borrarToken() {
    tokenEnMemoria = null;
    try {
        localStorage.removeItem(CLAVE_TOKEN);
    } catch {
        // nada que borrar
    }
}

// Hace la petición y devuelve el JSON. Si algo falla lanza un ErrorApi.
// conToken = true para las rutas que necesitan haber iniciado sesión.
async function peticion(ruta, { metodo = "GET", cuerpo, conToken = false, avisarSiCaduca = true } = {}) {

    const cabeceras = { Accept: "application/json" };

    if (cuerpo !== undefined) {
        cabeceras["Content-Type"] = "application/json";
    }

    if (conToken) {
        const token = obtenerToken();
        if (token) {
            cabeceras.Authorization = `Bearer ${token}`;
        }
    }

    let respuesta;

    try {
        respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
            method: metodo,
            headers: cabeceras,
            body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
        });
    } catch {
        throw new ErrorApi(
            0,
            "No se puede conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo."
        );
    }

    let datos = null;

    try {
        datos = await respuesta.json();
    } catch {
        // la respuesta no tiene cuerpo JSON
    }

    if (!respuesta.ok) {

        // 401 con token: la sesión ha caducado o el token ya no vale.
        if (respuesta.status === 401 && conToken) {
            borrarToken();
            if (avisarSiCaduca && alCaducarSesion) {
                alCaducarSesion();
            }
        }

        throw new ErrorApi(
            respuesta.status,
            datos?.message ?? "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
            datos?.errors ?? {}
        );
    }

    return datos;
}

// --- Conversión de lo que devuelve la API a la forma que usa el frontend ---

export function convertirUsuario(usuarioApi) {
    const roles = usuarioApi.roles ?? [];

    return {
        id: usuarioApi.id,
        nombre: usuarioApi.name,
        correo: usuarioApi.email,
        codigoPostal: usuarioApi.zip_code ?? "",
        roles: roles,
        // "admin" es lo que entiende el frontend para el panel de organización
        rol: roles.includes("organizacion") ? "admin" : "usuario"
    };
}

function convertirReserva(reservaApi) {
    return {
        id: reservaApi.id,
        referencia: reservaApi.reference,
        estado: reservaApi.status,            // confirmada | cancelada
        charla: Charla.fromJSON(reservaApi.talk)
    };
}

// --- Autenticación ---

export async function iniciarSesionApi(correo, password) {
    const datos = await peticion("/login", {
        metodo: "POST",
        cuerpo: { email: correo, password: password }
    });

    return { usuario: convertirUsuario(datos.user), token: datos.token };
}

export async function registrarApi({ nombre, correo, password, codigoPostal }) {
    const datos = await peticion("/register", {
        metodo: "POST",
        cuerpo: {
            name: nombre,
            email: correo,
            password: password,
            zip_code: codigoPostal
        }
    });

    return { usuario: convertirUsuario(datos.user), token: datos.token };
}

export async function obtenerPerfil() {
    const datos = await peticion("/me", { conToken: true });
    return convertirUsuario(datos);
}

export async function cerrarSesionApi() {
    // Al cerrar sesión no hace falta avisar de que la sesión había caducado.
    await peticion("/logout", { metodo: "POST", conToken: true, avisarSiCaduca: false });
}

// --- Charlas (públicas) ---

export async function obtenerCharlas() {
    const datos = await peticion("/talks");
    return datos.data.map((charla) => Charla.fromJSON(charla));
}

// --- Reservas (necesitan sesión) ---

export async function reservarCharla(charlaId) {
    const datos = await peticion(`/talks/${charlaId}/inscribe`, {
        metodo: "POST",
        conToken: true
    });

    return convertirReserva(datos.data);
}

export async function obtenerMisReservas() {
    const datos = await peticion("/me/reservations", { conToken: true });
    return datos.data.map(convertirReserva);
}

export async function cancelarReservaApi(reservaId, motivo) {
    const datos = await peticion(`/reservations/${reservaId}/cancel`, {
        metodo: "POST",
        cuerpo: motivo ? { reason: motivo } : {},
        conToken: true
    });

    return convertirReserva(datos.data);
}
