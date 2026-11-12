import { useState } from "react";

import { fechaLarga, sePuedeReservar } from "../utils/charlas";

// Pantalla "al reservar charla" del prototipo: hora, sitio e información, y el botón Confirmar.
function Reserva({ catalogo, charlaSeleccionada, confirmarReserva, usuario, cambiarPagina }) {

    const charlas = catalogo.charlas;

    const [charlaId, setCharlaId] = useState(
        charlaSeleccionada ? String(charlaSeleccionada.id) : ""
    );
    const [enviando, setEnviando] = useState(false);

    const charla = charlas.find((item) => item.id === Number(charlaId));

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
        <main className="pagina pagina--estrecha">
            <div className="cabecera-pagina">
                <span className="antetitulo">Reserva</span>
                <h1>Pide tu cita</h1>
                <p>Elige la charla, revisa los datos y confirma tu plaza.</p>
            </div>

            {!usuario && (
                <p className="estado" style={{ marginBottom: 24 }}>
                    Para confirmar la reserva necesitas una cuenta.{" "}
                    <button className="boton boton--enlace" onClick={() => cambiarPagina("login")}>
                        Inicia sesión
                    </button>{" "}
                    o{" "}
                    <button className="boton boton--enlace" onClick={() => cambiarPagina("registro")}>
                        regístrate
                    </button>.
                </p>
            )}

            {catalogo.estado === "cargando" && (
                <p role="status" className="estado">Cargando charlas...</p>
            )}

            {catalogo.estado === "error" && (
                <div role="alert" className="estado estado--error">
                    <p>No se han podido cargar las charlas. {catalogo.error}</p>
                    <button className="boton" onClick={catalogo.recargar}>Reintentar</button>
                </div>
            )}

            {catalogo.estado === "listo" && (
                <form onSubmit={enviarReserva} className="panel formulario">

                    <div className="campo">
                        <label htmlFor="reserva-charla">Charla</label>
                        <select
                            id="reserva-charla"
                            value={charlaId}
                            onChange={(e) => setCharlaId(e.target.value)}
                            required
                        >
                            <option value="">Elige una charla</option>

                            {charlas.map((item) => (
                                <option key={item.id} value={item.id} disabled={!sePuedeReservar(item)}>
                                    {item.titulo}
                                    {!sePuedeReservar(item) ? " (no disponible)" : ""}
                                </option>
                            ))}
                        </select>
                        <p className="campo__ayuda">Las charlas completas o ya celebradas no se pueden elegir.</p>
                    </div>

                    {charla && (
                        <section className="resumen" aria-labelledby="resumen-titulo">
                            <h2 id="resumen-titulo" style={{ fontSize: "1.15rem" }}>{charla.titulo}</h2>
                            <dl className="datos">
                                <dt>Fecha</dt>
                                <dd>{fechaLarga(charla)}</dd>
                                <dt>Hora</dt>
                                <dd>{charla.fechasDisponibles[0].horas[0]} - {charla.fechasDisponibles[0].horaFin}</dd>
                                <dt>Lugar</dt>
                                <dd>{charla.lugar} · {charla.direccion}</dd>
                                <dt>Ponente</dt>
                                <dd>{charla.ponente}</dd>
                                <dt>Plazas libres</dt>
                                <dd>{charla.plazasDisponibles}</dd>
                            </dl>
                        </section>
                    )}

                    <button type="submit" className="boton boton--ancho" disabled={enviando || !charla}>
                        {enviando ? "Reservando..." : "Confirmar reserva"}
                    </button>
                </form>
            )}
        </main>
    );
}

export default Reserva;
