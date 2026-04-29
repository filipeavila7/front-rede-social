import MeuPerfil from "../components/MeuPerfil";
import MeusPosts from "../components/meusPosts";
import '../styles/Perfil.css'

function Perfil() {
  return (
    <main className="perfil-layout">
      <MeuPerfil/>
      <MeusPosts/>
      
    </main>
  );
}

export default Perfil;
