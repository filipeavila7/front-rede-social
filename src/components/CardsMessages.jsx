import { useState, useEffect, useRef } from "react";
import api from "../service/api";
import "../styles/Messages.css";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function CardsMessages({ onMessageSent }) {
    const [messages, setMessages] = useState([]);
    const [meId, setMeId] = useState(null);
    const [headerName, setHeaderName] = useState("");
    const [headerPhoto, setHeaderPhoto] = useState("");
    const { conversationId } = useParams();
    const [receiverId, setReceiverId] = useState(null);

    const inputMessage = useRef();
    const allRef = useRef(null);
    const firstLoadRef = useRef(true);
    const stompClientRef = useRef(null);

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
            return res.data?.id ?? null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getConversationHeader() {
        try {
            const res = await api.get("/conversations/me");
            const convo = res.data?.find(
                (c) => Number(c.conversationId) === Number(conversationId)
            );

            setReceiverId(convo?.otherUserId ?? null);
            setHeaderName(convo?.otherUserName || "");
            setHeaderPhoto(convo?.otherUserPhoto || "");
        } catch (error) {
            console.log(error);
        }
    }

    async function postMessage(e) {
        e.preventDefault();

        const content = inputMessage.current.value.trim();

        if (!content || !receiverId) return;

        const tempId = "temp_" + Date.now();

        const tempMessage = {
            id: tempId,
            senderId: meId,
            content,
            createdAt: new Date().toISOString(),
            status: "sending"
        };

        setMessages((prev) => [...prev, tempMessage]);
        inputMessage.current.value = "";

        requestAnimationFrame(() => {
            if (allRef.current) {
                allRef.current.scrollTop = allRef.current.scrollHeight;
            }
        });

        try {
            const res = await api.post(`/messages/${receiverId}`, {
                content,
            });

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempId
                        ? { ...res.data, status: "sent" }
                        : msg
                )
            );

        } catch (error) {
            console.log(error);

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempId
                        ? { ...msg, status: "error" }
                        : msg
                )
            );
        }
    }
    useEffect(() => {
        if (!conversationId) return;

        async function initChat() {
            await getMessages();
            const myId = await getMe();
            await getConversationHeader();

            firstLoadRef.current = true;

            if (!myId) return;

            try {
                const socket = new SockJS("http://localhost:8080/ws");

                const stompClient = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,

                    onConnect: () => {
                        stompClient.subscribe(`/topic/messages/${myId}`, (message) => {
                            const novaMensagem = JSON.parse(message.body);

                            setMessages((prev) => {
                                const jaExiste = prev.some((m) => m.id === novaMensagem.id);
                                if (jaExiste) return prev;
                                return [...prev, novaMensagem];
                            });

                            if (onMessageSent) {
                                onMessageSent();
                            }

                            requestAnimationFrame(() => {
                                if (allRef.current) {
                                    allRef.current.scrollTop = allRef.current.scrollHeight;
                                }
                            });
                        });
                    },

                    onStompError: (frame) => {
                        console.log("Erro STOMP:", frame);
                    }
                });

                stompClient.activate();
                stompClientRef.current = stompClient;

            } catch (error) {
                console.log(error);
            }
        }

        initChat();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
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
                <div className="chat-header-info">
                    <div className="chat-name">{headerName}</div>
                    <p className="chat-subtitle">Conversa ativa</p>
                </div>
                <div className="config-icon-container">
                    <img className="config-icon" src="/dots.png" alt="" />
                </div>
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

                            {isMine && (
                                <div className="send-indicator">
                                    {dados.status === "sending" && <span className="loading-dot"></span>}
                                    {dados.status === "sent" && <span className="send-ok">✓</span>}
                                    {dados.status === "error" && <span className="send-error">!</span>}
                                </div>
                            )}

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
                <form onSubmit={postMessage} className="msg-form">
                    <textarea
                        ref={inputMessage}
                        className="input-msg"
                        placeholder="Escreva sua mensagem"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                postMessage(e);
                            }
                        }}
                    />
                </form>

                <button onClick={postMessage} className="btn-msg" type="button">
                    <img className="btn-icon" src="/plane.png" alt="" />
                </button>
            </div>
        </div>
    );
}

export default CardsMessages;