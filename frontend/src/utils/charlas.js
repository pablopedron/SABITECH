// Utilidades para mostrar las charlas. Solo sirven para la pantalla:
// las reglas de verdad (aforo, si se puede reservar...) las comprueba siempre el servidor.

// Fecha de la charla como objeto Date (la API ya la da en hora de Madrid).
export function inicioCharla(charla) {
    const { fecha, horas } = charla.fechasDisponibles[0];
    return new Date(`${fecha}T${horas[0]}:00`);
}

// La charla ya ha empezado: no se puede reservar.
export function yaEmpezada(charla) {
    return inicioCharla(charla) < new Date();
}

// "10" y "dic" para el bloque de calendario de las tarjetas.
export function diaYMes(charla) {
    const inicio = inicioCharla(charla);
    return {
        dia: inicio.toLocaleDateString("es-ES", { day: "numeric" }),
        mes: inicio.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")
    };
}

// "Jueves, 10 de diciembre de 2026"
export function fechaLarga(charla) {
    const texto = inicioCharla(charla).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// "10 dic 2026"
export function fechaCorta(charla) {
    return inicioCharla(charla)
        .toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
        .replace(".", "");
}

// Texto y tipo del estado de plazas. El texto explica el estado; el color solo lo acompaña.
export function estadoPlazas(charla) {
    if (yaEmpezada(charla)) {
        return { tipo: "pasada", texto: "Charla ya celebrada" };
    }
    if (charla.plazasDisponibles === 0) {
        return { tipo: "completa", texto: "Completa" };
    }
    if (charla.plazasDisponibles <= 5) {
        return { tipo: "pocas", texto: `Últimas ${charla.plazasDisponibles} plazas` };
    }
    return { tipo: "libres", texto: `${charla.plazasDisponibles} plazas libres` };
}

// Se puede pedir cita si no ha empezado y quedan plazas.
export function sePuedeReservar(charla) {
    return !yaEmpezada(charla) && charla.plazasDisponibles > 0;
}
