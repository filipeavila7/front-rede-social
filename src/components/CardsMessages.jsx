import '../styles/Messages.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../service/api'

function CardsMessages(){
    const [messages, setMessages] = useState([])
    const { conversationId } = useParams(); // usePaeams para pegar id da url
    const [meId, setMeId] = useState(null)

    

    async function getMessages() {
        try {
            const res = await api.get(`/messages/conversation/${conversationId}`); // passar id no get´
            setMessages(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
        
    }

    async function getMe() {
        try {
            const res = await api.get('users/me'); 
            setMeId(res.data.id)
            console.log(res.data.id)
            return meId
        } catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
      
        getMessages()
        getMe()
      
    }, [])
    





    return(
        <>
        {messages.map((dados)=>(
            <div key={dados.id} className='message-container'>
                <div className={dados.senderId === meId ? "msg-right" : "msg-left"}>
                    <div className={dados.senderId === meId ? "conteudo-right" : "conteudo-left"}>
                        <p>{dados.content}</p>
                    </div>
                </div>

            </div>
        ))}
            
        </>
    )
}


export default CardsMessages