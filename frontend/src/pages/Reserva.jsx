import { useState } from "react";
import charlas from "../data/charlas";

function Reserva({ charlaSeleccionada, confirmarReserva }) {

    const [charlaId, setCharlaId] = useState(
        charlaSeleccionada ? String(charlaSeleccionada.id) : ""
    );

    const charla = charlas.find(
        (item) => item.id === Number(charlaId)
    );

    function enviarReserva(e) {
        e.preventDefault();

        if (!charla) {
            alert("Selecciona una charla.");
            return;
        }

        confirmarReserva({
            charla: charla.titulo,
            charlaId: charla.id,
            fecha: charla.fechasDisponibles[0].fecha,
            hora: charla.fechasDisponibles[0].horas[0],
            lugar: charla.lugar
        });
    }

    return (
        <main style={estilos.contenedor}>
            <h2>Reserva tu cita</h2>

            <form onSubmit={enviarReserva} style={estilos.formulario}>

                <label>Selecciona una charla</label>

                <select
                    value={charlaId}
                    onChange={(e) => setCharlaId(e.target.value)}
                    required
                >
                    <option value="">Elige una charla</option>

                    {charlas.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.titulo}
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

                <button type="submit">
                    CONFIRMAR RESERVA
                </button>

            </form>
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