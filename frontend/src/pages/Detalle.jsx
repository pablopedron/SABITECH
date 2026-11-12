import { useEffect, useState } from "react";

import { obtenerCharla } from "../services/api";
import { areaDe, estadoPlazas, fechaLarga, sePuedeReservar, yaEmpezada } from "../utils/charlas";

// Pantalla de detalle: pide a la API (GET /talks/{id}) una sola charla.
// Estados: "cargando", "listo", "noExiste" (404) y "error".
function Detalle({ charlaId, reservar, volver }) {

    const [charla, setCharla] = useState(null);
    const [estado, setEstado] = useState("cargando");
    const [error, setError] = useState("");
    const [intento, setIntento] = useState(0);

    // Volver a pedir la charla tras un error.
    function reintentar() {
        setEstado("cargando");
        setIntento(intento + 1);
    }

    useEffect(() => {
        let activo = true;

        obtenerCharla(charlaId)
            .then((datos) => {
                if (activo) {
                    setCharla(datos);
                    setEstado("listo");
                }
            })
            .catch((fallo) => {
                if (!activo) {
                    return;
                }

                if (fallo.estado === 404) {
                    setEstado("noExiste");
                } else {
                    setError(fallo.message);
                    setEstado("error");
                }
            });

        // Si salimos de la pantalla antes de que responda, ignoramos la respuesta.
        return () => {
            activo = false;
        };
    }, [charlaId, intento]);

    return (
        <main className="pagina">

            <button onClick={volver} className="boton boton--enlace volver">
                ← Volver a las charlas
            </button>

            {estado === "cargando" && (
                <p role="status" className="estado">Cargando charla...</p>
            )}

            {estado === "noExiste" && (
                <p role="alert" className="estado estado--error">
                    Esta charla no existe o ya no está disponible.
                </p>
            )}

            {estado === "error" && (
                <div role="alert" className="estado estado--error">
                    <p>No se ha podido cargar la charla. {error}</p>
                    <button className="boton" onClick={reintentar}>Reintentar</button>
                </div>
            )}

            {estado === "listo" && <FichaCharla charla={charla} reservar={reservar} />}
        </main>
    );
}

function FichaCharla({ charla, reservar }) {

    const fecha = charla.fechasDisponibles[0];
    const plazas = estadoPlazas(charla);
    const ocupadas = charla.capacidad - charla.plazasDisponibles;
    const porcentaje = Math.round((ocupadas / charla.capacidad) * 100);

    let textoBoton = "Pedir cita";
    if (yaEmpezada(charla)) {
        textoBoton = "Charla ya celebrada";
    } else if (charla.plazasDisponibles === 0) {
        textoBoton = "Sin plazas";
    }

    return (
        <article className="detalle">

            <div className="detalle__principal panel">
                <span className={`etiqueta etiqueta--${areaDe(charla)}`}>{charla.categoria}</span>
                <h1 style={{ marginTop: 14 }}>{charla.titulo}</h1>
                <p className="detalle__descripcion">{charla.descripcion}</p>

                <section className="ponente" aria-labelledby="ponente-titulo">
                    <span className="ponente__inicial" aria-hidden="true">
                        {charla.ponente?.charAt(0)}
                    </span>
                    <div>
                        <h2 id="ponente-titulo" className="solo-lector">Ponente</h2>
                        <p><strong>{charla.ponente}</strong></p>
                        {charla.empresaPonente && <p className="texto-suave">{charla.empresaPonente}</p>}
                        {charla.biografiaPonente && <p>{charla.biografiaPonente}</p>}
                    </div>
                </section>
            </div>

            <aside className="detalle__lateral panel" aria-labelledby="cuando-titulo">
                <h2 id="cuando-titulo" style={{ fontSize: "1.2rem" }}>Cuándo y dónde</h2>

                <dl className="datos">
                    <dt>Fecha</dt>
                    <dd>{fechaLarga(charla)}</dd>
                    <dt>Horario</dt>
                    <dd>{fecha.horas[0]} - {fecha.horaFin}</dd>
                    <dt>Lugar</dt>
                    <dd>{charla.lugar}</dd>
                    <dt>Dirección</dt>
                    <dd>{charla.direccion}</dd>
                </dl>

                <h3 style={{ fontSize: "1rem", marginBottom: 0 }}>Aforo</h3>
                <div
                    className="ocupacion"
                    role="img"
                    aria-label={`${ocupadas} de ${charla.capacidad} plazas ocupadas`}
                >
                    <div className="ocupacion__relleno" style={{ width: `${porcentaje}%` }} />
                </div>
                <p className="texto-suave" style={{ fontSize: "0.9rem" }}>
                    {charla.plazasDisponibles} plazas libres de {charla.capacidad}
                </p>

                <p className={`plazas plazas--${plazas.tipo}`} style={{ marginTop: 0 }}>{plazas.texto}</p>

                <button
                    className="boton boton--ancho"
                    style={{ marginTop: 16 }}
                    onClick={() => reservar(charla)}
                    disabled={!sePuedeReservar(charla)}
                >
                    {textoBoton}
                </button>
            </aside>
        </article>
    );
}

export default Detalle;
