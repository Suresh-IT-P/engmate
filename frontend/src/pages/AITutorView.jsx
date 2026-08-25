import React, { useState, useEffect, useRef } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import FormattedText from '../components/FormattedText';

export default function AITutorView() {
  const { tamilEnabled, speakText } = useLearning();

  const scenarios = {
    'Friendly Chat': {
      title: 'Friendly Chat',
      welcome: "வணக்கம்! Hello! I am Suresh, your AI English Coach. How can I help you practice your English today? You can ask grammar questions, learn new words, or chat freely.",
      welcomeTamil: "வணக்கம்! நான் சுரேஷ், உங்கள் ஆங்கில ஆசிரியர். இன்று என்ன பயிற்சி செய்யலாம்?",
      chips: ["Explain Present Continuous Tense", "Teach me 3 new vocabulary words", "Check my grammar", "Tell me a common idiom"]
    },
    'Job Interview Simulation': {
      title: 'Job Interview Simulation',
      welcome: "Good morning! Welcome to your interview practice. I will be your interviewer today. Could you please introduce yourself and mention your key strengths?",
      welcomeTamil: "காலை வணக்கம்! உங்கள் நேர்காணல் பயிற்சிக்கு நல்வரவு. உங்களை அறிமுகப்படுத்திக் கொண்டு உங்கள் பலங்களைப் பற்றிக் கூறுங்கள்.",
      chips: ["Hello! My name is...", "I have experience in...", "My greatest strength is..."]
    },
    'Coffee Shop & Travel': {
      title: 'Coffee Shop & Travel',
      welcome: "Hello! Welcome to Green Valley Cafe. Here is our menu. What can I get started for you today?",
      welcomeTamil: "வணக்கம்! கஃபேக்கு நல்வரவு. இன்று உங்களுக்கு என்ன பானம் அல்லது உணவு வேண்டும்?",
      chips: ["I'd like a cappuccino, please", "Can I see the special menu?", "Do you have iced tea?"]
    },
    'Grammar Doctor': {
      title: 'Grammar Doctor',
      welcome: "Welcome to AI Grammar Doctor! Type or speak any English sentence, and I will analyze its grammar, explain the rules, and give you Tamil translations.",
      welcomeTamil: "வாக்கியப் பிழை திருத்திக்கு நல்வரவு! எந்த வாக்கியத்தையும் பதிவிட்டு பிழைகளைத் திருத்திக் கொள்ளுங்கள்.",
      chips: ["Myself Alex from Madurai", "I am go to college daily", "He don't like coffee", "I did not went there"]
    }
  };

  const [selectedScenario, setSelectedScenario] = useState('Friendly Chat');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      content: scenarios['Friendly Chat'].welcome,
      tamil_translation: scenarios['Friendly Chat'].welcomeTamil,
      suggestedReplies: scenarios['Friendly Chat'].chips
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleScenarioChange = (newScenario) => {
    setSelectedScenario(newScenario);
    setConversationId(null);
    const scen = scenarios[newScenario] || scenarios['Friendly Chat'];
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        content: scen.welcome,
        tamil_translation: scen.welcomeTamil,
        suggestedReplies: scen.chips
      }
    ]);
  };

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInputText(text);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSend = async (messageToSend = inputText) => {
    const text = messageToSend.trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithAI({
        message: text,
        conversationId,
        scenario: selectedScenario,
        persona: 'Suresh',
        enableTamil: tamilEnabled
      });

      if (res.success && res.data) {
        setConversationId(res.data.conversationId);
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          content: res.data.reply,
          tamil_translation: res.data.tamilTranslation,
          correction: res.data.correction,
          suggestedReplies: res.data.suggestedReplies || []
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          content: "I'm having trouble connecting right now, but please keep practicing! Try typing another sentence.",
          tamil_translation: "இணைப்பில் சிறு தாமதம் ஏற்பட்டுள்ளது. தொடர்ந்து பயிற்சி செய்யுங்கள்."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to cleanly parse and render **bold** words, *italics*, and linebreaks
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = [];
      const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const matchText = match[0];
        if (matchText.startsWith('**') && matchText.endsWith('**')) {
          parts.push(
            <strong key={`${lIdx}-${match.index}`} className="font-bold text-primary dark:text-primary-container">
              {matchText.slice(2, -2)}
            </strong>
          );
        } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
          parts.push(
            <em key={`${lIdx}-${match.index}`} className="italic opacity-90">
              {matchText.slice(1, -1)}
            </em>
          );
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <span key={lIdx} className="block leading-relaxed">
          {parts.length > 0 ? parts : line}
        </span>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pt-2 flex flex-col h-app-pane">
      
      {/* Persona / Scenario Selector Header */}
      <div className="p-3 bg-surface-container-high rounded-2xl border border-surface-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center relative">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface"></div>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-on-surface font-display leading-tight truncate">Suresh (AI English Coach)</h3>
            <span className="text-[10px] font-bold text-secondary font-tamil">ஆன்லைனில் உள்ளார் (Active)</span>
          </div>
        </div>

        {/* Scenario dropdown */}
        <select
          value={selectedScenario}
          onChange={(e) => handleScenarioChange(e.target.value)}
          className="w-full sm:w-auto sm:max-w-[45%] px-3 py-2 rounded-xl bg-surface-container-lowest text-xs font-bold text-primary border border-surface-variant/60 outline-none cursor-pointer truncate"
        >
          <option value="Friendly Chat">Mode: Friendly Chat</option>
          <option value="Job Interview Simulation">Mode: Job Interview</option>
          <option value="Coffee Shop & Travel">Mode: Cafe & Travel</option>
          <option value="Grammar Doctor">Mode: Grammar Doctor</option>
        </select>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-w-0 overflow-y-auto overscroll-contain px-1 sm:px-2 flex flex-col gap-3 py-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[88%] sm:max-w-[80%] ${
                isUser ? 'self-end flex-row-reverse' : 'self-start'
              } animate-[fadeIn_0.2s_ease-out]`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 min-w-0">
                {/* Main Message Bubble */}
                <div
                  className={`p-3 sm:p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed break-words ${
                    isUser
                      ? 'bg-primary text-white rounded-tr-sm shadow-primary/20'
                      : 'bg-surface-container-lowest border border-surface-variant/60 text-on-surface rounded-tl-sm'
                  }`}
                >
                  <FormattedText text={msg.content} highlightVariant="badge" />

                  {/* Audio button for AI reply */}
                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.content)}
                      className="mt-2 text-primary/70 hover:text-primary flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">volume_up</span>
                      Listen
                    </button>
                  )}
                </div>

                {/* Tamil Translation sub-bubble */}
                {!isUser && tamilEnabled && msg.tamil_translation && (
                  <div className="p-2.5 rounded-xl bg-secondary-container/20 border border-secondary/20 text-xs font-tamil text-on-surface font-medium">
                    <span className="font-bold mr-1">📖</span>
                    <FormattedText text={msg.tamil_translation} highlightVariant="badge" />
                  </div>
                )}

                {/* Suggested replies chips */}
                {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {msg.suggestedReplies.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary-fixed text-on-surface hover:text-primary transition-all border border-surface-variant/60 shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="self-start flex items-center gap-2 text-xs font-bold text-primary p-3 rounded-2xl bg-surface-container-high animate-pulse">
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Maya is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-2 pb-2 shrink-0">
        <div className="p-1.5 rounded-2xl bg-surface-container border border-surface-variant/70 shadow-inner flex items-center gap-2">
          
          {/* Voice Input Button */}
          <button
            onClick={toggleMic}
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-error text-white animate-pulse'
                : 'bg-surface-container-high hover:bg-surface-variant text-outline'
            }`}
            title="Speak using microphone"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'stop' : 'mic'}
            </span>
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Listening to voice...' : 'Ask question or practice speaking...'}
            className="flex-1 min-w-0 bg-transparent py-2 px-1 text-sm font-medium text-on-surface placeholder:text-outline-variant outline-none"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className="w-10 h-10 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
            aria-label="Send"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
