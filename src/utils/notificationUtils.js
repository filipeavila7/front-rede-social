function normalizeNotification(raw) {
    return {
        id: raw?.id ?? `${raw?.type ?? "NOTIF"}-${raw?.createdAt ?? Date.now()}`,
        type: String(raw?.type ?? "UNKNOWN").toUpperCase(),
        senderId: raw?.senderId ?? raw?.actorId ?? null,
        senderName: raw?.senderName ?? raw?.actorName ?? "Alguem",
        senderUserName: raw?.senderUserName ?? raw?.actorUserName ?? null,
        senderPhoto: raw?.senderPhoto ?? raw?.actorPhoto ?? "/null.png",
        content: raw?.content ?? raw?.message ?? "",
        postId: raw?.postId ?? null,
        conversationId: raw?.conversationId ?? null,
        createdAt: raw?.createdAt ?? new Date().toISOString(),
    };
}

function getNotificationText(notification) {
    switch (notification.type) {
        case "MESSAGE":
            return "te enviou uma mensagem";
        case "LIKE":
            return "curtiu seu post";
        case "COMMENT":
            return "comentou no seu post";
        case "FOLLOW":
            return "comecou a te seguir";
        default:
            return "enviou uma notificacao";
    }
}

function getNotificationTarget(notification) {
    if (notification.type === "MESSAGE" && notification.conversationId) {
        return `/contatos/${notification.conversationId}`;
    }

    if ((notification.type === "LIKE" || notification.type === "COMMENT") && notification.postId) {
        return `/feed/${notification.postId}`;
    }

    if (notification.type === "FOLLOW" && notification.senderId && notification.senderUserName) {
        return `/profile/${notification.senderId}/${notification.senderUserName}`;
    }

    return "/notifications";
}

function getNotificationNavigation(notification, currentLocation = "/notifications") {
    const path = getNotificationTarget(notification);

    if (path.startsWith("/feed/")) {
        return {
            path,
            state: {
                returnTo: {
                    kind: "notifications",
                    path: currentLocation,
                    state: null,
                },
            },
        };
    }

    if (path.startsWith("/profile/")) {
        return {
            path,
            state: {
                backStack: [
                    {
                        path: currentLocation,
                        state: null,
                    },
                ],
            },
        };
    }

    if (path.startsWith("/contatos/")) {
        return {
            path,
            state: {
                returnTo: {
                    kind: "notifications",
                    path: currentLocation,
                    state: null,
                },
            },
        };
    }

    return { path, state: null };
}

function formatNotificationDate(date) {
    if (!date) return "";

    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;

    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `ha ${mins} min`;

    const hours = Math.floor(diffMs / 3600000);
    if (hours < 24) return `ha ${hours}h`;

    return then.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export {
    normalizeNotification,
    getNotificationText,
    getNotificationTarget,
    getNotificationNavigation,
    formatNotificationDate,
};
