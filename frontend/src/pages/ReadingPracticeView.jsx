import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function ReadingPracticeView() {
  const { tamilEnabled, speakText, triggerCelebration } = useLearning();
  const [passages, setPassages] = useState([]);
  const [activePassage, setActivePassage] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassages();
  }, []);

  async function loadPassages() {
    try {
      const res = await api.getReadingPassages();
      if (res.success && res.data) {
        setPassages(res.data);
        if (res.data.length > 0) setActivePassage(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFinishReading = async () => {
    if (!activePassage) return;
    try {
      await api.completeSkillSession({
        skillType: 'reading',
        targetId: activePassage.id,
        durationSeconds: 120,
        xpEarned: 25
      });
      setCompleted(true);
      triggerCelebration();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Reading Comprehension
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'ஆங்கில கட்டுரைகளை வாசித்து புதிய சொற்களைப் புரிந்து கொள்ளுங்கள்.' : 'Read short passages, expand your contextual vocabulary, and improve reading speed.'}
        </p>
      </div>

      {/* Passage Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {passages.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePassage(p);
              setCompleted(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              activePassage?.id === p.id
                ? 'bg-tertiary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {activePassage && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-5">
          
          <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3 gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary uppercase">
                Level {activePassage.level_id} • ~{activePassage.word_count} Words
              </span>
              <h2 className="text-xl font-bold text-on-surface font-display mt-1">{activePassage.title}</h2>
              {tamilEnabled && activePassage.tamil_title && (
                <p className="text-xs font-tamil text-secondary font-medium">{activePassage.tamil_title}</p>
              )}
            </div>

            <button
              onClick={() => speakText(activePassage.passage_text)}
              className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center hover:bg-tertiary/20 transition-colors shrink-0"
              title="Listen to passage"
            >
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
          </div>

          {/* Reading text */}
          <div className="p-4 rounded-2xl bg-surface-container text-base font-normal text-on-surface leading-relaxed whitespace-pre-line">
            {activePassage.passage_text}
          </div>

          {/* Vocabulary Notes Box */}
          {activePassage.vocabulary_notes && (
            <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/20 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-secondary uppercase font-tamil">
                முக்கிய சொற்கள் & அர்த்தங்கள் (Key Vocabulary)
              </span>
              <p className="text-xs font-medium text-on-surface leading-relaxed">
                {activePassage.vocabulary_notes}
              </p>
            </div>
          )}

          {/* Completion Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleFinishReading}
              disabled={completed}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-tertiary text-white font-bold text-xs shadow-md hover:bg-tertiary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {completed ? 'Reading Completed! (+25 XP)' : 'Mark as Read & Earn XP'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
