import charlas from "../data/charlas";

function Admin({ usuarios }) {

    // Contamos cuántos usuarios hay en cada ciudad.
    const ciudades = {};

    usuarios.forEach((usuario) => {
        if (usuario.ciudad) {
            if (ciudades[usuario.ciudad]) {
                ciudades[usuario.ciudad]++;
            } else {
                ciudades[usuario.ciudad] = 1;
            }
        }
    });

    return (
        <main style={estilos.contenedor}>
            <h2>Panel de administrador</h2>

            <section style={estilos.caja}>
                <h3>Usuarios por ciudad</h3>

                {Object.keys(ciudades).length === 0 ? (
                    <p>No hay usuarios registrados.</p>
                ) : (
                    Object.keys(ciudades).map((ciudad) => (
                        <div key={ciudad} style={estilos.fila}>
                            <p>{ciudad}: {ciudades[ciudad]} usuarios</p>

                            <div style={estilos.fondoBarra}>
                                <div
                                    style={{
                                        ...estilos.barra,
                                        width: `${ciudades[ciudad] * 20}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </section>

            <section style={estilos.caja}>
                <h3>Todas las charlas</h3>

                {charlas.map((charla) => (
                    <div key={charla.id} style={estilos.charla}>
                        <h4>{charla.titulo}</h4>
                        <p>{charla.descripcion}</p>
                        <p>{charla.fecha} - {charla.hora}</p>
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
    fila: {
        marginBottom: "15px"
    },
    fondoBarra: {
        backgroundColor: "#ddd",
        height: "15px",
        borderRadius: "10px"
    },
    barra: {
        backgroundColor: "#0077b6",
        height: "15px",
        borderRadius: "10px"
    },
    charla: {
        backgroundColor: "white",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px"
    }
};

export default Admin;