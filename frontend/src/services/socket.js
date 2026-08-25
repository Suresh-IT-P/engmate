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
 * The shared socket instance, created on first use but NOT connected.
 *
 * This always returns a real socket. Returning null until login looked tidy but
 * broke every consumer: CallProvider captures the socket once in useState and
 * MultiplayerBattle reads it in an effect, so both got null and threw on
 * `socket.on(...)` — and because CallProvider wraps the whole app, that is a
 * white screen for anyone not signed in.
 *
 * Attaching listeners to a disconnected socket is fine in Socket.IO; they fire
 * when connect() is finally called. So consumers can wire up whenever they
 * mount, and connectSocket() alone decides when traffic starts.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,          // connectSocket() owns the lifecycle
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,     // stop retrying after 5 failures
      reconnectionDelay: 2000,
      auth: { token: localStorage.getItem('englishmate_token') || null }
    });
  }
  return socket;
}

/**
 * Connect (or reconnect) with the current token. Called after login and when
 * restoring an existing session. Safe to call repeatedly.
 */
export function connectSocket() {
  const s = getSocket();
  s.auth = { token: localStorage.getItem('englishmate_token') || null };
  if (!s.connected) s.connect();
  return s;
}

/**
 * Disconnect on logout — but keep the instance.
 *
 * Dropping it to null orphaned every listener already attached by CallProvider
 * and the battle screen, so a logout followed by a login left them listening to
 * a dead object and silently receiving nothing.
 */
export function disconnectSocket() {
  if (!socket) return;
  socket.auth = { token: null };
  socket.disconnect();
}

/**
 * Re-handshake with the current token. The token travels in the handshake, so
 * a change of user needs a fresh connection for presence and calls to follow it.
 */
export function refreshSocketAuth() {
  if (!socket) return;
  socket.auth = { token: localStorage.getItem('englishmate_token') || null };
  if (socket.connected) socket.disconnect().connect();
}

/**
 * @deprecated Use disconnectSocket() instead.
 */
export function closeSocket() {
  disconnectSocket();
}
