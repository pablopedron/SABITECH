import { useState } from "react";

function Reserva({ catalogo, charlaSeleccionada, confirmarReserva }) {

    const charlas = catalogo.charlas;

    const [charlaId, setCharlaId] = useState(
        charlaSeleccionada ? String(charlaSeleccionada.id) : ""
    );
    const [enviando, setEnviando] = useState(false);

    const charla = charlas.find(
        (item) => item.id === Number(charlaId)
    );

    async function enviarReserva(e) {
        e.preventDefault();

        if (!charla) {
            return;
        }

        setEnviando(true);

        // App muestra el resultado (reserva hecha o error) y cambia de página si ha ido bien.
        await confirmarReserva(charla.id);

        setEnviando(false);
    }

    return (
        <main style={estilos.contenedor}>
            <h2>Reserva tu cita</h2>

            {catalogo.estado === "cargando" && (
                <p role="status">Cargando charlas...</p>
            )}

            {catalogo.estado === "error" && (
                <div role="alert">
                    <p>No se han podido cargar las charlas. {catalogo.error}</p>
                    <button onClick={catalogo.recargar}>Reintentar</button>
                </div>
            )}

            {catalogo.estado === "listo" && (
                <form onSubmit={enviarReserva} style={estilos.formulario}>

                    <label htmlFor="reserva-charla">Selecciona una charla</label>

                    <select
                        id="reserva-charla"
                        value={charlaId}
                        onChange={(e) => setCharlaId(e.target.value)}
                        required
                    >
                        <option value="">Elige una charla</option>

                        {charlas.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                                disabled={item.plazasDisponibles === 0}
                            >
                                {item.titulo}
                                {item.plazasDisponibles === 0 ? " (sin plazas)" : ""}
                            </option>
                        ))}
                    </select>

                    {charla && (
                        <>
                            <p>
                                <strong>Fecha:</strong>{" "}
                                {charla.fechasDisponibles[0].fecha}
                            </p>

                            <p>
                                <strong>Hora:</strong>{" "}
                                {charla.fechasDisponibles[0].horas[0]}
                            </p>

                            <p>
                                <strong>Lugar:</strong> {charla.lugar}
                            </p>

                            <p>
                                <strong>Plazas disponibles:</strong>{" "}
                                {charla.plazasDisponibles}
                            </p>
                        </>
                    )}

                    <button type="submit" disabled={enviando}>
                        {enviando ? "RESERVANDO..." : "CONFIRMAR RESERVA"}
                    </button>

                </form>
            )}
        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "450px",
        width: "100%",
        margin: "40px auto",
        padding: "25px",
        boxSizing: "border-box",
        textAlign: "center"
    },
    formulario: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "25px",
        boxSizing: "border-box"
    }
};

export default Reserva;
