function Footer() {

    return (
        <footer style={estilos.footer}>
            <p>© 2026 SABITECH - Todos los derechos reservados</p>
        </footer>
    );
}

const estilos = {
    footer: {
        backgroundColor: "#5f137b",
        color: "white",
        textAlign: "center",
        padding: "25px",
        marginTop: "40px"
    }
};

export default Footer;