import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import FormattedText from '../components/FormattedText';

export default function MistakeNotebook() {
  const { tamilEnabled, speakText } = useLearning();
  const [mistakes, setMistakes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMistakes();
  }, []);

  async function loadMistakes() {
    try {
      const res = await api.getMistakes();
      if (res.success && res.data) {
        setMistakes(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkReviewed = async (id) => {
    try {
      await api.markMistakeReviewed(id);
      setMistakes((prev) => prev.map((m) => (m.id === id ? { ...m, is_reviewed: 1 } : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMistakes = filter === 'unreviewed'
    ? mistakes.filter((m) => !m.is_reviewed)
    : mistakes;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Mistake Notebook (Smart Revision)
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'நீங்கள் செய்த தவறுகளை மீளாய்வு செய்து சரியான வடிவத்தைக் கற்றுக் கொள்ளுங்கள்.' : 'Review past errors from quizzes, exercises, speaking, and AI doctor to cement mastery.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          All Mistakes ({mistakes.length})
        </button>
        <button
          onClick={() => setFilter('unreviewed')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === 'unreviewed'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Needs Revision ({mistakes.filter((m) => !m.is_reviewed).length})
        </button>
      </div>

      {/* Mistake Cards */}
      {filteredMistakes.length === 0 ? (
        <div className="p-5 sm:p-8 text-center bg-surface-container-lowest rounded-3xl border border-surface-variant/70">
          <span className="material-symbols-outlined text-[44px] text-secondary mb-2">task_alt</span>
          <h3 className="text-lg font-bold text-on-surface font-display">Mistake Notebook Clean!</h3>
          <p className="text-xs text-on-surface-variant mt-1">No recorded mistakes to review right now. Keep practicing!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredMistakes.map((m) => (
            <div
              key={m.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col gap-3 ${
                m.is_reviewed
                  ? 'bg-surface-container-lowest/60 border-surface-variant/40 opacity-75'
                  : 'bg-surface-container-lowest border-surface-variant/80 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-error-container/40 text-error uppercase tracking-wider">
                  Source: {m.source_type || 'Exercise'}
                </span>
                
                {m.is_reviewed ? (
                  <span className="text-xs font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Reviewed
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkReviewed(m.id)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Mark as Mastered
                  </button>
                )}
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-error-container/20 border border-error/20">
                  <span className="text-[10px] font-bold text-error uppercase block">What was answered</span>
                  <p className="text-sm font-medium text-on-surface line-through opacity-80 mt-0.5">{m.original_input}</p>
                </div>

                <div className="p-3 rounded-2xl bg-secondary-container/20 border border-secondary/20 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-secondary uppercase block">Correct English Form</span>
                    <p className="text-sm font-bold text-on-surface mt-0.5">{m.corrected_input}</p>
                  </div>
                  <button
                    onClick={() => speakText(m.corrected_input)}
                    className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                  </button>
                </div>
              </div>

              {/* Explanation notes */}
              {(m.explanation || m.tamil_explanation) && (
                <div className="p-3 rounded-2xl bg-surface-container text-xs flex flex-col gap-1.5">
                  {m.explanation && (
                    <div className="text-on-surface font-medium">
                      <span className="font-bold mr-1">💡 Why:</span>
                      <FormattedText text={m.explanation} highlightVariant="badge" />
                    </div>
                  )}
                  {tamilEnabled && m.tamil_explanation && (
                    <div className="text-primary font-tamil font-medium">
                      <span className="font-bold mr-1">📖 விளக்கம்:</span>
                      <FormattedText text={m.tamil_explanation} highlightVariant="badge" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
