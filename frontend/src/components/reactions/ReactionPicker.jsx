import React, { useEffect, useRef } from 'react';
import { MESSAGE_REACTIONS, REACTION_GROUPS, haptic } from './reactionKit';

/**
 * Two ways to pick a reaction.
 *
 * `ReactionRow` is the quick strip that appears against a message: eight
 * emoji, each a 44px tap target, sized so the row fits a 320px screen.
 *
 * `ReactionSheet` is the full palette. On a phone it is a bottom sheet within
 * thumb reach rather than a centred dialog — a popover anchored to a message
 * near the top of the list would otherwise open where the thumb cannot go.
 */

export function ReactionRow({ onPick, onMore, active = [], className = '' }) {
  return (
    <div
      className={`flex items-center gap-0.5 xs:gap-1 p-1.5 rounded-full bg-surface-container-lowest border border-surface-variant/70 shadow-xl animate-reaction-pop ${className}`}
      role="group"
      aria-label="React to this message"
    >
      {MESSAGE_REACTIONS.map((emoji, i) => {
        const mine = active.includes(emoji);
        return (
          <button
            key={emoji}
            onClick={(e) => { haptic(); onPick(emoji, e.currentTarget); }}
            style={{ animationDelay: `${i * 24}ms` }}
            className={`w-9 h-9 xs:w-10 xs:h-10 shrink-0 rounded-full text-lg xs:text-xl leading-none flex items-center justify-center transition-transform animate-reaction-chip active:scale-90 hover:scale-125 ${
              mine ? 'bg-primary-fixed ring-2 ring-primary' : 'hover:bg-surface-variant'
            }`}
            aria-label={`React ${emoji}`}
            aria-pressed={mine}
          >
            {emoji}
          </button>
        );
      })}

      {onMore && (
        <button
          onClick={onMore}
          className="w-9 h-9 xs:w-10 xs:h-10 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          aria-label="More reactions"
        >
          <span className="material-symbols-outlined text-[20px]">add_reaction</span>
        </button>
      )}
    </div>
  );
}

export function ReactionSheet({ open, onClose, onPick, active = [] }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[75dvh] overflow-y-auto overscroll-contain bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl border border-surface-variant/70 shadow-2xl pb-safe sm:pb-4 animate-sheet-up sm:animate-pop-in"
        role="dialog"
        aria-label="Choose a reaction"
      >
        {/* Grab handle — the affordance that says "this sheet drags/dismisses". */}
        <div className="sticky top-0 bg-surface-container-lowest pt-2.5 pb-2 rounded-t-3xl">
          <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto" />
        </div>

        {REACTION_GROUPS.map((group) => (
          <div key={group.label} className="px-4 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              {group.label}
              <span className="font-tamil normal-case tracking-normal ml-1.5 opacity-70">({group.tamil})</span>
            </span>

            <div className="grid grid-cols-6 gap-1.5">
              {group.emojis.map((emoji, i) => {
                const mine = active.includes(emoji);
                return (
                  <button
                    key={emoji}
                    onClick={(e) => { haptic(); onPick(emoji, e.currentTarget); }}
                    style={{ animationDelay: `${i * 18}ms` }}
                    className={`aspect-square min-h-[44px] rounded-2xl text-2xl flex items-center justify-center transition-transform animate-reaction-chip active:scale-90 hover:scale-110 ${
                      mine ? 'bg-primary-fixed ring-2 ring-primary' : 'bg-surface-container hover:bg-surface-variant'
                    }`}
                    aria-label={`React ${emoji}`}
                    aria-pressed={mine}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The little count chips shown under a message that has reactions. */
export function ReactionChips({ summary = [], onToggle, className = '' }) {
  if (!summary.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {summary.map((r) => (
        <button
          key={r.emoji}
          onClick={(e) => { haptic(8); onToggle(r.emoji, e.currentTarget); }}
          className={`px-2 py-0.5 min-h-[26px] rounded-full text-xs font-bold flex items-center gap-1 border transition-all animate-reaction-chip active:scale-90 ${
            r.mine
              ? 'bg-primary-fixed border-primary text-primary'
              : 'bg-surface-container border-surface-variant/70 text-on-surface-variant hover:border-primary/50'
          }`}
          aria-label={`${r.emoji} ${r.count}${r.mine ? ', including you. Tap to remove' : '. Tap to add yours'}`}
          aria-pressed={r.mine}
        >
          <span className="text-sm leading-none">{r.emoji}</span>
          {r.count > 1 && <span className="tabular-nums">{r.count}</span>}
        </button>
      ))}
    </div>
  );
}
