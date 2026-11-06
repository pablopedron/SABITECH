import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Charlas from "./pages/Charlas";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reserva from "./pages/Reserva";
import Cuenta from "./pages/Cuenta";
import Admin from "./pages/Admin";

function App() {

    // Página que se está mostrando.
    const [pagina, setPagina] = useState("inicio");

    // Usuario que ha iniciado sesión.
    const [usuario, setUsuario] = useState(null);

    // Usuarios registrados.
    const [usuarios, setUsuarios] = useState([]);

    // Reservas realizadas.
    const [reservas, setReservas] = useState([]);

    // Charla seleccionada desde una tarjeta.
    const [charlaSeleccionada, setCharlaSeleccionada] = useState(null);

    // Cambiar de página.
    function cambiarPagina(nombrePagina) {
        setPagina(nombrePagina);
    }

    // Seleccionar una charla para reservarla.
    function reservar(charla) {
        setCharlaSeleccionada(charla);
        setPagina("reserva");
    }

    // Iniciar sesión.
    function iniciarSesion(correo) {

        // Usuario de prueba para acceder al administrador.
        if (correo === "admin@sabitech.es") {
            const administrador = {
                nombre: "Administrador",
                correo: correo,
                ciudad: "Valencia",
                codigoPostal: "46001",
                rol: "admin"
            };

            setUsuario(administrador);
            setPagina("admin");
            return;
        }

        // Buscamos si el usuario está registrado.
        const usuarioEncontrado = usuarios.find(
            (item) => item.correo === correo
        );

        if (usuarioEncontrado) {
            setUsuario(usuarioEncontrado);
            setPagina("cuenta");
        } else {
            alert("No existe una cuenta con ese correo. Regístrate primero.");
        }
    }

    // Registrar un usuario nuevo.
    function registrar(usuarioNuevo) {

        const existe = usuarios.find(
            (item) => item.correo === usuarioNuevo.correo
        );

        if (existe) {
            alert("Este correo ya está registrado.");
            return;
        }

        setUsuarios([...usuarios, usuarioNuevo]);
        setUsuario(usuarioNuevo);

        alert("Registro realizado correctamente.");

        setPagina("cuenta");
    }

    // Confirmar una reserva.
    function confirmarReserva(reservaNueva) {

        if (!usuario) {
            alert("Debes iniciar sesión para reservar una cita.");
            setPagina("login");
            return;
        }

        setReservas([...reservas, reservaNueva]);

        alert("¡Tu reserva se ha realizado correctamente!");

        setPagina("cuenta");
    }

    // Cancelar una reserva.
    function cancelarReserva(indice) {

        const nuevasReservas = reservas.filter(
            (reserva, index) => index !== indice
        );

        setReservas(nuevasReservas);
    }

    // Cerrar sesión.
    function cerrarSesion() {
        setUsuario(null);
        setPagina("inicio");
    }

    // Mostramos la página correspondiente.
    function mostrarPagina() {

        switch (pagina) {

            case "inicio":
                return (
                    <Inicio
                        reservar={reservar}
                        cambiarPagina={cambiarPagina}
                    />
                );

            case "charlas":
                return (
                    <Charlas reservar={reservar} />
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
                        charlaSeleccionada={charlaSeleccionada}
                        confirmarReserva={confirmarReserva}
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
                    />
                );

            case "admin":
                if (!usuario || usuario.rol !== "admin") {
                    return <Inicio reservar={reservar} cambiarPagina={cambiarPagina} />;
                }

                return (
                    <Admin usuarios={usuarios} />
                );

            default:
                return (
                    <Inicio
                        reservar={reservar}
                        cambiarPagina={cambiarPagina}
                    />
                );
        }
    }


    return (
        <div style={estilos.aplicacion}>

            <Header
                cambiarPagina={cambiarPagina}
                usuario={usuario}
            />

            {mostrarPagina()}

            <Footer />

        </div>
    );
}

const estilos = {
    aplicacion: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        color: "#000000"
    }
};

export default App;