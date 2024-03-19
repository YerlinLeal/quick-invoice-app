import "../assets/css/components/Footer.css"
import logo_transparent from '../assets/img/logo_transparent.png';

const Footer = (props) => {
    return <>
        {props.user &&
            <footer style={{ backgroundImage: "url(/img/footer.jpg)" }}>
                <div className="container footer">
                    <img className="img-logo" src={logo_transparent} alt="Quick Invoice"/>
                    <strong>Prueba técnica - Logical Data</strong>
                    <strong>Desarrollado por Yerlin Leal</strong>
                </div>
            </footer>
        }
    </>
}

export default Footer