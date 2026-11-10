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
        <main style={estilos.contenedor}>
            <h2>Crear una cuenta</h2>

            <form onSubmit={enviarFormulario} style={estilos.formulario}>

                <label htmlFor="registro-nombre">Nombre completo</label>
                <input
                    id="registro-nombre"
                    type="text"
                    name="nombre"
                    placeholder="Introduce nombre y apellidos..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <label htmlFor="registro-correo">Correo electrónico</label>
                <input
                    id="registro-correo"
                    type="email"
                    name="correo"
                    placeholder="Introduce tu correo..."
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />

                <label htmlFor="registro-password">Contraseña (mínimo 8 caracteres)</label>
                <input
                    id="registro-password"
                    type="password"
                    name="contrasenya"
                    placeholder="Introduce tu contraseña..."
                    minLength="8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="registro-cp">Código postal</label>
                <input
                    id="registro-cp"
                    type="text"
                    name="codigoPostal"
                    placeholder="Introduce tu código postal..."
                    pattern="[0-9]{5}"
                    maxLength="5"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    required
                />

                {errores.length > 0 && (
                    <ul role="alert" style={estilos.errores}>
                        {errores.map((mensaje, indice) => (
                            <li key={indice}>{mensaje}</li>
                        ))}
                    </ul>
                )}

                <button type="submit" disabled={enviando}>
                    {enviando ? "Registrando..." : "Registrarme"}
                </button>

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
        padding: "clamp(16px, 5vw, 30px)",
        boxSizing: "border-box",
        width: "100%"
    },
    errores: {
        color: "#b00020",
        textAlign: "left",
        margin: 0
    }
};

export default Registro;
