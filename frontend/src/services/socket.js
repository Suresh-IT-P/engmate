import { io } from 'socket.io-client';

/**
 * One Socket.IO connection for the whole app.
 *
 * Vite only proxies `/api`, so in dev the socket has to reach the backend port
 * directly; in a build the frontend is served by that same Express process, so
 * the page origin is right. The hard-coded `http://localhost:5000` this
 * replaces worked on the dev machine and nowhere else.
 */
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

let socket = null;

/**
 * The shared socket, created on first use. Chat, presence and calls all ride
 * this one connection — a second one would register the user twice and make
 * presence flap on every page change.
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: { token: localStorage.getItem('englishmate_token') || null }
    });
  }
  return socket;
}

/** Re-handshake with a new token after login or logout. */
export function refreshSocketAuth() {
  if (!socket) return;
  socket.auth = { token: localStorage.getItem('englishmate_token') || null };
  socket.disconnect().connect();
}

export function closeSocket() {
  if (!socket) return;
  socket.close();
  socket = null;
}
