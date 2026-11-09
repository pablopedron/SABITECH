
import { useState } from "react";
import charlas from "../data/charlas";

function Reserva({ charlaSeleccionada, confirmarReserva }) {

    const [charlaId, setCharlaId] = useState(
        charlaSeleccionada ? String(charlaSeleccionada.id) : ""
    );

    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [lugar, setLugar] = useState("");

    // Buscar la charla seleccionada.
    const charla = charlas.find(
        (item) => item.id === Number(charlaId)
    );

    // Buscar las horas correspondientes a la fecha.
    const fechaSeleccionada = charla?.fechasDisponibles.find(
        (item) => item.fecha === fecha
    );

    const horasDisponibles = fechaSeleccionada
        ? fechaSeleccionada.horas
        : [];

    // Enviar la reserva.
    function enviarReserva(e) {
        e.preventDefault();

        if (!charla || !fecha || !hora || !lugar) {
            alert("Debes completar todos los campos.");
            return;
        }

        confirmarReserva({
            charla: charla.titulo,
            charlaId: charla.id,
            fecha: fecha,
            hora: hora,
            lugar: lugar
        });
    }

    return (
        <main style={estilos.contenedor}>

            <h2>Reserva tu cita</h2>

            <form onSubmit={enviarReserva} style={estilos.formulario}>

                {/* SELECCIONAR CHARLA */}
                <label>Selecciona una charla</label>

                <select
                    value={charlaId}
                    onChange={(e) => {
                        setCharlaId(e.target.value);
                        setFecha("");
                        setHora("");
                        setLugar("");
                    }}
                    required
                >
                    <option value="">Elige una charla</option>

                    {charlas.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.titulo}
                        </option>
                    ))}
                </select>

                {/* SELECCIONAR FECHA */}
                <label>Selecciona una fecha</label>

                <select
                    value={fecha}
                    onChange={(e) => {
                        setFecha(e.target.value);
                        setHora("");
                    }}
                    disabled={!charla}
                    required
                >
                    <option value="">Elige una fecha</option>

                    {charla?.fechasDisponibles.map((item) => (
                        <option key={item.fecha} value={item.fecha}>
                            {item.fecha}
                        </option>
                    ))}
                </select>

                {/* SELECCIONAR HORA */}
                <label>Selecciona una hora</label>

                <select
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={!fecha}
                    required
                >
                    <option value="">Elige una hora</option>

                    {horasDisponibles.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                {/* SELECCIONAR LUGAR */}
                <label>Selecciona un lugar</label>

                <select
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    disabled={!charla}
                    required
                >
                    <option value="">Elige un lugar</option>

                    {charla?.lugaresDisponibles.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    CONFIRMAR RESERVA
                </button>

            </form>
        </main>
    );
}

const estilos = {
    contenedor: {
        width: "100%",
        maxWidth: "450px",
        margin: "40px auto",
        padding: "25px",
        textAlign: "center",
        boxSizing: "border-box"
    },

    formulario: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "30px",
        boxSizing: "border-box"
    }
};

export default Reserva;
