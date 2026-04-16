import "../styles/Messages.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../service/api";

function CardsMessages() {
  const [messages, setMessages] = useState([]);
  const [meId, setMeId] = useState(null);
  const [headerName, setHeaderName] = useState("");
  const [headerPhoto, setHeaderPhoto] = useState("");
  const { conversationId } = useParams();
  const [receiverId, setReceiverId] = useState(null)
  const inputMessage = useRef()
  const allRef = useRef(null)
  const firstLoadRef = useRef(true)
  async function getMessages() {
    try {
      const res = await api.get(`/messages/conversation/${conversationId}`);
      setMessages(res.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMe() {
    try {
      const res = await api.get("/users/me");
      setMeId(res.data?.id ?? null);
    } catch (error) {
      console.log(error);
    }
  }

  async function getConversationHeader() {
    try {
      const res = await api.get("/conversations/me"); // faz o get nos contatos
      const convo = res.data?.find(
        (c) => c.conversationId === Number(conversationId) // procura o id do contato que tem o msm da url
      );
      setReceiverId(convo.otherUserId)
      setHeaderName(convo?.otherUserName || ""); // pega o nome
      setHeaderPhoto(convo?.otherUserPhoto || ""); // pega a foto
    } catch (error) {
      console.log(error);
    }
  }

  async function postMessage(e) {
    e.preventDefault()

    try {
      await api.post(`/messages/${receiverId}`, { 
        content : inputMessage.current.value
        
      })
      inputMessage.current.value = "";
      getMessages()
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (!conversationId) return;

    getMessages();
    getMe();
    getConversationHeader();
    firstLoadRef.current = true;

    const interval = setInterval(() => {
      getMessages();
    }, 1000); // a cada 1s

    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    if (!firstLoadRef.current) return;
    if (messages.length === 0) return;
    const el = allRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      firstLoadRef.current = false;
    });
  }, [messages]);


  return (
    <div ref={allRef} className="all">
      <div className="chat-header">
        <img className="chat-photo" src={headerPhoto || "/null.png"} alt="" />
        <div className="chat-name">{headerName}</div>
        <img className="config-icon" src="/dots.png" alt="" />
      </div>

      <div className="message-list">
        {messages.map((dados) => {
          const isMine = dados.senderId === meId;
          const time = dados.createdAt
            ? new Date(dados.createdAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div key={dados.id} className={isMine ? "msg-right" : "msg-left"}>
              <div className={isMine ? "conteudo-right" : "conteudo-left"}>
                <p>{dados.content}</p>
                <p className={isMine ? "horas-right" : "horas-left"}>
                  {time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="input-msg-container">
        <form onSubmit={postMessage} className="msg-form" action="">
          <textarea  placeholder="Mensagem" className="input-msg" type="text" ref={inputMessage} />
          <button className="btn-msg" type="submit">
            <img className="btn-icon" src="/send.png" alt="" />
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default CardsMessages;
