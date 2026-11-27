import { fechaLarga, yaEmpezada } from "../utils/charlas";

// "Mi cuenta" del prototipo: mis datos, mis citas (info y darse de baja) y cerrar sesión.
function Cuenta({ usuario, reservas, cancelarReserva, cerrarSesion, verDetalle }) {

    // Las canceladas se muestran aparte, sin botón de cancelar.
    const confirmadas = reservas.filter((reserva) => reserva.estado === "confirmada");
    const canceladas = reservas.filter((reserva) => reserva.estado === "cancelada");

    return (
        <main className="pagina">
            <div className="cabecera-pagina">
                <span className="antetitulo">Mi cuenta</span>
                <h1>Hola, {usuario.nombre}</h1>
                <p>Aquí tienes tus datos y las charlas que has reservado.</p>
            </div>

            <div className="cuenta">
                <section className="panel perfil" aria-labelledby="datos-titulo">
                    <span className="perfil__avatar" aria-hidden="true">{usuario.nombre.charAt(0)}</span>
                    <h2 id="datos-titulo" style={{ fontSize: "1.2rem" }}>Mis datos</h2>

                    <dl className="datos">
                        <dt>Nombre</dt>
                        <dd>{usuario.nombre}</dd>
                        <dt>Correo</dt>
                        <dd>{usuario.correo}</dd>
                        <dt>Código postal</dt>
                        <dd>{usuario.codigoPostal || "No indicado"}</dd>
                    </dl>

                    <button className="boton boton--secundario boton--ancho" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </section>

                <div>
                    <section className="panel" aria-labelledby="citas-titulo">
                        <div className="panel__titulo">
                            <h2 id="citas-titulo" style={{ fontSize: "1.3rem" }}>Mis citas</h2>
                            <span className="etiqueta">{confirmadas.length} confirmadas</span>
                        </div>

                        {confirmadas.length === 0 ? (
                            <p className="estado">Todavía no tienes ninguna reserva.</p>
                        ) : (
                            <ul className="citas">
                                {confirmadas.map((reserva) => (
                                    <li key={reserva.id}>
                                        <article className="cita">
                                            <div>
                                                <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{reserva.charla.titulo}</h3>
                                                <span className="cita__referencia">Ref. {reserva.referencia}</span>
                                            </div>

                                            <dl className="datos">
                                                <dt>Fecha</dt>
                                                <dd>{fechaLarga(reserva.charla)}</dd>
                                                <dt>Hora</dt>
                                                <dd>{reserva.charla.fechasDisponibles[0].horas[0]}</dd>
                                                <dt>Lugar</dt>
                                                <dd>{reserva.charla.lugar}</dd>
                                            </dl>

                                            <div className="cita__acciones">
                                                <button
                                                    className="boton boton--secundario"
                                                    onClick={() => verDetalle(reserva.charla)}
                                                    aria-label={`Ver información de ${reserva.charla.titulo}`}
                                                >
                                                    Info
                                                </button>
                                                {yaEmpezada(reserva.charla) ? (
                                                    <button className="boton" disabled>
                                                        Ya celebrada
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="boton boton--peligro"
                                                        onClick={() => cancelarReserva(reserva.id)}
                                                        aria-label={`Darse de baja de ${reserva.charla.titulo}`}
                                                    >
                                                        Darse de baja
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {canceladas.length > 0 && (
                        <section className="panel" aria-labelledby="canceladas-titulo">
                            <h2 id="canceladas-titulo" style={{ fontSize: "1.1rem" }}>Reservas canceladas</h2>
                            <ul className="lista-canceladas">
                                {canceladas.map((reserva) => (
                                    <li key={reserva.id}>
                                        {reserva.charla.titulo} · <span className="cita__referencia">{reserva.referencia}</span> · cancelada
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Cuenta;
