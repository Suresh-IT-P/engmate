import React from 'react';
import { useCall } from '../context/CallContext';

/**
 * Every call surface in one place: the incoming-call sheet, the outgoing
 * "calling…" screen, and the in-call controls. Mounted once at the app root so
 * a call reaches the user on whatever screen they are on.
 */

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

function formatDuration(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function CallOverlay() {
  const {
    call, status, muted, seconds,
    lastEndReason, mediaError,
    acceptCall, declineCall, hangUp, toggleMute, dismissNotice
  } = useCall();

  // A refused mic or a declined call leaves a short banner behind.
  if (!call && (lastEndReason || mediaError)) {
    return (
      <div className="fixed left-1/2 -translate-x-1/2 z-[95] px-4 w-full max-w-sm top-[calc(4.5rem+env(safe-area-inset-top,0px))]">
        <div className="px-4 py-3 rounded-2xl bg-on-surface text-surface shadow-2xl flex items-center gap-3 animate-slide-in">
          <span className="material-symbols-outlined text-[20px] shrink-0">
            {mediaError ? 'mic_off' : 'call_end'}
          </span>
          <p className="text-xs font-bold flex-1 min-w-0">{mediaError || lastEndReason}</p>
          <button
            onClick={dismissNotice}
            className="shrink-0 text-surface/70 hover:text-surface"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    );
  }

  if (!call) return null;

  const peerName = call.peer?.name || 'Friend';
  const incomingRinging = status === 'ringing';

  const subtitle =
    status === 'ringing' ? 'Incoming voice call'
      : status === 'calling' ? 'Ringing…'
        : status === 'connecting' ? 'Connecting…'
          : formatDuration(seconds);

  return (
    <div className="fixed inset-0 z-[90] bg-on-surface/95 backdrop-blur-xl flex flex-col items-center justify-between py-10 px-6 animate-fade-in">
      {/* Who and how long */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div
          className={`w-28 h-28 shrink-0 rounded-full bg-primary text-white text-5xl font-extrabold font-display flex items-center justify-center shadow-2xl ${
            status === 'ringing' || status === 'calling' ? 'animate-pulse' : ''
          }`}
        >
          {initials(peerName)}
        </div>

        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold text-surface font-display break-words">{peerName}</h2>
          <p className="text-sm font-bold text-surface/70 mt-1 flex items-center justify-center gap-1.5">
            {status === 'active' && (
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            )}
            {subtitle}
          </p>
          <p className="text-xs text-surface/50 font-tamil mt-1">
            {incomingRinging ? 'குரல் அழைப்பு வருகிறது' : 'குரல் அழைப்பு'}
          </p>
        </div>

        {status === 'active' && (
          <span className="text-[11px] font-bold text-surface/50 flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Peer-to-peer · audio never touches the server
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm shrink-0">
        {incomingRinging ? (
          <div className="flex items-center justify-around gap-6">
            <button
              onClick={declineCall}
              className="flex flex-col items-center gap-2 group"
              aria-label="Decline call"
            >
              <span className="w-16 h-16 shrink-0 rounded-full bg-error text-white flex items-center justify-center shadow-xl group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[30px]">call_end</span>
              </span>
              <span className="text-xs font-bold text-surface/80">Decline</span>
            </button>

            <button
              onClick={acceptCall}
              className="flex flex-col items-center gap-2 group"
              aria-label="Accept call"
            >
              <span className="w-16 h-16 shrink-0 rounded-full bg-secondary text-white flex items-center justify-center shadow-xl animate-bounce-short group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[30px]">call</span>
              </span>
              <span className="text-xs font-bold text-surface/80">Accept</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleMute}
              disabled={status !== 'active'}
              className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 ${
                muted ? 'bg-surface text-on-surface' : 'bg-surface/20 text-surface'
              }`}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              <span className="material-symbols-outlined text-[24px]">{muted ? 'mic_off' : 'mic'}</span>
            </button>

            <button
              onClick={hangUp}
              className="w-16 h-16 shrink-0 rounded-full bg-error text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
              aria-label="Hang up"
            >
              <span className="material-symbols-outlined text-[30px]">call_end</span>
            </button>

            <div className="w-14 h-14 shrink-0" aria-hidden="true" />
          </div>
        )}

        {muted && status === 'active' && (
          <p className="text-center text-[11px] font-bold text-surface/60 mt-4">
            Your microphone is muted
          </p>
        )}
      </div>
    </div>
  );
}
