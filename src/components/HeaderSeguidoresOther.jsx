import { NavLink } from "react-router-dom";
import '../styles/Perfil.css'
import { useLocation, useNavigate, useParams } from "react-router-dom";

function HeaderSeguidoresOther() {
    const navigate = useNavigate()
    const location = useLocation()
    const {id, userName} = useParams()
    const profilePath = location.state?.profilePath ?? `/profile/${id}/${userName}`

    return (
        <section className="header-seguidores">
            <div className="header-seguidores-top">
                <div className="voltar-container-seguidor">
                    <button
                        onClick={() => navigate(profilePath, {
                            state: { backStack: location.state?.backStack ?? [] }
                        })}
                        className="voltar-button"
                        type="button"
                    >
                        <img className="voltar-icon" src="/voltar.png" alt="Voltar para contatos" />
                    </button>
                    <h2 className="header-seguidores-title">Conexões</h2>
                </div>


            </div>

            <nav className="navBar-seguidores">
                <ul className="navLinks-seguidores">
                    <li>
                        <NavLink
                            to={`/profile/${id}/${userName}/followers`}
                            state={location.state}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Seguidores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/profile/${id}/${userName}/follows`}
                            state={location.state}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Seguindo
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default HeaderSeguidoresOther
