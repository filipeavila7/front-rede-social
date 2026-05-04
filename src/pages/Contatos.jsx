import StatusCard from "../components/StatusCards";
import ContatoCard from "../components/ContatoCard";
import '../styles/Contatos.css'
import SearchUsers from "../components/SearchUsers";


function Contatos() {
  return (
    <main className="conteudo-contato">
      <SearchUsers/>
      <StatusCard />

      <section className="contatos-section">
        <div className="contatos-section-top">
          <p className="contatos-section-label">Mensagens</p>
          <h2 className="contatos-section-title">Suas conversas</h2>
        </div>

        <ContatoCard />
      </section>
    </main>
  );
}

export default Contatos;
