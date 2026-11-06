import TarjetaCharla from "../components/TarjetaCharla";
import charlas from "../data/charlas";

function Inicio({ reservar, cambiarPagina }) {

    return (
        <main style={estilos.contenedor}>

            <section style={estilos.portada}>
                <h2>Bienvenido a SABITECH</h2>

                <p>
                    Un espacio para aprender, compartir y descubrir
                    las nuevas tecnologías.
                </p>

                <button
                    style={estilos.boton}
                    onClick={() => cambiarPagina("reserva")}
                >
                    PIDE TU CITA
                </button>
            </section>
<br></br>
            <section style={estilos.info}>
                <h2>NUESTRA NUEVA FUNCIÓN: CHARLAS</h2>

                <p>
                    En SABITECH organizamos charlas y actividades
                    relacionadas con el mundo tecnológico. Tanto para estudiantes
                     y trabajadores del sector, como personas que quieran
                      adentrarse en el mundillo.
                </p>
            </section>

            <section>
                <h2 style={estilos.titulo}>NUESTRAS CHARLAS</h2>

                <div style={estilos.tarjetas}>
                    {charlas.map((charla) => (
                        <TarjetaCharla
                            key={charla.id}
                            charla={charla}
                            reservar={reservar}
                        />
                    ))}
                </div>
            </section>

            <section style={estilos.final}>
                <h2>Descubre el mundo digital</h2>
                <p>Participa en nuestras charlas y aprende con nosotros.</p>
            </section>

        </main>
    );
}

const estilos = {
    contenedor: {
        padding: "25px",
        maxWidth: "1200px",
        margin: "auto",
    },
    portada: {
        backgroundColor: "#8e8e94",
        textAlign: "center",
        padding: "70px 20px",
        borderRadius: "12px",
    },
    info: {
        backgroundColor: "#b9b9c4",
        borderRadius: "12px",
        textAlign: "center",
        padding: "25px"
    },
    titulo: {
        textAlign: "center",
        marginTop: "40px"
    },
    tarjetas: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
    },
    boton: {
        backgroundColor: "#110707",
        color: "white",
        padding: "15px 25px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    },
    final: {
        textAlign: "center",
        backgroundColor: "#8e8e94",
        padding: "35px",
        marginTop: "40px",
        borderRadius: "12px"
    }
};

export default Inicio;