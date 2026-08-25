import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

const MODULE_THEMES = [
  {
    gradient: 'from-indigo-600 via-blue-600 to-sky-500',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    cardBorder: 'border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-600',
    lessonNumBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20',
    xpBadge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60',
    icon: 'menu_book',
    tag: 'Part I • 20 Marks'
  },
  {
    gradient: 'from-emerald-600 via-teal-600 to-green-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cardBorder: 'border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-600',
    lessonNumBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
    xpBadge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    icon: 'auto_awesome',
    tag: 'Part II • 14 Marks'
  },
  {
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cardBorder: 'border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-600',
    lessonNumBg: 'bg-amber-600 text-white shadow-md shadow-amber-500/20',
    xpBadge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
    icon: 'edit_note',
    tag: 'Part III • 21 Marks'
  },
  {
    gradient: 'from-rose-600 via-purple-600 to-pink-500',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    cardBorder: 'border-rose-200/80 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-600',
    lessonNumBg: 'bg-rose-600 text-white shadow-md shadow-rose-500/20',
    xpBadge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
    icon: 'workspace_premium',
    tag: 'Part IV • 35 Marks'
  }
];

export default function LearnHub() {
  const { tamilEnabled } = useLearning();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClass11Course();
  }, []);

  async function loadClass11Course() {
    try {
      const res = await api.getCourseById('crs_class11');
      if (res.success && res.data) {
        setCourse(res.data);
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

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6 font-sans">
      
      {/* Header with Vibrant Badges */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[32px]">school</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white uppercase tracking-wider shadow-sm">
            Exclusive 11th Standard English Curriculum
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase tracking-wider">
            Way to Success Guide 2019
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display mt-2.5">
          Class 11 English (Samacheer Kalvi & Way to Success)
        </h1>
        <p className="text-sm text-on-surface-variant mt-1 font-medium">
          {tamilEnabled
            ? '11ஆம் வகுப்பு சமச்சீர் கல்வி ஆங்கிலப் பாடத்திட்டம்: 1-மதிப்பெண் வினாக்கள், செய்யுள் வினாக்கள், 2-மதிப்பெண் இலக்கண மாற்றங்கள், 3-மதிப்பெண் வினாக்கள் மற்றும் 5-மதிப்பெண் கட்டுரைகள்.'
            : 'Complete 11th Standard English textbook curriculum: Prose, Poems, Practical Writing Skills, Way to Success Exam Guide, and Board Exam Grammar.'}
        </p>
      </div>

      {/* Flagship Course Banner with Colorful Gradient */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-inner">
            <span className="material-symbols-outlined text-[34px]">workspace_premium</span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">Standard 11 (+1 English Masterclass)</span>
            <h2 className="text-xl font-bold font-display">{course?.title || 'Class 11 English (Way to Success)'}</h2>
            <p className="text-xs font-tamil text-white/90 font-medium">11-ஆம் வகுப்பு ஆங்கிலம் 4 பிரிவுகள் (Way to Success)</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <span className="text-xs font-bold px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30">
            2000 XP • Full Way to Success Dataset
          </span>
        </div>
      </div>

      {/* Modules & Lessons Tree with Vibrant Color Coding */}
      <div className="flex flex-col gap-6">
        {course?.modules?.map((mod, modIdx) => {
          const theme = MODULE_THEMES[modIdx % MODULE_THEMES.length];
          return (
            <div
              key={mod.id}
              className={`p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border ${theme.cardBorder} shadow-sm transition-all flex flex-col gap-4`}
            >
              
              {/* Module Header with Custom Gradient */}
              <div className="border-b border-surface-variant/40 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-r ${theme.gradient} flex items-center justify-center text-white shadow-md`}>
                    <span className="material-symbols-outlined text-[22px]">{theme.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} uppercase tracking-wider`}>
                        {theme.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface font-display mt-1">{mod.title}</h3>
                    {tamilEnabled && mod.tamil_title && (
                      <p className="text-xs font-tamil text-on-surface-variant font-medium mt-0.5">{mod.tamil_title}</p>
                    )}
                  </div>
                </div>

                <span className="text-xs text-outline font-semibold hidden sm:inline-block">
                  {mod.lessons?.length || 0} Lessons
                </span>
              </div>

              {/* Lessons List */}
              <div className="flex flex-col gap-2.5 pt-1">
                {mod.lessons?.map((les, lesIdx) => (
                  <Link
                    key={les.id}
                    to={`/lessons/${les.id}`}
                    className={`p-4 rounded-2xl bg-surface-container-high hover:bg-surface-variant/80 border border-surface-variant/50 flex items-center justify-between transition-all group active:scale-[0.99] gap-3`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${
                          les.is_completed
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : theme.lessonNumBg
                        }`}
                      >
                        {les.is_completed ? (
                          <span className="material-symbols-outlined text-[20px]">check</span>
                        ) : (
                          lesIdx + 1
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                          {les.title}
                        </h4>
                        {tamilEnabled && les.tamil_title && (
                          <p className="text-xs font-tamil text-on-surface-variant font-medium mt-0.5">{les.tamil_title}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${theme.xpBadge} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-[16px] text-amber-500">workspace_premium</span>
                        +{les.xp_reward || 40} XP
                      </span>
                      <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform text-[20px]">
                        chevron_right
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
