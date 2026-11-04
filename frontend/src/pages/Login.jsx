import { useState } from "react";

function Login({ iniciarSesion, cambiarPagina }) {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    function enviarFormulario(e) {
        e.preventDefault();

        if (correo === "" || password === "") {
            alert("Rellena todos los campos");
            return;
        }

        iniciarSesion(correo);
    }

    return (
        <main style={estilos.contenedor}>
            <h2>Iniciar sesión</h2>

            <form onSubmit={enviarFormulario} style={estilos.formulario}>

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

                <button type="submit">Entrar</button>

            </form>

            <p>
                ¿No tienes cuenta?
                <button onClick={() => cambiarPagina("registro")}>
                    Registrarse
                </button>
            </p>
        </main>
    );
}

const estilos = {
    contenedor: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "25px",
        textAlign: "center"
    },
    formulario: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "50px"
    }
};

export default Login;