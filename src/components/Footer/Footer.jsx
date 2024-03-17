import "./Footer.css"

const Footer = () => {
    return <footer className='footer' style={{ backgroundImage: "url(/img/footer.jpg)" }}>
        <img className="img-logo" src='/img/Logo.png' alt='Quick Invoice' />
        <strong>Prueba técnica - Logical Data</strong>
        <strong>Desarrollado por Yerlin Leal</strong>
    </footer>
}

export default Footer