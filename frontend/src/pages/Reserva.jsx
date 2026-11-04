import { useState } from "react";
import charlas from "../data/charlas";

function Reserva({ charlaSeleccionada, confirmarReserva }) {

    const [charlaId, setCharlaId] = useState(
        charlaSeleccionada ? String(charlaSeleccionada.id) : ""
    );

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");

    function enviarReserva(e) {
        e.preventDefault();

        const charla = charlas.find(
            (item) => item.id === Number(charlaId)
        );

        if (!charla) {
            alert("Selecciona una charla");
            return;
        }

        confirmarReserva({
            charla: charla.titulo,
            fecha: fecha,
            hora: hora,
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

                    {charlas.map((charla) => (
                        <option key={charla.id} value={charla.id}>
                            {charla.titulo}
                        </option>
                    ))}
                </select>

                <label>Fecha</label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                />

                <label>Hora</label>

                <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                />

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
        margin: "40px auto",
        padding: "25px",
        textAlign: "center"
    },
    formulario: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "50px"

    }
};

export default Reserva;