import '../styles/NavBar.css'

import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navBar">
      <ul className="navLinks">
        <li>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? "active" : "")}>
            Feed
          </NavLink>
        </li>
        <li>
          <NavLink to="/contatos" className={({ isActive }) => (isActive ? "active" : "")}>
            Contatos
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
            Posts
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            Perfil
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
