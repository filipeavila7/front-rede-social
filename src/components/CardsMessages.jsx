import { useState, useEffect, useRef, useCallback } from "react";
import api from "../service/api";
import "../styles/Messages.css";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

const PAGE_SIZE = 20;

function CardsMessages({ onMessageSent }) {
    const [messages, setMessages] = useState([]);
    const [meId, setMeId] = useState(null);
    const [headerName, setHeaderName] = useState("");
    const [headerPhoto, setHeaderPhoto] = useState("");
    const [loadingOlder, setLoadingOlder] = useState(false);

    const { conversationId } = useParams();

    const inputMessage = useRef(null);
    const allRef = useRef(null);
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const notificationSubRef = useRef(null);
    const receiverIdRef = useRef(null);
    const meIdRef = useRef(null);
    const firstLoadRef = useRef(true);
    const isFetchingOlderRef = useRef(false);
    const hasMoreOlderRef = useRef(true);
    const pageRef = useRef(0);
    const pendingScrollRestoreRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (allRef.current) {
                allRef.current.scrollTop = allRef.current.scrollHeight;
            }
        });
    }, []);

    const mergeById = useCallback((list) => {
        const map = new Map();
        list.forEach((item) => {
            map.set(String(item.id), item);
        });
        return Array.from(map.values());
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

    const getConversationHeader = useCallback(async () => {
        try {
            const res = await api.get("/conversations/me");
            const convo = res.data?.find((c) => Number(c.conversationId) === Number(conversationId));

            receiverIdRef.current = convo?.otherUserId ?? null;
            setHeaderName(convo?.otherUserName || "");
            setHeaderPhoto(convo?.otherUserPhoto || "");
        } catch (error) {
            console.log(error);
        }
    }, [conversationId]);

    const markAsRead = useCallback(async () => {
        try {
            await api.post(`/messages/conversation/${conversationId}/read`);
        } catch (error) {
            console.log(error);
        }
    }, [conversationId]);

    const loadMessagesPage = useCallback(async (pageNumber, { prepend } = { prepend: false }) => {
        if (isFetchingOlderRef.current) return;
        if (prepend && !hasMoreOlderRef.current) return;

        isFetchingOlderRef.current = true;
        setLoadingOlder(prepend);

        let prevHeight = 0;
        let prevTop = 0;

        if (prepend && allRef.current) {
            prevHeight = allRef.current.scrollHeight;
            prevTop = allRef.current.scrollTop;
        }

        try {
            const res = await api.get(`/messages/${conversationId}/messages?page=${pageNumber}&size=${PAGE_SIZE}`);
            const chunk = (res.data || []).map((msg) => ({ ...msg, status: "sent" }));

            hasMoreOlderRef.current = chunk.length === PAGE_SIZE;
            pageRef.current = pageNumber;

            setMessages((prev) => {
                if (!prepend) return mergeById(chunk);
                return mergeById([...chunk, ...prev]);
            });

            if (prepend && allRef.current) {
                pendingScrollRestoreRef.current = { prevHeight, prevTop };
            }
        } catch (error) {
            console.log(error);
        } finally {
            isFetchingOlderRef.current = false;
            setLoadingOlder(false);
        }
    }, [conversationId, mergeById]);

    async function loadOlderMessages() {
        if (isFetchingOlderRef.current || !hasMoreOlderRef.current) return;
        await loadMessagesPage(pageRef.current + 1, { prepend: true });
    }

    async function postMessage(e) {
        e.preventDefault();

        const content = inputMessage.current?.value?.trim();
        if (!content || !receiverIdRef.current) return;

        const tempId = `temp_${Date.now()}`;
        const tempMessage = {
            id: tempId,
            conversationId: Number(conversationId),
            senderId: meIdRef.current,
            content,
            createdAt: new Date().toISOString(),
            status: "sending",
            readAt: null,
        };

        setMessages((prev) => [...prev, tempMessage]);
        inputMessage.current.value = "";
        scrollToBottom();

        try {
            const res = await api.post(`/messages/${receiverIdRef.current}`, { content });
            if (onMessageSent) onMessageSent();

            setMessages((prev) =>
                prev.map((msg) => (msg.id === tempId ? { ...res.data, status: "sent" } : msg))
            );
        } catch (error) {
            console.log(error);
            setMessages((prev) =>
                prev.map((msg) => (msg.id === tempId ? { ...msg, status: "error" } : msg))
            );
        }
    }

    useEffect(() => {
        if (!conversationId) return;

        let mounted = true;

        async function loadConversation() {
            firstLoadRef.current = true;
            pageRef.current = 0;
            hasMoreOlderRef.current = true;
            isFetchingOlderRef.current = false;
            setMessages([]);

            await getConversationHeader();
            await loadMessagesPage(0, { prepend: false });
            await markAsRead();

            if (mounted) {
                scrollToBottom();
                firstLoadRef.current = false;
            }
        }

        loadConversation();

        return () => {
            mounted = false;
        };
    }, [conversationId, getConversationHeader, loadMessagesPage, markAsRead, scrollToBottom]);

    useEffect(() => {
        if (!conversationId) return;

        let stompClient;

        async function connect() {
            const myId = await getMe();
            if (!myId) return;

            const socket = new SockJS("https://rede-social-java-production.up.railway.app/ws");
            stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                onConnect: () => {
                    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
                    if (notificationSubRef.current) notificationSubRef.current.unsubscribe();

                    subscriptionRef.current = stompClient.subscribe(
                        `/topic/messages/conversation/${conversationId}`,
                        (message) => {
                            const incoming = JSON.parse(message.body);

                            setMessages((prev) => {
                                if (incoming.senderId === meIdRef.current) return prev;
                                if (prev.some((m) => String(m.id) === String(incoming.id))) return prev;
                                return [...prev, { ...incoming, status: "sent" }];
                            });

                            markAsRead();
                            scrollToBottom();
                            if (onMessageSent) onMessageSent();
                        }
                    );

                    notificationSubRef.current = stompClient.subscribe(
                        `/topic/notifications/${myId}`,
                        (message) => {
                            const event = JSON.parse(message.body);
                            if (event.type !== "READ") return;

                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.conversationId === event.conversationId
                                        ? { ...msg, readAt: new Date().toISOString() }
                                        : msg
                                )
                            );
                        }
                    );
                },
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
    }, [conversationId, markAsRead, onMessageSent, scrollToBottom]);

    useEffect(() => {
        const restore = pendingScrollRestoreRef.current;
        if (!restore || !allRef.current) return;

        requestAnimationFrame(() => {
            if (!allRef.current) return;
            const nextHeight = allRef.current.scrollHeight;
            allRef.current.scrollTop = restore.prevTop + (nextHeight - restore.prevHeight);
            pendingScrollRestoreRef.current = null;
        });
    }, [messages]);

    function handleScroll() {
        if (!allRef.current) return;
        if (allRef.current.scrollTop > 80) return;
        loadOlderMessages();
    }

    return (
        <div ref={allRef} className="all" onScroll={handleScroll}>
            <div className="chat-header">
                <img className="chat-photo" src={headerPhoto || "/null.png"} />

                <div className="chat-header-info">
                    <div className="chat-name">{headerName}</div>
                    <p className="chat-subtitle">Conversa ativa</p>
                </div>
            </div>

            <div className="message-list">
                {loadingOlder && (
                    <div className="loading-more">
                        <span className="loading-dot-inline" />
                    </div>
                )}

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
                                    <span className="hora-cor">{time}</span>

                                    {isMine && (
                                        <div className="send-indicator">
                                            {dados.status === "sending" && <span className="loading-dot" />}
                                            {dados.status === "error" && <span className="send-error">!</span>}
                                            {dados.status !== "sending" &&
                                                dados.status !== "error" &&
                                                !dados.readAt && <span className="send-ok">✓✓</span>}
                                            {dados.status !== "sending" &&
                                                dados.status !== "error" &&
                                                dados.readAt && <span className="send-read">✓✓</span>}
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
