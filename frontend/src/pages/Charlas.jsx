import TarjetaCharla from "../components/TarjetaCharla";
import charlas from "../data/charlas";

function Charlas({ reservar }) {

    return (
        <main style={estilos.contenedor}>
            <h2>Todas nuestras charlas</h2>

            <p>
                Consulta la información de cada charla y reserva tu plaza.
            </p>

            <div style={estilos.tarjetas}>
                {charlas.map((charla) => (
                    <TarjetaCharla
                        key={charla.id}
                        charla={charla}
                        reservar={reservar}
                    />
                ))}
            </div>
        </main>
    );
}

const estilos = {
    contenedor: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "auto"
    },
    tarjetas: {
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        gap: "20px",
        width: "100%",
        margin: "0 auto"
    }
};

export default Charlas;