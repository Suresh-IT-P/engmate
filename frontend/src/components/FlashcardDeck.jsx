import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function FlashcardDeck({ words = [], onFinish }) {
  const [deck, setDeck] = useState(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const { speakText, tamilEnabled } = useLearning();

  // Keep deck in sync if words prop updates
  React.useEffect(() => {
    setDeck(words);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words]);

  const handleShuffle = () => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  const currentWord = deck[currentIndex];

  if (!currentWord) {
    return (
      <div className="p-5 sm:p-8 bg-surface-container-lowest rounded-3xl text-center border border-surface-variant/70">
        <div className="w-16 h-16 shrink-0 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mx-auto mb-3">
          <span className="material-symbols-outlined text-[36px]">task_alt</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface font-display">All Caught Up!</h3>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">No flashcards due for review right now.</p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-colors"
        >
          Back to Vocabulary
        </button>
      </div>
    );
  }

  const handleRate = async (qualityScore) => {
    try {
      await api.submitWordReview(currentWord.id, qualityScore);
      setReviewedCount((prev) => prev + 1);
      setIsFlipped(false);

      if (currentIndex < deck.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        if (onFinish) onFinish();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-4">
      {/* Top Controls: Shuffle & Progress Counter */}
      <div className="w-full flex flex-wrap items-center justify-between text-xs font-bold text-on-surface-variant px-2 gap-2">
        <div className="flex items-center gap-2">
          <span>Card {currentIndex + 1} of {deck.length}</span>
          {isShuffled && (
            <span className="px-2 py-0.5 rounded-md bg-tertiary-container/60 text-on-tertiary-container text-[10px]">
              🎲 Shuffled
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Shuffle Flashcard Deck"
            className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-primary text-[11px] font-bold flex items-center gap-1 border border-surface-variant/60 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">shuffle</span>
            Shuffle
          </button>
          
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase text-[10px] truncate max-w-[42vw]">
            {currentWord.level_id} • {currentWord.part_of_speech || 'noun'}
          </span>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[320px] sm:min-h-[360px] bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-variant/80 p-4 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl relative overflow-hidden gap-3"
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none"></div>

        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-outline">Tap to Reveal Meaning</span>
            
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary capitalize tracking-tight break-words max-w-full">
              {currentWord.word}
            </h2>

            {currentWord.phonetic && (
              <span className="text-sm font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                /{currentWord.phonetic}/
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(currentWord.word);
              }}
              className="w-12 h-12 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center mt-2 shadow-sm transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
            </button>
          </div>
        ) : (
          /* BACK OF CARD */
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3 text-left animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold font-display text-primary capitalize">{currentWord.word}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(currentWord.word);
                  }}
                  className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>

              {/* English Meaning */}
              <div className="p-3 rounded-2xl bg-surface-container">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">English Meaning</span>
                <p className="text-sm font-medium text-on-surface mt-0.5">{currentWord.meaning}</p>
              </div>

              {/* Tamil Meaning */}
              {tamilEnabled && (
                <div className="p-3 rounded-2xl bg-secondary-container/20 border border-secondary/20">
                  <span className="text-[10px] font-bold text-secondary uppercase font-tamil">தமிழ் அர்த்தம்</span>
                  <p className="text-base font-bold text-on-surface font-tamil mt-0.5">{currentWord.tamil_meaning}</p>
                </div>
              )}

              {/* Example sentence */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <div className="p-3 rounded-2xl bg-tertiary-container/10 border border-tertiary/20">
                  <span className="text-[10px] font-bold text-tertiary uppercase">Example</span>
                  <p className="text-xs font-medium text-on-surface italic mt-0.5">"{currentWord.examples[0].sentence}"</p>
                  {tamilEnabled && currentWord.examples[0].tamil_translation && (
                    <p className="text-xs font-tamil text-on-surface-variant mt-1">{currentWord.examples[0].tamil_translation}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-surface-variant/40">
          <span className="text-[11px] text-outline font-medium">
            {isFlipped ? 'How easily did you recall this word?' : 'Tap card to flip'}
          </span>
        </div>
      </div>

      {/* SM-2 Spaced Repetition Action Buttons (Visible when card is flipped) */}
      {isFlipped && (
        <div className="grid grid-cols-4 gap-2 w-full animate-[slideIn_0.2s_ease-out]">
          <button
            onClick={() => handleRate(1)}
            className="py-2.5 px-2 rounded-2xl bg-error-container/50 border border-error/30 hover:bg-error-container text-on-error-container text-center flex flex-col items-center transition-transform active:scale-95"
          >
            <span className="text-xs font-bold">Again</span>
            <span className="text-[10px] opacity-75">1 Day</span>
          </button>

          <button
            onClick={() => handleRate(3)}
            className="py-2.5 px-2 rounded-2xl bg-tertiary-container/40 border border-tertiary/30 hover:bg-tertiary-container text-on-tertiary-container text-center flex flex-col items-center transition-transform active:scale-95"
          >
            <span className="text-xs font-bold">Hard</span>
            <span className="text-[10px] opacity-75">3 Days</span>
          </button>

          <button
            onClick={() => handleRate(4)}
            className="py-2.5 px-2 rounded-2xl bg-primary-fixed border border-primary/30 hover:bg-primary-fixed-dim text-on-primary-fixed text-center flex flex-col items-center transition-transform active:scale-95"
          >
            <span className="text-xs font-bold">Good</span>
            <span className="text-[10px] opacity-75">6 Days</span>
          </button>

          <button
            onClick={() => handleRate(5)}
            className="py-2.5 px-2 rounded-2xl bg-secondary-container border border-secondary/30 hover:bg-secondary-fixed text-on-secondary-container text-center flex flex-col items-center transition-transform active:scale-95"
          >
            <span className="text-xs font-bold">Easy</span>
            <span className="text-[10px] opacity-75">14+ Days</span>
          </button>
        </div>
      )}
    </div>
  );
}
