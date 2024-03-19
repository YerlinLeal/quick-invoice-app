import "../assets/css/components/Footer.css"

const Footer = (props) => {
    return <>
        {props.user &&
            <footer style={{ backgroundImage: "url(/img/footer.jpg)" }}>
                <div className="container footer">
                    <img className="img-logo" src='/img/Logo.png' alt='Quick Invoice' />
                    <strong>Prueba técnica - Logical Data</strong>
                    <strong>Desarrollado por Yerlin Leal</strong>
                </div>
            </footer>
        }
    </>
}

export default Footer