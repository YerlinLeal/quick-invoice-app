import image from "../assets/img/header.png"
import "../assets/css/components/Header.css"
import { Link } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Navbar.Brand href="/">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/product">Productos</Nav.Link>
                    <Nav.Link href="/sale">Compra</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header