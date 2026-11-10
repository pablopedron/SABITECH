function Admin({ catalogo }) {

    return (
        <main style={estilos.contenedor}>
            <h2>Panel de administrador</h2>

            <section style={estilos.caja}>
                <h3>Estadísticas de usuarios</h3>

                <p>
                    Las estadísticas (por ejemplo, usuarios por código postal) se
                    mostrarán cuando el backend ofrezca esos datos a organización.
                </p>
            </section>

            <section style={estilos.caja}>
                <h3>Todas las charlas</h3>

                {catalogo.estado === "cargando" && <p role="status">Cargando charlas...</p>}

                {catalogo.estado === "error" && (
                    <div role="alert">
                        <p>No se han podido cargar las charlas. {catalogo.error}</p>
                        <button onClick={catalogo.recargar}>Reintentar</button>
                    </div>
                )}

                {catalogo.estado === "listo" && catalogo.charlas.map((charla) => (
                    <div key={charla.id} style={estilos.charla}>
                        <h4>{charla.titulo}</h4>
                        <p>{charla.descripcion}</p>
                        <p>
                            {charla.fechasDisponibles[0].fecha} - {charla.fechasDisponibles[0].horas[0]}
                            {" "}({charla.plazasDisponibles} de {charla.capacidad} plazas libres)
                        </p>
                    </div>
                ))}
            </section>
        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "900px",
        margin: "auto",
        padding: "30px"
    },
    caja: {
        backgroundColor: "#f1f5f9",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px"
    },
    charla: {
        backgroundColor: "white",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px"
    }
};

export default Admin;