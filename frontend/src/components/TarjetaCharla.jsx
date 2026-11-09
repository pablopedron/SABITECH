
function TarjetaCharla({ charla, reservar }) {

    return (
        <article style={estilos.tarjeta}>

            <div style={estilos.imagen}>
                {charla.imagen}
            </div>

            <h3>{charla.titulo}</h3>

            <p>{charla.descripcion}</p>

            <p><strong>Días disponibles:</strong></p>

            {charla.fechasDisponibles.map((item) => (
                <div key={item.fecha}>

                    <p>{item.fecha}</p>

                    <p>
                        <strong>Horas:</strong>{" "}
                        {item.horas.join(", ")}
                    </p>

                </div>
            ))}

            <p><strong>Lugar:</strong> Valencia</p>

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
        width: "100%",
        maxWidth: "280px",
        flex: "1 1 250px",
        boxSizing: "border-box"
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
