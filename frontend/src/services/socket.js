import { io } from 'socket.io-client';

/**
 * One Socket.IO connection for the whole app.
 *
 * autoConnect is false, so merely importing this never opens a connection —
 * that avoids the "ERR_CONNECTION_REFUSED" spam from pages that have no use
 * for a socket. Opening it is an explicit act: AuthContext calls
 * connectSocket() on login, and screens that need a socket without a login
 * (the multiplayer battle) call it themselves on mount.
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

      // Polling FIRST, then upgrade. This is not a downgrade: Socket.IO
      // handshakes over HTTP and silently switches to WebSocket a moment
      // later, which is verified working in production.
      //
      // Listing 'websocket' first is what broke the game server connection.
      // A websocket-first handshake times out behind the deployment's proxy,
      // and socket.io-client does not fall through to the next transport on
      // its own — so the client failed outright instead of using polling,
      // which works fine.
      transports: ['polling', 'websocket'],

      // Belt and braces: if polling is ever the blocked one, try the rest
      // rather than giving up on the first failure.
      tryAllTransports: true,

      // Never stop trying. Capping this at 5 meant a phone that lost signal
      // for ten seconds, or a cold start on the host, left the socket dead
      // until a full page reload — the UI just sat on "Connecting…" forever.
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000, // back off, but keep retrying
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
