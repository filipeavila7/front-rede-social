import "../styles/ContatoCard.css";
import api from "../service/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ContatoCard() {
    const [contatos, setContatos] = useState([]);
    const navigate = useNavigate();
    const { conversationId } = useParams();

    async function getContatos() {
        try {
            const res = await api.get("/conversations/me");
            setContatos(res.data);
        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
        }
    }

    useEffect(() => {
        getContatos();
    }, []);

    const formatTime = (date) => {
        if (!date) return "--:--";

        return new Date(date).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="contato-card-list">
            {contatos.map((dados) => (
                <article
                    key={`contatos-${dados.conversationId}`}
                    onClick={() => navigate(`/contatos/${dados.conversationId}`)}
                    className={`contato-card ${Number(conversationId) === dados.conversationId ? "active" : ""}`}
                >
                    <div className="img-contato-container">
                        <img
                            className="img-contato"
                            src={dados.otherUserPhoto || "/null.png"}
                            alt={dados.otherUserName}
                        />
                    </div>

                    <div className="contato-info">
                        <div className="contato-nome">
                            <p className="contato-nome-text">{dados.otherUserName}</p>
                            <p className="ultima-msg">
                                {dados.lastMessage?.trim() || "Comece essa conversa"}
                            </p>
                        </div>

                        <div className="hora-msg">
                            <p className="hora-principal">{formatTime(dados.lastMessageAt)}</p>
                            <p className="hora-secundaria">{formatDate(dados.lastMessageAt)}</p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default ContatoCard;
