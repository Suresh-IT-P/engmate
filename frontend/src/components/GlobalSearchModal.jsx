import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function GlobalSearchModal() {
  const { searchOpen, setSearchOpen, tamilEnabled } = useLearning();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ vocabulary: [], lessons: [], grammar: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults({ vocabulary: [], lessons: [], grammar: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query.trim());
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] animate-fade-in"
      onClick={() => setSearchOpen(false)}
    >
      {/* dvh, not vh: when the phone keyboard opens, vh keeps the old full
          height and the results list ends up underneath the keyboard. */}
      <div
        className="w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-surface-variant/70 overflow-hidden flex flex-col max-h-[75dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-3 sm:p-4 border-b border-surface-variant/40 flex items-center gap-2 sm:gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, grammar, lessons... / தேடுங்கள்..."
            autoFocus
            className="flex-1 min-w-0 bg-transparent text-on-surface placeholder:text-outline-variant outline-none font-medium text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-outline hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="hidden sm:block text-xs font-bold px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-3 sm:p-4 flex flex-col gap-4">
          {loading && (
            <div className="flex justify-center py-6 text-primary">
              <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-8 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[40px] text-outline-variant mb-2">menu_book</span>
              <p>Type at least 2 letters to search words, lessons, and grammar topics.</p>
            </div>
          )}

          {/* Vocabulary Results */}
          {results.vocabulary.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2 mb-1 block">
                Vocabulary ({results.vocabulary.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {results.vocabulary.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/vocabulary?word=${w.word}`);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface-container flex items-center justify-between transition-colors group gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-on-surface capitalize group-hover:text-primary transition-colors">
                        {w.word}
                      </span>
                      <span className="text-xs text-on-surface-variant block">{w.meaning}</span>
                      {tamilEnabled && (
                        <span className="text-xs text-primary/80 font-tamil font-medium block">{w.tamil_meaning}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                      {w.level_id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Topics */}
          {results.grammar.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary px-2 mb-1 block">
                Grammar Topics ({results.grammar.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {results.grammar.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/grammar/${g.id}`);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface-container flex items-center justify-between transition-colors group gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">
                        {g.title}
                      </span>
                      {tamilEnabled && (
                        <span className="text-xs text-secondary font-tamil font-medium block">{g.tamil_title}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                      {g.level_id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lessons */}
          {results.lessons.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary px-2 mb-1 block">
                Lessons ({results.lessons.length})
              </span>
              <div className="flex flex-col gap-1.5">
                {results.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/lessons/${l.id}`);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-surface-container flex items-center justify-between transition-colors group gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-on-surface group-hover:text-tertiary transition-colors">
                        {l.title}
                      </span>
                      {tamilEnabled && (
                        <span className="text-xs text-tertiary font-tamil font-medium block">{l.tamil_title}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                      +{l.xp_reward} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query && results.vocabulary.length === 0 && results.grammar.length === 0 && results.lessons.length === 0 && (
            <div className="text-center py-6 text-on-surface-variant text-sm">
              No direct matches found for "{query}". Try checking your spelling.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
