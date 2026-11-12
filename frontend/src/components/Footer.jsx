import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faFacebook,
    faTiktok,
    faXTwitter
} from "@fortawesome/free-brands-svg-icons";

// Pie del prototipo: información y redes sociales.
function Footer({ cambiarPagina }) {

    return (
        <footer className="pie">
            <div className="contenedor pie__columnas">

                <section>
                    <h2>SABITECH</h2>
                    <p>
                        Jornadas de charlas tecnológicas para estudiantes, profesionales
                        y cualquier persona con ganas de aprender.
                    </p>
                </section>

                <nav aria-label="Enlaces del pie">
                    <h2>La web</h2>
                    <ul className="pie__lista">
                        <li><button className="pie__enlace" onClick={() => cambiarPagina("inicio")}>Inicio</button></li>
                        <li><button className="pie__enlace" onClick={() => cambiarPagina("charlas")}>Charlas</button></li>
                        <li><button className="pie__enlace" onClick={() => cambiarPagina("reserva")}>Pide tu cita</button></li>
                    </ul>
                </nav>

                <section>
                    <h2>Síguenos</h2>
                    <ul className="pie__lista">
                        <li>
                            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={faInstagram} /> Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={faFacebook} /> Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={faTiktok} /> TikTok
                            </a>
                        </li>
                        <li>
                            <a href="https://x.com/" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={faXTwitter} /> X
                            </a>
                        </li>
                    </ul>
                </section>
            </div>

            <div className="pie__legal">
                <div className="contenedor">
                    <p>© 2026 SABITECH · Web desarrollada por PGD Technologies S.L.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
