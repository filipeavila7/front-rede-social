import "../styles/ContatoCard.css";
import api from "../service/api";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function ContatoCard() {
    const [contatos, setContatos] = useState([]);
    const [unreadMap, setUnreadMap] = useState({});

    const navigate = useNavigate();
    const { conversationId } = useParams();

    const stompRef = useRef(null);
    const myIdRef = useRef(null);

    async function getMe() {
        const res = await api.get("/users/me");
        myIdRef.current = res.data?.id;
    }

    async function getContatos() {
        try {
            const res = await api.get("/conversations/me");
            setContatos(res.data || []);
        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
        }
    }

    async function getUnread() {
        try {
            const res = await api.get("/messages/conversations/unread");

            const map = {};
            res.data.forEach((item) => {
                map[item.conversationId] = item.unreadCount;
            });

            setUnreadMap(map);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!conversationId) return;

        setUnreadMap((prev) => ({
            ...prev,
            [conversationId]: 0
        }));
    }, [conversationId]);

    useEffect(() => {
        getContatos();
        getUnread();
    }, []);

    useEffect(() => {
        let client;

        async function connect() {
            await getMe();

            const socket = new SockJS("https://rede-social-java-production.up.railway.app/ws");
            //const socket = new SockJS("http://localhost:8080/ws");
            client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,

                onConnect: () => {
                    client.subscribe(
                        `/topic/conversations/${myIdRef.current}`,
                        (msg) => {
                            const data = JSON.parse(msg.body);

                            setContatos((prev) => {
                                const updated = prev.map((c) =>
                                    c.conversationId === data.conversationId
                                        ? {
                                              ...c,
                                              lastMessage: data.lastMessage,
                                              lastMessageAt: data.lastMessageAt
                                          }
                                        : c
                                );

                                return [...updated].sort(
                                    (a, b) =>
                                        new Date(b.lastMessageAt || 0) -
                                        new Date(a.lastMessageAt || 0)
                                );
                            });

                            getUnread();
                        }
                    );

                    client.subscribe(
                        `/topic/notifications/${myIdRef.current}`,
                        (msg) => {
                            const data = JSON.parse(msg.body);

                            if (data.type === "READ") {
                                setUnreadMap((prev) => ({
                                    ...prev,
                                    [data.conversationId]: 0
                                }));
                            }
                        }
                    );
                }
            });

            client.activate();
            stompRef.current = client;
        }

        connect();

        return () => {
            if (stompRef.current) {
                stompRef.current.deactivate();
                stompRef.current = null;
            }
        };
    }, []);

    const formatTime = (date) => {
        if (!date) return "--:--";

        return new Date(date).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const contatosVisiveis = contatos.filter(
        (c) => c.lastMessage && c.lastMessage.trim() !== ""
    );

    return (
        <div className="contato-card-list">
            {contatosVisiveis.map((dados) => (
                <article
                    key={`contatos-${dados.conversationId}`}
                    onClick={() =>
                        navigate(`/contatos/${dados.conversationId}`)
                    }
                    className={`contato-card ${
                        Number(conversationId) ===
                        Number(dados.conversationId)
                            ? "active"
                            : ""
                    }`}
                >
                    <div className="img-contato-container">
                        <div className="badge-div">
                        {unreadMap[dados.conversationId] > 0 && (
                            
                                <span className="badge-unread">
                                    {unreadMap[dados.conversationId]}
                                </span>
                                
                            )}
                            </div>
                        <img
                            className="img-contato"
                            src={dados.otherUserPhoto || "/null.png"}
                            alt={dados.otherUserName}
                        />
                    </div>

                    <div className="contato-info">
                        <div className="contato-nome">
                            <p className="contato-nome-text">
                                {dados.otherUserName}
                            </p>
                            <p className="ultima-msg">
                                {dados.lastMessage}
                            </p>
                        </div>

                        <div className="hora-msg">
                            <p className="hora-principal">
                                {formatTime(dados.lastMessageAt)}
                            </p>

                            <p className="hora-secundaria">
                                {formatDate(dados.lastMessageAt)}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default ContatoCard;
