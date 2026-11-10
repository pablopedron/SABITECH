import { useEffect, useState } from "react";

import { obtenerCharla } from "../services/api";

// Pantalla de detalle: pide a la API (GET /talks/{id}) una sola charla.
// Estados: "cargando", "listo", "noExiste" (404) y "error".
function Detalle({ charlaId, reservar, volver }) {

    const [charla, setCharla] = useState(null);
    const [estado, setEstado] = useState("cargando");
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    // Volver a pedir la charla tras un error.
    function reintentar() {
        setEstado("cargando");
        setIntento(intento + 1);
    }

    useEffect(() => {
        let activo = true;

        obtenerCharla(charlaId)
            .then((datos) => {
                if (activo) {
                    setCharla(datos);
                    setEstado("listo");
                }
            })
            .catch((fallo) => {
                if (!activo) {
                    return;
                }

                if (fallo.estado === 404) {
                    setEstado("noExiste");
                } else {
                    setError(fallo.message);
                    setEstado("error");
                }
            });

        // Si salimos de la pantalla antes de que responda, ignoramos la respuesta.
        return () => {
            activo = false;
        };
    }, [charlaId, intento]);

    const fecha = charla?.fechasDisponibles[0];
    const sinPlazas = charla?.plazasDisponibles === 0;

    return (
        <main style={estilos.contenedor}>

            <button onClick={volver} style={estilos.volver}>
                ← Volver a las charlas
            </button>

            {estado === "cargando" && (
                <p role="status">Cargando charla...</p>
            )}

            {estado === "noExiste" && (
                <p role="alert">Esta charla no existe o ya no está disponible.</p>
            )}

            {estado === "error" && (
                <div role="alert">
                    <p>No se ha podido cargar la charla. {error}</p>
                    <button onClick={reintentar}>Reintentar</button>
                </div>
            )}

            {estado === "listo" && (
                <article style={estilos.ficha}>
                    <h2>{charla.titulo}</h2>

                    <p><strong>Categoría:</strong> {charla.categoria}</p>

                    <p>{charla.descripcion}</p>

                    <h3>Cuándo y dónde</h3>
                    <p><strong>Fecha:</strong> {fecha.fecha}</p>
                    <p><strong>Horario:</strong> {fecha.horas[0]} - {fecha.horaFin}</p>
                    <p><strong>Lugar:</strong> {charla.lugar}</p>
                    <p><strong>Dirección:</strong> {charla.direccion}</p>

                    <h3>Ponente</h3>
                    <p><strong>{charla.ponente}</strong> · {charla.empresaPonente}</p>
                    {charla.biografiaPonente && <p>{charla.biografiaPonente}</p>}

                    <h3>Aforo</h3>
                    <p>
                        {charla.plazasDisponibles} plazas libres de {charla.capacidad}
                    </p>

                    <button
                        style={{
                            ...estilos.reservar,
                            ...(sinPlazas ? estilos.sinPlazas : {})
                        }}
                        onClick={() => reservar(charla)}
                        disabled={sinPlazas}
                    >
                        {sinPlazas ? "SIN PLAZAS" : "PIDE CITA"}
                    </button>
                </article>
            )}
        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "700px",
        width: "100%",
        margin: "30px auto",
        padding: "0 20px",
        boxSizing: "border-box"
    },
    volver: {
        marginBottom: "16px",
        cursor: "pointer"
    },
    ficha: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "25px",
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    },
    reservar: {
        backgroundColor: "#5f137b",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "16px"
    },
    sinPlazas: {
        backgroundColor: "#6b6b6b",
        cursor: "not-allowed"
    }
};

export default Detalle;
