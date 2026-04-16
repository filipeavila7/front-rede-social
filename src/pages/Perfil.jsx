import MeuPerfil from "../components/MeuPerfil";
import MeusPosts from "../components/meusPosts";
import '../styles/Perfil.css'

function Perfil() {
  return (
    <main className="perfil-layout">
      <MeuPerfil/>
      <div className="meus-posts-container">
        <MeusPosts/>
      </div>
    </main>
  );
}

export default Perfil;
