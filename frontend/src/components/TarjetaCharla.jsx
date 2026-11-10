function TarjetaCharla({ charla, reservar }) {

    const fechaDisponible = charla.fechasDisponibles?.[0];

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
                style={estilos.boton}
                onClick={() => reservar(charla)}
            >
                PIDE CITA
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
        maxWidth: "280px",
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
    }
};

export default TarjetaCharla;