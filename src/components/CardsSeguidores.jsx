import api from '../service/api';
import '../styles/CardSeguidores.css';
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
function CardSeguidores() {
  const navigate = useNavigate()
  const location = useLocation()
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
              <p className='status-p'>{dados.messageStatus}</p>
            </div>
          )}

          <div
            onClick={() => {
              const currentEntry = {
                path: location.pathname,
                state: location.state ?? null
              };
              const incomingBackStack = location.state?.backStack ?? [];
              const lastEntry = incomingBackStack[incomingBackStack.length - 1];
              const nextBackStack =
                lastEntry?.path === currentEntry.path
                  ? incomingBackStack
                  : [...incomingBackStack, currentEntry];

              navigate(`/profile/${dados.userId}/${dados.UserName}`, {
                state: { backStack: nextBackStack }
              });
            }}
            className="img-container"
          >
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
