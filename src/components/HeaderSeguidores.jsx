import { NavLink } from "react-router-dom";
import '../styles/Perfil.css'

function HeaderSeguidores() {
    return (
        <section className="header-seguidores">
            <div className="header-seguidores-top">

                <h2 className="header-seguidores-title">Conexões</h2>
            </div>

            <nav className="navBar-seguidores">
                <ul className="navLinks-seguidores">
                    <li>
                        <NavLink to="/perfil/followers" className={({ isActive }) => (isActive ? "active" : "")}>
                            Seguidores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/perfil/follows" className={({ isActive }) => (isActive ? "active" : "")}>
                            Seguindo
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default HeaderSeguidores
