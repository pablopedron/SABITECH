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
        <main className="pagina">
            <div className="acceso">
                <div className="acceso__cabecera">
                    <h1>Iniciar sesión</h1>
                    <p>Entra para reservar charlas y ver tus citas.</p>
                </div>

                <form onSubmit={enviarFormulario} className="panel formulario">

                    <div className="campo">
                        <label htmlFor="login-correo">Correo electrónico</label>
                        <input
                            id="login-correo"
                            type="email"
                            name="correo"
                            autoComplete="email"
                            placeholder="nombre@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="login-password">Contraseña</label>
                        <input
                            id="login-password"
                            type="password"
                            name="contrasenya"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p role="alert" className="error-campo">{error}</p>}

                    <button type="submit" className="boton boton--ancho" disabled={enviando}>
                        {enviando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="acceso__pie">
                    ¿No tienes cuenta?{" "}
                    <button className="boton boton--enlace" onClick={() => cambiarPagina("registro")}>
                        Regístrate
                    </button>
                </p>
            </div>
        </main>
    );
}

export default Login;
