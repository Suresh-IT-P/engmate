import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

const ROUNDS_PER_MATCH = 10;

/** Shown only if the battle bank cannot be reached. */
const FALLBACK_QUESTIONS = [
  {
    question: 'Which sentence is grammatically correct?',
    options: ["She doesn't like tea.", "She don't likes tea.", "She doesn't likes tea.", 'She is not like tea.'],
    correct: "She doesn't like tea."
  },
  {
    question: "Choose the correct preposition: 'He is interested ______ learning English.'",
    options: ['in', 'on', 'at', 'about'],
    correct: 'in'
  }
];

export default function AIBattle({ topic }) {
  const { user, profile } = useAuth();
  const { triggerCelebration, speakText } = useLearning();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'countdown' | 'battle' | 'results'
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOpt, setSelectedOpt] = useState('');
  const [answered, setAnswered] = useState(false);
  const [battleQuestions, setBattleQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const topicId = topic?.id || 'mixed';
  const topicTitle = topic?.title || 'Mixed Challenge';

  const botOpponent = {
    name: 'Kavitha (Bot Challenger)',
    level: 'A2',
    avatar: '🤖'
  };

  /** A fresh set is drawn for every match, so no two rounds repeat. */
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.getBattleQuestions(topicId, ROUNDS_PER_MATCH);
      const items = (res?.data?.questions || []).map((q) => ({
        question: q.question,
        options: q.options,
        correct: q.options[q.ans],
        explanation: q.explanation
      }));
      setBattleQuestions(items.length ? items : FALLBACK_QUESTIONS);
      return items.length ? items : FALLBACK_QUESTIONS;
    } catch (err) {
      setBattleQuestions(FALLBACK_QUESTIONS);
      return FALLBACK_QUESTIONS;
    } finally {
      setLoadingQuestions(false);
    }
  };

  const currentQ = battleQuestions[currentRound];

  // Match countdown
  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setTimeout(() => {
        setGameState('battle');
        setTimeLeft(10);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Round timer
  useEffect(() => {
    if (gameState === 'battle' && !answered) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Time ran out
        handleAnswer('');
      }
    }
  }, [gameState, timeLeft, answered]);

  const handleStartMatch = async () => {
    setPlayerScore(0);
    setBotScore(0);
    setCurrentRound(0);
    setSelectedOpt('');
    setAnswered(false);
    // Load before the countdown so the first question is ready on time.
    await fetchQuestions();
    setGameState('countdown');
  };

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelectedOpt(opt);
    setAnswered(true);

    const isUserCorrect = opt === currentQ.correct;
    if (isUserCorrect) {
      setPlayerScore((prev) => prev + 100 + timeLeft * 10);
    }

    // Bot has 75% chance of correct answer
    const botCorrect = Math.random() < 0.75;
    if (botCorrect) {
      setBotScore((prev) => prev + 100 + Math.floor(Math.random() * 50));
    }

    setTimeout(() => {
      if (currentRound < battleQuestions.length - 1) {
        setCurrentRound((prev) => prev + 1);
        setSelectedOpt('');
        setAnswered(false);
        setTimeLeft(10);
      } else {
        setGameState('results');
        if (isUserCorrect) triggerCelebration();
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-nav min-h-[80vh] flex flex-col justify-center">
      
      {/* 1. LOBBY STATE */}
      {gameState === 'lobby' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 shrink-0 rounded-3xl bg-gradient-to-tr from-error to-primary text-white flex items-center justify-center shadow-lg shadow-error/25">
            <span className="material-symbols-outlined text-[44px]">sports_kabaddi</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">Live Grammar Battle</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1 font-tamil">
              நேரடி 1v1 இலக்கண சவால். 10 வினாடிகளில் சரியான விடையைத் தேர்ந்தெடுங்கள்!
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 p-4 rounded-2xl bg-surface-container w-full max-w-sm">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-bold mt-1">{profile?.full_name || 'You'}</span>
            </div>

            <span className="text-lg font-extrabold text-error">VS</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 shrink-0 rounded-full bg-surface-container-highest text-2xl flex items-center justify-center">
                {botOpponent.avatar}
              </div>
              <span className="text-xs font-bold mt-1">{botOpponent.name.split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-[18px]">category</span>
            <span className="text-xs font-bold text-primary">Topic: {topicTitle}</span>
          </div>

          <button
            onClick={handleStartMatch}
            disabled={loadingQuestions}
            className="w-full max-w-sm py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-lg shadow-primary/25 hover:bg-primary-container hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
          >
            {loadingQuestions ? 'Loading questions…' : 'Find Match & Start Duel!'}
          </button>
        </div>
      )}

      {/* 2. MATCH COUNTDOWN */}
      {gameState === 'countdown' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Match Starting</span>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-error font-display animate-ping">READY!</h2>
        </div>
      )}

      {/* 3. BATTLE IN PROGRESS */}
      {gameState === 'battle' && currentQ && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-xl flex flex-col gap-5">
          
          {/* Battle Header & Live Scores */}
          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-surface-container gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase block text-on-surface-variant">You</span>
                <span className="text-sm font-extrabold text-primary font-display">{playerScore} pts</span>
              </div>
            </div>

            {/* Timer Pill */}
            <div className="px-2.5 sm:px-3 py-1 shrink-0 rounded-full bg-error text-white font-extrabold text-xs flex items-center gap-1 shadow-sm animate-pulse">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {timeLeft}s
            </div>

            <div className="flex items-center gap-2 text-right min-w-0 flex-1 justify-end">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase block text-on-surface-variant truncate">Kavitha (Bot)</span>
                <span className="text-sm font-extrabold text-error font-display">{botScore} pts</span>
              </div>
              <div className="w-8 h-8 shrink-0 rounded-full bg-surface-container-highest text-base flex items-center justify-center">
                {botOpponent.avatar}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center py-2">
            <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">
              Round {currentRound + 1} of {battleQuestions.length}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface font-display break-words">{currentQ.question}</h3>
          </div>

          {/* 4 Rapid Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              let style = 'bg-surface-container-high text-on-surface hover:bg-surface-variant';
              if (answered) {
                if (opt === currentQ.correct) {
                  style = 'bg-secondary-container text-secondary font-bold border-2 border-secondary';
                } else if (selectedOpt === opt) {
                  style = 'bg-error-container text-error font-bold border-2 border-error';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3.5 sm:p-4 rounded-2xl font-semibold text-sm text-left transition-all active:scale-[0.98] break-words ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. RESULTS SCREEN */}
      {gameState === 'results' && (
        <div className="p-5 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl text-center flex flex-col items-center gap-5 animate-[slideIn_0.3s_ease-out]">
          <div className="w-20 h-20 shrink-0 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary shadow-inner">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {playerScore >= botScore ? 'emoji_events' : 'sentiment_satisfied'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
            {playerScore >= botScore ? 'VICTORY! 🎉' : 'DEFEAT!'}
          </h2>
          <p className="text-xs font-tamil text-on-surface-variant font-medium">
            {playerScore >= botScore ? 'அருமையான வெற்றி! நீங்கள் சிறப்பாக விளையாடினீர்கள்.' : 'நன்றாக விளையாடினீர்கள்! மீண்டும் ஒருமுறை முயற்சி செய்யுங்கள்.'}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <div className="p-4 rounded-2xl bg-surface-container text-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Your Score</span>
              <p className="text-2xl font-bold text-primary font-display">{playerScore}</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-container text-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Opponent</span>
              <p className="text-2xl font-bold text-error font-display">{botScore}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full max-w-sm">
            <button
              onClick={handleStartMatch}
              className="flex-1 min-w-0 py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-container transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="flex-1 min-w-0 py-3.5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-variant transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
