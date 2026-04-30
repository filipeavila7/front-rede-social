import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearSession,
  getTokenExpirationTime,
  storeSessionExpiredMessage,
} from "../utils/session";

function AuthExpiredHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let expirationTimeoutId;

    function redirectToLogin(message) {
      clearSession();
      storeSessionExpiredMessage(message);

      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: { sessionMessage: message },
        });
      }
    }

    function handleAuthExpired(event) {
      const message =
        event.detail?.message || "Sua sessao expirou. Faca login novamente.";

      redirectToLogin(message);
    }

    const token = localStorage.getItem("token");
    const expirationTime = token ? getTokenExpirationTime(token) : null;

    if (token && expirationTime) {
      const timeoutMs = expirationTime - Date.now();

      if (timeoutMs <= 0) {
        redirectToLogin("Sua sessao expirou. Faca login novamente.");
      } else {
        expirationTimeoutId = window.setTimeout(() => {
          redirectToLogin("Sua sessao expirou. Faca login novamente.");
        }, timeoutMs);
      }
    }

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      if (expirationTimeoutId) {
        window.clearTimeout(expirationTimeoutId);
      }

      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [location.pathname, navigate]);

  return null;
}

export default AuthExpiredHandler;
