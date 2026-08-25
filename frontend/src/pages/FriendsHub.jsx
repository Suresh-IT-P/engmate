import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function FriendsHub() {
  const { tamilEnabled } = useLearning();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('my_friends'); // 'my_friends' | 'find' | 'requests'

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Friends & Requests state
  const [friendsData, setFriendsData] = useState({ friends: [], incomingRequests: [], outgoingRequests: [] });
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    try {
      const res = await api.getFriends();
      if (res.success && res.data) {
        setFriendsData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.searchFriends(searchQuery.trim());
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      const res = await api.sendFriendRequest({ friendId });
      if (res.success) {
        setActionMsg('Friend request sent!');
        setTimeout(() => setActionMsg(''), 3000);
        // Refresh search and friend lists
        if (searchQuery) handleSearch({ preventDefault: () => {} });
        await loadFriends();
      }
    } catch (err) {
      alert(err.message || 'Failed to send friend request');
    }
  };

  const handleRespond = async (friendshipId, action) => {
    try {
      const res = await api.respondFriendRequest({ friendshipId, action });
      if (res.success) {
        setActionMsg(action === 'accept' ? 'Friend request accepted!' : 'Request declined');
        setTimeout(() => setActionMsg(''), 3000);
        await loadFriends();
      }
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      await api.removeFriend(friendId);
      await loadFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const startDirectChat = async (friendId) => {
    try {
      const res = await api.getOrCreateDirectRoom(friendId);
      if (res.success && res.data) {
        navigate(`/messages/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalIncoming = friendsData.incomingRequests?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">group</span>
            {tamilEnabled ? 'நண்பர்கள் வட்டம்' : 'Friends & Learning Circle'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {tamilEnabled
              ? 'பயனர்பெயர் (Username) அல்லது தொலைபேசி எண் (Phone Number) மூலம் நண்பர்களை தேடி சேருங்கள்.'
              : 'Find friends by Username or Phone Number to practice English together!'}
          </p>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">forum</span>
          Open Chat Rooms
        </button>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-primary-fixed/40 border border-primary/30 text-primary font-bold text-xs text-center animate-fade-in">
          ✨ {actionMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-2xl bg-surface-container p-1 border border-surface-variant/50">
        <button
          onClick={() => setActiveTab('my_friends')}
          className={`flex-1 min-w-0 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'my_friends'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">group</span>
          My Friends ({friendsData.friends?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('find')}
          className={`flex-1 min-w-0 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'find'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person_search</span>
          Find Friends
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 min-w-0 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'requests'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          Requests
          {totalIncoming > 0 && (
            <span className="w-5 h-5 shrink-0 rounded-full bg-error text-white font-bold text-[10px] flex items-center justify-center">
              {totalIncoming}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MY FRIENDS */}
      {activeTab === 'my_friends' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[36px]">progress_activity</span>
            </div>
          ) : friendsData.friends && friendsData.friends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friendsData.friends.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0 border border-primary/20">
                      {f.avatar_url ? (
                        <img src={f.avatar_url} alt={f.full_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        f.full_name?.charAt(0) || 'F'
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-on-surface truncate">{f.full_name}</h3>
                      <p className="text-xs text-on-surface-variant truncate">
                        {f.username ? `@${f.username}` : f.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary">
                          {f.current_level || 'A1'}
                        </span>
                        <span className="text-[10px] font-bold text-tertiary">⭐ {f.xp || 0} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => startDirectChat(f.id)}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      Chat
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(f.id)}
                      className="text-[10px] text-outline hover:text-error transition-colors text-center"
                    >
                      Unfriend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 sm:p-8 text-center bg-surface-container-lowest rounded-3xl border border-surface-variant/60 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-outline-variant text-[48px]">group_add</span>
              <p className="text-sm font-bold text-on-surface">No friends added yet!</p>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Search for your friends by Username or Phone Number to start practicing English together.
              </p>
              <button
                onClick={() => setActiveTab('find')}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md"
              >
                Search Friends Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FIND FRIENDS (By Username or Phone Number) */}
      {activeTab === 'find' && (
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 min-w-0 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Username (e.g. @karthik) or Phone Number..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-surface-variant/80 text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Quick Tips */}
          <div className="p-4 rounded-2xl bg-surface-container-high text-xs text-on-surface-variant flex items-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lightbulb</span>
            <div>
              <p className="font-bold text-on-surface">Search Tips:</p>
              <p>Type a friend's exact username, phone number, or full name to add them to your practice circle.</p>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Search Results ({searchResults.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {u.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-on-surface truncate">{u.full_name}</h4>
                        <p className="text-xs text-on-surface-variant truncate">
                          {u.username ? `@${u.username}` : u.phone_number ? u.phone_number : u.email}
                        </p>
                      </div>
                    </div>

                    {u.friendStatus === 'friends' ? (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-secondary-container/50 text-secondary">
                        Friends
                      </span>
                    ) : u.friendStatus === 'request_sent' ? (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-surface-variant text-outline">
                        Sent
                      </span>
                    ) : u.friendStatus === 'request_received' ? (
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="px-3 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs"
                      >
                        Accept Request
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(u.id)}
                        className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-container transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-6">
          {/* Incoming Requests */}
          <div>
            <h3 className="text-sm font-bold text-on-surface font-display mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">inbox</span>
              Incoming Friend Requests ({friendsData.incomingRequests?.length || 0})
            </h3>

            {friendsData.incomingRequests && friendsData.incomingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friendsData.incomingRequests.map((r) => (
                  <div
                    key={r.friendship_id}
                    className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {r.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-on-surface truncate">{r.full_name}</h4>
                        <p className="text-xs text-on-surface-variant truncate">
                          {r.username ? `@${r.username}` : r.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRespond(r.friendship_id, 'accept')}
                        className="px-3 py-1.5 rounded-xl bg-secondary text-white font-bold text-xs shadow-sm hover:bg-secondary/90"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(r.friendship_id, 'reject')}
                        className="px-3 py-1.5 rounded-xl border border-surface-variant text-outline font-bold text-xs hover:bg-surface-variant"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant italic">No pending incoming requests.</p>
            )}
          </div>

          {/* Outgoing Requests */}
          <div>
            <h3 className="text-sm font-bold text-on-surface font-display mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">send</span>
              Sent Requests ({friendsData.outgoingRequests?.length || 0})
            </h3>

            {friendsData.outgoingRequests && friendsData.outgoingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friendsData.outgoingRequests.map((r) => (
                  <div
                    key={r.friendship_id}
                    className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant font-bold flex items-center justify-center shrink-0">
                        {r.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-on-surface truncate">{r.full_name}</h4>
                        <p className="text-xs text-on-surface-variant truncate">
                          {r.username ? `@${r.username}` : r.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-surface-variant text-outline">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant italic">No sent requests.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
