import '../styles/NavBar.css'

import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navBar">
      <ul className="navLinks">
        <li>
          <p>Menu</p>
        </li>
        <li>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/homeA.png" : "/home.png"} alt="" />
                Feed
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/contatos" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/planeB.png" : "/plane.png"} alt="" />
                Contatos
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/moreA.png" : "/more.png"} alt="" />
                Posts
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/userA.png" : "/user.png"} alt="" />
                Perfil
              </>
            )}
          </NavLink>
        </li>
        <li className='cog'>
          <NavLink to="/config" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/cogA.png" : "/cog.png"} alt="" />
                Configuração
              </>
            )}
          </NavLink>
        </li>
        
        <button className='btn-sair'>
          <img className='sair-icon' src='/sair.png'/>
          Sair
        </button>
      </ul>
    </nav>
  );
}

export default NavBar;
