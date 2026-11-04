function Cuenta({ usuario, reservas, cancelarReserva, cerrarSesion }) {

    return (
        <main style={estilos.contenedor}>
            <h2>Mi cuenta</h2>

            <section style={estilos.caja}>
                <h3>Bienvenido, {usuario.nombre}</h3>

                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Ciudad:</strong> {usuario.ciudad}</p>
                <p><strong>Código postal:</strong> {usuario.codigoPostal}</p>
            </section>

            <section style={estilos.caja}>
                <h3>Mis citas</h3>

                {reservas.length === 0 ? (
                    <p>No tienes ninguna reserva.</p>
                ) : (
                    reservas.map((reserva, index) => (
                        <div key={index} style={estilos.reserva}>
                            <p><strong>Charla:</strong> {reserva.charla}</p>
                            <p><strong>Fecha:</strong> {reserva.fecha}</p>
                            <p><strong>Hora:</strong> {reserva.hora}</p>
                            <p><strong>Lugar:</strong> {reserva.lugar}</p>

                            <button onClick={() => cancelarReserva(index)}>
                                Cancelar reserva
                            </button>
                        </div>
                    ))
                )}
            </section>

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