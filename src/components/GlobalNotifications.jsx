import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../service/api";
import "../styles/GlobalNotifications.css";
import {
    getNotificationNavigation,
    getNotificationText,
    normalizeNotification,
} from "../utils/notificationUtils";

function GlobalNotifications() {
    const [notifications, setNotifications] = useState([]);
    const stompRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let stompClient;

        async function connect() {
            try {
                const meRes = await api.get("/users/me");
                const myId = meRes.data?.id;
                if (!myId) return;

                const socket = new SockJS("https://rede-social-java-production.up.railway.app/ws");
                //const socket = new SockJS("http://localhost:8080/ws");
                stompClient = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    onConnect: () => {
                        stompClient.subscribe(`/topic/notifications/${myId}`, (msg) => {
                            const raw = JSON.parse(msg.body);
                            if (raw?.type === "READ") return;

                            const normalized = normalizeNotification(raw);
                            const toast = { ...normalized, localId: `${Date.now()}-${Math.random()}` };

                            setNotifications((prev) => {
                                const exists = prev.some(
                                    (n) => String(n.id) === String(toast.id) && n.type === toast.type
                                );
                                if (exists) return prev;
                                return [...prev, toast];
                            });

                            setTimeout(() => {
                                setNotifications((prev) => prev.filter((n) => n.localId !== toast.localId));
                            }, 4500);
                        });
                    },
                    onStompError: (frame) => {
                        console.log("Erro STOMP:", frame);
                    },
                });

                stompClient.activate();
                stompRef.current = stompClient;
            } catch (error) {
                console.log(error);
            }
        }

        connect();

        return () => {
            if (stompRef.current) {
                stompRef.current.deactivate();
                stompRef.current = null;
            }
        };
    }, []);

    return (
        <div className="global-notification-wrapper">
            {notifications.map((notification) => (
                <div
                    key={notification.localId}
                    className="notification-card"
                    onClick={() => {
                        const target = getNotificationNavigation(notification, "/notifications");
                        navigate(target.path, { state: target.state ?? undefined });
                    }}
                >
                    <img
                        src={notification.senderPhoto || "/null.png"}
                        className="notif-photo"
                    />

                    <div className="notif-texts">
                        <h4>{notification.senderName}</h4>
                        <p>{getNotificationText(notification)}</p>
                        {notification.content && <span>{notification.content}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GlobalNotifications;
