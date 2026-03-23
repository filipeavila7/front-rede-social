import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
