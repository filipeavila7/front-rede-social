import { useState, useEffect } from "react"
import api from "../service/api"
import '../styles/ContatosNav.css'
import { useNavigate, useParams } from 'react-router-dom'

function ContatoNav() {
    const [contatos, setContatos] = useState([])
    const navigate = useNavigate();
    const { conversationId } = useParams();
    
    async function getContatos() {
        try {
            const res = await api.get('/conversations/me')
            setContatos(res.data)
            console.log(res.data)
        } catch (error) {
            console.error("Erro ao buscar contatos:", error)
        }
    }

    useEffect(() => {
        getContatos()
    }, [])

    return (
        <div className="contatos-nav">
            <div className="voltar-container">
                <img className="voltar-icon" src="/voltar.png" alt=""  onClick={() => navigate("/contatos")} />
            </div>
            {contatos.map((dados) => (
                <div
                    className={`contato-user-nav ${String(conversationId) === String(dados.conversationId) ? "active" : ""}`}
                    key={dados.conversationId}
                    onClick={() => navigate(`/contatos/${dados.conversationId}`)}
                >
                    <img className="img-contato-nav" src={dados.otherUserPhoto} alt=""  />
                    <p className="nome-contato-nav">{dados.otherUserName}</p>
                </div>
            ))}
            
        </div>
    )
}

export default ContatoNav
