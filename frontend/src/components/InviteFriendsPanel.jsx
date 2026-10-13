import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCall } from '../context/CallContext';
import { haptic } from './reactions/reactionKit';

/**
 * Friends list in the battle lobby, each with an Invite button.
 *
 * An invite goes through the friend chat (`game:invite`): an online friend
 * gets the "challenged you" pop-up wherever they are, and every friend gets a
 * challenge card in your conversation, so an offline one still sees it later.
 */
export default function InviteFriendsPanel({ battleRoomId }) {
  const { socket, connected, isFriendOnline } = useCall();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  // friendId -> 'sending' | 'sent' | error message
  const [status, setStatus] = useState({});

  useEffect(() => {
    let alive = true;
    api.getFriends()
      .then((res) => { if (alive && res?.success) setFriends(res.data?.friends || []); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // Online friends first: they can join right now.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return friends
      .filter((f) => !q || `${f.full_name || ''} ${f.username || ''}`.toLowerCase().includes(q))
      .sort((a, b) => (isFriendOnline(b.id) - isFriendOnline(a.id))
        || (a.full_name || '').localeCompare(b.full_name || ''));
  }, [friends, query, isFriendOnline]);

  const invite = async (friend) => {
    if (!socket || !connected || status[friend.id] === 'sending') return;
    setStatus((s) => ({ ...s, [friend.id]: 'sending' }));
    try {
      const room = await api.getOrCreateDirectRoom(friend.id);
      if (!room?.success || !room.data?.id) throw new Error('Could not reach your chat with them.');

      const res = await new Promise((resolve) => {
        const timer = setTimeout(() => resolve({ ok: false, error: 'The server did not answer. Try again.' }), 8000);
        socket.emit('game:invite', { roomId: room.data.id, battleRoomId }, (r) => { clearTimeout(timer); resolve(r); });
      });
      if (!res?.ok) throw new Error(res?.error || 'Could not send the invite.');

      haptic(15);
      setStatus((s) => ({ ...s, [friend.id]: 'sent' }));
    } catch (err) {
      setStatus((s) => ({ ...s, [friend.id]: err.message }));
    }
  };

  return (
    <div className="w-full max-w-sm text-left">
      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 mb-1.5">
        <span className="material-symbols-outlined text-[14px]">group_add</span>
        Invite friends
      </span>

      {loading ? (
        <div className="py-4 flex justify-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[24px]">progress_activity</span>
        </div>
      ) : friends.length === 0 ? (
        <div className="p-3 rounded-2xl bg-surface-container text-xs text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] shrink-0">person_search</span>
          <span className="min-w-0">
            No friends yet. <Link to="/friends" className="font-bold text-primary hover:underline">Add friends</Link>, or share the link below.
          </span>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-container border border-surface-variant/60 overflow-hidden">
          {friends.length > 5 && (
            <div className="p-2 border-b border-surface-variant/60">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search friends…"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-variant text-xs outline-none focus:border-primary"
              />
            </div>
          )}

          <ul className="max-h-60 overflow-y-auto overscroll-contain divide-y divide-surface-variant/50">
            {shown.map((f) => {
              const online = isFriendOnline(f.id);
              const st = status[f.id];
              const sent = st === 'sent';
              const sending = st === 'sending';
              const error = st && !sent && !sending ? st : null;
              return (
                <li key={f.id} className="px-3 py-2.5 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                      {(f.full_name || f.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container ${online ? 'bg-secondary' : 'bg-outline-variant'}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-on-surface truncate">{f.full_name || f.username}</p>
                    <p className={`text-[11px] truncate ${error ? 'text-error font-bold' : online ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                      {error || (sent
                        ? (online ? 'Invite sent — they got a pop-up' : 'Invite sent to their chat')
                        : (online ? 'Online now' : 'Offline · gets it in chat'))}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => invite(f)}
                    disabled={sent || sending || !connected}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 disabled:cursor-default ${
                      sent
                        ? 'bg-secondary/15 text-secondary'
                        : 'bg-tertiary text-white shadow-sm shadow-tertiary/25 disabled:opacity-50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${sending ? 'animate-spin' : ''}`}>
                      {sending ? 'progress_activity' : sent ? 'check' : 'send'}
                    </span>
                    {sent ? 'Invited' : error ? 'Retry' : 'Invite'}
                  </button>
                </li>
              );
            })}
            {shown.length === 0 && (
              <li className="px-3 py-3 text-xs text-on-surface-variant text-center">No friend matches “{query}”.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
