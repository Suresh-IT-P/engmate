import React, { useEffect, useState } from 'react';
import BattleTopicPicker from './BattleTopicPicker';

const ROUND_OPTIONS = [5, 10, 15];

/**
 * Bottom sheet for challenging a friend to a Grammar Battle from the chat:
 * pick a topic and a length, and one tap creates the room and sends the invite.
 */
export default function ChallengeSheet({ open, onClose, friendName, onSend, sending = false }) {
  const [topic, setTopic] = useState(null);
  const [rounds, setRounds] = useState(10);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={sending ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[85dvh] overflow-y-auto overscroll-contain bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl border border-surface-variant/70 shadow-2xl pb-safe sm:pb-4 animate-sheet-up sm:animate-pop-in"
        role="dialog"
        aria-label={`Challenge ${friendName}`}
      >
        <div className="sticky top-0 z-10 bg-surface-container-lowest pt-2.5 pb-2 rounded-t-3xl">
          <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto" />
        </div>

        <div className="px-4 pb-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 shrink-0 rounded-2xl bg-tertiary/15 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">sports_esports</span>
            </span>
            <div className="min-w-0">
              <h3 className="font-extrabold text-on-surface font-display break-words">
                Challenge {friendName}
              </h3>
              <p className="text-xs text-on-surface-variant">
                A live Grammar Battle — fastest correct answer wins.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">Topic</span>
            <BattleTopicPicker value={topic} onChange={setTopic} compact />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">Questions</span>
            <div className="flex gap-2">
              {ROUND_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRounds(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    rounds === n
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                  }`}
                  aria-pressed={rounds === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSend({ topic, questionCount: rounds })}
            disabled={sending || !topic}
            className="w-full py-3.5 rounded-2xl bg-tertiary text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-tertiary/25 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${sending ? 'animate-spin' : ''}`}>
              {sending ? 'progress_activity' : 'swords'}
            </span>
            {sending ? 'Setting up the room…' : 'Send challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
