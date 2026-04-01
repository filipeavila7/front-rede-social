import api from '../service/api';
import '../styles/CardSeguidores.css';
import { useEffect, useState, useMemo } from "react";

function CardSeguidores() {

  const [seguidores, setSeguidres] = useState([]);

  async function getStatusSeguidores() {
    try {
      const seguidoresApi = await api.get('/profiles/following');
      setSeguidres(seguidoresApi.data);
      console.log(seguidoresApi.data)
    } catch (error) {
      console.error("Erro ao buscar seguidores:", error);
    }
  }

  useEffect(() => {
    getStatusSeguidores();
  }, []);

  // Ordenação (quem tem mensagem primeiro)
  const seguidoresOrdenados = useMemo(() => {
    return [...seguidores].sort((a, b) => {
      const aTem = a.messageStatus?.trim() ? 1 : 0;
      const bTem = b.messageStatus?.trim() ? 1 : 0;

      return bTem - aTem;
    });
  }, [seguidores]);

  return (
    <>
      {seguidoresOrdenados.map((dados) => (
        <div key={`status-${dados.userId}`} className="cards-content">
          

          {dados.messageStatus?.trim() && (
            <div className="message-status">
              <p>{dados.messageStatus}</p>
            </div>
          )}

          <div className="img-container">
            <img className='imageCard'
              src={dados.imageUrlProfile ? dados.imageUrlProfile : "/null.png"}
              alt={dados.nome}
            />
          </div>

          <div className="name">
            <p>{dados.nome}</p>
          </div>

        </div>
      ))}
    </>
  );
}

export default CardSeguidores;