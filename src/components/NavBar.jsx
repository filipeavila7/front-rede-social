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
                <img src={isActive ? "/feedActive.png" : "/feed.png"} alt="" />
                Feed
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/contatos" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/contatoActive.png" : "/contato.png"} alt="" />
                Contatos
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/postActive.png" : "/post.png"} alt="" />
                Posts
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            {({ isActive }) => (
              <>
                <img src={isActive ? "/userActive.png" : "/user.png"} alt="" />
                Perfil
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
