import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Aviso from "./components/Aviso";

import Inicio from "./pages/Inicio";
import Charlas from "./pages/Charlas";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reserva from "./pages/Reserva";
import Detalle from "./pages/Detalle";
import Cuenta from "./pages/Cuenta";
import Admin from "./pages/Admin";

import {
    borrarToken,
    cancelarReservaApi,
    cerrarSesionApi,
    guardarToken,
    iniciarSesionApi,
    obtenerCharlas,
    obtenerMisReservas,
    obtenerPerfil,
    obtenerToken,
    registrarApi,
    registrarManejadorSesionCaducada,
    reservarCharla
} from "./services/api";

function App() {

    // Página que se está mostrando.
    const [pagina, setPagina] = useState("inicio");

    // Usuario que ha iniciado sesión (null si no hay sesión).
    const [usuario, setUsuario] = useState(null);

    // Reservas del usuario, tal y como las devuelve la API.
    const [reservas, setReservas] = useState([]);

    // Charlas del catálogo y estado de su carga: "cargando", "listo" o "error".
    const [charlas, setCharlas] = useState([]);
    const [estadoCharlas, setEstadoCharlas] = useState("cargando");
    const [errorCharlas, setErrorCharlas] = useState("");

    // Área elegida en la página de charlas: "todas", "salud", "business" o "tech".
    const [filtroArea, setFiltroArea] = useState("todas");

    // Charla seleccionada desde una tarjeta.
    const [charlaSeleccionada, setCharlaSeleccionada] = useState(null);

    // Id de la charla cuyo detalle se está viendo.
    const [charlaDetalleId, setCharlaDetalleId] = useState(null);

    // Mensaje para el usuario: { tipo: "ok" | "error", texto }.
    const [aviso, setAviso] = useState(null);

    // Al abrir la web: cargamos el catálogo y, si había una sesión guardada, la recuperamos.
    useEffect(() => {
        registrarManejadorSesionCaducada(() => {
            setUsuario(null);
            setReservas([]);
            setAviso({
                tipo: "error",
                texto: "Tu sesión ha caducado. Inicia sesión de nuevo."
            });
            setPagina("login");
        });

        cargarCharlas();
        restaurarSesion();
    }, []);

    // Al cambiar de pantalla, volvemos arriba (en móvil se quedaría a mitad de página).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pagina]);

    // Pide las charlas a la API.
    async function cargarCharlas() {

        // Si ya hay charlas mostradas no las ocultamos mientras se actualizan.
        setEstadoCharlas((anterior) => (anterior === "listo" ? anterior : "cargando"));

        try {
            const lista = await obtenerCharlas();
            setCharlas(lista);
            setEstadoCharlas("listo");
        } catch (error) {
            setErrorCharlas(error.message);
            setEstadoCharlas("error");
        }
    }

    // Pide las reservas del usuario a la API.
    async function cargarReservas() {
        try {
            setReservas(await obtenerMisReservas());
        } catch (error) {
            // El 401 ya lo gestiona el aviso de sesión caducada.
            if (error.estado !== 401) {
                setAviso({ tipo: "error", texto: error.message });
            }
        }
    }

    // Si hay un token guardado, comprobamos con la API quién es el usuario.
    async function restaurarSesion() {
        if (!obtenerToken()) {
            return;
        }

        try {
            setUsuario(await obtenerPerfil());
            await cargarReservas();
        } catch {
            // Sin sesión válida seguimos como visitante.
        }
    }

    // Cambiar de página.
    function cambiarPagina(nombrePagina) {
        setAviso(null);
        setPagina(nombrePagina);
    }

    // Ir a la página de charlas mostrando solo un área (desde el inicio).
    function verCharlasDe(area) {
        setFiltroArea(area);
        cambiarPagina("charlas");
    }

    // Seleccionar una charla para reservarla.
    function reservar(charla) {
        setAviso(null);
        setCharlaSeleccionada(charla);
        setPagina("reserva");
    }

    // Abrir la pantalla de detalle de una charla.
    function verDetalle(charla) {
        setAviso(null);
        setCharlaDetalleId(charla.id);
        setPagina("detalle");
    }

    // El login y el registro devuelven pocos datos; /me trae el perfil completo (código postal...).
    async function perfilCompleto(usuarioApi) {
        try {
            return await obtenerPerfil();
        } catch {
            return usuarioApi;
        }
    }

    // Iniciar sesión. Devuelve el mensaje de error, o null si ha ido bien.
    async function iniciarSesion(correo, password) {
        try {
            const { usuario: usuarioApi, token } = await iniciarSesionApi(correo, password);

            guardarToken(token);

            const perfil = await perfilCompleto(usuarioApi);
            setUsuario(perfil);
            setAviso(null);
            await cargarReservas();

            // La organización va a su panel; el resto, a su cuenta.
            setPagina(perfil.rol === "admin" ? "admin" : "cuenta");

            return null;
        } catch (error) {
            return error.message;
        }
    }

    // Registrar un usuario nuevo. Devuelve una lista de errores, o null si ha ido bien.
    async function registrar(datos) {
        try {
            const { usuario: usuarioApi, token } = await registrarApi(datos);

            guardarToken(token);
            setUsuario(await perfilCompleto(usuarioApi));
            setReservas([]);
            setAviso({ tipo: "ok", texto: "Registro realizado correctamente." });
            setPagina("cuenta");

            return null;
        } catch (error) {
            // Con errores de validación (422) mostramos cada uno; si no, el mensaje general.
            const detalles = Object.values(error.errores ?? {}).flat();
            return detalles.length > 0 ? detalles : [error.message];
        }
    }

    // Confirmar una reserva.
    async function confirmarReserva(charlaId) {

        if (!usuario) {
            setAviso({ tipo: "error", texto: "Debes iniciar sesión para reservar una cita." });
            setPagina("login");
            return;
        }

        try {
            const reserva = await reservarCharla(charlaId);

            // Actualizamos reservas y plazas disponibles con lo que ha guardado el servidor.
            await Promise.all([cargarReservas(), cargarCharlas()]);

            setAviso({
                tipo: "ok",
                texto: `¡Tu reserva se ha realizado correctamente! Referencia: ${reserva.referencia}`
            });
            setPagina("cuenta");
        } catch (error) {
            if (error.estado === 401) {
                return;
            }

            setAviso({ tipo: "error", texto: error.message });

            // Si no quedaban plazas, refrescamos para mostrar la disponibilidad real.
            if (error.estado === 409) {
                cargarCharlas();
            }
        }
    }

    // Cancelar una reserva.
    async function cancelarReserva(reservaId) {
        try {
            await cancelarReservaApi(reservaId);
            await Promise.all([cargarReservas(), cargarCharlas()]);

            setAviso({ tipo: "ok", texto: "Reserva cancelada. La plaza ha quedado libre." });
        } catch (error) {
            if (error.estado !== 401) {
                setAviso({ tipo: "error", texto: error.message });
            }
        }
    }

    // Cerrar sesión.
    async function cerrarSesion() {
        try {
            await cerrarSesionApi();
        } catch {
            // Aunque el servidor no responda, cerramos la sesión en este navegador.
        }

        borrarToken();
        setUsuario(null);
        setReservas([]);
        setAviso(null);
        setPagina("inicio");
    }

    // Datos del catálogo que reciben las páginas.
    const catalogo = {
        charlas: charlas,
        estado: estadoCharlas,
        error: errorCharlas,
        recargar: cargarCharlas
    };

    // Mostramos la página correspondiente.
    function mostrarPagina() {

        switch (pagina) {

            case "inicio":
                return (
                    <Inicio
                        catalogo={catalogo}
                        reservar={reservar}
                        verDetalle={verDetalle}
                        cambiarPagina={cambiarPagina}
                        verCharlasDe={verCharlasDe}
                    />
                );

            case "charlas":
                return (
                    <Charlas
                        catalogo={catalogo}
                        reservar={reservar}
                        verDetalle={verDetalle}
                        filtroArea={filtroArea}
                        cambiarFiltroArea={setFiltroArea}
                    />
                );

            case "detalle":
                return (
                    <Detalle
                        charlaId={charlaDetalleId}
                        reservar={reservar}
                        volver={() => cambiarPagina("charlas")}
                    />
                );

            case "login":
                return (
                    <Login
                        iniciarSesion={iniciarSesion}
                        cambiarPagina={cambiarPagina}
                    />
                );

            case "registro":
                return (
                    <Registro
                        registrar={registrar}
                        cambiarPagina={cambiarPagina}
                    />
                );

            case "reserva":
                return (
                    <Reserva
                        catalogo={catalogo}
                        charlaSeleccionada={charlaSeleccionada}
                        confirmarReserva={confirmarReserva}
                        usuario={usuario}
                        cambiarPagina={cambiarPagina}
                    />
                );

            case "cuenta":
                if (!usuario) {
                    return <Login iniciarSesion={iniciarSesion} cambiarPagina={cambiarPagina} />;
                }

                return (
                    <Cuenta
                        usuario={usuario}
                        reservas={reservas}
                        cancelarReserva={cancelarReserva}
                        cerrarSesion={cerrarSesion}
                        verDetalle={verDetalle}
                    />
                );

            case "admin":
                if (!usuario || usuario.rol !== "admin") {
                    return (
                        <Inicio
                            catalogo={catalogo}
                            reservar={reservar}
                            verDetalle={verDetalle}
                            cambiarPagina={cambiarPagina}
                            verCharlasDe={verCharlasDe}
                        />
                    );
                }

                return (
                    <Admin catalogo={catalogo} usuario={usuario} cerrarSesion={cerrarSesion} />
                );

            default:
                return (
                    <Inicio
                        catalogo={catalogo}
                        reservar={reservar}
                        verDetalle={verDetalle}
                        cambiarPagina={cambiarPagina}
                        verCharlasDe={verCharlasDe}
                    />
                );
        }
    }


    return (
        <>
            <a className="salto" href="#contenido">Saltar al contenido</a>

            <Header
                pagina={pagina}
                cambiarPagina={cambiarPagina}
                usuario={usuario}
                cerrarSesion={cerrarSesion}
            />

            <Aviso aviso={aviso} cerrar={() => setAviso(null)} />

            <div id="contenido" className="contenido" tabIndex="-1">
                {mostrarPagina()}
            </div>

            <Footer cambiarPagina={cambiarPagina} />
        </>
    );
}

export default App;
