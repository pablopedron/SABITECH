import { useState } from "react";

function Registro({ registrar, cambiarPagina }) {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");

    function enviarFormulario(e) {
        e.preventDefault();

        const usuario = {
            nombre: nombre,
            correo: correo,
            ciudad: ciudad,
            codigoPostal: codigoPostal,
            rol: "usuario"
        };

        registrar(usuario);
    }

    return (
        <main style={estilos.contenedor}>
            <h2>Crear una cuenta</h2>

            <form onSubmit={enviarFormulario} style={estilos.formulario}>

                <label>Nombre completo</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <label>Correo electrónico</label>
                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>Ciudad</label>
                <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                />

                <label>Código postal</label>
                <input
                    type="text"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    required
                />

                <button type="submit">Registrarme</button>

            </form>

            <p>
                ¿Ya tienes cuenta?
                <button onClick={() => cambiarPagina("login")}>
                    Iniciar sesión
                </button>
            </p>
        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "450px",
        margin: "40px auto",
        padding: "25px",
        textAlign: "center"
    },
    formulario: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding:"50px"
    }
};

export default Registro;