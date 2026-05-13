import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import api from "../service/api";
import ConfirmModal from "./ConfirmModal";
import {
    formatNotificationDate,
    getNotificationNavigation,
    getNotificationText,
    normalizeNotification,
} from "../utils/notificationUtils";
import "../styles/NotificationsPage.css";

function NotificationsList() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const stompRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const res = await api.get("/notifications");
                if (!mounted) return;

                const normalized = (res.data || []).map(normalizeNotification);
                setNotifications(normalized);
            } catch (error) {
                console.log(error);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let client;

        async function connect() {
            try {
                const meRes = await api.get("/users/me");
                const myId = meRes.data?.id;
                if (!myId) return;

                const socket = new SockJS("https://rede-social-java-production.up.railway.app/ws");
                client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    onConnect: () => {
                        client.subscribe(`/topic/notifications/${myId}`, (msg) => {
                            const raw = JSON.parse(msg.body);
                            if (raw?.type === "READ") return;

                            const normalized = normalizeNotification(raw);
                            setNotifications((prev) => {
                                const exists = prev.some((n) => String(n.id) === String(normalized.id));
                                if (exists) return prev;
                                return [normalized, ...prev];
                            });
                        });
                    },
                });

                client.activate();
                stompRef.current = client;
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

    const hasNotifications = useMemo(() => notifications.length > 0, [notifications]);
    const hasSelection = selectedIds.length > 0;

    function toggleSelection(id) {
        setSelectedIds((prev) => {
            const key = String(id);
            const exists = prev.some((item) => String(item) === key);
            if (exists) return prev.filter((item) => String(item) !== key);
            return [...prev, id];
        });
    }

    async function handleDeleteSelected() {
        if (!hasSelection) return;

        setDeleting(true);
        try {
            await api.delete("/notifications", { data: selectedIds });
            setNotifications((prev) =>
                prev.filter((n) => !selectedIds.some((id) => String(id) === String(n.id)))
            );
            setSelectedIds([]);
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <section className="notifications-page">
                <div className="notifications-head">
                    <p className="notifications-label">Atualizacões</p>
                    <h2 className="notifications-title">Notificações</h2>
                </div>
                <p className="notifications-empty">Carregando...</p>
            </section>
        );
    }

    return (
        <section className="notifications-page">
            <div className="notifications-head">
                <p className="notifications-label">Atualizações</p>
                <h2 className="notifications-title">Notificações</h2>
            </div>

            <div className="notifications-actions">
                <button
                    type="button"
                    className="notifications-delete-btn"
                    disabled={!hasSelection || deleting}
                    onClick={() => setShowDeleteModal(true)}
                >
                    {deleting ? "Excluindo..." : `Excluir selecionadas (${selectedIds.length})`}
                </button>
            </div>

            {!hasNotifications ? (
                <p className="notifications-empty">Voce ainda nao tem notificacoes.</p>
            ) : (
                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <article
                            key={`${notification.id}-${notification.createdAt}`}
                            className="notification-item"
                            onClick={() => {
                                const target = getNotificationNavigation(notification, "/notifications");
                                navigate(target.path, { state: target.state ?? undefined });
                            }}
                        >
                            <img
                                className="notification-avatar"
                                src={notification.senderPhoto || "/null.png"}
                                alt={notification.senderName}
                            />

                            <div className="notification-content">
                                <p className="notification-text">
                                    <strong>{notification.senderName}</strong> {getNotificationText(notification)}
                                </p>

                                {notification.content && (
                                    <p className="notification-extra">{notification.content}</p>
                                )}

                                <span className="notification-date">
                                    {formatNotificationDate(notification.createdAt)}
                                </span>
                            </div>

                            <label className="notification-check" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.some((id) => String(id) === String(notification.id))}
                                    onChange={() => toggleSelection(notification.id)}
                                />
                            </label>
                        </article>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                message={`Deseja excluir ${selectedIds.length} notificacao(oes)?`}
                onConfirm={handleDeleteSelected}
                onCancel={() => setShowDeleteModal(false)}
            />
        </section>
    );
}

export default NotificationsList;
