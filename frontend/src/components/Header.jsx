import { useState } from "react";

// Cabecera del prototipo: logo, Inicio y Charlas a la izquierda;
// a la derecha, Iniciar sesión / Registrarse o, con sesión, "Bienvenid@", Mi cuenta y Cerrar sesión.
// En móvil la navegación se pliega en un menú.
function Header({ pagina, cambiarPagina, usuario, cerrarSesion }) {

    const [menuAbierto, setMenuAbierto] = useState(false);

    function ir(nombrePagina) {
        setMenuAbierto(false);
        cambiarPagina(nombrePagina);
    }

    // aria-current marca la página en la que estamos (se ve y lo anuncian los lectores de pantalla).
    function actual(nombres) {
        return nombres.includes(pagina) ? "page" : undefined;
    }

    const paginaCuenta = usuario?.rol === "admin" ? "admin" : "cuenta";

    return (
        <header className="cabecera">
            <div className="contenedor cabecera__barra">

                <button className="logo" onClick={() => ir("inicio")} aria-label="SABITECH, ir al inicio">
                    <span className="logo__marca" aria-hidden="true">S</span>
                    SABITECH
                </button>

                <button
                    className="menu-boton"
                    aria-expanded={menuAbierto}
                    aria-controls="navegacion-principal"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    {menuAbierto ? "✕ Cerrar" : "☰ Menú"}
                </button>

                <nav
                    id="navegacion-principal"
                    aria-label="Navegación principal"
                    className={`navegacion ${menuAbierto ? "navegacion--abierta" : ""}`}
                >
                    <ul className="navegacion__enlaces">
                        <li>
                            <button className="nav-enlace" aria-current={actual(["inicio"])} onClick={() => ir("inicio")}>
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button className="nav-enlace" aria-current={actual(["charlas", "detalle", "reserva"])} onClick={() => ir("charlas")}>
                                Charlas
                            </button>
                        </li>
                    </ul>

                    <ul className="navegacion__cuenta">
                        {usuario ? (
                            <>
                                <li className="saludo">Bienvenid@, <strong>{usuario.nombre}</strong></li>
                                <li>
                                    <button className="nav-enlace" aria-current={actual(["cuenta", "admin"])} onClick={() => ir(paginaCuenta)}>
                                        Mi cuenta
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="boton boton--borde-claro"
                                        onClick={() => {
                                            setMenuAbierto(false);
                                            cerrarSesion();
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button className="nav-enlace" aria-current={actual(["login"])} onClick={() => ir("login")}>
                                        Iniciar sesión
                                    </button>
                                </li>
                                <li>
                                    <button className="boton boton--claro" onClick={() => ir("registro")}>
                                        Registrarse
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
