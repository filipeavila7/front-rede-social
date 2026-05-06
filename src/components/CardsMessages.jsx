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
    const [receiverId, setReceiverId] = useState(null);

    const { conversationId } = useParams();

    const inputMessage = useRef();
    const allRef = useRef(null);
    const firstLoadRef = useRef(true);
    const stompClientRef = useRef(null);
    const currentConversationRef = useRef(null);

    useEffect(() => {
        currentConversationRef.current = Number(conversationId);
    }, [conversationId]);

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

    async function getMessages() {
        try {
            const res = await api.get(`/messages/conversation/${conversationId}`);

            const msgs = (res.data || []).map((msg) => ({
                ...msg,
                status: "sent"
            }));

            setMessages(msgs);
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
            conversationId: Number(conversationId),
            senderId: meId,
            content,
            createdAt: new Date().toISOString(),
            status: "sending",
            readAt: null
        };

        setMessages((prev) => [...prev, tempMessage]);
        inputMessage.current.value = "";

        requestAnimationFrame(() => {
            if (allRef.current) {
                allRef.current.scrollTop = allRef.current.scrollHeight;
            }
        });

        try {
            const res = await api.post(`/messages/${receiverId}`, { content });

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

    // CARREGA CONVERSA AO TROCAR DE CHAT
    useEffect(() => {
        if (!conversationId) return;

        async function loadConversation() {
            await getConversationHeader();
            await getMessages();
            firstLoadRef.current = true;
        }

        loadConversation();
    }, [conversationId]);

    // CONECTA WEBSOCKET UMA ÚNICA VEZ
    useEffect(() => {
        async function connectSocket() {
            const myId = await getMe();
            if (!myId) return;

            const socket = new SockJS("http://localhost:8080/ws");

            const stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,

                onConnect: () => {

                    // RECEBER NOVAS MENSAGENS
                    stompClient.subscribe(`/topic/messages/${myId}`, (message) => {
                        const novaMensagem = JSON.parse(message.body);

                        if (onMessageSent) onMessageSent();

                        setMessages((prev) => {
                            const jaExiste = prev.some((m) => m.id === novaMensagem.id);
                            if (jaExiste) return prev;

                            if (
                                Number(novaMensagem.conversationId) !==
                                currentConversationRef.current
                            ) {
                                return prev;
                            }

                            requestAnimationFrame(() => {
                                if (allRef.current) {
                                    allRef.current.scrollTop = allRef.current.scrollHeight;
                                }
                            });

                            return [
                                ...prev,
                                {
                                    ...novaMensagem,
                                    status: "sent"
                                }
                            ];
                        });
                    });

                    // RECEBER EVENTO DE LEITURA
                    stompClient.subscribe(`/topic/read-status/${myId}`, (message) => {
                        const readEvent = JSON.parse(message.body);

                        setMessages((prev) =>
                            prev.map((msg) =>
                                readEvent.messageIds.includes(msg.id)
                                    ? { ...msg, readAt: new Date().toISOString() }
                                    : msg
                            )
                        );
                    });
                },

                onStompError: (frame) => {
                    console.log("Erro STOMP:", frame);
                }
            });

            stompClient.activate();
            stompClientRef.current = stompClient;
        }

        connectSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    // SCROLL AUTOMÁTICO PRIMEIRA CARGA
    useEffect(() => {
        if (!firstLoadRef.current) return;
        if (messages.length === 0) return;

        requestAnimationFrame(() => {
            if (allRef.current) {
                allRef.current.scrollTop = allRef.current.scrollHeight;
                firstLoadRef.current = false;
            }
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
                            <div className={isMine ? "conteudo-right" : "conteudo-left"}>
                                <p>{dados.content}</p>

                                <div className={isMine ? "horas-right" : "horas-left"}>
                                    <span>{time}</span>

                                    {isMine && (
                                        <div className="send-indicator">
                                            {dados.status === "sending" && <span className="loading-dot"></span>}
                                            {dados.status === "error" && <span className="send-error">!</span>}
                                            {dados.status !== "sending" && dados.status !== "error" && !dados.readAt && (
                                                <span className="send-ok">✓✓</span>
                                            )}
                                            {dados.status !== "sending" && dados.status !== "error" && dados.readAt && (
                                                <span className="send-read">✓✓</span>
                                            )}
                                        </div>
                                    )}
                                </div>
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