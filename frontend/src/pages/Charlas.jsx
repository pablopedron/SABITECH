import ListaCharlas from "../components/ListaCharlas";

function Charlas({ catalogo, reservar, verDetalle }) {

    return (
        <main className="pagina">
            <div className="cabecera-pagina">
                <span className="antetitulo">Programa</span>
                <h1>Todas nuestras charlas</h1>
                <p>Consulta la información de cada charla y reserva tu plaza.</p>
            </div>

            <ListaCharlas catalogo={catalogo} reservar={reservar} verDetalle={verDetalle} />
        </main>
    );
}

export default Charlas;
