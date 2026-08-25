import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { useCall } from '../context/CallContext';
import { useBurst } from '../components/reactions/ReactionBurstLayer';
import { ReactionRow, ReactionSheet, ReactionChips } from '../components/reactions/ReactionPicker';
import { summarise, haptic } from '../components/reactions/reactionKit';

/**
 * One-to-one chat with a friend, with a voice-call button in the header.
 *
 * Messages arrive over the socket rather than the 5-second poll the chat hub
 * uses, and the timeline interleaves call records ("missed call", "voice call,
 * 2:14") with the messages so the conversation reads in order.
 */

const QUICK_REPLIES = [
  'Hi! 👋',
  'How are you?',
  "Let's practise English!",
  'வணக்கம்! 🙏',
  'See you soon 😊'
];

function timeLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function callSummary(entry, iAmCaller) {
  if (entry.status === 'completed') {
    const m = Math.floor((entry.duration_seconds || 0) / 60);
    const s = (entry.duration_seconds || 0) % 60;
    return `Voice call · ${m}:${String(s).padStart(2, '0')}`;
  }
  if (entry.status === 'declined') return iAmCaller ? 'Call declined' : 'You declined the call';
  if (entry.status === 'cancelled') return iAmCaller ? 'You cancelled the call' : 'Missed voice call';
  return iAmCaller ? 'No answer' : 'Missed voice call';
}

