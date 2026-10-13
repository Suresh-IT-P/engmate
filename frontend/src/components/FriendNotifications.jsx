import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCall } from '../context/CallContext';
import { getActiveBattle, clearActiveBattle, ACTIVE_BATTLE_EVENT } from '../services/battle';
import {
  alertUser, initNotifications, setNotificationTapHandler, isAppInFront, playTone, vibrate
} from '../services/notify';

/**
 * Pop-ups for friend activity that happens while you are somewhere else in
 * the app: a new chat message, a friend challenging you to a Grammar Battle,
 * and a way back into a battle you left by accident. Mounted once at the app
 * root, next to the call overlay.
 */

/** Live states worth returning to. A finished match is simply forgotten. */
const RETURNABLE = { LOBBY: 'Waiting in the battle lobby', PLAYING: 'Your battle is still on!' };

const MESSAGE_TOAST_MS = 5000;
/** Long enough to finish what you were doing and still accept. */
const INVITE_TOAST_MS = 45000;
/** An invite rings like a call: every few seconds, for a while. */
const INVITE_RING_EVERY_MS = 2500;
const INVITE_RING_FOR_MS = 15000;
const MAX_TOASTS = 3;

const newId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export default function FriendNotifications() {
  const { socket, connected, status: callStatus } = useCall();
  const location = useLocation();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  // Notification permission, channel and audio unlock; a tapped system
  // notification opens the chat or battle it was about.
  useEffect(() => {
    initNotifications();
    setNotificationTapHandler((url) => { if (url) navigate(url); });
    return () => setNotificationTapHandler(null);
  }, [navigate]);

  // No chimes over a voice call.
  const callStatusRef = useRef(callStatus);
  callStatusRef.current = callStatus;

  /* ------------------------------------------- return to the battle --- */

  // Leaving the battle screen (Back, a swipe, a toast) does not leave the
  // room: the shared socket keeps the seat. Offer the way back from anywhere,
  // as long as the server says the room is still live.
  const [battle, setBattle] = useState(null); // { code, state }
  const [battleKey, setBattleKey] = useState(0);

  useEffect(() => {
    const bump = () => setBattleKey((k) => k + 1);
    window.addEventListener(ACTIVE_BATTLE_EVENT, bump);
    return () => window.removeEventListener(ACTIVE_BATTLE_EVENT, bump);
  }, []);

  useEffect(() => {
    const code = getActiveBattle();
    if (!code || !socket || !connected || location.pathname === `/battle/room/${code}`) {
      setBattle(null);
      return undefined;
    }

    let alive = true;
    const check = () => socket.emit('game:room-status', { battleRoomIds: [code] }, (res) => {
      if (!alive || !res?.ok) return;
      const state = res.states?.[code];
      if (RETURNABLE[state]) {
        setBattle({ code, state });
      } else {
        // Gone (everyone left, or a server restart) or already over.
        clearActiveBattle();
        setBattle(null);
      }
    });
    check();
    const poll = setInterval(check, 10000);
    return () => { alive = false; clearInterval(poll); };
  }, [socket, connected, location.pathname, battleKey]);

  // The socket handlers outlive renders; read the current screen from a ref.
  const pathRef = useRef(location.pathname);
  useEffect(() => { pathRef.current = location.pathname; }, [location.pathname]);

  const timersRef = useRef([]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** A newer toast with the same key (same chat, same room) replaces the old one. */
  const push = useCallback((toast, ttl) => {
    setToasts((prev) => [...prev.filter((t) => t.key !== toast.key), toast].slice(-MAX_TOASTS));
    timersRef.current.push(setTimeout(() => dismiss(toast.id), ttl));
  }, [dismiss]);

  useEffect(() => {
    if (!socket) return undefined;

    const onActivity = ({ roomId, kind, preview, senderName }) => {
      // Invites get their own alert below.
      if (kind === 'game_invite') return;
      // Looking at that very conversation: the message is already on screen.
      const inThatChat = pathRef.current === `/messages/${roomId}`;
      if (inThatChat && isAppInFront()) return;

      if (callStatusRef.current === 'idle') {
        alertUser({
          kind: 'message',
          key: `msg:${roomId}`,
          title: senderName || 'New message',
          body: preview,
          url: `/messages/${roomId}`
        });
      }
      if (inThatChat) return;
      push({
        id: newId(),
        key: `msg:${roomId}`,
        kind: 'message',
        roomId,
        title: senderName || 'New message',
        body: preview
      }, MESSAGE_TOAST_MS);
    };

    const onInvite = ({ battleRoomId, topicTitle, from }) => {
      if (pathRef.current === `/battle/room/${battleRoomId}`) return;
      if (callStatusRef.current === 'idle') {
        alertUser({
          kind: 'invite',
          key: `invite:${battleRoomId}`,
          title: `${from?.name || 'A friend'} challenged you! 🎮`,
          body: `Grammar Battle · ${topicTitle || 'Mixed Challenge'} — tap to join`,
          url: `/battle/room/${battleRoomId}`
        });
      }
      push({
        id: newId(),
        key: `invite:${battleRoomId}`,
        kind: 'invite',
        battleRoomId,
        title: `${from?.name || 'A friend'} challenged you!`,
        body: topicTitle || 'Grammar Battle'
      }, INVITE_TOAST_MS);
    };

    socket.on('chat:room-activity', onActivity);
    socket.on('game:invite-incoming', onInvite);
    return () => {
      socket.off('chat:room-activity', onActivity);
      socket.off('game:invite-incoming', onInvite);
    };
  }, [socket, push]);

  // A pending invite keeps ringing, like a phone call, until it is answered,
  // dismissed, or has rung for a while: one chime is easy to miss mid-lesson.
  const ringingFor = toasts.filter((t) => t.kind === 'invite').map((t) => t.id).join(',');
  useEffect(() => {
    if (!ringingFor || callStatus !== 'idle') return undefined;
    const started = Date.now();
    const ring = setInterval(() => {
      if (Date.now() - started > INVITE_RING_FOR_MS) { clearInterval(ring); return; }
      if (isAppInFront()) { playTone('invite'); vibrate('invite'); }
    }, INVITE_RING_EVERY_MS);
    return () => clearInterval(ring);
  }, [ringingFor, callStatus]);

  // The call screen covers everything; do not pile toasts on top of it.
  if ((!toasts.length && !battle) || callStatus !== 'idle') return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[85] px-4 w-full max-w-sm top-[calc(4.5rem+env(safe-area-inset-top,0px))] flex flex-col gap-2 pointer-events-none">
      {battle && (
        <div
          className="pointer-events-auto rounded-2xl bg-gradient-to-r from-tertiary to-primary text-white shadow-2xl flex items-center gap-2 pl-3 pr-1.5 py-2 animate-slide-in"
          role="status"
        >
          <button
            onClick={() => navigate(`/battle/room/${battle.code}`)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left"
          >
            <span className="relative w-9 h-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">sports_esports</span>
              {battle.state === 'PLAYING' && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-error border-2 border-white animate-pulse" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-extrabold truncate">{RETURNABLE[battle.state]}</span>
              <span className="block text-[11px] text-white/80 truncate">Tap to return · Room {battle.code}</span>
            </span>
          </button>
          <button
            onClick={() => { clearActiveBattle(); setBattle(null); }}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white/70 hover:text-white"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {toasts.map((t) => (t.kind === 'invite' ? (
        <div
          key={t.id}
          className="pointer-events-auto rounded-3xl overflow-hidden shadow-2xl border border-tertiary/30 bg-surface-container-lowest animate-slide-in"
          role="alert"
        >
          <div className="px-4 py-3 bg-gradient-to-br from-tertiary to-primary text-white flex items-center gap-3">
            <span className="relative w-10 h-10 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center">
              {/* Pulses while it rings, so it reads as "incoming", like a call. */}
              <span className="absolute inset-0 rounded-2xl bg-white/40 animate-ping" />
              <span className="relative material-symbols-outlined text-[24px] animate-bounce-short">sports_esports</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-sm break-words">{t.title}</p>
              <p className="text-xs opacity-85 truncate">Grammar Battle · {t.body}</p>
            </div>
          </div>
          <div className="p-2 flex gap-2">
            <button
              onClick={() => dismiss(t.id)}
              className="flex-1 py-2.5 rounded-2xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors"
            >
              Later
            </button>
            <button
              onClick={() => { dismiss(t.id); navigate(`/battle/room/${t.battleRoomId}`); }}
              className="flex-1 py-2.5 rounded-2xl bg-tertiary text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-md shadow-tertiary/25 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Join now
            </button>
          </div>
        </div>
      ) : (
        <div
          key={t.id}
          className="pointer-events-auto rounded-2xl bg-on-surface text-surface shadow-2xl flex items-center gap-3 pl-3 pr-2 py-2.5 animate-slide-in"
          role="status"
        >
          <button
            onClick={() => { dismiss(t.id); navigate(`/messages/${t.roomId}`); }}
            className="flex items-center gap-3 min-w-0 flex-1 text-left"
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center">
              {(t.title || '?').charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-extrabold truncate">{t.title}</span>
              <span className="block text-xs text-surface/75 truncate">{t.body}</span>
            </span>
          </button>
          <button
            onClick={() => dismiss(t.id)}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-surface/60 hover:text-surface"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )))}
    </div>
  );
}
