import { Navigate, Outlet } from "react-router-dom";

function PublicOnly() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
}

export default PublicOnly;
