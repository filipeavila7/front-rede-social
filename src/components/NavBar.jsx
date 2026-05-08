import "../styles/NavBar.css";

import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import usePostDraftStore from "../store/postDraftStore";
import { clearSession } from "../utils/session";

function NavBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hasUnsavedChanges = usePostDraftStore((state) => state.hasUnsavedChanges);
  const setHasUnsavedChanges = usePostDraftStore((state) => state.setHasUnsavedChanges);

  function handleLogout() {
    clearSession();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  }

  function handleProtectedNavigation(path, e) {
    if (!hasUnsavedChanges || location.pathname !== "/posts") {
      return;
    }

    e.preventDefault();
    setPendingRoute(path);
    setShowLeaveModal(true);
  }

  function confirmLeavePage() {
    if (!pendingRoute) return;

    setHasUnsavedChanges(false);
    setShowLeaveModal(false);
    navigate(pendingRoute);
    setPendingRoute(null);
  }

  function cancelLeavePage() {
    setShowLeaveModal(false);
    setPendingRoute(null);
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
            <NavLink
              to="/feed"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/feed", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/homeA.png" : "/home.png"} alt="" />
                  Feed
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contatos"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/contatos", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/planeB.png" : "/plane.png"} alt="" />
                  Contatos
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/posts"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/posts", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/moreA.png" : "/more.png"} alt="" />
                  Novo
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/perfil"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/perfil", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/userA.png" : "/user.png"} alt="" />
                  Perfil
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/perfil", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/bellA.png" : "/bell.png"} alt="" />
                  Notificações
                </>
              )}
            </NavLink>
          </li>
          <li className="cog">
            <NavLink
              to="/config"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/config", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/cogA.png" : "/cog.png"} alt="" />
                  Configuração
                </>
              )}
            </NavLink>
          </li>
        </ul>

        <button className="btn-sair" type="button" onClick={() => setShowLogoutModal(true)}>
          <img className="sair-icon" src="/sair.png" alt="" />
          Sair
        </button>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        message="Tem certeza que deseja sair da conta?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        message="Voce tem alteracoes nao salvas. Deseja sair desta pagina?"
        onConfirm={confirmLeavePage}
        onCancel={cancelLeavePage}
      />
    </>
  );
}

export default NavBar;
