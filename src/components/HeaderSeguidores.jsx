import { NavLink } from "react-router-dom";
import '../styles/Perfil.css'
import { useNavigate } from "react-router-dom";

function HeaderSeguidores() {
    const navigate = useNavigate()
    return (
        <section className="header-seguidores">
            <div className="header-seguidores-top">
                <div className="voltar-container-seguidor">
                    <button onClick={()=> navigate('/perfil')} className="voltar-button" type="button">
                        <img className="voltar-icon" src="/voltar.png" alt="Voltar para contatos" />
                    </button>
                    <h2 className="header-seguidores-title">Conexões</h2>
                </div>


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
