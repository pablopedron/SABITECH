import { useState } from "react";

function Registro({ registrar, cambiarPagina }) {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [errores, setErrores] = useState([]);
    const [enviando, setEnviando] = useState(false);

    async function enviarFormulario(e) {
        e.preventDefault();

        setErrores([]);
        setEnviando(true);

        // registrar devuelve una lista con los mensajes de error, o null si ha ido bien.
        const problemas = await registrar({
            nombre: nombre,
            correo: correo,
            password: password,
            codigoPostal: codigoPostal
        });

        if (problemas) {
            setErrores(problemas);
            setEnviando(false);
        }
    }

    return (
        <main className="pagina">
            <div className="acceso">
                <div className="acceso__cabecera">
                    <h1>Crear una cuenta</h1>
                    <p>Regístrate gratis para reservar tu plaza en las charlas.</p>
                </div>

                <form onSubmit={enviarFormulario} className="panel formulario">

                    <div className="campo">
                        <label htmlFor="registro-nombre">Nombre completo</label>
                        <input
                            id="registro-nombre"
                            type="text"
                            name="nombre"
                            autoComplete="name"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="registro-correo">Correo electrónico</label>
                        <input
                            id="registro-correo"
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
                        <label htmlFor="registro-password">Contraseña</label>
                        <input
                            id="registro-password"
                            type="password"
                            name="contrasenya"
                            autoComplete="new-password"
                            minLength="8"
                            aria-describedby="registro-password-ayuda"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p id="registro-password-ayuda" className="campo__ayuda">Mínimo 8 caracteres.</p>
                    </div>

                    <div className="campo">
                        <label htmlFor="registro-cp">Código postal</label>
                        <input
                            id="registro-cp"
                            type="text"
                            name="codigoPostal"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            pattern="[0-9]{5}"
                            maxLength="5"
                            aria-describedby="registro-cp-ayuda"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            required
                        />
                        <p id="registro-cp-ayuda" className="campo__ayuda">5 cifras. Solo se usa para estadísticas de procedencia.</p>
                    </div>

                    {errores.length > 0 && (
                        <ul role="alert" className="errores">
                            {errores.map((mensaje, indice) => (
                                <li key={indice}>{mensaje}</li>
                            ))}
                        </ul>
                    )}

                    <button type="submit" className="boton boton--ancho" disabled={enviando}>
                        {enviando ? "Registrando..." : "Registrarme"}
                    </button>
                </form>

                <p className="acceso__pie">
                    ¿Ya tienes cuenta?{" "}
                    <button className="boton boton--enlace" onClick={() => cambiarPagina("login")}>
                        Inicia sesión
                    </button>
                </p>
            </div>
        </main>
    );
}

export default Registro;
