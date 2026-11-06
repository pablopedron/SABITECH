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

                <a href="https://www.instagram.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                </a> Instagram

                <a href="https://www.facebook.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                </a> Facebook

                <a href="https://www.tiktok.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faTiktok} />
                </a> Tik Tok

                <a href="https://x.com/"
                    target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faXTwitter} />
                </a> X

            </div>

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
    },

     redes: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "15px",
        fontSize: "15px"
    }
};

export default Footer;