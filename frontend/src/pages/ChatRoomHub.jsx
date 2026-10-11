import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { useCall } from '../context/CallContext';
import { api } from '../services/api';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatRoomHub() {
  const { tamilEnabled, speakText } = useLearning();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Call context for online presence and voice calling
  const { isFriendOnline, startCall } = useCall();

  const activeRoomIdFromUrl = searchParams.get('room');

  // Main tab: 'friends' (Friends & DMs) vs 'circles' (Practice Circles)
  const [mainTab, setMainTab] = useState(activeRoomIdFromUrl ? 'circles' : 'friends');

  // Public & direct rooms
  const [publicRooms, setPublicRooms] = useState([]);
  const [directRooms, setDirectRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);

  // Friends & Practice peers state
  const [friendsList, setFriendsList] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [searchingFriends, setSearchingFriends] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [openingChatWith, setOpeningChatWith] = useState(null);

  // Messages state for Circles tab
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedCorrectionId, setCopiedCorrectionId] = useState(null);
  const [localReactions, setLocalReactions] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    loadRooms();
    loadFriendsData();
  }, []);

  useEffect(() => {
    if (activeRoomIdFromUrl) {
      setMainTab('circles');
    }
  }, [activeRoomIdFromUrl]);

  useEffect(() => {
    if (activeRoom && mainTab === 'circles') {
      loadMessages(activeRoom.id, true);
      const interval = setInterval(() => {
        loadMessages(activeRoom.id, false);
      }, 5000); // 5s auto refresh
      return () => clearInterval(interval);
    }
  }, [activeRoom?.id, mainTab]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  async function loadRooms() {
    setLoadingRooms(true);
    try {
      const res = await api.getChatRooms();
      if (res.success && res.data) {
        const pub = res.data.publicRooms || [];
        const dir = res.data.directRooms || [];
        setPublicRooms(pub);
        setDirectRooms(dir);

        const allRooms = [...pub, ...dir];
        if (activeRoomIdFromUrl) {
          const found = allRooms.find(r => r.id === activeRoomIdFromUrl);
          if (found) setActiveRoom(found);
          else if (allRooms.length > 0) setActiveRoom(allRooms[0]);
        } else if (allRooms.length > 0) {
          setActiveRoom(allRooms[0]);
        }
      }
    } catch (err) {
      console.error('Error loading chat rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  }

  async function loadFriendsData() {
    try {
      const res = await api.getFriends();
      if (res.success && res.data) {
        setFriendsList(res.data.friends || []);
        setIncomingRequests(res.data.incomingRequests || []);
      }
    } catch (err) {
      console.error('Error loading friends:', err);
    }
  }

  async function handleSearch(query) {
    setFriendSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchingFriends(false);
      return;
    }
    setSearchingFriends(true);
    try {
      const res = await api.searchFriends(query.trim());
      if (res.success && res.data) {
        setSearchResults(res.data || []);
      }
    } catch (err) {
      console.error('Error searching friends:', err);
    } finally {
      setSearchingFriends(false);
    }
  }

  async function loadMessages(roomId, shouldScroll = true) {
    if (shouldScroll) setLoadingMessages(true);
    try {
      const res = await api.getRoomMessages(roomId);
      if (res.success && res.data) {
        setMessages(res.data);
        if (shouldScroll) {
          setTimeout(() => scrollToBottom(false), 50);
        }
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      if (shouldScroll) setLoadingMessages(false);
    }
  }

  const handleSelectRoom = (room) => {
    setShowRoomPicker(false);
    if (room.room_type === 'direct') {
      navigate(`/messages/${room.id}`);
      return;
    }
    setActiveRoom(room);
    setSearchParams({ room: room.id });
    setMainTab('circles');
  };

  const handleOpenDirectChat = async (peerId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOpeningChatWith(peerId);
    try {
      const res = await api.getOrCreateDirectRoom(peerId);
      if (res.success && res.data) {
        navigate(`/messages/${res.data.id}`);
      } else {
        alert(res.message || 'Could not start chat');
      }
    } catch (err) {
      console.error('Failed to open chat:', err);
      alert(err.message || 'Could not start chat');
    } finally {
      setOpeningChatWith(null);
    }
  };

  const handleStartCall = async (peer) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.getOrCreateDirectRoom(peer.id);
      if (res.success && res.data) {
        startCall(peer, res.data.id);
        navigate(`/messages/${res.data.id}`);
      }
    } catch (err) {
      alert(err.message || 'Could not start call');
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      const res = await api.sendFriendRequest({ friendId });
      if (res.success) {
        setFeedbackMsg('Friend request sent! 🤝');
        setTimeout(() => setFeedbackMsg(''), 3000);
        loadFriendsData();
        if (friendSearchQuery) handleSearch(friendSearchQuery);
      }
    } catch (err) {
      alert(err.message || 'Failed to send friend request');
    }
  };

  const handleRespondRequest = async (friendshipId, action) => {
    try {
      const res = await api.respondFriendRequest({ friendshipId, action });
      if (res.success) {
        setFeedbackMsg(action === 'accept' ? 'Friend request accepted! 🌟' : 'Request declined');
        setTimeout(() => setFeedbackMsg(''), 3000);
        loadFriendsData();
        loadRooms();
      }
    } catch (err) {
      alert(err.message || 'Failed to respond');
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const textToSend = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await api.sendChatMessage(activeRoom.id, {
        messageText: textToSend,
        checkGrammar
      });

      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data]);
        setTimeout(() => scrollToBottom(true), 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSpeak = (msgId, text) => {
    if (!text) return;
    setActiveSpeakingId(msgId);
    speakText(text);
    setTimeout(() => {
      setActiveSpeakingId(null);
    }, Math.min(Math.max(text.length * 80, 1500), 7000));
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        if (transcript) {
          setNewMessage(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };
      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };
      rec.onend = () => setIsRecording(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const handleAddReaction = (msgId, emoji) => {
    setLocalReactions(prev => {
      const current = prev[msgId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [msgId]: current.filter(e => e !== emoji) };
      }
      return { ...prev, [msgId]: [...current, emoji] };
    });
  };

  const handleCopyImproved = (msgId, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCorrectionId(msgId);
    setTimeout(() => setCopiedCorrectionId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-4rem-4rem)] sm:h-[calc(100vh-4rem)] flex flex-col bg-surface-container-lowest sm:border sm:border-surface-variant/40 sm:rounded-3xl shadow-xs overflow-hidden relative">

      {/* TOP NAVIGATION SEGMENTED BAR */}
      <div className="px-3 sm:px-4 py-2 border-b border-surface-variant/40 bg-surface/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
        
        {/* Modern Segmented Control */}
        <div className="flex items-center p-1 bg-surface-container rounded-2xl border border-surface-variant/50">
          <button
            type="button"
            onClick={() => setMainTab('friends')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'friends'
                ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-[1.02]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">people</span>
            <span>Friends & DMs</span>
            {friendsList.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                mainTab === 'friends' ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface'
              }`}>
                {friendsList.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMainTab('circles')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'circles'
                ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-[1.02]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">groups</span>
            <span>Practice Circles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
              mainTab === 'circles' ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface'
            }`}>
              {publicRooms.length}
            </span>
          </button>
        </div>

        {/* Right side quick actions */}
        <div className="flex items-center gap-1.5">
          {mainTab === 'circles' ? (
            <>
              {/* Room Switcher */}
              <button
                type="button"
                onClick={() => setShowRoomPicker(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface text-xs font-semibold transition-colors border border-surface-variant/60"
                title="Switch practice room"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
                <span className="hidden xs:inline">Rooms</span>
              </button>

              {/* AI Grammar Doctor Toggle */}
              <button
                type="button"
                onClick={() => setCheckGrammar(prev => !prev)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
                  checkGrammar
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-surface-variant/40 border-surface-variant text-on-surface-variant'
                }`}
                title="Toggle AI English Doctor grammar check"
              >
                <span className={`material-symbols-outlined text-[15px] ${checkGrammar ? 'text-primary' : 'text-outline'}`}>
                  auto_fix_high
                </span>
                <span className="hidden sm:inline">AI Doctor</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-full font-bold ${
                  checkGrammar ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {checkGrammar ? 'ON' : 'OFF'}
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/friends')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-secondary text-xs font-bold transition-colors border border-secondary/30"
              title="Open full friends hub"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Find & Invite</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (mainTab === 'circles' && activeRoom) loadMessages(activeRoom.id, true);
              else {
                loadFriendsData();
                if (friendSearchQuery) handleSearch(friendSearchQuery);
              }
            }}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST / ALERT */}
      {feedbackMsg && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 text-xs font-bold flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg('')} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: FRIENDS & DIRECT MESSAGES VIEW                                     */}
      {/* ========================================================================= */}
      {mainTab === 'friends' && (
        <div className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-3 sm:p-5 flex flex-col gap-4 bg-gradient-to-b from-surface/20 to-surface-container-lowest/80">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={friendSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by friend's username, phone, or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-surface-variant/60 text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
            />
            {friendSearchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* SEARCH RESULTS IF SEARCHING */}
          {friendSearchQuery.trim().length >= 2 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Search Results ({searchResults.length})
              </span>

              {searchingFriends ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-on-surface-variant">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResults.map((peer) => {
                    const isOpening = openingChatWith === peer.id;
                    const online = isFriendOnline(peer.id);

                    return (
                      <div
                        key={peer.id}
                        className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-variant/50 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                              {peer.full_name?.charAt(0) || peer.username?.charAt(0) || 'U'}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container-lowest ${
                              online ? 'bg-emerald-500' : 'bg-outline-variant'
                            }`} />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-on-surface truncate">{peer.full_name || peer.username}</h4>
                            <p className="text-[11px] text-on-surface-variant truncate">@{peer.username || 'user'}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface-variant text-on-surface-variant">
                              Level {peer.current_level || 'A1'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={isOpening}
                            onClick={() => handleOpenDirectChat(peer.id)}
                            className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
                          >
                            {isOpening ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[15px]">chat</span>
                                <span>Chat</span>
                              </>
                            )}
                          </button>

                          {peer.friendStatus !== 'friends' && (
                            <button
                              type="button"
                              onClick={() => handleSendFriendRequest(peer.id)}
                              className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface border border-surface-variant/60"
                              title="Add Friend"
                            >
                              <span className="material-symbols-outlined text-[17px]">person_add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-surface-variant/40 text-center text-xs text-on-surface-variant">
                  No users found matching "{friendSearchQuery}".
                </div>
              )}
            </div>
          )}

          {/* INCOMING FRIEND REQUESTS (IF ANY) */}
          {incomingRequests.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Incoming Friend Requests ({incomingRequests.length})</span>
              </div>
              <div className="flex flex-col gap-2">
                {incomingRequests.map((req) => (
                  <div key={req.friendship_id} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest border border-amber-500/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center shrink-0 text-sm">
                        {req.full_name?.charAt(0) || req.username?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-on-surface truncate">{req.full_name || req.username}</h4>
                        <p className="text-[11px] text-on-surface-variant truncate">Level: {req.current_level || 'A1'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRespondRequest(req.friendship_id, 'accept')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req.friendship_id, 'decline')}
                        className="px-2.5 py-1 rounded-xl bg-surface-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container active:scale-95 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT DIRECT CONVERSATIONS (IF ANY) */}
          {directRooms.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
                  Recent Conversations ({directRooms.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {directRooms.map((room) => {
                  const online = isFriendOnline(room.friend_id);
                  return (
                    <button
                      key={room.id}
                      onClick={() => navigate(`/messages/${room.id}`)}
                      className="p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container text-left border border-surface-variant/40 hover:border-primary/40 transition-all flex items-center gap-3 group shadow-xs hover:shadow-md"
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                          {room.friend_name?.charAt(0) || 'F'}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-container-lowest ${
                          online ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-outline-variant'
                        }`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">
                            {room.friend_name || 'Friend'}
                          </h4>
                          {room.last_message_at && (
                            <span className="text-[10px] text-on-surface-variant shrink-0">
                              {formatTime(room.last_message_at)}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                          {room.last_message || 'Start chatting in English...'}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold ${online ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface-variant'}`}>
                            {online ? '● Online' : 'Offline'}
                          </span>
                          {room.friend_level && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-surface-variant text-on-surface-variant">
                              {room.friend_level}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MY FRIENDS LIST */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">handshake</span>
                My Friends ({friendsList.length})
              </span>
              <button
                type="button"
                onClick={() => navigate('/friends')}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                <span>Find & Add</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {friendsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {friendsList.map((friend) => {
                  const online = isFriendOnline(friend.id);
                  const isOpening = openingChatWith === friend.id;

                  return (
                    <div
                      key={friend.id}
                      className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-variant/50 flex items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-secondary to-secondary-container text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {friend.full_name?.charAt(0) || friend.username?.charAt(0) || 'F'}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-container-lowest ${
                            online ? 'bg-emerald-500 animate-pulse' : 'bg-outline-variant'
                          }`} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-on-surface truncate">
                            {friend.full_name || friend.username}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {friend.username ? `@${friend.username}` : 'Practice Partner'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-bold ${online ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface-variant'}`}>
                              {online ? 'Online' : 'Offline'}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-secondary/10 text-secondary">
                              {friend.current_level || 'A2'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* 💬 Direct Chat */}
                        <button
                          type="button"
                          disabled={isOpening}
                          onClick={() => handleOpenDirectChat(friend.id)}
                          className="px-3 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-primary/25 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                          title="Open 1-on-1 direct chat"
                        >
                          {isOpening ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                              <span>Chat</span>
                            </>
                          )}
                        </button>

                        {/* 📞 Voice Call */}
                        <button
                          type="button"
                          onClick={() => handleStartCall(friend)}
                          className={`p-2 rounded-xl font-bold transition-all active:scale-95 border ${
                            online
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/25 hover:bg-emerald-600'
                              : 'bg-surface-container text-on-surface-variant border-surface-variant hover:text-primary'
                          }`}
                          title={online ? 'Start live voice call' : 'Friend looks offline — click to call anyway'}
                        >
                          <span className="material-symbols-outlined text-[18px]">call</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-surface-container-low/50 border border-surface-variant/40 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">group_add</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">No friends added yet</h4>
                <p className="text-xs text-on-surface-variant max-w-xs">
                  Search by your friend's username, mobile number, or full name above to start chatting and voice calling.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/friends')}
                  className="mt-1 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRACTICE CIRCLES (PUBLIC ROOMS) VIEW                               */}
      {/* ========================================================================= */}
      {mainTab === 'circles' && (
        <>
          {/* ROOM SUBHEADER */}
          <div className="px-3.5 py-2 border-b border-surface-variant/40 bg-surface/80 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRoomPicker(true)}
              className="flex items-center gap-2 min-w-0 text-left hover:bg-surface-container/60 p-1 -ml-1 rounded-xl transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                    {activeRoom?.name || 'English Practice Room'}
                  </h3>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
                    expand_more
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 leading-none mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                  <span className="truncate">{activeRoom?.description || 'Public live practice circle'}</span>
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowRoomPicker(true)}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
              <span>Change Room</span>
            </button>
          </div>

          {/* MESSAGE STREAM */}
          <div className="flex-1 min-w-0 p-3 sm:p-5 overflow-y-auto overscroll-contain flex flex-col gap-3.5 bg-gradient-to-b from-surface/20 to-surface-container-lowest/80">
            {loadingMessages ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-on-surface-variant font-medium">Loading conversation...</p>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = user && (
                  String(msg.sender_id) === String(user.id) ||
                  (user.username && msg.sender_username && msg.sender_username.toLowerCase() === user.username.toLowerCase()) ||
                  (user.name && msg.sender_name && msg.sender_name.toLowerCase() === user.name.toLowerCase())
                );

                const isSpeakingThis = activeSpeakingId === msg.id;
                const hasCorrection = Boolean(msg.grammar_correction?.improved);
                const reactions = [
                  ...(msg.reactions || []).map(r => r.emoji),
                  ...(localReactions[msg.id] || [])
                ];

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 max-w-[88%] sm:max-w-[75%] ${
                      isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    {/* Sender Label */}
                    {!isMe && (
                      <div className="flex items-center gap-1.5 px-1 text-[11px] text-on-surface-variant font-bold">
                        <span className="text-on-surface">{msg.sender_name || 'English Learner'}</span>
                        {msg.sender_level && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-surface-variant text-on-surface-variant font-semibold">
                            {msg.sender_level}
                          </span>
                        )}
                        <span className="text-[10px] text-outline">• {formatTime(msg.created_at)}</span>
                      </div>
                    )}

                    {/* Chat Bubble Container */}
                    <div
                      className={`relative rounded-3xl p-3.5 sm:p-4 shadow-sm transition-all flex flex-col gap-2 ${
                        isMe
                          ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-br-xs shadow-primary/15'
                          : 'bg-surface-container-low border border-surface-variant/60 text-on-surface rounded-bl-xs'
                      }`}
                    >
                      {/* Message Content */}
                      <p className="text-sm sm:text-base leading-relaxed break-words font-medium select-text">
                        {msg.message_text}
                      </p>

                      {/* Tamil Translation */}
                      {tamilEnabled && msg.tamil_translation && (
                        <div className={`pt-1.5 mt-1 border-t text-xs font-serif leading-relaxed ${
                          isMe ? 'border-white/20 text-white/90' : 'border-surface-variant/60 text-primary'
                        }`}>
                          <span className="text-[10px] uppercase tracking-wide opacity-75 font-sans mr-1">தமிழ்:</span>
                          {msg.tamil_translation}
                        </div>
                      )}

                      {/* AI English Grammar Doctor Correction Card */}
                      {hasCorrection && (
                        <div className={`mt-1.5 p-2.5 rounded-2xl text-xs flex flex-col gap-1.5 border ${
                          isMe
                            ? 'bg-black/25 border-white/20 text-white'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold flex items-center gap-1 text-[11px]">
                              <span className="material-symbols-outlined text-[15px] text-emerald-400">auto_fix_high</span>
                              AI English Doctor
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyImproved(msg.id, msg.grammar_correction.improved)}
                              className="text-[10px] opacity-80 hover:opacity-100 flex items-center gap-0.5 underline font-medium"
                            >
                              <span className="material-symbols-outlined text-[12px]">content_copy</span>
                              {copiedCorrectionId === msg.id ? 'Copied!' : 'Copy'}
                            </button>
                          </div>

                          <div className="font-bold text-xs">
                            <span className="opacity-75 font-normal">Better: </span>
                            "{msg.grammar_correction.improved}"
                          </div>

                          {msg.grammar_correction.explanation && (
                            <p className="text-[11px] opacity-85 leading-tight">
                              💡 {msg.grammar_correction.explanation}
                            </p>
                          )}

                          {tamilEnabled && msg.grammar_correction.tamilExplanation && (
                            <p className="text-[11px] opacity-85 font-serif leading-tight">
                              விளக்கம்: {msg.grammar_correction.tamilExplanation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bubble Bottom Controls: TTS Speak, Time & Reactions */}
                      <div className={`flex items-center justify-between gap-2 pt-1 mt-0.5 border-t ${
                        isMe ? 'border-white/15' : 'border-surface-variant/40'
                      }`}>
                        {/* Audio Listen TTS Button */}
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.grammar_correction?.improved || msg.message_text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                            isMe
                              ? (isSpeakingThis ? 'bg-white text-primary scale-105' : 'bg-white/15 hover:bg-white/25 text-white')
                              : (isSpeakingThis ? 'bg-primary text-white scale-105' : 'bg-surface-variant/60 hover:bg-surface-variant text-on-surface-variant hover:text-primary')
                          }`}
                          title="Listen to native English pronunciation"
                        >
                          <span className={`material-symbols-outlined text-[14px] ${isSpeakingThis ? 'animate-bounce' : ''}`}>
                            volume_up
                          </span>
                          <span>{isSpeakingThis ? 'Speaking...' : 'Listen'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] ${isMe ? 'text-white/70' : 'text-on-surface-variant'}`}>
                            {formatTime(msg.created_at)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddReaction(msg.id, '👏')}
                            className={`p-1 rounded-full text-xs hover:scale-110 active:scale-95 transition-transform ${
                              isMe ? 'text-white/80 hover:text-white' : 'text-on-surface-variant hover:text-primary'
                            }`}
                            title="React with clap"
                          >
                            👏
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reactions Display */}
                    {reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 px-1 -mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Array.from(new Set(reactions)).map((emoji, idx) => {
                          const count = reactions.filter(e => e === emoji).length;
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-full text-[11px] bg-surface-container-high border border-surface-variant/60 shadow-xs flex items-center gap-0.5"
                            >
                              <span>{emoji}</span>
                              {count > 1 && <span className="text-[10px] font-bold text-on-surface-variant">{count}</span>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">chat_bubble_outline</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-on-surface">No messages yet</h4>
                  <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-0.5">
                    Start the conversation! Type a message below to practice speaking English.
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE INPUT BAR */}
          <form onSubmit={handleSendMessage} className="p-2 sm:p-3 bg-surface-container-high/90 border-t border-surface-variant/40 flex gap-2 items-center shrink-0">
            
            {/* Speech-to-Text Microphone Dictation */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-2xl transition-all flex items-center justify-center shrink-0 border ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary border-surface-variant/60 hover:bg-surface-container'
              }`}
              title={isRecording ? 'Listening... Tap to stop' : 'Tap to speak English (Voice Dictation)'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? 'mic' : 'mic_none'}
              </span>
            </button>

            {/* Text Input with AI Doctor indicator */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  isRecording 
                    ? 'Listening to your voice...' 
                    : (activeRoom ? `Type message in ${activeRoom.name}...` : 'Type your message...')
                }
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-surface-container-lowest border border-surface-variant/80 text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
              />
              {checkGrammar && newMessage.trim().length > 3 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" title="AI Grammar Doctor is checking">
                  <span className="material-symbols-outlined text-[16px] animate-pulse">auto_fix_high</span>
                </span>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-xs shadow-md shadow-primary/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              aria-label="Send message"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* SLIDE-UP ROOM SWITCHER MODAL DRAWER */}
      {showRoomPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl border border-surface-variant/60 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Sheet Header */}
            <div className="p-4 border-b border-surface-variant/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">swap_horiz</span>
                <h3 className="font-bold text-sm text-on-surface font-display">Select Practice Circle</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRoomPicker(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Room List in Sheet */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 pt-1">
                Public Rooms
              </span>

              {publicRooms.map((r) => {
                const isActive = activeRoom?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRoom(r)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 border ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-primary-container text-white border-transparent shadow-md shadow-primary/20'
                        : 'bg-surface-container-low/60 hover:bg-surface-container text-on-surface border-surface-variant/40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">groups</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs truncate">{r.name}</h4>
                        {r.message_count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            isActive ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface-variant'
                          }`}>
                            {r.message_count} msgs
                          </span>
                        )}
                      </div>
                      {tamilEnabled && r.tamil_name && (
                        <p className={`text-[11px] truncate ${isActive ? 'text-white/80' : 'text-primary'}`}>
                          {r.tamil_name}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sheet Footer */}
            <div className="p-3 border-t border-surface-variant/40 bg-surface/50 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setShowRoomPicker(false);
                  setMainTab('friends');
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">people</span>
                Switch to Friends & DMs
              </button>
              <button
                type="button"
                onClick={() => setShowRoomPicker(false)}
                className="px-3 py-1.5 rounded-xl bg-surface-variant text-on-surface-variant font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
