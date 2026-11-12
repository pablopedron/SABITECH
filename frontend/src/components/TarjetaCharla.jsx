import { diaYMes, estadoPlazas, sePuedeReservar, yaEmpezada } from "../utils/charlas";

// Tarjeta de charla del prototipo: datos principales y los botones "Info" y "Pedir cita".
function TarjetaCharla({ charla, reservar, verDetalle }) {

    const fecha = charla.fechasDisponibles[0];
    const { dia, mes } = diaYMes(charla);
    const plazas = estadoPlazas(charla);
    const pasada = yaEmpezada(charla);
    const idTitulo = `charla-${charla.id}-titulo`;

    let textoBoton = "Pedir cita";
    if (pasada) {
        textoBoton = "Ya celebrada";
    } else if (charla.plazasDisponibles === 0) {
        textoBoton = "Sin plazas";
    }

    return (
        <article className={`tarjeta ${pasada ? "tarjeta--pasada" : ""}`} aria-labelledby={idTitulo}>

            <div className="tarjeta__cabecera">
                <span className="etiqueta">{charla.categoria}</span>

                <p className="fecha-bloque" aria-label={`Día ${dia} de ${mes}`}>
                    <span className="fecha-bloque__dia" aria-hidden="true">{dia}</span>
                    <span className="fecha-bloque__mes" aria-hidden="true">{mes}</span>
                </p>
            </div>

            <div className="tarjeta__cuerpo">
                <h3 className="tarjeta__titulo" id={idTitulo}>{charla.titulo}</h3>

                <p className="tarjeta__ponente">
                    {charla.ponente}
                    {charla.empresaPonente && ` · ${charla.empresaPonente}`}
                </p>

                <dl className="datos">
                    <dt>Hora</dt>
                    <dd>{fecha.horas[0]} - {fecha.horaFin}</dd>
                    <dt>Lugar</dt>
                    <dd>{charla.lugar}</dd>
                </dl>

                <p className={`plazas plazas--${plazas.tipo}`}>{plazas.texto}</p>
            </div>

            <div className="tarjeta__acciones">
                <button
                    className="boton boton--secundario"
                    onClick={() => verDetalle(charla)}
                    aria-label={`Ver información de ${charla.titulo}`}
                >
                    Info
                </button>

                <button
                    className="boton"
                    onClick={() => reservar(charla)}
                    disabled={!sePuedeReservar(charla)}
                    aria-label={`${textoBoton}: ${charla.titulo}`}
                >
                    {textoBoton}
                </button>
            </div>
        </article>
    );
}

export default TarjetaCharla;
