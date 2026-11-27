import { estadoPlazas, fechaCorta } from "../utils/charlas";

// Panel de organización del prototipo: datos, charlas y (más adelante) la gráfica de usuarios por ciudad.
function Admin({ catalogo, usuario, cerrarSesion }) {

    return (
        <main className="pagina">
            <div className="cabecera-pagina">
                <span className="antetitulo">Organización</span>
                <h1>Panel de organización</h1>
                <p>Consulta el estado de las charlas publicadas.</p>
            </div>

            <div className="cuenta">
                <section className="panel perfil" aria-labelledby="admin-datos-titulo">
                    <span className="perfil__avatar" aria-hidden="true">{usuario.nombre.charAt(0)}</span>
                    <h2 id="admin-datos-titulo" style={{ fontSize: "1.2rem" }}>Mis datos</h2>
                    <dl className="datos">
                        <dt>Nombre</dt>
                        <dd>{usuario.nombre}</dd>
                        <dt>Correo</dt>
                        <dd>{usuario.correo}</dd>
                        <dt>Perfil</dt>
                        <dd>Organización</dd>
                    </dl>
                    <button className="boton boton--secundario boton--ancho" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </section>

                <div>
                    <section className="panel" aria-labelledby="admin-charlas-titulo">
                        <div className="panel__titulo">
                            <h2 id="admin-charlas-titulo" style={{ fontSize: "1.3rem" }}>Charlas</h2>
                            {catalogo.estado === "listo" && (
                                <span className="etiqueta">{catalogo.charlas.length} publicadas</span>
                            )}
                        </div>

                        {catalogo.estado === "cargando" && <p role="status" className="estado">Cargando charlas...</p>}

                        {catalogo.estado === "error" && (
                            <div role="alert" className="estado estado--error">
                                <p>No se han podido cargar las charlas. {catalogo.error}</p>
                                <button className="boton" onClick={catalogo.recargar}>Reintentar</button>
                            </div>
                        )}

                        {catalogo.estado === "listo" && (
                            <div className="tabla-contenedor">
                                <table className="tabla">
                                    <caption className="solo-lector">Charlas publicadas y su ocupación</caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Charla</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Ocupación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {catalogo.charlas.map((charla) => {
                                            const ocupadas = charla.capacidad - charla.plazasDisponibles;
                                            const porcentaje = Math.round((ocupadas / charla.capacidad) * 100);
                                            return (
                                                <tr key={charla.id}>
                                                    <td>
                                                        <strong>{charla.titulo}</strong>
                                                        <br />
                                                        <span className="texto-suave">{charla.lugar}</span>
                                                    </td>
                                                    <td>
                                                        {fechaCorta(charla)}
                                                        <br />
                                                        <span className="texto-suave">{charla.fechasDisponibles[0].horas[0]}</span>
                                                    </td>
                                                    <td>
                                                        {ocupadas} de {charla.capacidad}
                                                        <div className="ocupacion" aria-hidden="true">
                                                            <div className="ocupacion__relleno" style={{ width: `${porcentaje}%` }} />
                                                        </div>
                                                        <span className="texto-suave" style={{ fontSize: "0.85rem" }}>
                                                            {estadoPlazas(charla).texto}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="panel" aria-labelledby="grafica-titulo">
                        <h2 id="grafica-titulo" style={{ fontSize: "1.3rem" }}>Usuarios por ciudad</h2>
                        <p className="marcador">
                            La gráfica de usuarios por código postal se mostrará cuando el backend ofrezca esos datos a la organización.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Admin;
