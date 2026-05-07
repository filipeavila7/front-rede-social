import { useState, useEffect, useRef, useCallback } from "react";
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
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const notificationSubRef = useRef(null);

    const firstLoadRef = useRef(true);
    const meIdRef = useRef(null);
    const receiverIdRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (allRef.current) {
                allRef.current.scrollTop = allRef.current.scrollHeight;
            }
        });
    }, []);

    async function getMe() {
        try {
            const res = await api.get("/users/me");
            const id = res.data?.id ?? null;
            setMeId(id);
            meIdRef.current = id;
            return id;
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

            const otherId = convo?.otherUserId ?? null;

            setReceiverId(otherId);
            receiverIdRef.current = otherId;

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

    const markAsRead = useCallback(async () => {
        try {
            await api.post(`/messages/conversation/${conversationId}/read`);
        } catch (error) {
            console.log(error);
        }
    }, [conversationId]);

    async function postMessage(e) {
        e.preventDefault();

        const content = inputMessage.current.value.trim();
        if (!content || !receiverIdRef.current) return;

        const tempId = "temp_" + Date.now();

        const tempMessage = {
            id: tempId,
            conversationId: Number(conversationId),
            senderId: meIdRef.current,
            content,
            createdAt: new Date().toISOString(),
            status: "sending",
            readAt: null
        };

        setMessages((prev) => [...prev, tempMessage]);

        inputMessage.current.value = "";
        scrollToBottom();

        try {
            const res = await api.post(
                `/messages/${receiverIdRef.current}`,
                { content }
            );

            if (onMessageSent) onMessageSent();

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

    // =========================
    // LOAD CONVERSATION
    // =========================
    useEffect(() => {
        if (!conversationId) return;

        async function load() {
            firstLoadRef.current = true;

            await getConversationHeader();
            await getMessages();
            await markAsRead();
        }

        load();
    }, [conversationId]);

    // =========================
    // WEBSOCKET
    // =========================
    useEffect(() => {
        if (!conversationId) return;

        let stompClient;

        async function connect() {
            const myId = await getMe();
            if (!myId) return;

            const socket = new SockJS("http://localhost:8080/ws");

            stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,

                onConnect: () => {

                    // limpa subs antigas
                    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
                    if (notificationSubRef.current) notificationSubRef.current.unsubscribe();

                    // =========================
                    // MENSAGENS CHAT
                    // =========================
                    subscriptionRef.current = stompClient.subscribe(
                        `/topic/messages/conversation/${conversationId}`,
                        (message) => {
                            const nova = JSON.parse(message.body);

                            setMessages((prev) => {
                                if (nova.senderId === meIdRef.current) return prev;

                                const exists = prev.some((m) => m.id === nova.id);
                                if (exists) return prev;

                                return [...prev, { ...nova, status: "sent" }];
                            });

                            markAsRead();
                            scrollToBottom();

                            if (onMessageSent) onMessageSent();
                        }
                    );

                    // =========================
                    // NOTIFICAÇÕES (READ + MESSAGE + LIKE etc)
                    // =========================
                    notificationSubRef.current = stompClient.subscribe(
                        `/topic/notifications/${myId}`,
                        (message) => {
                            const event = JSON.parse(message.body);

                            // READ EVENT
                            if (event.type === "READ") {
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.conversationId === event.conversationId
                                            ? { ...msg, readAt: new Date().toISOString() }
                                            : msg
                                    )
                                );
                            }
                        }
                    );
                }
            });

            stompClient.activate();
            stompClientRef.current = stompClient;
        }

        connect();

        return () => {
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
            if (notificationSubRef.current) notificationSubRef.current.unsubscribe();
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [conversationId]);

    // =========================
    // AUTO SCROLL PRIMEIRA VEZ
    // =========================
    useEffect(() => {
        if (!firstLoadRef.current || messages.length === 0) return;

        scrollToBottom();
        firstLoadRef.current = false;
    }, [messages]);

    return (
        <div ref={allRef} className="all">

            <div className="chat-header">
                <img
                    className="chat-photo"
                    src={headerPhoto || "/null.png"}
                />

                <div className="chat-header-info">
                    <div className="chat-name">{headerName}</div>
                    <p className="chat-subtitle">Conversa ativa</p>
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
                        <div
                            key={dados.id}
                            className={isMine ? "msg-right" : "msg-left"}
                        >
                            <div className={isMine ? "conteudo-right" : "conteudo-left"}>

                                <p>{dados.content}</p>

                                <div className={isMine ? "horas-right" : "horas-left"}>
                                    <span className="hora-cor">{time}</span>

                                    {isMine && (
                                        <div className="send-indicator">
                                            {dados.status === "sending" && (
                                                <span className="loading-dot"></span>
                                            )}

                                            {dados.status === "error" && (
                                                <span className="send-error">!</span>
                                            )}

                                            {dados.status !== "sending" &&
                                                dados.status !== "error" &&
                                                !dados.readAt && (
                                                    <span className="send-ok">✓✓</span>
                                                )}

                                            {dados.status !== "sending" &&
                                                dados.status !== "error" &&
                                                dados.readAt && (
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
                    <img className="btn-icon" src="/plane.png" />
                </button>
            </div>

        </div>
    );
}

export default CardsMessages;