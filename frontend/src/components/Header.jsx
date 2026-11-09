function Header({ cambiarPagina, usuario }) {

    return (
        <header style={estilos.header}>
            <h1 onClick={() => cambiarPagina("inicio")} style={estilos.logo}>
                SABITECH
            </h1>

            <nav style={estilos.nav}>
                <button onClick={() => cambiarPagina("inicio")}>
                    Inicio
                </button>

                <button onClick={() => cambiarPagina("charlas")}>
                    Charlas
                </button>

                <button onClick={() => cambiarPagina("reserva")}>
                    Pide tu cita
                </button>

                {usuario ? (
                    <button onClick={() => cambiarPagina(
                        usuario.rol === "admin" ? "admin" : "cuenta"
                    )}>
                        Mi cuenta
                    </button>
                ) : (
                    <>
                        <button onClick={() => cambiarPagina("login")}>
                            Iniciar sesión
                        </button>

                        <button onClick={() => cambiarPagina("registro")}>
                            Registrarse
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}

const estilos = {
    header: {
        backgroundColor: "#5f137b",
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px"
    },
    logo: {
        cursor: "pointer",
        margin: 0
    },
    nav: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px"
    }
};

export default Header;