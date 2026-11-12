// Mensaje para el usuario (éxito o error). Los lectores de pantalla lo anuncian solos.
function Aviso({ aviso, cerrar }) {

    if (!aviso) {
        return null;
    }

    const esError = aviso.tipo === "error";

    return (
        <div role={esError ? "alert" : "status"} className={`aviso ${esError ? "aviso--error" : "aviso--ok"}`}>
            <p>
                <strong>{esError ? "Error: " : "Hecho: "}</strong>
                {aviso.texto}
            </p>

            <button className="aviso__cerrar" onClick={cerrar} aria-label="Cerrar el mensaje">
                ✕
            </button>
        </div>
    );
}

export default Aviso;
