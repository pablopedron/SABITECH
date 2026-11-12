import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faFacebook,
    faTiktok,
    faXTwitter
} from "@fortawesome/free-brands-svg-icons";

function Footer() {

    return (
        <footer style={estilos.footer}>

            <p>© 2026 SABITECH - Todos los derechos reservados</p>

            <p>Consulta novedades en nuestras redes sociales:</p>

            <div style={estilos.redes}>

                <a style={estilos.enlace} href="https://www.instagram.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram} /> Instagram
                </a>

                <a style={estilos.enlace} href="https://www.facebook.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faFacebook} /> Facebook
                </a>

                <a style={estilos.enlace} href="https://www.tiktok.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faTiktok} /> Tik Tok
                </a>

                <a style={estilos.enlace} href="https://x.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faXTwitter} /> X
                </a>

            </div>

        </footer>
    );
}

const estilos = {
    enlace: {
        color: "white"
    },
    footer: {
        backgroundColor: "#5f137b",
        color: "white",
        textAlign: "center",
        padding: "25px",
        marginTop: "40px"
    },

     redes: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 20px",
        marginTop: "15px",
        fontSize: "15px"
    }
};

export default Footer;