import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function SentenceDoctorModal({ isOpen, onClose }) {
  const [inputSentence, setInputSentence] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { speakText, tamilEnabled } = useLearning();

  if (!isOpen) return null;

  async function handleCheck(e) {
    e.preventDefault();
    if (!inputSentence.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.correctSentence(inputSentence.trim());
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Bottom sheet on phones, centred dialog from sm: up. */}
      <div className="w-full max-w-lg max-h-[92dvh] bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-variant/80 overflow-y-auto overscroll-contain flex flex-col pb-safe sm:pb-0">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
            </div>
            <div>
              <h3 className="font-bold text-base font-display">AI Sentence Doctor</h3>
              <p className="text-xs text-white/80 font-tamil">வாக்கியப் பிழை திருத்தி</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <form onSubmit={handleCheck} className="flex flex-col gap-3">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Type or paste your English sentence:
            </label>
            <div className="relative">
              <textarea
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                placeholder="e.g. Myself Alex. I am go to college yesterday."
                rows={3}
                className="w-full p-3.5 bg-surface-container rounded-2xl border border-surface-variant/60 font-medium text-sm text-on-surface placeholder:text-outline-variant outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <div className="flex justify-between items-center gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputSentence('I am go to office everyday.')}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface-variant transition-colors"
                >
                  Try Example 1
                </button>
                <button
                  type="button"
                  onClick={() => setInputSentence('Myself Karthik from Madurai.')}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface-variant transition-colors"
                >
                  Try Example 2
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !inputSentence.trim()}
                className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    Check Sentence
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {result && (
            <div className="mt-2 p-4 rounded-2xl bg-surface-container-high border border-surface-variant/70 flex flex-col gap-3 animate-[slideIn_0.2s_ease-out]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                  {result.grammarRule || 'Grammar Rule'}
                </span>
                <button
                  onClick={() => speakText(result.improved)}
                  className="w-8 h-8 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
                  title="Listen pronunciation"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>

              {/* Original vs Improved */}
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-xl bg-error-container/30 border border-error/20">
                  <span className="text-[10px] font-bold text-error block uppercase">Your Sentence</span>
                  <p className="text-sm font-medium text-on-surface line-through opacity-80">{result.original}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-secondary-container/30 border border-secondary/20">
                  <span className="text-[10px] font-bold text-secondary block uppercase">Better & Natural</span>
                  <p className="text-sm font-bold text-on-surface">{result.improved}</p>
                </div>
              </div>

              {/* Explanations */}
              <div className="p-3 rounded-xl bg-surface-container-lowest text-xs flex flex-col gap-1.5 border border-surface-variant/40">
                <p className="text-on-surface font-medium">💡 <strong>Why:</strong> {result.explanation}</p>
                {tamilEnabled && result.tamilExplanation && (
                  <p className="text-primary font-tamil font-medium">
                    📖 <strong>தமிழில் விளக்கம்:</strong> {result.tamilExplanation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
