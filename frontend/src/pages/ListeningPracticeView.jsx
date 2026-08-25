import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function ListeningPracticeView() {
  const { tamilEnabled, speakText, stopSpeech, voiceSpeed, setVoiceSpeed, isPlaying, isPaused, activeAudioPlaying, triggerCelebration } = useLearning();

  const [allLessons, setAllLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showTranscript, setShowTranscript] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      const res = await api.getListeningLessons();
      if (res.success && res.data) {
        setAllLessons(res.data);
        setLessons(res.data);
        if (res.data.length > 0) {
          setActiveLessonIndex(0);
          setActiveLesson(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleLevelFilter = (lvl) => {
    setSelectedLevel(lvl);
    stopSpeech();
    let filtered = allLessons;
    if (lvl !== 'All') {
      filtered = allLessons.filter(l => l.level_id === lvl);
    }
    setLessons(filtered);
    setActiveLessonIndex(0);
    setActiveLesson(filtered[0] || null);
    setShowTranscript(false);
    setCompleted(false);
  };

  const handleSelectLesson = (lesson, idx) => {
    stopSpeech();
    setActiveLessonIndex(idx);
    setActiveLesson(lesson);
    setShowTranscript(false);
    setCompleted(false);
  };

  const handlePrev = () => {
    if (activeLessonIndex > 0) {
      const prevIdx = activeLessonIndex - 1;
      stopSpeech();
      setActiveLessonIndex(prevIdx);
      setActiveLesson(lessons[prevIdx]);
      setShowTranscript(false);
      setCompleted(false);
    }
  };

  const handleNext = () => {
    if (activeLessonIndex < lessons.length - 1) {
      const nextIdx = activeLessonIndex + 1;
      stopSpeech();
      setActiveLessonIndex(nextIdx);
      setActiveLesson(lessons[nextIdx]);
      setShowTranscript(false);
      setCompleted(false);
    }
  };

  const handlePlayAudio = () => {
    if (!activeLesson) return;
    speakText(activeLesson.transcript);
  };

  const handleComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.completeSkillSession({
        skillType: 'listening',
        targetId: activeLesson.id,
        durationSeconds: 90,
        xpEarned: 25
      });
      setCompleted(true);
      triggerCelebration();
    } catch (err) {
      console.error(err);
    }
  };

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px]">headphones</span>
          {tamilEnabled ? 'ஆங்கில கேட்டல் பயிற்சி' : 'AI English Listening Practice'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled
            ? '30+ உரையாடல்களைக் கவனமாகக் கேட்டு உங்கள் கேட்டல் திறனை மேம்படுத்துங்கள்.'
            : 'Listen to 30+ real-life English dialogues, adjust speed, and master native listening comprehension.'}
        </p>
      </div>

      {/* Level Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => handleLevelFilter(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedLevel === lvl
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {lvl === 'All' ? 'All Level Audio' : `Level ${lvl}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
        </div>
      ) : (
        <>
          {/* Deck Navigator Bar */}
          <div className="flex flex-wrap items-center justify-between bg-surface-container-high p-2.5 px-3 sm:p-3 sm:px-4 rounded-2xl border border-surface-variant/50 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-on-surface font-display">
                Dialogue {activeLessonIndex + 1} of {lessons.length}
              </span>
              {activeLesson?.level_id && (
                <span className="hidden xs:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary uppercase">
                  Level {activeLesson.level_id}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                onClick={handlePrev}
                disabled={activeLessonIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-surface-container border border-surface-variant/60 text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={activeLessonIndex === lessons.length - 1}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-primary-container shadow-sm"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Lesson Selector Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {lessons.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => handleSelectLesson(l, idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  activeLessonIndex === idx
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {l.title}
              </button>
            ))}
          </div>

          {activeLesson && (
            <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-5">
              
              <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3 gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-on-surface font-display mt-1">{activeLesson.title}</h2>
                  {tamilEnabled && activeLesson.tamil_title && (
                    <p className="text-xs font-tamil text-secondary font-medium mt-0.5">{activeLesson.tamil_title}</p>
                  )}
                </div>
              </div>

              {/* Audio Player Controls Box */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-tr from-primary-container to-primary text-white shadow-md flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Audio Dialogue Narration</span>
                  {isPaused && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-on-surface font-sans animate-pulse">
                      ⏸ Paused
                    </span>
                  )}
                  {isPlaying && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-on-surface font-sans animate-pulse">
                      ▶ Playing
                    </span>
                  )}
                </div>
                
                {/* Control Buttons (Play/Pause + Stop) */}
                <div className="flex items-center gap-4">
                  {/* Big Play / Pause Button */}
                  <button
                    onClick={handlePlayAudio}
                    className="w-20 h-20 shrink-0 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                    title={isPlaying ? 'Pause Audio (Mid-Sentence)' : isPaused ? 'Resume Audio' : 'Play Audio'}
                  >
                    <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  {/* Stop Button (Resets to beginning) */}
                  {(isPlaying || isPaused) && (
                    <button
                      onClick={stopSpeech}
                      className="w-12 h-12 shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-md transition-colors"
                      title="Stop & Reset to Beginning"
                    >
                      <span className="material-symbols-outlined text-[24px]">stop</span>
                    </button>
                  )}
                </div>

                {/* Playback speed selector */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-white/80">Speed Rate:</span>
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setVoiceSpeed(speed)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        voiceSpeed === speed
                          ? 'bg-white text-primary shadow-sm'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript reveal toggle & Completion button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showTranscript ? 'visibility_off' : 'visibility'}
                  </span>
                  {showTranscript ? 'Hide Audio Transcript' : 'Reveal Audio Transcript & Tamil Translation'}
                </button>

                <button
                  onClick={handleComplete}
                  disabled={completed}
                  className="px-5 py-2.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 disabled:opacity-50 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {completed ? 'Completed! (+25 XP)' : 'Mark as Listened (+25 XP)'}
                </button>
              </div>

              {/* Transcript content */}
              {showTranscript && (
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container border border-surface-variant/60 flex flex-col gap-3 animate-[slideIn_0.2s_ease-out]">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">English Dialogue Transcript</h4>
                  
                  {/* Line by line dialogue player */}
                  <div className="flex flex-col gap-2.5 my-1">
                    {activeLesson.transcript.split('\n').map((line, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface-container-lowest border border-surface-variant/40 flex items-start justify-between gap-3">
                        <p className="text-xs font-medium text-on-surface leading-relaxed flex-1 min-w-0">
                          {line}
                        </p>
                        <button
                          onClick={() => speakText(line)}
                          className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors shrink-0"
                          title="Listen to this line"
                        >
                          <span className="material-symbols-outlined text-[18px]">volume_up</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {tamilEnabled && activeLesson.tamil_transcript && (
                    <div className="pt-3 border-t border-surface-variant/40">
                      <h4 className="text-xs font-bold text-secondary uppercase font-tamil mb-1">தமிழில் உரைவடிவம் (Tamil Translation)</h4>
                      <p className="text-xs font-tamil text-on-surface whitespace-pre-line leading-relaxed">
                        {activeLesson.tamil_transcript}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
}
