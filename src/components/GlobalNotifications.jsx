import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../service/api";
import "../styles/GlobalNotifications.css";

function GlobalNotifications() {
    const [notifications, setNotifications] = useState([]);
    const stompRef = useRef(null);

    const socketInitializedRef = useRef(false);
    const subscribedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (socketInitializedRef.current) return;
        socketInitializedRef.current = true;

        let stompClientLocal = null;

        async function connect() {
            try {
                const res = await api.get("/users/me");
                const myId = res.data?.id;

                if (!myId) return;

                const socket = new SockJS("http://localhost:8080/ws");

                stompClientLocal = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,

                    onConnect: () => {
                        if (subscribedRef.current) return;
                        subscribedRef.current = true;

                        stompClientLocal.subscribe(
                            `/topic/notifications/${myId}`,
                            (msg) => {
                                const notif = JSON.parse(msg.body);

                                // ❌ ignora READ (não é toast)
                                if (notif.type === "READ") return;

                                const notifObj = {
                                    ...notif,
                                    localId: Date.now() + Math.random()
                                };

                                setNotifications((prev) => {
                                    const exists = prev.some(
                                        (n) =>
                                            n.messageId === notif.messageId &&
                                            n.type === notif.type
                                    );

                                    if (exists) return prev;

                                    return [...prev, notifObj];
                                });

                                // auto remove toast
                                setTimeout(() => {
                                    setNotifications((prev) =>
                                        prev.filter(
                                            (n) => n.localId !== notifObj.localId
                                        )
                                    );
                                }, 4500);
                            }
                        );
                    },

                    onStompError: (frame) => {
                        console.log("Erro STOMP:", frame);
                    }
                });

                stompClientLocal.activate();
                stompRef.current = stompClientLocal;

            } catch (err) {
                console.log(err);
            }
        }

        connect();

        return () => {
            socketInitializedRef.current = false;
            subscribedRef.current = false;

            if (stompRef.current) {
                stompRef.current.deactivate();
                stompRef.current = null;
            }
        };
    }, []);

    return (
        <div className="global-notification-wrapper">

            {notifications.map((n) => (
                <div
                    key={n.localId}
                    className="notification-card"
                    onClick={() =>
                        navigate(`/contatos/${n.conversationId}`)
                    }
                >
                    <img
                        src={n.senderPhoto || "/null.png"}
                        className="notif-photo"
                    />

                    <div className="notif-texts">
                        <h4>{n.senderName}</h4>

                        <p>
                            {n.type === "MESSAGE"
                                ? "te enviou uma mensagem"
                                : "notificação"}
                        </p>

                        {n.content && <span>{n.content}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GlobalNotifications;