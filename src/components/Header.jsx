import "../assets/css/components/Header.css"
import { userStorage } from '../utils/userStorage';
import { useState } from "react";
import { NavLink } from "react-router-dom";

function logout() {
    userStorage.logout();
}

function Header(props) {
    const [showNavbar, setShowNavbar] = useState(false);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const Hamburger = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="52"
            height="24"
            viewBox="0 0 52 24"
        >
        <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
        <rect
            id="Rectangle_3"
            data-name="Rectangle 3"
            width="42"
            height="4"
            rx="2"
            transform="translate(304 47)"
            fill="#574c4c"
        />
        <rect
            id="Rectangle_5"
            data-name="Rectangle 5"
            width="42"
            height="4"
            rx="2"
            transform="translate(304 67)"
            fill="#574c4c"
        />
        <rect
            id="Rectangle_4"
            data-name="Rectangle 4"
            width="52"
            height="4"
            rx="2"
            transform="translate(294 57)"
            fill="#574c4c"
        />
        </g>
    </svg>
    );

    return (
        <>
            <div>
                {props.user &&
                    <nav className="navbar">
                        <div className="container">
                            <div className="logo"></div>
                            <div className="menu-icon" onClick={handleShowNavbar}>
                                <Hamburger />
                            </div>
                            <div className={`nav-elements  ${showNavbar && "active"}`}>
                                <ul>
                                    <li>
                                        <NavLink to="/">Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/product">Producto</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/sale">Compra</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/invoice">Historial de facturas</NavLink>
                                    </li>
                                    <li>
                                        <NavLink onClick={logout}>Cerrar Sesión</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                }
            </div>
        </>
    )
}

export default Header