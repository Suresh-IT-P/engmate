import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function BookmarksView() {
  const { tamilEnabled, speakText } = useLearning();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    try {
      const res = await api.getBookmarks();
      if (res.success && res.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRemove = async (id) => {
    try {
      await api.removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Saved Bookmarks
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'நீங்கள் சேமித்த முக்கியமான சொற்கள் மற்றும் பாடங்கள்.' : 'Quick access to words, grammar rules, and lessons you have bookmarked.'}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="p-5 sm:p-8 text-center bg-surface-container-lowest rounded-3xl border border-surface-variant/70">
          <span className="material-symbols-outlined text-[44px] text-tertiary mb-2">bookmark_border</span>
          <h3 className="text-lg font-bold text-on-surface font-display">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-on-surface-variant mt-1 mb-4">Tap the bookmark icon on any word or lesson to save it here.</p>
          <Link to="/vocabulary" className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md">
            Explore Vocabulary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary-fixed block w-max mb-1">
                  {b.item_type}
                </span>
                <h4 className="text-sm font-bold text-on-surface capitalize">{b.title}</h4>
                {b.subtext && <p className="text-xs text-on-surface-variant line-clamp-1">{b.subtext}</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(b.title)}
                  className="w-8 h-8 shrink-0 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">volume_up</span>
                </button>
                <button
                  onClick={() => handleRemove(b.id)}
                  className="w-8 h-8 shrink-0 rounded-full bg-error-container/30 hover:bg-error-container text-error flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
