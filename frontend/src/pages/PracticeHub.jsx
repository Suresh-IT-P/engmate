import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import ExerciseEngine from '../components/ExerciseEngine';

export default function PracticeHub() {
  const { tamilEnabled } = useLearning();
  const [customSprintCount, setCustomSprintCount] = useState(10);
  const [customExercise, setCustomExercise] = useState(null);
  const [loadingCustom, setLoadingCustom] = useState(false);

  const handleLaunchCustomSprint = async (count) => {
    setLoadingCustom(true);
    try {
      const res = await api.getCustomPracticeSet(count || customSprintCount);
      if (res.success && res.data) {
        setCustomExercise(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCustom(false);
    }
  };

  const activities = [
    {
      to: '/quiz/daily',
      title: 'Daily Challenge Quiz',
      tamil_title: 'தினசரி வினாடி வினா',
      desc: '5 quick questions to test your grammar and vocabulary retention.',
      icon: 'bolt',
      color: 'bg-primary text-white',
      badge: '+50 XP'
    },
    {
      to: '/battle',
      title: 'Live Grammar Battle',
      tamil_title: 'நேரடி இலக்கண போட்டி',
      desc: 'Compete 1v1 in rapid-fire grammar duels against AI bots or classmates.',
      icon: 'swords',
      color: 'bg-gradient-to-tr from-error to-error-container text-white',
      badge: 'Multiplayer'
    },
    {
      to: '/speaking',
      title: 'AI Speaking Practice',
      tamil_title: 'பேச்சு பயிற்சி & உச்சரிப்பு',
      desc: 'Speech recognition engine with instant pronunciation feedback.',
      icon: 'record_voice_over',
      color: 'bg-secondary text-white',
      badge: 'Voice AI'
    },
    {
      to: '/skills/reading',
      title: 'Reading Comprehension',
      tamil_title: 'வாசித்துப் புரிந்துகொள்ளுதல்',
      desc: 'Short stories and news articles with vocabulary notes and checkpoints.',
      icon: 'auto_stories',
      color: 'bg-tertiary text-white',
      badge: 'Stories'
    },
    {
      to: '/skills/listening',
      title: 'Listening Practice',
      tamil_title: 'கேட்டுப் பழகும் பயிற்சி',
      desc: 'Conversations with audio playback speed controls and transcripts.',
      icon: 'headphones',
      color: 'bg-primary-container text-white',
      badge: 'Audio'
    },
    {
      to: '/skills/writing',
      title: 'Writing Evaluator',
      tamil_title: 'எழுத்துப் பயிற்சி மதிப்பீடு',
      desc: 'Write essays, emails, and paragraphs with AI grammar & clarity scores.',
      icon: 'edit_note',
      color: 'bg-gradient-to-tr from-primary to-secondary text-white',
      badge: 'AI Doctor'
    },
    {
      to: '/mistakes',
      title: 'Mistake Notebook',
      tamil_title: 'பிழைகள் குறிப்பேடு',
      desc: 'Review and correct past errors from your quizzes and speaking drills.',
      icon: 'auto_fix_high',
      color: 'bg-surface-container text-error',
      badge: 'Smart Revision'
    },
    {
      to: '/onboarding',
      title: 'Level Placement Test',
      tamil_title: 'நிலை மதிப்பீட்டு தேர்வு',
      desc: 'Take the diagnostic test to recalibrate your learning level.',
      icon: 'quiz',
      color: 'bg-surface-container text-primary',
      badge: 'Diagnostic'
    }
  ];

  if (customExercise) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav">
        <ExerciseEngine
          exercise={customExercise}
          onExit={() => setCustomExercise(null)}
          onFinish={() => setCustomExercise(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Practice Arena
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'அனைத்து ஆங்கிலத் திறன்களையும் (பேசுதல், கேட்டல், வாசித்தல், எழுதுதல்) பயிற்சி செய்யுங்கள்.' : 'Sharpen speaking, listening, reading, writing, and quiz accuracy.'}
        </p>
      </div>

      {/* Set Question Count Custom Practice Sprint Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-primary-container/40 via-surface-container-high to-secondary-container/30 border border-primary/20 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[28px]">tune</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Custom Sprint</span>
              <h2 className="text-lg font-bold text-on-surface font-display">Set Practice Question Count</h2>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white hidden sm:inline-block">
            Instant Question Generator
          </span>
        </div>

        <p className="text-xs text-on-surface-variant font-tamil">
          நீங்கள் எத்தனை வினாக்கள் பயிற்சி செய்ய விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுத்து உடனடியாக பயிற்சியைத் தொடங்குங்கள்.
        </p>

        {/* Count Selection Pills & Launch Button */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-on-surface mr-1">Choose Count:</span>
          {[5, 10, 15, 20, 25, 30].map(count => (
            <button
              key={count}
              onClick={() => setCustomSprintCount(count)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                customSprintCount === count
                  ? 'bg-primary text-white shadow-sm scale-105'
                  : 'bg-surface-container hover:bg-surface-variant text-on-surface'
              }`}
            >
              {count} Questions
            </button>
          ))}

          <button
            onClick={() => handleLaunchCustomSprint(customSprintCount)}
            disabled={loadingCustom}
            className="w-full sm:w-auto sm:ml-auto px-5 py-3 sm:py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingCustom ? (
              <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                Start {customSprintCount} Q Sprint
              </>
            )}
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((act) => (
          <Link
            key={act.to}
            to={act.to}
            className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm hover:shadow-md hover:border-primary/40 flex items-start justify-between transition-all group active:scale-[0.99] gap-3"
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl ${act.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                <span className="material-symbols-outlined text-[26px]">
                  {act.icon === 'swords' ? 'sports_kabaddi' : act.icon}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-bold text-base text-on-surface font-display group-hover:text-primary transition-colors">
                    {act.title}
                  </h3>
                </div>
                {tamilEnabled && (
                  <p className="text-xs font-tamil text-secondary font-semibold mt-0.5">
                    {act.tamil_title}
                  </p>
                )}
                <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">
                  {act.desc}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider shrink-0">
              {act.badge}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
