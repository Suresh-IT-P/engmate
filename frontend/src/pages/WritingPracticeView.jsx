import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import FormattedText from '../components/FormattedText';

export default function WritingPracticeView() {
  const { tamilEnabled, triggerCelebration } = useLearning();

  const [prompts, setPrompts] = useState([]);
  const [activePrompt, setActivePrompt] = useState(null);
  const [studentText, setStudentText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    try {
      const res = await api.getWritingPrompts();
      if (res.success && res.data) {
        setPrompts(res.data);
        if (res.data.length > 0) setActivePrompt(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const wordCount = studentText.trim() ? studentText.trim().split(/\s+/).length : 0;
  const minWords = activePrompt?.min_words || 30;

  const handleEvaluate = async () => {
    if (!studentText.trim() || !activePrompt) return;

    setEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await api.evaluateWriting({
        promptId: activePrompt.id,
        promptTitle: activePrompt.title,
        text: studentText.trim(),
        minWords
      });

      if (res.success && res.data) {
        setEvaluationResult(res.data);
        if (res.data.overallScore >= 75) {
          triggerCelebration();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          AI Writing Evaluator
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'மின்னஞ்சல்கள், கட்டுரைகள் மற்றும் பத்திகளை எழுதி AI இலக்கண மதிப்பீட்டைப் பெறுங்கள்.' : 'Write emails, paragraphs, and essays with instant AI scoring for grammar, clarity, and vocabulary.'}
        </p>
      </div>

      {/* Prompt Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePrompt(p);
              setStudentText('');
              setEvaluationResult(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              activePrompt?.id === p.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {activePrompt && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-5">
          
          {/* Prompt Instructions */}
          <div className="p-4 rounded-2xl bg-surface-container flex flex-col gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Writing Task ({activePrompt.prompt_type}) • Minimum {minWords} Words
            </span>
            <h3 className="text-base font-bold text-on-surface font-display">{activePrompt.title}</h3>
            {tamilEnabled && activePrompt.tamil_title && (
              <p className="text-xs font-tamil text-secondary font-medium">{activePrompt.tamil_title}</p>
            )}
            <p className="text-xs text-on-surface font-medium mt-1 leading-relaxed">{activePrompt.instructions}</p>
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-2">
            <textarea
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              rows={6}
              placeholder="Write your English response here..."
              className="w-full p-4 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface placeholder:text-outline-variant outline-none focus:ring-2 focus:ring-primary/40 resize-y"
            />
            <div className="flex justify-between items-center text-xs text-outline font-medium px-1 gap-3">
              <span>
                Word count: <strong className={wordCount >= minWords ? 'text-secondary' : 'text-error'}>{wordCount}</strong> / {minWords} min
              </span>
              <button
                type="button"
                onClick={() => setStudentText(activePrompt.sample_answer || '')}
                className="text-primary hover:underline text-[11px] font-bold"
              >
                Load Sample Answer
              </button>
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={evaluating || !studentText.trim()}
            className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {evaluating ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                Evaluate Writing with AI Doctor
              </>
            )}
          </button>

          {/* Detailed Scorecard & Feedback */}
          {evaluationResult && (
            <div className="mt-2 p-4 sm:p-5 rounded-2xl bg-surface-container-high border border-surface-variant/70 flex flex-col gap-4 animate-[slideIn_0.2s_ease-out]">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-sm text-on-surface font-display flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  AI Writing Assessment
                </h4>
                <span className="text-xl font-extrabold text-primary font-display">
                  {evaluationResult.overallScore}/100 Score
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Grammar</span>
                  <p className="text-lg font-bold text-secondary font-display">{evaluationResult.scores?.grammar}%</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Vocabulary</span>
                  <p className="text-lg font-bold text-tertiary font-display">{evaluationResult.scores?.vocabulary}%</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Clarity</span>
                  <p className="text-lg font-bold text-primary font-display">{evaluationResult.scores?.clarity}%</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest text-xs flex flex-col gap-2">
                <div className="text-on-surface font-medium leading-relaxed">
                  <span className="font-bold mr-1">💡 Feedback:</span>
                  <FormattedText text={evaluationResult.feedback} highlightVariant="badge" />
                </div>

                {evaluationResult.suggestions && evaluationResult.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-surface-variant/40 flex flex-col gap-1">
                    <span className="font-bold text-primary uppercase text-[10px]">Specific Suggestions</span>
                    {evaluationResult.suggestions.map((s, idx) => (
                      <div key={idx} className="text-on-surface-variant text-[11px]">
                        <FormattedText text={`• ${s}`} highlightVariant="badge" />
                      </div>
                    ))}
                  </div>
                )}

                {tamilEnabled && evaluationResult.tamilSummary && (
                  <div className="pt-2 border-t border-surface-variant/40 text-primary font-tamil font-medium">
                    <FormattedText text={`📖 ${evaluationResult.tamilSummary}`} highlightVariant="badge" />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
