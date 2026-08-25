import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import FlashcardDeck from '../components/FlashcardDeck';

export default function VocabularyTrainer() {
  const { tamilEnabled, speakText } = useLearning();

  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'list'
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(shuffle = false) {
    setLoading(true);
    try {
      const [wotdRes, queueRes, listRes] = await Promise.all([
        api.getWordOfTheDay(),
        api.getReviewQueue(50),
        api.getVocabulary({ limit: 1200, shuffle: shuffle ? 'true' : 'false' })
      ]);
      if (wotdRes.success) setWordOfTheDay(wotdRes.data);
      if (queueRes.success) setReviewQueue(queueRes.data);
      if (listRes.success) setVocabList(listRes.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleShuffleList = () => {
    const shuffled = [...vocabList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setVocabList(shuffled);
  };

  const filteredList = vocabList.filter((w) => {
    const matchesLevel = selectedLevel === 'all' || w.level_id === selectedLevel;
    const matchesSearch = !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.tamil_meaning.includes(search);
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Vocabulary Builder
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'இடைவெளி மீள்முறை (Spaced Repetition) மூலம் புதிய சொற்களை நினைவில் கொள்ளுங்கள்.' : 'Master essential words with spaced repetition flashcards.'}
        </p>
      </div>

      {/* Word of the Day Hero Banner */}
      {wordOfTheDay && (
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-tr from-tertiary-container to-tertiary text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between gap-4">
          <div className="z-10 flex flex-col gap-2 min-w-0">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider self-start">
              Word of the Day (இன்றைய சொல்)
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display capitalize break-words">{wordOfTheDay.word}</h2>
              {wordOfTheDay.phonetic && (
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">
                  /{wordOfTheDay.phonetic}/
                </span>
              )}
              <button
                onClick={() => speakText(wordOfTheDay.word)}
                className="w-8 h-8 shrink-0 rounded-full bg-white text-tertiary flex items-center justify-center shadow-md active:scale-95 transition-transform"
                title="Pronounce"
              >
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
              </button>
            </div>

            <p className="text-sm text-white/90 font-medium">{wordOfTheDay.meaning}</p>
            {tamilEnabled && (
              <p className="text-sm font-tamil text-white font-bold">
                தமிழ் அர்த்தம்: {wordOfTheDay.tamil_meaning}
              </p>
            )}

            {wordOfTheDay.examples && wordOfTheDay.examples.length > 0 && (
              <p className="text-xs text-white/80 italic mt-1">
                "{wordOfTheDay.examples[0].sentence}"
              </p>
            )}
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 self-end sm:self-auto">
            <span className="material-symbols-outlined text-[36px]">auto_stories</span>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex p-1 rounded-2xl bg-surface-container border border-surface-variant/60 max-w-md mx-auto w-full">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 min-w-0 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'flashcards'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Spaced Repetition ({reviewQueue.length} Due)
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 min-w-0 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'list'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Browse Dictionary ({vocabList.length})
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'flashcards' ? (
        <div className="py-2">
          <FlashcardDeck words={reviewQueue} onFinish={loadData} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* Level filter & Search bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 hide-scrollbar">
              <button
                onClick={handleShuffleList}
                title="Shuffle Word Order"
                className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-primary-fixed hover:text-primary text-xs font-bold flex items-center gap-1 border border-surface-variant/60 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">shuffle</span>
                Shuffle
              </button>

              {['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all shrink-0 ${
                    selectedLevel === lvl
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 1,000+ words..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container rounded-full text-xs font-medium text-on-surface placeholder:text-outline-variant outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Word List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredList.map((word) => (
              <div
                key={word.id}
                className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base font-display text-primary capitalize">{word.word}</span>
                      {word.phonetic && (
                        <span className="text-[11px] text-on-surface-variant font-mono">/{word.phonetic}/</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase">
                        {word.level_id}
                      </span>
                      <button
                        onClick={() => speakText(word.word)}
                        className="w-7 h-7 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface font-medium">{word.meaning}</p>
                  {tamilEnabled && (
                    <p className="text-xs font-tamil text-secondary font-bold mt-1">
                      {word.tamil_meaning}
                    </p>
                  )}
                </div>

                {word.examples && word.examples.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-surface-container text-[11px] text-on-surface-variant italic">
                    "{word.examples[0].sentence}"
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
