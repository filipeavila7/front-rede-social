import { Outlet } from "react-router-dom";
import Header from "./Header";
import GlobalNotifications from "./GlobalNotifications";

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
         <GlobalNotifications />
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
