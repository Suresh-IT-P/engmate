import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import FormattedText from '../components/FormattedText';

export default function ChatRoomHub() {
  const { tamilEnabled, speakText } = useLearning();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeRoomIdFromUrl = searchParams.get('room');

  const [publicRooms, setPublicRooms] = useState([]);
  const [directRooms, setDirectRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [checkGrammar, setCheckGrammar] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom.id);
      const interval = setInterval(() => {
        loadMessages(activeRoom.id, false);
      }, 5000); // 5s auto refresh for new messages
      return () => clearInterval(interval);
    }
  }, [activeRoom?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function loadRooms() {
    try {
      const res = await api.getChatRooms();
      if (res.success && res.data) {
        setPublicRooms(res.data.publicRooms || []);
        setDirectRooms(res.data.directRooms || []);

        const allRooms = [...(res.data.publicRooms || []), ...(res.data.directRooms || [])];
        if (activeRoomIdFromUrl) {
          const found = allRooms.find(r => r.id === activeRoomIdFromUrl);
          if (found) setActiveRoom(found);
          else if (allRooms.length > 0) setActiveRoom(allRooms[0]);
        } else if (allRooms.length > 0) {
          setActiveRoom(allRooms[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages(roomId, shouldScroll = true) {
    try {
      const res = await api.getRoomMessages(roomId);
      if (res.success && res.data) {
        setMessages(res.data);
        if (shouldScroll) {
          setTimeout(scrollToBottom, 100);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSelectRoom = (room) => {
    // A friend DM gets the dedicated screen — it has presence, typing, live
    // delivery and the call button, none of which the public-room pane has.
    if (room.room_type === 'direct') {
      navigate(`/messages/${room.id}`);
      return;
    }
    setActiveRoom(room);
    setSearchParams({ room: room.id });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    if (!user) {
      alert('Please log in to chat.');
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
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-2 flex flex-col md:flex-row gap-3 md:gap-4 h-app-pane">

      {/* LEFT SIDEBAR: ROOM SWITCHER */}
      <div className="w-full md:w-80 bg-surface-container-lowest rounded-3xl border border-surface-variant/80 shadow-sm flex flex-col shrink-0 overflow-hidden">
        <div className="p-3 md:p-4 border-b border-surface-variant/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[22px] md:text-[24px] shrink-0">forum</span>
            <h2 className="font-bold text-sm md:text-base text-on-surface font-display truncate">Chat Hub</h2>
          </div>

          <button
            onClick={() => navigate('/friends')}
            className="px-3 py-2 shrink-0 rounded-xl bg-primary-fixed/40 text-primary font-bold text-xs flex items-center gap-1 hover:bg-primary-fixed/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">group_add</span>
            Friends
          </button>
        </div>

        <div className="flex-1 min-w-0 overflow-x-auto md:overflow-x-visible md:overflow-y-auto p-3 flex flex-row md:flex-col gap-2 md:gap-4 hide-scrollbar">
          {/* Public Chat Rooms */}
          <div className="shrink-0 md:shrink">
            <span className="hidden md:block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-2">
              Public Practice Rooms
            </span>
            <div className="flex flex-row md:flex-col gap-2 md:gap-1">
              {publicRooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRoom(r)}
                  className={`w-auto md:w-full shrink-0 p-2.5 md:p-3 rounded-2xl text-left transition-all flex items-center gap-2 md:gap-3 max-w-[55vw] md:max-w-none ${
                    activeRoom?.id === r.id
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    activeRoom?.id === r.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs truncate">{r.name}</h4>
                    {tamilEnabled && r.tamil_name && (
                      <p className={`text-[10px] truncate ${activeRoom?.id === r.id ? 'text-white/80' : 'text-primary'}`}>
                        {r.tamil_name}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messaging with Friends */}
          <div className="shrink-0 md:shrink">
            <span className="hidden md:block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-2">
              Friend Direct Messages
            </span>
            {directRooms.length > 0 ? (
              <div className="flex flex-row md:flex-col gap-2 md:gap-1">
                {directRooms.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRoom(r)}
                    className={`w-auto md:w-full shrink-0 p-2.5 md:p-3 rounded-2xl text-left transition-all flex items-center gap-2 md:gap-3 max-w-[55vw] md:max-w-none ${
                      activeRoom?.id === r.id
                        ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center shrink-0 border border-secondary/20">
                      {r.friend_name?.charAt(0) || 'F'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs truncate">{r.friend_name}</h4>
                      <p className={`text-[10px] truncate ${activeRoom?.id === r.id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {r.last_message || `@${r.friend_username || 'friend'}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center rounded-2xl bg-surface-container/40">
                <p className="text-[11px] text-on-surface-variant">No direct chats yet.</p>
                <button
                  onClick={() => navigate('/friends')}
                  className="mt-1 text-[11px] text-primary font-bold hover:underline"
                >
                  + Add Friends to Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-3xl border border-surface-variant/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Active Room Header */}
        {activeRoom && (
          <div className="p-3 sm:p-4 border-b border-surface-variant/50 bg-surface-container-high flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-primary text-white font-bold flex items-center justify-center shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[22px]">
                  {activeRoom.room_type === 'direct' ? 'person' : 'forum'}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-on-surface font-display truncate">
                  {activeRoom.room_type === 'direct' ? activeRoom.friend_name || activeRoom.name : activeRoom.name}
                </h3>
                {activeRoom.description && (
                  <p className="hidden sm:block text-xs text-on-surface-variant truncate max-w-md">
                    {activeRoom.description}
                  </p>
                )}
              </div>
            </div>

            {/* AI Grammar Toggle Switch */}
            <label className="flex items-center gap-2 shrink-0 cursor-pointer bg-surface-container-lowest px-2.5 sm:px-3 py-2 rounded-full border border-surface-variant/60">
              <input
                type="checkbox"
                checked={checkGrammar}
                onChange={(e) => setCheckGrammar(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                <span className="hidden sm:inline">AI Grammar Check</span>
                <span className="sm:hidden">AI</span>
              </span>
            </label>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 overflow-y-auto overscroll-contain flex flex-col gap-3">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isMe = user && msg.sender_id === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
                    isMe ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-bold text-on-surface-variant">
                      {isMe ? 'You' : msg.sender_name}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-surface-variant text-outline">
                      {msg.sender_level || 'A1'}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed relative ${
                      isMe
                        ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/20'
                        : 'bg-surface-container text-on-surface rounded-tl-none border border-surface-variant/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message_text}</p>

                    <button
                      onClick={() => speakText(msg.message_text)}
                      className={`absolute top-2 right-2 opacity-70 hover:opacity-100 ${
                        isMe ? 'text-white' : 'text-primary'
                      }`}
                      title="Listen"
                    >
                      <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    </button>
                  </div>

                  {/* AI Grammar Correction Card (if available) */}
                  {msg.grammar_correction && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col gap-1 animate-fade-in w-full">
                      <div className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                        <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                        <span>AI English Doctor:</span>
                      </div>
                      <p className="text-on-surface font-medium">
                        👉 <strong>Better:</strong> "{msg.grammar_correction.improved}"
                      </p>
                      {msg.grammar_correction.explanation && (
                        <p className="text-on-surface-variant text-[11px]">
                          💡 {msg.grammar_correction.explanation}
                        </p>
                      )}
                      {tamilEnabled && msg.grammar_correction.tamilExplanation && (
                        <p className="text-primary font-tamil text-[11px]">
                          📖 {msg.grammar_correction.tamilExplanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tamil Translation (if enabled and present) */}
                  {tamilEnabled && msg.tamil_translation && !msg.grammar_correction && (
                    <div className="px-2 py-0.5 rounded-lg bg-secondary-container/20 text-[11px] font-tamil text-secondary">
                      📖 {msg.tamil_translation}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center p-5 sm:p-8 gap-2">
              <span className="material-symbols-outlined text-outline-variant text-[48px]">chat_bubble_outline</span>
              <p className="text-sm font-bold text-on-surface">No messages in this room yet.</p>
              <p className="text-xs text-on-surface-variant">Be the first to say hello and start practicing English!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 bg-surface-container-high border-t border-surface-variant/50 flex gap-2 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={activeRoom ? `Type message in ${activeRoom.name}...` : 'Type a message...'}
            className="flex-1 min-w-0 px-3.5 sm:px-4 py-3 rounded-2xl bg-surface-container-lowest border border-surface-variant/80 text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-3.5 sm:px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>

    </div>
  );
}
