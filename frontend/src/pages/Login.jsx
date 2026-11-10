import { useState } from "react";

function Login({ iniciarSesion, cambiarPagina }) {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function enviarFormulario(e) {
        e.preventDefault();

        if (correo === "" || password === "") {
            setError("Rellena todos los campos.");
            return;
        }

        setError("");
        setEnviando(true);

        // iniciarSesion devuelve el mensaje de error, o null si ha ido bien.
        const mensaje = await iniciarSesion(correo, password);

        if (mensaje) {
            setError(mensaje);
            setEnviando(false);
        }
    }

    return (
        <main style={estilos.contenedor}>
            <h2>Iniciar sesión</h2>

            <form onSubmit={enviarFormulario} style={estilos.formulario}>

                <label htmlFor="login-correo">Correo electrónico</label>

                <input
                    id="login-correo"
                    type="email"
                    name="correo"
                    placeholder="Introduce tu correo..."
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />

                <label htmlFor="login-password">Contraseña</label>

                <input
                    id="login-password"
                    type="password"
                    name="contrasenya"
                    placeholder="Introduce tu contraseña..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p role="alert" style={estilos.error}>{error}</p>}

                <button type="submit" disabled={enviando}>
                    {enviando ? "Entrando..." : "Entrar"}
                </button>

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
    },
    error: {
        color: "#b00020",
        margin: 0
    }
};

export default Login;
