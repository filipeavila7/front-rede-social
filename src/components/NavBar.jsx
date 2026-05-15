import "../styles/NavBar.css";

import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import usePostDraftStore from "../store/postDraftStore";
import { clearSession } from "../utils/session";
import { useFeedStore } from "../store/feedStore";
import { clearPostsListCaches } from "../store/postsListCache";

function NavBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasUnsavedChanges = usePostDraftStore((state) => state.hasUnsavedChanges);
  const setHasUnsavedChanges = usePostDraftStore((state) => state.setHasUnsavedChanges);
  const resetFeed = useFeedStore((state) => state.resetFeed);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    clearPostsListCaches();
    resetFeed();
    clearSession();
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
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
                  <span className="nav-text">Feed</span>
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
                  <span className="nav-text">Contatos</span>
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
                  <span className="nav-text">Novo</span>
                </>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={(e) => handleProtectedNavigation("/notifications", e)}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? "/bellA.png" : "/bell.png"} alt="" />
                  <span className="nav-text">Notificações</span>
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
                  <span className="nav-text">Perfil</span>
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
                  <span className="nav-text">Configuração</span>
                </>
              )}
            </NavLink>
          </li>

          <li className="mobile-menu-trigger">
            <button
              type="button"
              className={`mobile-menu-button ${isMobileMenuOpen ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <img src="/dots.png" alt="" />
            </button>
          </li>
        </ul>

        <button className="btn-sair" type="button" onClick={() => setShowLogoutModal(true)}>
          <img className="sair-icon" src="/sair.png" alt="" />
          Sair
        </button>

        <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/config"
            className={({ isActive }) => `mobile-menu-link ${isActive ? "active" : ""}`}
            onClick={(e) => {
              handleProtectedNavigation("/config", e);
              if (!e.defaultPrevented) {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            {({ isActive }) => (
              <>
                <img src={isActive ? "/cogA.png" : "/cogA.png"} alt="" />
                <span >Configuração</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            className="mobile-menu-link mobile-menu-logout"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowLogoutModal(true);
            }}
          >
            <img src="/sair.png" alt="" />
            <span>Sair</span>
          </button>
        </div>
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
