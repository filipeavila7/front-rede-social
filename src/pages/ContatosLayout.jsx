import { Outlet } from "react-router-dom";
import ContatoNav from "../components/ContatosNav";
import "../styles/Contatos.css";

function ContatosLayout() {
  return (
    <div className="contatos-layout">
      <ContatoNav />
      <div className="contatos-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ContatosLayout;
