import ListaCharlas from "../components/ListaCharlas";
import { AREAS, areaDe } from "../utils/charlas";

// Programa completo con un filtro por área (Salud, Business o Tech).
function Charlas({ catalogo, reservar, verDetalle, filtroArea, cambiarFiltroArea }) {

    const charlas = filtroArea === "todas"
        ? catalogo.charlas
        : catalogo.charlas.filter((charla) => areaDe(charla) === filtroArea);

    const opciones = [{ id: "todas", nombre: "Todas" }, ...AREAS];

    return (
        <main className="pagina">
            <div className="cabecera-pagina">
                <span className="antetitulo">Programa</span>
                <h1>Todas nuestras charlas</h1>
                <p>Charlas de salud, business y tech. Consulta la información de cada una y reserva tu plaza.</p>
            </div>

            <div className="filtros" role="group" aria-label="Filtrar charlas por área">
                {opciones.map((opcion) => (
                    <button
                        key={opcion.id}
                        className={`filtro filtro--${opcion.id}`}
                        aria-pressed={filtroArea === opcion.id}
                        onClick={() => cambiarFiltroArea(opcion.id)}
                    >
                        {opcion.nombre}
                    </button>
                ))}
            </div>

            {catalogo.estado === "listo" && (
                <p className="filtros__resultado" role="status">
                    {charlas.length} {charlas.length === 1 ? "charla" : "charlas"}
                    {filtroArea !== "todas" && ` de ${opciones.find((o) => o.id === filtroArea).nombre}`}
                </p>
            )}

            <ListaCharlas catalogo={catalogo} charlas={charlas} reservar={reservar} verDetalle={verDetalle} />
        </main>
    );
}

export default Charlas;
