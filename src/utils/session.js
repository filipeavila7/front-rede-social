import { useFeedStore } from "../store/feedStore";
import usePostDraftStore from "../store/postDraftStore";

export const SESSION_EXPIRED_MESSAGE_KEY = "sessionExpiredMessage";

export function resetSessionStores() {
  useFeedStore.getState().resetFeed();
  usePostDraftStore.setState({ hasUnsavedChanges: false });
}

export function clearSession() {
  localStorage.removeItem("token");
  resetSessionStores();
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
}

export function getTokenExpirationTime(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) return null;

  return payload.exp * 1000;
}

export function storeSessionExpiredMessage(message) {
  sessionStorage.setItem(SESSION_EXPIRED_MESSAGE_KEY, message);
}

export function consumeSessionExpiredMessage() {
  const message = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);

  if (message) {
    sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
  }

  return message;
}
