import ListaCharlas from "../components/ListaCharlas";

function Charlas({ catalogo, reservar }) {

    return (
        <main style={estilos.contenedor}>
            <h2>Todas nuestras charlas</h2>

            <p>
                Consulta la información de cada charla y reserva tu plaza.
            </p>

            <ListaCharlas catalogo={catalogo} reservar={reservar} />
        </main>
    );
}

const estilos = {
    contenedor: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "auto"
    }
};

export default Charlas;
