import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function GrammarCoach() {
  const { tamilEnabled } = useLearning();
  const [topics, setTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      const res = await api.getGrammarTopics();
      if (res.success && res.data) {
        setTopics(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTopics = selectedLevel === 'all'
    ? topics
    : topics.filter((t) => t.level_id === selectedLevel);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Grammar Coach
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'எளிய தமிழ் விளக்கங்களுடன் ஆங்கில இலக்கணத்தை முழுமையாகக் கற்றுக்கொள்ளுங்கள்.' : 'Master core English grammar rules, tenses, and sentence structures with ease.'}
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
              selectedLevel === lvl
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {lvl === 'all' ? 'All Topics' : `Level ${lvl}`}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/grammar/${topic.id}`}
            className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm hover:shadow-md hover:border-primary/40 flex flex-col justify-between transition-all group active:scale-[0.99] relative overflow-hidden gap-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 gap-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                  {topic.level_id}
                </span>
                <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  Explore Rule →
                </span>
              </div>

              <h3 className="text-lg font-bold text-on-surface font-display group-hover:text-primary transition-colors leading-snug">
                {topic.title}
              </h3>
              {tamilEnabled && topic.tamil_title && (
                <p className="text-xs font-tamil text-secondary font-semibold mt-0.5">
                  {topic.tamil_title}
                </p>
              )}

              <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
                {topic.summary}
              </p>

              {topic.rule_formula && (
                <div className="mt-3 p-2.5 rounded-xl bg-surface-container text-[11px] font-mono text-primary font-bold line-clamp-1 border border-surface-variant/40">
                  {topic.rule_formula.split('\n')[0]}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-surface-variant/40 flex items-center justify-between text-xs text-outline gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Rules & Examples
              </span>
              <span className="flex items-center gap-1 text-secondary font-medium">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                Practice Sets
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
