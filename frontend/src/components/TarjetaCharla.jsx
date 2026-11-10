function TarjetaCharla({ charla, reservar, verDetalle }) {

    const fechaDisponible = charla.fechasDisponibles?.[0];

    // Con 0 plazas libres no se puede reservar (el servidor también lo comprueba).
    const sinPlazas = charla.plazasDisponibles === 0;

    return (
        <article style={estilos.tarjeta}>
            <h3>{charla.titulo}</h3>

            <p>{charla.descripcion}</p>

            <p>
                <strong>Categoría:</strong> {charla.categoria || "No disponible"}
            </p>

            <p>
                <strong>Ponente:</strong> {charla.ponente || "No disponible"}
            </p>

            <p>
                <strong>Empresa:</strong> {charla.empresaPonente || "No disponible"}
            </p>

            <p>
                <strong>Fecha:</strong>{" "}
                {fechaDisponible?.fecha || "No disponible"}
            </p>

            <p>
                <strong>Hora:</strong>{" "}
                {fechaDisponible?.horas?.[0] || "No disponible"}
            </p>

            <p>
                <strong>Lugar:</strong> {charla.lugar || "No disponible"}
            </p>

            <p>
                <strong>Dirección:</strong> {charla.direccion || "No disponible"}
            </p>

            <p>
                <strong>Plazas disponibles:</strong>{" "}
                {charla.plazasDisponibles ?? "No disponible"}
            </p>

            <button
                style={{ ...estilos.boton, ...estilos.botonSecundario }}
                onClick={() => verDetalle(charla)}
            >
                VER DETALLE
            </button>

            <button
                style={{
                    ...estilos.boton,
                    ...(sinPlazas ? estilos.botonDesactivado : {})
                }}
                onClick={() => reservar(charla)}
                disabled={sinPlazas}
            >
                {sinPlazas ? "SIN PLAZAS" : "PIDE CITA"}
            </button>
        </article>
    );
}

const estilos = {
    tarjeta: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    },
    boton: {
        backgroundColor: "#5f137b",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%"
    },
    botonSecundario: {
        backgroundColor: "#ffffff",
        color: "#5f137b",
        border: "2px solid #5f137b",
        marginBottom: "8px"
    },
    botonDesactivado: {
        backgroundColor: "#6b6b6b",
        cursor: "not-allowed"
    }
};

export default TarjetaCharla;