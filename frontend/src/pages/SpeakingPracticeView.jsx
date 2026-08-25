import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import SpeakingVoiceRecorder from '../components/SpeakingVoiceRecorder';

export default function SpeakingPracticeView() {
  const { tamilEnabled } = useLearning();

  const [allTopics, setAllTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTopic, setActiveTopic] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics(shouldShuffle = false) {
    setLoading(true);
    try {
      const res = await api.getSpeakingTopics(shouldShuffle ? '?shuffle=true' : '');
      if (res.success && res.data) {
        setAllTopics(res.data);
        setTopics(res.data);
        if (res.data.length > 0) {
          setActiveTopicIndex(0);
          setActiveTopic(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShuffling(false);
    }
  }

  const handleShuffle = () => {
    setShuffling(true);
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    setTopics(shuffled);
    setActiveTopicIndex(0);
    setActiveTopic(shuffled[0] || null);
    setTimeout(() => setShuffling(false), 300);
  };

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    let filtered = allTopics;
    if (cat !== 'All') {
      filtered = allTopics.filter((t) => t.category === cat);
    }
    setTopics(filtered);
    setActiveTopicIndex(0);
    setActiveTopic(filtered[0] || null);
  };

  const handleSelectTopic = (top, idx) => {
    setActiveTopicIndex(idx);
    setActiveTopic(top);
  };

  const handleNext = () => {
    if (activeTopicIndex < topics.length - 1) {
      const nextIdx = activeTopicIndex + 1;
      setActiveTopicIndex(nextIdx);
      setActiveTopic(topics[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (activeTopicIndex > 0) {
      const prevIdx = activeTopicIndex - 1;
      setActiveTopicIndex(prevIdx);
      setActiveTopic(topics[prevIdx]);
    }
  };

  // Categories list
  const categories = ['All', 'Daily Life', 'Samacheer Kalvi', 'Job Interview', 'Spoken Fluency', 'Travel', 'Health', 'Tech'];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">

      {/* Header with Shuffle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">record_voice_over</span>
            {tamilEnabled ? 'ஆங்கில பேச்சு பயிற்சி' : 'AI Spoken English Practice'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
            {tamilEnabled
              ? '100+ வாக்கியங்களை உரக்கப் பேசிப் பழகுங்கள். உடனடி AI உச்சரிப்பு கருத்துகளைப் பெறுங்கள்.'
              : 'Master 100+ speaking topics & sentences with instant AI speech evaluation and pronunciation breakdown.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShuffle}
            disabled={shuffling}
            className="px-4 py-2.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md shadow-secondary/25 hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95"
            title="Shuffle Sentences Randomly"
          >
            <span className={`material-symbols-outlined text-[18px] ${shuffling ? 'animate-spin' : ''}`}>
              shuffle
            </span>
            {tamilEnabled ? 'வாக்கியங்களை மாற்று (Shuffle)' : 'Shuffle Sentences 🔀'}
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
        </div>
      ) : (
        <>
          {/* Deck Navigator Header */}
          <div className="flex flex-wrap items-center justify-between bg-surface-container-high p-2.5 px-3 sm:p-3 sm:px-4 rounded-2xl border border-surface-variant/50 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-on-surface font-display">
                Sentence {activeTopicIndex + 1} of {topics.length}
              </span>
              {activeTopic?.level_id && (
                <span className="hidden xs:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed/50 text-primary uppercase">
                  Level {activeTopic.level_id}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                onClick={handlePrev}
                disabled={activeTopicIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-surface-container border border-surface-variant/60 text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={activeTopicIndex === topics.length - 1}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-primary-container shadow-sm"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Horizontal Topic Switcher Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {topics.map((top, idx) => (
              <button
                key={top.id}
                onClick={() => handleSelectTopic(top, idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  activeTopicIndex === idx
                    ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                {top.title}
              </button>
            ))}
          </div>

          {/* Active Voice Recorder Engine */}
          {activeTopic && (
            <div className="flex flex-col gap-4">
              <SpeakingVoiceRecorder topic={activeTopic} />
            </div>
          )}
        </>
      )}

    </div>
  );
}
