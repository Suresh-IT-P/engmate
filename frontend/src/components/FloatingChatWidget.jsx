import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function FloatingChatWidget() {
  const { user } = useAuth();
  const { tamilEnabled, speakText } = useLearning();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);
  const [directRooms, setDirectRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [checkGrammar, setCheckGrammar] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeRoom) {
      loadMessages(activeRoom.id);
      const interval = setInterval(() => {
        loadMessages(activeRoom.id, false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeRoom?.id]);

  // Hide the global widget wherever the screen has a chat of its own,
  // otherwise two FABs land in the same bottom-right corner.
  if (location.pathname === '/chat' || location.pathname.startsWith('/battle')) {
    return null;
  }

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
        if (!activeRoom && allRooms.length > 0) {
          setActiveRoom(allRooms[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMessages(roomId, shouldScroll = true) {
    try {
      const res = await api.getRoomMessages(roomId, 30);
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
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed right-3 sm:right-6 z-50 flex flex-col items-end bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6">
      
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-96 h-[480px] max-h-[calc(100dvh-11rem)] mb-3 bg-surface-container-lowest/95 backdrop-blur-2xl rounded-3xl border border-surface-variant/80 shadow-2xl flex flex-col overflow-hidden animate-slide-in">
          
          {/* Header */}
          <div className="p-3 bg-surface-container-high border-b border-surface-variant/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[22px]">forum</span>
              
              {/* Room Select Dropdown */}
              <select
                value={activeRoom?.id || ''}
                onChange={(e) => {
                  const allRooms = [...publicRooms, ...directRooms];
                  const found = allRooms.find(r => r.id === e.target.value);
                  if (found) setActiveRoom(found);
                }}
                className="px-2.5 py-1 rounded-xl bg-surface-container border border-surface-variant text-xs font-bold text-on-surface focus:outline-none max-w-[190px] truncate"
              >
                <optgroup label="Public Practice Rooms">
                  {publicRooms.map(r => (
                    <option key={r.id} value={r.id}>🌐 {r.name}</option>
                  ))}
                </optgroup>
                {directRooms.length > 0 && (
                  <optgroup label="Direct Messages">
                    {directRooms.map(r => (
                      <option key={r.id} value={r.id}>💬 {r.friend_name || r.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/chat?room=${activeRoom?.id || ''}`)}
                className="w-7 h-7 shrink-0 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                title="Open Full Page Chat"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 shrink-0 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 min-w-0 p-3 overflow-y-auto flex flex-col gap-2.5 hide-scrollbar">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = user && msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-0.5 max-w-[85%] ${
                      isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-on-surface-variant px-1">
                      {isMe ? 'You' : msg.sender_name}
                    </span>

                    <div
                      className={`p-2.5 rounded-2xl text-xs font-medium relative ${
                        isMe
                          ? 'bg-primary text-white rounded-tr-none shadow-sm'
                          : 'bg-surface-container text-on-surface rounded-tl-none border border-surface-variant/60'
                      }`}
                    >
                      <p className="whitespace-pre-wrap pr-4">{msg.message_text}</p>
                      <button
                        onClick={() => speakText(msg.message_text)}
                        className={`absolute top-1.5 right-1 opacity-70 hover:opacity-100 ${
                          isMe ? 'text-white' : 'text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">volume_up</span>
                      </button>
                    </div>

                    {/* AI Grammar Correction Badge */}
                    {msg.grammar_correction && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-on-surface w-full mt-0.5">
                        <span className="font-bold text-amber-600 dark:text-amber-400">👉 Better: </span>
                        "{msg.grammar_correction.improved}"
                      </div>
                    )}

                    {/* Tamil Translation */}
                    {tamilEnabled && msg.tamil_translation && !msg.grammar_correction && (
                      <div className="text-[10px] font-tamil text-secondary px-1">
                        📖 {msg.tamil_translation}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center p-4 text-on-surface-variant gap-1">
                <span className="material-symbols-outlined text-[32px] text-outline">chat</span>
                <p className="text-xs font-bold">Start practicing English!</p>
                <p className="text-[10px]">Type a message below to join the chat.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-2 bg-surface-container-high border-t border-surface-variant/50 flex gap-1.5">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type in English..."
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-variant/80 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md disabled:opacity-40 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>

        </div>
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 shrink-0 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-surface-variant text-on-surface-variant rotate-90'
            : 'bg-gradient-to-tr from-primary to-secondary text-white ring-4 ring-primary/20'
        }`}
        title="Open Practice Chat Room Popup"
        aria-label="Chat Popup"
      >
        <span className="material-symbols-outlined text-[28px]">
          {isOpen ? 'close' : 'forum'}
        </span>
      </button>

    </div>
  );
}
