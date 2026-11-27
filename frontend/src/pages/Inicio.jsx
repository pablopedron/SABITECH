import { useRef } from "react";

import ListaCharlas from "../components/ListaCharlas";
import { AREAS, areaDe, yaEmpezada } from "../utils/charlas";
import icono from "../assets/logos/icono-sabitech.webp";

// Inicio del prototipo: información, botón "Pide tu cita" y carrusel con las charlas.
function Inicio({ catalogo, reservar, verDetalle, cambiarPagina, verCharlasDe }) {

    const carrusel = useRef(null);

    // En el carrusel, las próximas charlas; si no hay, todas.
    const proximas = catalogo.charlas.filter((charla) => !yaEmpezada(charla));
    const charlasCarrusel = proximas.length > 0 ? proximas : catalogo.charlas;
    const plazasLibres = proximas.reduce((total, charla) => total + charla.plazasDisponibles, 0);

    // Cuántas próximas charlas hay de cada área (para las tarjetas de áreas).
    function proximasDe(area) {
        return proximas.filter((charla) => areaDe(charla) === area).length;
    }

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
                        <span className="antetitulo">Salud · Business · Tech</span>
                        <h1 id="portada-titulo">Charlas para cuidarte, emprender y entender la tecnología</h1>
                        <p className="portada__texto">
                            SABITECH reúne en unas mismas jornadas tres mundos que cada vez van más juntos:
                            la salud, los negocios y la tecnología. Consulta el programa y reserva tu plaza en un minuto.
                        </p>

                        <div className="portada__acciones">
                            <button className="boton boton--claro" onClick={() => cambiarPagina("reserva")}>
                                Pide tu cita
                            </button>
                            <button className="boton boton--borde-claro" onClick={() => verCharlasDe("todas")}>
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
                                <strong>3 áreas</strong> salud, business y tech
                            </li>
                        </ul>
                    )}
                </div>
            </section>

            <div className="contenedor">

                <section className="seccion" aria-labelledby="areas-titulo">
                    <div className="cabecera-pagina">
                        <span className="antetitulo">Qué significa SABITECH</span>
                        <h2 id="areas-titulo" aria-label="SABITECH: Salud, Business y Tech">
                            <span className="sigla sigla--salud">SA</span>
                            {" · "}
                            <span className="sigla sigla--business">BI</span>
                            {" · "}
                            <span className="sigla sigla--tech">TECH</span>
                        </h2>
                        <p>
                            <strong>Salud</strong>, <strong>Business</strong> y <strong>Tech</strong>: cada charla
                            pertenece a una de estas tres áreas. Elige la que más te interese.
                        </p>
                    </div>

                    <ul className="areas">
                        {AREAS.map((area) => (
                            <li key={area.id}>
                                <article className={`area area--${area.id}`}>
                                    <span className="area__letras" aria-hidden="true">{area.letras}</span>
                                    <h3>{area.nombre}</h3>
                                    <p>{area.descripcion}</p>
                                    {catalogo.estado === "listo" && (
                                        <p className="area__cuenta">
                                            {proximasDe(area.id)} {proximasDe(area.id) === 1 ? "próxima charla" : "próximas charlas"}
                                        </p>
                                    )}
                                    <button
                                        className="boton boton--secundario"
                                        onClick={() => verCharlasDe(area.id)}
                                        aria-label={`Ver las charlas de ${area.nombre}`}
                                    >
                                        Ver charlas
                                    </button>
                                </article>
                            </li>
                        ))}
                    </ul>
                </section>

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
                        <h2 id="llamada-titulo">Salud, negocio y tecnología en un mismo lugar</h2>
                        <p>Participa en nuestras charlas y aprende con nosotros.</p>
                    </div>
                    <button className="boton" onClick={() => verCharlasDe("todas")}>
                        Ver el programa completo
                    </button>
                </section>
            </div>
        </main>
    );
}

export default Inicio;
