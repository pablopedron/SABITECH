function Cuenta({ usuario, reservas, cancelarReserva, cerrarSesion }) {

    // Las canceladas se muestran aparte, sin botón de cancelar.
    const confirmadas = reservas.filter((reserva) => reserva.estado === "confirmada");
    const canceladas = reservas.filter((reserva) => reserva.estado === "cancelada");

    return (
        <main style={estilos.contenedor}>
            <h2>Mi cuenta</h2>

            <section style={estilos.caja}>
                <h3>Bienvenido, {usuario.nombre}</h3>

                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Código postal:</strong> {usuario.codigoPostal || "No indicado"}</p>
            </section>

            <section style={estilos.caja}>
                <h3>Mis citas</h3>

                {confirmadas.length === 0 ? (
                    <p>No tienes ninguna reserva.</p>
                ) : (
                    confirmadas.map((reserva) => (
                        <div key={reserva.id} style={estilos.reserva}>
                            <p><strong>Referencia:</strong> {reserva.referencia}</p>
                            <p><strong>Charla:</strong> {reserva.charla.titulo}</p>
                            <p><strong>Fecha:</strong> {reserva.charla.fechasDisponibles[0].fecha}</p>
                            <p><strong>Hora:</strong> {reserva.charla.fechasDisponibles[0].horas[0]}</p>
                            <p><strong>Lugar:</strong> {reserva.charla.lugar}</p>

                            <button onClick={() => cancelarReserva(reserva.id)}>
                                Cancelar reserva
                            </button>
                        </div>
                    ))
                )}
            </section>

            {canceladas.length > 0 && (
                <section style={estilos.caja}>
                    <h3>Reservas canceladas</h3>

                    {canceladas.map((reserva) => (
                        <div key={reserva.id} style={estilos.reserva}>
                            <p>
                                <strong>{reserva.charla.titulo}</strong>{" "}
                                ({reserva.referencia}) - cancelada
                            </p>
                        </div>
                    ))}
                </section>
            )}

            <button
                style={estilos.boton}
                onClick={cerrarSesion}
            >
                Cerrar sesión
            </button>

        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "800px",
        margin: "auto",
        padding: "30px"
    },
    caja: {
        backgroundColor: "#b9b9ba",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "10px"
    },
    reserva: {
        backgroundColor: "white",
        padding: "15px",
        margin: "10px 0",
        borderRadius: "8px"
    },
    boton: {
        padding: "12px 20px",
        backgroundColor: "#d62828",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default Cuenta;
