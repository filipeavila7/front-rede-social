import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AuthExpiredHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleAuthExpired(event) {
      const message =
        event.detail?.message || "Sua sessao expirou. Faca login novamente.";

      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: { sessionMessage: message },
        });
      }
    }

    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [location.pathname, navigate]);

  return null;
}

export default AuthExpiredHandler;
