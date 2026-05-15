import { useState, useEffect, useRef } from "react";
import api from "../service/api";
import "../styles/ContatosNav.css";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function ContatoNav({ refreshContacts, isOpen = true, onConversationSelect }) {
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
        getContatos();
        getUnread();
    }, [conversationId, refreshContacts]);

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

    const contatosVisiveis = contatos.filter(
        (dados) => dados.lastMessage && dados.lastMessage.trim() !== ""
    );

    return (
        <aside className={`contatos-nav ${isOpen ? "is-open" : "is-closed"}`}>
            <div className="voltar-container">
                <button
                    className="voltar-button"
                    onClick={() => navigate("/contatos")}
                >
                    <img src="/voltar.png" className="voltar-icon" />
                </button>

                <div className="contatos-nav-top">
                    <p className="contatos-nav-label">Conversas</p>
                    <h2 className="contatos-nav-title">Inbox</h2>
                </div>
            </div>

            <div className="message-nav-lay">
                {contatosVisiveis.map((dados) => (
                    <div
                        key={dados.conversationId}
                        className={`contato-user-nav ${
                            String(conversationId) ===
                            String(dados.conversationId)
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            navigate(`/contatos/${dados.conversationId}`)
                            onConversationSelect?.()
                        }}
                    >
                        <img
                            className="img-contato-nav"
                            src={dados.otherUserPhoto || "/null.png"}
                        />

                        <div className="contato-user-nav-info">
                            <p className="nome-contato-nav">
                                {dados.otherUserName}
                            </p>

                            <span className="contato-user-nav-text">
                                {dados.lastMessage}
                            </span>
                        </div>
                        <div className="badge-div-c">
                        {unreadMap[dados.conversationId] > 0 && (
                            <span className="badge-unread-c">
                                {unreadMap[dados.conversationId]}
                            </span>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default ContatoNav;
