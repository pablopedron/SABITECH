import TarjetaCharla from "./TarjetaCharla";

// Muestra las tarjetas de charlas con sus tres estados: cargando, error y lista vacía.
// "catalogo" viene de App: { charlas, estado, error, recargar }.
function ListaCharlas({ catalogo, reservar }) {

    if (catalogo.estado === "cargando") {
        return <p role="status">Cargando charlas...</p>;
    }

    if (catalogo.estado === "error") {
        return (
            <div role="alert">
                <p>No se han podido cargar las charlas. {catalogo.error}</p>
                <button onClick={catalogo.recargar}>Reintentar</button>
            </div>
        );
    }

    if (catalogo.charlas.length === 0) {
        return <p>Todavía no hay charlas publicadas.</p>;
    }

    return (
        <div className="charlas-grid">
            {catalogo.charlas.map((charla) => (
                <TarjetaCharla
                    key={charla.id}
                    charla={charla}
                    reservar={reservar}
                />
            ))}
        </div>
    );
}


export default ListaCharlas;
