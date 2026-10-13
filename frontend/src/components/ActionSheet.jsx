import React, { useEffect } from 'react';

/**
 * A short list of choices with Cancel at the bottom, used to confirm things
 * that cannot be undone, such as deleting a message or a whole chat.
 *
 * On a phone it is a bottom sheet within thumb reach, like the reaction and
 * challenge sheets; on a wider screen it is a centred card.
 *
 * `actions`: [{ label, icon?, tone?: 'danger', onClick }]. `busy` disables
 * them while the request they started is in flight.
 */
export default function ActionSheet({ open, title, message, actions = [], onClose, busy = false }) {
  useEffect(() => {
    if (!open) return undefined;
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
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-sm bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl border border-surface-variant/70 shadow-2xl px-4 pt-2.5 pb-safe sm:pb-4 animate-sheet-up sm:animate-pop-in"
      >
        <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto mb-3 sm:hidden" />

        {title && <h3 className="font-bold text-base text-on-surface font-display">{title}</h3>}
        {message && <p className="text-xs text-on-surface-variant mt-1 break-words">{message}</p>}

        <div className="flex flex-col gap-2 mt-4">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={busy}
              className={`w-full min-h-[48px] py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 ${
                action.tone === 'danger'
                  ? 'bg-error text-white shadow-md shadow-error/20'
                  : 'bg-surface-container text-on-surface border border-surface-variant/60'
              }`}
            >
              {action.icon && <span className="material-symbols-outlined text-[18px]">{action.icon}</span>}
              {action.label}
            </button>
          ))}

          <button
            onClick={onClose}
            className="w-full min-h-[48px] py-3 rounded-2xl text-sm font-bold text-primary hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
