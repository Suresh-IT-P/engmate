import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import ExerciseEngine from '../components/ExerciseEngine';
import FormattedText from '../components/FormattedText';

export default function GrammarTopicDetail() {
  const { id } = useParams();
  const { tamilEnabled, speakText } = useLearning();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inExerciseMode, setInExerciseMode] = useState(false);

  useEffect(() => {
    loadTopic();
  }, [id]);

  async function loadTopic() {
    try {
      const res = await api.getGrammarTopicById(id);
      if (res.success && res.data) {
        setTopic(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-5 sm:p-8 text-center">
        <p className="text-on-surface-variant">Topic not found.</p>
        <button onClick={() => navigate('/grammar')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold">
          Back to Grammar Coach
        </button>
      </div>
    );
  }

  if (inExerciseMode && topic.exercises && topic.exercises.length > 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav">
        <ExerciseEngine
          exercise={topic.exercises[0]}
          onExit={() => setInExerciseMode(false)}
          onFinish={() => setInExerciseMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/grammar')}
        className="self-start flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Topics
      </button>

      {/* Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-high border border-surface-variant/60 shadow-sm flex flex-col gap-2">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase tracking-wider self-start">
          Level {topic.level_id}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">{topic.title}</h1>
        {tamilEnabled && topic.tamil_title && (
          <p className="text-sm font-tamil text-secondary font-semibold">{topic.tamil_title}</p>
        )}
      </div>

      {/* Formula Box */}
      {topic.rule_formula && (
        <div className="p-4 sm:p-5 rounded-3xl bg-primary-container text-white shadow-md flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Rule Formula (விதி முறை)
          </span>
          <pre className="text-sm sm:text-base font-mono font-bold whitespace-pre-wrap leading-relaxed text-white">
            {topic.rule_formula}
          </pre>
        </div>
      )}

      {/* Explanation Cards */}
      <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-base font-display text-on-surface">Detailed Explanation</h3>
        <div className="text-sm font-medium text-on-surface leading-relaxed">
          <FormattedText text={topic.explanation} highlightVariant="badge" />
        </div>

        {tamilEnabled && topic.beginner_explanation && (
          <div className="p-3.5 rounded-2xl bg-secondary-container/20 border border-secondary/20 text-xs font-tamil text-on-surface font-medium leading-relaxed mt-2">
            <span className="font-bold text-secondary block mb-1">📖 தமிழில் எளிய விளக்கம்:</span>
            <FormattedText text={topic.beginner_explanation} highlightVariant="badge" />
          </div>
        )}
      </div>

      {/* Common Mistakes */}
      {topic.common_mistakes && (
        <div className="p-4 sm:p-5 rounded-3xl bg-error-container/20 border border-error/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-error min-w-0">
            <span className="material-symbols-outlined text-[22px]">warning</span>
            <h4 className="font-bold text-sm font-display">Common Mistakes to Avoid</h4>
          </div>
          <div className="text-xs font-medium text-on-surface leading-relaxed mt-1">
            <FormattedText text={topic.common_mistakes} highlightVariant="badge" />
          </div>
        </div>
      )}

      {/* Example Sentences */}
      {topic.examples && topic.examples.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-base font-display text-on-surface">Example Sentences</h3>
          <div className="flex flex-col gap-2.5">
            {topic.examples.map((ex) => (
              <div
                key={ex.id || ex.example_sentence}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-on-surface">"{ex.example_sentence}"</p>
                  {tamilEnabled && ex.tamil_translation && (
                    <p className="text-xs font-tamil text-on-surface-variant mt-0.5">{ex.tamil_translation}</p>
                  )}
                </div>
                <button
                  onClick={() => speakText(ex.example_sentence)}
                  className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Button */}
      {topic.exercises && topic.exercises.length > 0 && (
        <button
          onClick={() => setInExerciseMode(true)}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary-container transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">sports_esports</span>
          Practice Grammar Exercises
        </button>
      )}

    </div>
  );
}
