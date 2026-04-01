import '../styles/ContatoCard.css'
import api from '../service/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function ContatoCard() {
    const [contatos, setContatos] = useState([])
    const navigate = useNavigate();

    async function getContatos() {
        try {
            const res = await api.get('/conversations/me')
            setContatos(res.data)
            console.log(res.data)
            
        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
        }



    }

    useEffect(() => {
        getContatos()


    }, [])


    return (
        <>
            {
                contatos.map((dados) => (
                    <div key={`contatos-${dados.conversationId}`} onClick={() => navigate(`/contatos/${dados.conversationId}`)} className="contato-card"> 
                        <div className="img-contato-container">
                            <img className='img-contato' src={dados.otherUserPhoto} alt="" />

                        </div>
                        <div className="contato-nome">
                            <p>{dados.otherUserName}</p>
                            <p className='ultima-msg'>{dados.lastMessage} </p>
                        </div>
                        <div className="hora-msg">
                            <p> {
                                new Date(dados.lastMessageAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit"

                                })} </p>
                            <p> {
                                new Date(dados.lastMessageAt).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })} </p>


                        </div>
                    </div>
                ))
            }

        </>

    )


}

export default ContatoCard