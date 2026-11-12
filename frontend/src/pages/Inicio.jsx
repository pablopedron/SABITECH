import { useRef } from "react";

import ListaCharlas from "../components/ListaCharlas";
import { yaEmpezada } from "../utils/charlas";
import icono from "../assets/logos/icono-sabitech.webp";

// Inicio del prototipo: información, botón "Pide tu cita" y carrusel con las charlas.
function Inicio({ catalogo, reservar, verDetalle, cambiarPagina }) {

    const carrusel = useRef(null);

    // En el carrusel, las próximas charlas; si no hay, todas.
    const proximas = catalogo.charlas.filter((charla) => !yaEmpezada(charla));
    const charlasCarrusel = proximas.length > 0 ? proximas : catalogo.charlas;
    const plazasLibres = proximas.reduce((total, charla) => total + charla.plazasDisponibles, 0);

    // Las flechas mueven el carrusel una tarjeta a la izquierda o a la derecha.
    function mover(direccion) {
        const pista = carrusel.current?.querySelector("ul");
        const tarjeta = pista?.querySelector("li");
        if (pista && tarjeta) {
            pista.scrollBy({ left: direccion * (tarjeta.offsetWidth + 20), behavior: "smooth" });
        }
    }

    return (
        <main>
            <section className="portada" aria-labelledby="portada-titulo">
                <img className="portada__marca" src={icono} alt="" aria-hidden="true" width="192" height="192" />
                <div className="contenedor portada__contenido">
                    <div>
                        <span className="antetitulo">Jornadas tecnológicas</span>
                        <h1 id="portada-titulo">Aprende, comparte y descubre la tecnología</h1>
                        <p className="portada__texto">
                            En SABITECH organizamos charlas sobre inteligencia artificial, ciberseguridad,
                            desarrollo web y datos. Consulta el programa y reserva tu plaza en un minuto.
                        </p>

                        <div className="portada__acciones">
                            <button className="boton boton--claro" onClick={() => cambiarPagina("reserva")}>
                                Pide tu cita
                            </button>
                            <button className="boton boton--borde-claro" onClick={() => cambiarPagina("charlas")}>
                                Ver todas las charlas
                            </button>
                        </div>
                    </div>

                    {catalogo.estado === "listo" && (
                        <ul className="portada__datos" aria-label="SABITECH en cifras">
                            <li className="portada__dato">
                                <strong>{proximas.length}</strong> próximas charlas
                            </li>
                            <li className="portada__dato">
                                <strong>{plazasLibres}</strong> plazas libres
                            </li>
                            <li className="portada__dato">
                                <strong>Gratis</strong> con tu cuenta
                            </li>
                        </ul>
                    )}
                </div>
            </section>

            <div className="contenedor">

                <section className="seccion" aria-labelledby="como-titulo">
                    <div className="cabecera-pagina">
                        <span className="antetitulo">Cómo funciona</span>
                        <h2 id="como-titulo">Tu plaza en tres pasos</h2>
                    </div>

                    <div className="ventajas">
                        <article className="ventaja">
                            <span className="ventaja__icono" aria-hidden="true">1</span>
                            <h3>Elige una charla</h3>
                            <p>Consulta el programa con fecha, horario, lugar y plazas libres.</p>
                        </article>
                        <article className="ventaja">
                            <span className="ventaja__icono" aria-hidden="true">2</span>
                            <h3>Reserva tu plaza</h3>
                            <p>Con tu cuenta, confirma la reserva y te llegará un correo con la referencia.</p>
                        </article>
                        <article className="ventaja">
                            <span className="ventaja__icono" aria-hidden="true">3</span>
                            <h3>Entra con tu QR</h3>
                            <p>El día de la charla, enseña tu código QR en la entrada.</p>
                        </article>
                    </div>
                </section>

                <section className="seccion carrusel" aria-labelledby="proximas-titulo" ref={carrusel}>
                    <div className="seccion__cabecera">
                        <div>
                            <span className="antetitulo">Programa</span>
                            <h2 id="proximas-titulo">Próximas charlas</h2>
                        </div>

                        {catalogo.estado === "listo" && charlasCarrusel.length > 1 && (
                            <div className="carrusel__controles">
                                <button className="carrusel__flecha" onClick={() => mover(-1)} aria-label="Charlas anteriores">
                                    ←
                                </button>
                                <button className="carrusel__flecha" onClick={() => mover(1)} aria-label="Charlas siguientes">
                                    →
                                </button>
                            </div>
                        )}
                    </div>

                    <ListaCharlas
                        catalogo={catalogo}
                        charlas={charlasCarrusel}
                        reservar={reservar}
                        verDetalle={verDetalle}
                        clase="carrusel__pista"
                    />
                </section>

                <section className="seccion llamada" aria-labelledby="llamada-titulo">
                    <div>
                        <h2 id="llamada-titulo">Descubre el mundo digital</h2>
                        <p>Participa en nuestras charlas y aprende con nosotros.</p>
                    </div>
                    <button className="boton" onClick={() => cambiarPagina("charlas")}>
                        Ver el programa completo
                    </button>
                </section>
            </div>
        </main>
    );
}

export default Inicio;
