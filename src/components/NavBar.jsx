import "../styles/NavBar.css";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

function NavBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <nav className="navBar">
      <img className="logo-nav" src="" alt="" />
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
                  Novo
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
          <li className="cog">
            <NavLink to="/config" className={({ isActive }) => (isActive ? "active" : "")}>
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/cogA.png" : "/cog.png"} alt="" />
                  Configuração
                </>
              )}
            </NavLink>
          </li>

          <button className="btn-sair" type="button" onClick={() => setShowLogoutModal(true)}>
            <img className="sair-icon" src="/sair.png" alt="" />
            Sair
          </button>
        </ul>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        message="Tem certeza que deseja sair da conta?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default NavBar;
