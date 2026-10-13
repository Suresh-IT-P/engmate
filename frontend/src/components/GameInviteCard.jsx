import React from 'react';

/**
 * A Grammar Battle challenge, as it appears in the chat timeline.
 *
 * `roomState` comes from the server: 'LOBBY' | 'PLAYING' | 'FINISHED', null
 * once the room is gone, or undefined while it is still being checked.
 */
export default function GameInviteCard({ invite, mine, senderName, roomState, onOpen }) {
  const open = !!roomState;

  const action =
    roomState === undefined ? 'Checking…'
      : roomState === null ? 'Challenge expired'
        : roomState === 'PLAYING' ? 'Match in progress'
          : roomState === 'FINISHED' ? 'Match over'
            : mine ? 'Open lobby' : 'Join battle';

  return (
    <div
      className={`w-64 max-w-full rounded-3xl overflow-hidden border shadow-lg ${
        open ? 'border-tertiary/30 shadow-tertiary/15' : 'border-surface-variant/60 shadow-none opacity-80'
      }`}
    >
      <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-tertiary to-primary text-white relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-3 -bottom-4 text-[84px] opacity-15 pointer-events-none">
          sports_esports
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">swords</span>
          Grammar Battle
        </span>
        <p className="font-extrabold font-display text-base mt-1 break-words">
          {mine ? 'You sent a challenge' : `${senderName || 'Your friend'} challenged you!`}
        </p>
        <p className="text-xs font-semibold opacity-85 mt-0.5 break-words">
          {invite?.topicTitle || 'Mixed Challenge'}
          {invite?.questionCount ? ` · ${invite.questionCount} questions` : ''}
        </p>
      </div>

      <div className="p-2.5 bg-surface-container-lowest">
        <button
          type="button"
          onClick={onOpen}
          disabled={!open}
          className={`w-full py-2.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:cursor-not-allowed ${
            roomState === 'LOBBY' && !mine
              ? 'bg-tertiary text-white shadow-md shadow-tertiary/25'
              : open
                ? 'bg-surface-container text-on-surface hover:bg-surface-variant'
                : 'bg-surface-container text-outline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {roomState === null ? 'timer_off' : roomState === 'LOBBY' ? 'login' : 'sports_esports'}
          </span>
          {action}
        </button>
      </div>
    </div>
  );
}
