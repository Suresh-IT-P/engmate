import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import FormattedText, { renderInline } from './FormattedText';

export default function ExerciseEngine({ exercise, onFinish, onExit }) {
  const { speakText, triggerCelebration, tamilEnabled } = useLearning();
  const { refreshUserData } = useAuth();

  const fullPool = exercise.questions || [];
  const [selectedCount, setSelectedCount] = useState('all');
  const [activeQuestions, setActiveQuestions] = useState(fullPool);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [scrambledWords, setScrambledWords] = useState([]);
  const [selectedScrambled, setSelectedScrambled] = useState([]);
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const [showCountMenu, setShowCountMenu] = useState(false);
  
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answersLog, setAnswersLog] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);

  // Sync questions if exercise prop changes or count limit changes
  React.useEffect(() => {
    applyQuestionCount(selectedCount, fullPool);
  }, [exercise, selectedCount]);

  const applyQuestionCount = (countKey, pool = fullPool) => {
    let list = [...pool];
    if (countKey !== 'all') {
      const num = parseInt(countKey, 10);
      if (!isNaN(num) && num > 0) {
        list = list.slice(0, num);
      }
    }
    setActiveQuestions(list);
    setCurrentIndex(0);
    setAnswersLog([]);
  };

  const handleSetCount = (countKey) => {
    setSelectedCount(countKey);
    setShowCountMenu(false);
  };

  const handleShuffleQuestions = () => {
    let pool = [...fullPool];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    if (selectedCount !== 'all') {
      const num = parseInt(selectedCount, 10);
      if (!isNaN(num) && num > 0) {
        pool = pool.slice(0, num);
      }
    }
    setActiveQuestions(pool);
    setCurrentIndex(0);
    setIsShuffleActive(true);
    setAnswersLog([]);
  };

  const questions = activeQuestions;
  const currentQ = questions[currentIndex];
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Initialize scrambled chips or shuffled MCQ options when question changes
  React.useEffect(() => {
    if (currentQ && (exercise.exercise_type === 'sentence_order' || currentQ.question_text.includes('/'))) {
      const parts = currentQ.question_text.split('/').map((s) => s.trim()).filter(Boolean);
      // Shuffle chips
      const shuffled = [...parts].sort(() => Math.random() - 0.5);
      setScrambledWords(shuffled);
      setSelectedScrambled([]);
      setShuffledOptions([]);
    } else {
      setScrambledWords([]);
      setSelectedScrambled([]);

      // Always shuffle MCQ options so the correct answer is randomly positioned
      if (currentQ?.options && Array.isArray(currentQ.options) && currentQ.options.length > 0) {
        const rawOpts = currentQ.options.map(opt => 
          typeof opt === 'string' ? { option_text: opt } : opt
        );
        const shuffled = [...rawOpts];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledOptions(shuffled);
      } else {
        setShuffledOptions([]);
      }
    }
    setSelectedOption('');
    setFillBlankInput('');
    setHasChecked(false);
  }, [currentIndex, currentQ, exercise.exercise_type]);

  if (!currentQ && !summaryResult) {
    return (
      <div className="p-5 sm:p-8 text-center bg-surface rounded-3xl">
        <p className="text-on-surface-variant">No questions available for this exercise.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  // Handle checking answer
  const handleCheckAnswer = () => {
    let userAns = '';
    if (scrambledWords.length > 0) {
      userAns = selectedScrambled.join(' ');
    } else if (fillBlankInput) {
      userAns = fillBlankInput.trim();
    } else {
      userAns = selectedOption;
    }

    const correctAns = String(currentQ.correct_answer).trim();
    const correct = userAns.toLowerCase() === correctAns.toLowerCase();

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      speakText('Correct! Great job!');
    } else {
      speakText('Not quite right. Let us check why.');
    }

    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        answer: userAns,
        isCorrect: correct,
      },
    ]);
  };

  // Move to next question or submit final
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Final submission to backend
      setSubmitting(true);
      try {
        const payload = {
          answers: answersLog,
          durationSeconds: 90,
        };
        const res = await api.submitExercise(exercise.id, payload);
        if (res.success && res.data) {
          setSummaryResult(res.data);
          triggerCelebration();
          await refreshUserData();
        }
      } catch (err) {
        console.error('Error submitting exercise:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Render Summary Screen when finished
  if (summaryResult) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-6 bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/70 flex flex-col items-center text-center animate-[slideIn_0.3s_ease-out]">
        <div className="w-20 h-20 shrink-0 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-4 shadow-inner">
          <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emoji_events
          </span>
        </div>

        <h2 className="text-2xl font-bold text-on-surface font-display mb-1">Exercise Complete!</h2>
        <p className="text-sm text-on-surface-variant mb-6 font-tamil">பயிற்சி வெற்றிகரமாக முடிந்தது!</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="p-3.5 rounded-2xl bg-surface-container flex flex-col items-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Accuracy</span>
            <span className="text-xl font-bold text-secondary font-display">{summaryResult.accuracy}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container flex flex-col items-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase">XP Won</span>
            <span className="text-xl font-bold text-primary font-display">+{summaryResult.xpAwarded} XP</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container flex flex-col items-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Streak</span>
            <span className="text-xl font-bold text-error font-display">{summaryResult.currentStreak} 🔥</span>
          </div>
        </div>

        <button
          onClick={onFinish || onExit}
          className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-container transition-all"
        >
          Continue to Next Challenge
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / Math.max(1, activeQuestions.length)) * 100);

  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-[520px] bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/70 overflow-hidden relative">
      
      {/* Header with Progress Bar, Question Count Selector, Shuffle & Exit */}
      <div className="p-3 sm:p-4 border-b border-surface-variant/40 flex items-center justify-between gap-2 sm:gap-2.5 relative">
        <button
          onClick={onExit}
          title="Exit Exercise"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Progress bar */}
        <div className="flex-1 min-w-0 h-2.5 bg-surface-variant rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Question Count Selector Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowCountMenu(!showCountMenu)}
            title="Set Number of Questions"
            className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary text-[11px] font-bold flex items-center gap-1 border border-surface-variant/60 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>{selectedCount === 'all' ? fullPool.length : selectedCount}<span className="hidden xs:inline"> Qs</span></span>
            <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
          </button>

          {showCountMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-surface-container-lowest border border-surface-variant/80 rounded-2xl shadow-xl p-1.5 z-30 animate-[fadeIn_0.15s_ease-out]">
              <span className="text-[10px] font-bold text-on-surface-variant px-2.5 py-1 block uppercase tracking-wider">
                Question Count
              </span>
              {[
                { label: '3 Questions', val: '3' },
                { label: '5 Questions', val: '5' },
                { label: '10 Questions', val: '10' },
                { label: 'All Available', val: 'all' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleSetCount(opt.val)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCount === opt.val
                      ? 'bg-primary text-white shadow-xs'
                      : 'hover:bg-surface-variant text-on-surface'
                  } gap-3`}
                >
                  <span>{opt.label}</span>
                  {selectedCount === opt.val && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleShuffleQuestions}
          title="Shuffle Questions & Puzzles"
          className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary text-[11px] font-bold flex items-center gap-1 border border-surface-variant/60 transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">shuffle</span>
          <span className="hidden xs:inline">{isShuffleActive ? 'Shuffled' : 'Shuffle'}</span>
        </button>

        <span className="text-xs font-bold text-on-surface-variant font-display shrink-0">
          {currentIndex + 1} / {activeQuestions.length}
        </span>
      </div>

      {/* Question Content Body */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-4">
          
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                {exercise.title || 'Practice Question'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-display leading-snug break-words">
                {currentQ.question_text}
              </h3>
              {tamilEnabled && currentQ.tamil_subtext && (
                <p className="text-sm font-tamil text-on-surface-variant mt-1 font-medium">
                  {currentQ.tamil_subtext}
                </p>
              )}
            </div>
            <button
              onClick={() => speakText(currentQ.question_text)}
              className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors"
              title="Listen to question"
            >
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
          </div>

          {/* Option Type 1: Sentence Scramble Chips */}
          {scrambledWords.length > 0 ? (
            <div className="flex flex-col gap-4 my-3">
              {/* Target Drop Zone */}
              <div className="min-h-[56px] p-3 rounded-2xl bg-surface-container border-2 border-dashed border-primary/40 flex flex-wrap gap-2 items-center">
                {selectedScrambled.length === 0 && (
                  <span className="text-xs text-outline-variant italic">Tap words below to arrange the sentence...</span>
                )}
                {selectedScrambled.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!hasChecked) {
                        setSelectedScrambled(selectedScrambled.filter((_, i) => i !== idx));
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Source Word Bank */}
              <div className="flex flex-wrap gap-2">
                {scrambledWords.map((w, idx) => {
                  const isUsed = selectedScrambled.includes(w);
                  return (
                    <button
                      key={idx}
                      disabled={isUsed || hasChecked}
                      onClick={() => setSelectedScrambled([...selectedScrambled, w])}
                      className={`px-3.5 py-2 rounded-xl text-sm font-bold border transition-all ${
                        isUsed
                          ? 'opacity-20 border-transparent bg-surface-container'
                          : 'bg-surface-container-high border-surface-variant hover:border-primary/50 text-on-surface shadow-sm active:scale-95'
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (shuffledOptions.length > 0 || (currentQ.options && currentQ.options.length > 0)) ? (
            /* Option Type 2: Multiple Choice Options with Randomized Order */
            <div className="grid grid-cols-1 gap-2.5 my-2">
              {(shuffledOptions.length > 0 ? shuffledOptions : (currentQ.options || [])).map((opt, optIdx) => {
                const optText = typeof opt === 'string' ? opt : opt.option_text;
                const optTamil = typeof opt === 'object' ? opt.tamil_text : '';
                const isSelected = selectedOption === optText;
                const choiceLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                let optionStyle = 'bg-surface-container-high border-surface-variant/70 text-on-surface hover:border-primary/40';
                let letterStyle = 'bg-surface-variant text-on-surface-variant';

                if (hasChecked) {
                  if (optText.toLowerCase() === currentQ.correct_answer.toLowerCase() || opt.is_correct) {
                    optionStyle = 'bg-secondary-container/40 border-secondary text-secondary font-bold';
                    letterStyle = 'bg-secondary text-white font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-error-container/40 border-error text-error font-bold';
                    letterStyle = 'bg-error text-white font-bold';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-primary-fixed border-primary text-primary font-bold shadow-sm';
                  letterStyle = 'bg-primary text-white font-bold';
                }

                return (
                  <button
                    key={opt.id || optText || optIdx}
                    disabled={hasChecked}
                    onClick={() => setSelectedOption(optText)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer ${optionStyle} gap-3`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${letterStyle}`}>
                        {choiceLetter}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium break-words">{optText}</span>
                        {tamilEnabled && optTamil && (
                          <span className="text-xs font-tamil opacity-75 mt-0.5">{optTamil}</span>
                        )}
                      </div>
                    </div>
                    {hasChecked && (optText.toLowerCase() === currentQ.correct_answer.toLowerCase() || opt.is_correct) && (
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Option Type 3: Fill in the blank text input */
            <div className="my-3">
              <input
                type="text"
                value={fillBlankInput}
                disabled={hasChecked}
                onChange={(e) => setFillBlankInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-2xl bg-surface-container border-2 border-surface-variant/80 font-bold text-base text-on-surface outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Footer / Feedback Drawer */}
        <div className="mt-4 pt-4 border-t border-surface-variant/40">
          {hasChecked && (
            <div
              className={`p-4 rounded-2xl mb-4 flex flex-col gap-1.5 animate-[slideIn_0.2s_ease-out] ${
                isCorrect
                  ? 'bg-secondary-container/30 border border-secondary/30 text-on-secondary-container'
                  : 'bg-error-container/30 border border-error/30 text-on-error-container'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">
                  {isCorrect ? 'check_circle' : 'cancel'}
                </span>
                <span className="font-bold text-sm font-display">
                  {isCorrect ? 'Correct! Awesome job!' : 'Incorrect Answer'}
                </span>
              </div>

              {!isCorrect && (
                <p className="text-xs font-bold mt-1">
                  Correct Answer: <span className="underline">{currentQ.correct_answer}</span>
                </p>
              )}

              {currentQ.explanation && (
                <div className="text-xs mt-1">
                  <span className="font-bold mr-1">Explanation:</span>
                  {renderInline(currentQ.explanation, 'badge')}
                </div>
              )}

              {tamilEnabled && currentQ.tamil_explanation && (
                <div className="text-xs font-tamil font-medium text-primary mt-1">
                  <span className="font-bold mr-1">📖 விளக்கம்:</span>
                  {renderInline(currentQ.tamil_explanation, 'badge')}
                </div>
              )}
            </div>
          )}

          {!hasChecked ? (
            <button
              disabled={!selectedOption && !fillBlankInput && selectedScrambled.length === 0}
              onClick={handleCheckAnswer}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-40 transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-secondary text-white font-bold text-sm shadow-md shadow-secondary/25 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : currentIndex < questions.length - 1 ? (
                'Continue to Next Question'
              ) : (
                'Finish Exercise & Collect XP'
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
