import { useState, useEffect } from "react";
import api from "../service/api";
import "../styles/ContatosNav.css";
import { useNavigate, useParams } from "react-router-dom";

function ContatoNav() {
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

    return (
        <div className="contatos-nav">
            <div className="voltar-container">
                <button className="voltar-button" type="button" onClick={() => navigate("/contatos")}>
                    <img className="voltar-icon" src="/voltar.png" alt="Voltar para contatos" />
                </button>

                <div className="contatos-nav-top">
                    <p className="contatos-nav-label">Conversas</p>
                    <h2 className="contatos-nav-title">Inbox</h2>
                </div>
            </div>

            {contatos.map((dados) => (
                <div
                    className={`contato-user-nav ${String(conversationId) === String(dados.conversationId) ? "active" : ""}`}
                    key={dados.conversationId}
                    onClick={() => navigate(`/contatos/${dados.conversationId}`)}
                >
                    <img className="img-contato-nav" src={dados.otherUserPhoto || "/null.png"} alt={dados.otherUserName} />

                    <div className="contato-user-nav-info">
                        <p className="nome-contato-nav">{dados.otherUserName}</p>
                        <span className="contato-user-nav-text">
                            {dados.lastMessage?.trim() || "Toque para abrir a conversa"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContatoNav;
