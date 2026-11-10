// Mensaje para el usuario (éxito o error). Los lectores de pantalla lo anuncian solos.
function Aviso({ aviso, cerrar }) {

    if (!aviso) {
        return null;
    }

    const esError = aviso.tipo === "error";

    return (
        <div
            role={esError ? "alert" : "status"}
            style={{
                ...estilos.aviso,
                backgroundColor: esError ? "#fde8e8" : "#e3f6e8",
                borderColor: esError ? "#d62828" : "#2e7d32"
            }}
        >
            <span>
                <strong>{esError ? "Error: " : "Hecho: "}</strong>
                {aviso.texto}
            </span>

            <button onClick={cerrar} aria-label="Cerrar el mensaje">
                ✕
            </button>
        </div>
    );
}

const estilos = {
    aviso: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        maxWidth: "900px",
        width: "calc(100% - 40px)",
        boxSizing: "border-box",
        margin: "15px auto 0",
        padding: "12px 16px",
        border: "2px solid",
        borderRadius: "8px"
    }
};

export default Aviso;
