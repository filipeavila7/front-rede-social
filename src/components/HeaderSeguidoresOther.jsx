import { NavLink } from "react-router-dom";
import '../styles/Perfil.css'
import { useNavigate, useParams } from "react-router-dom";

function HeaderSeguidoresOther() {
    const navigate = useNavigate()
    const {id, userName} = useParams()

    return (
        <section className="header-seguidores">
            <div className="header-seguidores-top">
                <div className="voltar-container-seguidor">
                    <button onClick={() => navigate(`/profile/${id}/${userName}`)} className="voltar-button" type="button">
                        <img className="voltar-icon" src="/voltar.png" alt="Voltar para contatos" />
                    </button>
                    <h2 className="header-seguidores-title">Conexões</h2>
                </div>


            </div>

            <nav className="navBar-seguidores">
                <ul className="navLinks-seguidores">
                    <li>
                        <NavLink to={`/profile/${id}/${userName}/followers`} className={({ isActive }) => (isActive ? "active" : "")}>
                            Seguidores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/profile/${id}/${userName}/follows`} className={({ isActive }) => (isActive ? "active" : "")}>
                            Seguindo
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default HeaderSeguidoresOther
