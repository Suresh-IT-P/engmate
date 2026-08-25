import { io } from 'socket.io-client';

/**
 * One Socket.IO connection for the whole app.
 *
 * IMPORTANT: autoConnect is false — the socket is ONLY created and connected
 * after a successful login (see AuthContext). This prevents the repeated
 * "ERR_CONNECTION_REFUSED" spam that happens when an unauthenticated page
 * tries to open a WebSocket connection that the server rejects.
 */
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

let socket = null;

/**
 * Returns the shared socket only if it has already been connected.
 * Components should call this rather than connectSocket() themselves.
 */
export function getSocket() {
  return socket;
}

/**
 * Create and connect the socket. Called once after successful login.
 * Safe to call multiple times — it's a no-op if already connected.
 */
export function connectSocket() {
  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,          // We manually call connect() below
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,     // Stop retrying after 5 failures
      reconnectionDelay: 2000,
      auth: { token: localStorage.getItem('englishmate_token') || null }
    });
  }

  socket.auth = { token: localStorage.getItem('englishmate_token') || null };
  socket.connect();
  return socket;
}

/**
 * Disconnect and destroy the socket. Called on logout.
 */
export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

/**
 * @deprecated Use connectSocket() / disconnectSocket() instead.
 * Kept for backward compatibility with any components that still call it.
 */
export function refreshSocketAuth() {
  if (!socket) return;
  socket.auth = { token: localStorage.getItem('englishmate_token') || null };
  if (socket.connected) {
    socket.disconnect().connect();
  }
}

/**
 * @deprecated Use disconnectSocket() instead.
 */
export function closeSocket() {
  disconnectSocket();
}