export default function FriendChatView() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tamilEnabled, speakText } = useLearning();
  const { socket, connected, myUserId, isFriendOnline, startCall, status: callStatus } = useCall();

  const [peer, setPeer] = useState(null);
  const [canCall, setCanCall] = useState(false);
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const [draft, setDraft] = useState('');
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [peerTyping, setPeerTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [sending, setSending] = useState(false);

  // Which message the reaction row is open on, and whether the full sheet is up.
  const [reactingId, setReactingId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const endRef = useRef(null);
  const typingTimerRef = useRef(null);
  const longPressRef = useRef(null);
  const lastTapRef = useRef({ id: null, at: 0 });

  const { burst } = useBurst();

  const meId = myUserId ?? user?.id ?? null;

  /* ------------------------------------------------------- loading ---- */

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [detailRes, msgRes] = await Promise.all([
          api.getDirectRoomDetail(roomId),
          api.getRoomMessages(roomId, 100)
        ]);

        if (!alive) return;

        if (detailRes?.success) {
          setPeer(detailRes.data.peer);
          setCanCall(!!detailRes.data.canCall);
        }
        if (msgRes?.success) setMessages(msgRes.data || []);

        // Call history is a nice-to-have; a failure here must not blank the chat.
        try {
          const callRes = await api.getRoomCalls(roomId);
          if (alive && callRes?.success) setCalls(callRes.data || []);
        } catch (_) { /* timeline simply shows messages only */ }
      } catch (err) {
        if (alive) setLoadError(err.message || 'Could not open this conversation.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [roomId]);

  /* -------------------------------------------------- live updates ---- */

  useEffect(() => {
    if (!socket || !connected || !roomId) return;

    socket.emit('chat:join', { roomId });

    const onMessage = (msg) => {
      if (msg.room_id !== roomId) return;
      // The sender already appended their own copy optimistically.
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    };

    const onTyping = ({ roomId: r, userId, isTyping }) => {
      if (r !== roomId || Number(userId) === Number(meId)) return;
      setPeerTyping(isTyping);
    };

    const onCallEnded = () => {
      // Refresh the log so the call that just finished appears in the timeline.
      api.getRoomCalls(roomId)
        .then((res) => res?.success && setCalls(res.data || []))
        .catch(() => {});
    };

    const onReaction = ({ roomId: r, messageId, reactions, lastEmoji, added, byUserId }) => {
      if (r !== roomId) return;
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));

      // Celebrate the other person's new reaction. Skip our own (already burst
      // on tap) and skip removals, which should not throw confetti.
      if (added && Number(byUserId) !== Number(meId)) {
        burst(lastEmoji, { count: 6, buzz: false });
      }
    };

    socket.on('chat:new-message', onMessage);
    socket.on('chat:typing', onTyping);
    socket.on('call:ended', onCallEnded);
    socket.on('chat:reaction-update', onReaction);

    return () => {
      socket.emit('chat:leave', { roomId });
      socket.off('chat:new-message', onMessage);
      socket.off('chat:typing', onTyping);
      socket.off('call:ended', onCallEnded);
      socket.off('chat:reaction-update', onReaction);
    };
  }, [socket, connected, roomId, meId, burst]);

  /* ----------------------------------------------------- reactions ---- */

  /**
   * Toggle a reaction and fire the burst from wherever it was tapped, so the
   * emoji appears to leave the button rather than the middle of the screen.
   */
  const react = (messageId, emoji, sourceEl) => {
    if (!socket?.connected) return;

    let originX;
    let originY;
    if (sourceEl?.getBoundingClientRect) {
      const r = sourceEl.getBoundingClientRect();
      originX = r.left + r.width / 2;
      originY = r.top + r.height / 2;
    }

    const already = (messages.find((m) => m.id === messageId)?.reactions || [])
      .some((r) => r.emoji === emoji && Number(r.user_id) === Number(meId));

    // Only celebrate when adding. Removing a reaction should be quiet.
    if (!already) burst(emoji, { count: 8, originX, originY });

    setReactingId(null);
    setSheetOpen(false);

    socket.emit('chat:react', { roomId, messageId, emoji }, (res) => {
      if (res?.ok) {
        setMessages((prev) => prev.map((m) => (m.id === res.messageId ? { ...m, reactions: res.reactions } : m)));
      } else if (res && !res.ok) {
        setLoadError(res.error || 'Could not add that reaction.');
      }
    });
  };

  /** Long-press opens the reaction row; a quick double-tap sends a heart. */
  const startLongPress = (messageId) => {
    clearTimeout(longPressRef.current);
    longPressRef.current = setTimeout(() => {
      haptic(18);
      setReactingId(messageId);
    }, 420);
  };

  const cancelLongPress = () => clearTimeout(longPressRef.current);

  const handleBubbleTap = (messageId, el) => {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last.id === messageId && now - last.at < 320) {
      lastTapRef.current = { id: null, at: 0 };
      react(messageId, '❤️', el);
      return;
    }
    lastTapRef.current = { id: messageId, at: now };
  };

  useEffect(() => () => clearTimeout(longPressRef.current), []);

  /* --------------------------------------------------- the timeline --- */

  const timeline = useMemo(() => {
    const items = [
      ...messages.map((m) => ({ kind: 'message', at: m.created_at, data: m })),
      ...calls.map((c) => ({ kind: 'call', at: c.started_at, data: c }))
    ].sort((a, b) => new Date(a.at) - new Date(b.at));

    // Insert a date divider whenever the day changes.
    const withDays = [];
    let lastDay = null;
    for (const item of items) {
      const day = dayLabel(item.at);
      if (day && day !== lastDay) {
        withDays.push({ kind: 'day', at: item.at, data: day });
        lastDay = day;
      }
      withDays.push(item);
    }
    return withDays;
  }, [messages, calls]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [timeline.length, peerTyping]);

  /* ------------------------------------------------------- actions ---- */

  const notifyTyping = (isTyping) => {
    if (!socket || !connected) return;
    socket.emit('chat:typing', { roomId, isTyping });
  };

  const handleDraftChange = (value) => {
    setDraft(value);
    notifyTyping(true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => notifyTyping(false), 1500);
  };

  const send = (text) => {
    const body = (text ?? draft).trim();
    if (!body || sending) return;

    setSending(true);
    setDraft('');
    clearTimeout(typingTimerRef.current);
    notifyTyping(false);

    socket.emit('chat:message', { roomId, messageText: body, checkGrammar }, (res) => {
      setSending(false);
      if (res?.ok && res.message) {
        setMessages((prev) => (prev.some((m) => m.id === res.message.id) ? prev : [...prev, res.message]));
      } else if (res && !res.ok) {
        setLoadError(res.error || 'Message failed to send.');
        setDraft(body); // hand the text back rather than losing it
      }
    });
  };

  // Presence from the shared context, plus a direct check on mount: the
  // register ack can land before this screen exists, leaving the context's
  // list empty even though the friend is online.
  const [peerOnlineDirect, setPeerOnlineDirect] = useState(false);

  useEffect(() => {
    if (!socket || !connected || !peer?.id) return;
    let alive = true;
    const ask = () => socket.emit('presence:check', { userIds: [peer.id] }, (res) => {
      if (alive) setPeerOnlineDirect((res?.online || []).map(Number).includes(Number(peer.id)));
    });
    ask();
    const poll = setInterval(ask, 15000);
    return () => { alive = false; clearInterval(poll); };
  }, [socket, connected, peer?.id]);

  const peerOnline = (peer ? isFriendOnline(peer.id) : false) || peerOnlineDirect;
  const callBusy = callStatus !== 'idle';

  // Only a missing peer or a non-friend makes calling impossible. Being offline
  // does not: the button stays live and the server answers with a plain reason,
  // which beats a greyed-out control that cannot explain itself.
  const callBlockedReason = !peer
    ? 'This conversation has no other member.'
    : !canCall
      ? `Add ${peer.full_name || 'them'} as a friend to enable voice calls.`
      : null;

  /* --------------------------------------------------------- views ---- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pt-2 flex flex-col h-app-pane">

      {/* Header */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-surface-container-high border border-surface-variant/60 flex items-center gap-2 sm:gap-3 shrink-0 mb-2">
        <button
          onClick={() => navigate('/chat')}
          className="w-9 h-9 shrink-0 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
          aria-label="Back to chats"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center">
            {(peer?.full_name || 'F').charAt(0).toUpperCase()}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container-high ${
              peerOnline ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-sm text-on-surface font-display truncate">
            {peer?.full_name || 'Friend'}
          </h2>
          <p className="text-[11px] font-bold truncate">
            {peerTyping ? (
              <span className="text-primary">typing…</span>
            ) : (
              <span className={peerOnline ? 'text-secondary' : 'text-on-surface-variant'}>
                {peerOnline ? 'Online' : 'Offline'}
                {peer?.current_level ? ` · ${peer.current_level}` : ''}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => startCall(peer, roomId)}
          disabled={!!callBlockedReason || callBusy}
          title={callBlockedReason || (peerOnline ? 'Start a voice call' : `${peer?.full_name || 'They'} looks offline — try anyway`)}
          className={`w-10 h-10 shrink-0 rounded-full text-white flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            peerOnline ? 'bg-secondary shadow-secondary/25 hover:bg-secondary/90' : 'bg-outline shadow-outline/20 hover:bg-on-surface-variant'
          }`}
          aria-label="Start voice call"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
        </button>
      </div>

      {callBlockedReason && (
        <div className="px-3 py-2 mb-2 rounded-xl bg-surface-container border border-surface-variant/60 text-on-surface-variant text-[11px] font-bold flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[15px] shrink-0">info</span>
          <span className="min-w-0 break-words">{callBlockedReason}</span>
        </div>
      )}

      {!callBlockedReason && !peerOnline && (
        <div className="px-3 py-2 mb-2 rounded-xl bg-surface-container border border-surface-variant/60 text-on-surface-variant text-[11px] font-bold flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[15px] shrink-0">schedule</span>
          <span className="min-w-0 break-words">
            {peer?.full_name || 'They'} is offline. You can still send messages — and you can press call to try.
          </span>
        </div>
      )}

      {loadError && (
        <div className="px-3 py-2 mb-2 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs font-bold flex items-center justify-between gap-3 shrink-0">
          <span className="min-w-0 break-words">{loadError}</span>
          <button onClick={() => setLoadError(null)} className="shrink-0" aria-label="Dismiss">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Timeline */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setReactingId(null); }}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-1 sm:px-2 py-2 flex flex-col gap-2.5"
      >
        {timeline.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 p-6">
            <span className="material-symbols-outlined text-outline-variant text-[48px]">waving_hand</span>
            <p className="text-sm font-bold text-on-surface">Say hello to {peer?.full_name || 'your friend'}!</p>
            <p className="text-xs text-on-surface-variant">
              Practise English together — the AI Doctor will gently correct your sentences.
            </p>
            <p className="text-[11px] text-outline mt-1">
              Tip: double-tap a message for ❤️, or hold it to pick a reaction.
            </p>
          </div>
        )}

        {timeline.map((item, idx) => {
          if (item.kind === 'day') {
            return (
              <div key={`day-${idx}`} className="flex justify-center my-1">
                <span className="px-3 py-1 rounded-full bg-surface-container text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {item.data}
                </span>
              </div>
            );
          }

          if (item.kind === 'call') {
            const c = item.data;
            const iAmCaller = Number(c.caller_id) === Number(meId);
            const missed = c.status !== 'completed';
            return (
              <div key={`call-${c.id}`} className="flex justify-center">
                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                    missed
                      ? 'bg-error-container/30 text-error border-error/20'
                      : 'bg-secondary-container/30 text-secondary border-secondary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {missed ? 'phone_missed' : iAmCaller ? 'call_made' : 'call_received'}
                  </span>
                  {callSummary(c, iAmCaller)}
                  <span className="opacity-60 font-medium">{timeLabel(c.started_at)}</span>
                </span>
              </div>
            );
          }

          const msg = item.data;
          const mine = Number(msg.sender_id) === Number(meId);

          return (
            <div
              key={`msg-${msg.id}`}
              className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] min-w-0 ${
                mine ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                onPointerDown={() => startLongPress(msg.id)}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onClick={(e) => handleBubbleTap(msg.id, e.currentTarget)}
                onContextMenu={(e) => { e.preventDefault(); setReactingId(msg.id); }}
                className={`p-3 rounded-2xl text-sm font-medium leading-relaxed break-words relative cursor-pointer select-none transition-transform active:scale-[0.98] ${
                  mine
                    ? 'bg-primary text-white rounded-br-sm shadow-md shadow-primary/20'
                    : 'bg-surface-container text-on-surface rounded-bl-sm border border-surface-variant/60'
                }`}
              >
                <p className="whitespace-pre-wrap pr-6">{msg.message_text}</p>
                <button
                  onPointerDown={(e) => { e.stopPropagation(); cancelLongPress(); }}
                  onClick={(e) => { e.stopPropagation(); speakText(msg.message_text); }}
                  className={`absolute top-2 right-2 opacity-60 hover:opacity-100 ${mine ? 'text-white' : 'text-primary'}`}
                  aria-label="Listen to this message"
                >
                  <span className="material-symbols-outlined text-[15px]">volume_up</span>
                </button>
              </div>

              {msg.grammar_correction && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col gap-1 w-full min-w-0 animate-fade-in">
                  <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                    <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
                    AI English Doctor
                  </span>
                  <p className="text-on-surface font-medium break-words">
                    👉 <strong>Better:</strong> “{msg.grammar_correction.improved}”
                  </p>
                  {msg.grammar_correction.explanation && (
                    <p className="text-on-surface-variant text-[11px] break-words">
                      💡 {msg.grammar_correction.explanation}
                    </p>
                  )}
                  {tamilEnabled && msg.grammar_correction.tamilExplanation && (
                    <p className="text-primary font-tamil text-[11px] break-words">
                      📖 {msg.grammar_correction.tamilExplanation}
                    </p>
                  )}
                </div>
              )}

              {tamilEnabled && msg.tamil_translation && !msg.grammar_correction && (
                <span className="px-2 py-0.5 rounded-lg bg-secondary-container/20 text-[11px] font-tamil text-secondary break-words">
                  📖 {msg.tamil_translation}
                </span>
              )}

              <ReactionChips
                summary={summarise(msg.reactions, meId)}
                onToggle={(emoji, el) => react(msg.id, emoji, el)}
                className={mine ? 'justify-end' : 'justify-start'}
              />

              {reactingId === msg.id && (
                <div className={`max-w-full overflow-x-auto hide-scrollbar ${mine ? 'self-end' : 'self-start'}`}>
                  <ReactionRow
                    active={summarise(msg.reactions, meId).filter((r) => r.mine).map((r) => r.emoji)}
                    onPick={(emoji, el) => react(msg.id, emoji, el)}
                    onMore={() => { setSheetOpen(true); }}
                  />
                </div>
              )}

              <span className="text-[9px] font-bold text-outline px-1">{timeLabel(msg.created_at)}</span>
            </div>
          );
        })}

        {peerTyping && (
          <div className="self-start px-3 py-2 rounded-2xl bg-surface-container border border-surface-variant/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-outline animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div ref={endRef} />
      </div>

      <ReactionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        active={summarise(messages.find((m) => m.id === reactingId)?.reactions, meId).filter((r) => r.mine).map((r) => r.emoji)}
        onPick={(emoji, el) => reactingId && react(reactingId, emoji, el)}
      />

      {/* Composer */}
      <div className="shrink-0 pt-1 pb-2">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-2">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-[11px] font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label
            className="flex items-center gap-1.5 shrink-0 cursor-pointer px-2.5 py-2 rounded-xl bg-surface-container border border-surface-variant/60"
            title="Let the AI Doctor check your grammar"
          >
            <input
              type="checkbox"
              checked={checkGrammar}
              onChange={(e) => setCheckGrammar(e.target.checked)}
              className="w-3.5 h-3.5 accent-primary cursor-pointer"
            />
            <span className="material-symbols-outlined text-[16px] text-primary">auto_fix_high</span>
          </label>

          <input
            type="text"
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={connected ? 'Type a message…' : 'Connecting…'}
            disabled={!connected}
            className="flex-1 min-w-0 px-3.5 py-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface placeholder:text-outline-variant outline-none focus:border-primary disabled:opacity-50"
          />

          <button
            onClick={() => send()}
            disabled={!draft.trim() || sending || !connected}
            className="w-11 h-11 shrink-0 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 hover:bg-primary-container active:scale-95 transition-all disabled:opacity-40"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-[20px]">
              {sending ? 'hourglass_top' : 'send'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
