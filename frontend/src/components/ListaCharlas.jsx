import TarjetaCharla from "./TarjetaCharla";

// Muestra las tarjetas de charlas con sus tres estados: cargando, error y lista vacía.
// "catalogo" viene de App: { charlas, estado, error, recargar }.
// "charlas" permite mostrar solo una parte (por ejemplo, las próximas).
function ListaCharlas({ catalogo, charlas = catalogo.charlas, reservar, verDetalle, clase = "charlas-grid" }) {

    if (catalogo.estado === "cargando") {
        return <p role="status" className="estado">Cargando charlas...</p>;
    }

    if (catalogo.estado === "error") {
        return (
            <div role="alert" className="estado estado--error">
                <p>No se han podido cargar las charlas. {catalogo.error}</p>
                <button className="boton" onClick={catalogo.recargar}>Reintentar</button>
            </div>
        );
    }

    if (charlas.length === 0) {
        return <p className="estado">Todavía no hay charlas publicadas.</p>;
    }

    return (
        <ul className={clase}>
            {charlas.map((charla) => (
                <li key={charla.id}>
                    <TarjetaCharla charla={charla} reservar={reservar} verDetalle={verDetalle} />
                </li>
            ))}
        </ul>
    );
}

export default ListaCharlas;
