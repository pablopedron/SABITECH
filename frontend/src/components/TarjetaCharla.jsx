function TarjetaCharla({ charla, reservar }) {

    return (
        <article style={estilos.tarjeta}>
            <div style={estilos.imagen}>
                {charla.imagen}
            </div>

            <h3>{charla.titulo}</h3>

            <p>{charla.descripcion}</p>

            <p><strong>Fecha:</strong> {charla.fecha}</p>

            <p><strong>Hora:</strong> {charla.hora}</p>

            <p><strong>Lugar:</strong> {charla.lugar}</p>

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
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px #cccccc",
        textAlign: "center",
        minWidth: "220px",
        flex: "1"
    },
    imagen: {
        fontSize: "55px"
    },
    boton: {
        backgroundColor: "#5f137b",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default TarjetaCharla;