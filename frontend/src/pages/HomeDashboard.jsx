import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';
import SentenceDoctorModal from '../components/SentenceDoctorModal';

export default function HomeDashboard() {
  const { user, profile, streak } = useAuth();
  const { tamilEnabled, speakText } = useLearning();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorOpen, setDoctorOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const d = dashboardData || {
    profile: { fullName: profile?.full_name || 'Learner', currentLevel: 'A1', xp: 540 },
    streak: { current: streak.current || 7 },
    dailyGoal: { targetMinutes: 30, spentMinutes: 18, progressPct: 60 },
    recommendedLesson: { id: 'les_a1_2_1', title: 'Daily Routine (Simple Present)', tamil_title: 'அன்றாட பழக்கவழக்கங்கள்', xp_reward: 30 }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display leading-tight">
            {tamilEnabled && <span className="text-primary block text-xl sm:text-2xl">வணக்கம்! 👋</span>}
            Good day, {d.profile.fullName}!
          </h1>
          <p className="text-sm text-on-surface-variant font-medium mt-0.5">
            {tamilEnabled ? 'இன்றைய உங்கள் ஆங்கிலப் பயிற்சியைத் தொடங்குங்கள்.' : "Let's improve your English fluency today."}
          </p>
        </div>

        {/* Quick Sentence Doctor Action */}
        <button
          onClick={() => setDoctorOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-primary/25 hover:bg-primary-container hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">medical_services</span>
          AI Sentence Doctor
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Level Card */}
        <div className="col-span-2 bg-gradient-to-tr from-primary to-primary-container text-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-primary/20 flex items-center justify-between relative overflow-hidden gap-3">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="z-10">
            <span className="text-[11px] font-bold tracking-wider uppercase text-white/80 block">Current Level</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold font-display">Level {d.profile.currentLevel}</span>
              <span className="text-xs text-white/90 font-medium">Beginner</span>
            </div>
            <Link to="/learn" className="inline-block mt-3 text-xs font-bold underline text-white/90 hover:text-white">
              View Learning Path →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="bg-surface-container-high rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-surface-variant/40">
          <div className="w-10 h-10 shrink-0 rounded-full bg-tertiary-container/30 text-tertiary flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[22px]">military_tech</span>
          </div>
          <span className="text-xl font-bold text-on-surface font-display">{d.profile.xp || 540}</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Total XP</span>
        </div>

        {/* Streak Card */}
        <div className="bg-surface-container-high rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-surface-variant/40">
          <div className="w-10 h-10 shrink-0 rounded-full bg-error-container/60 text-error flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
          </div>
          <span className="text-xl font-bold text-on-surface font-display">{d.streak.current || 7} Days</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Streak</span>
        </div>
      </div>

      {/* Daily Goal Shimmer Progress */}
      <div className="bg-surface-container-high rounded-3xl p-4 sm:p-5 shadow-sm border border-surface-variant/50 relative overflow-hidden">
        <div className="flex justify-between items-end mb-2 relative z-10 gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-on-surface font-display">Daily Practice Goal</h3>
            <p className="text-xs text-on-surface-variant font-tamil">
              {tamilEnabled ? 'தினசரி 30 நிமிட பயிற்சி' : `Practice for ${d.dailyGoal.targetMinutes} minutes daily`}
            </p>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-primary font-display">{d.dailyGoal.spentMinutes}</span>
            <span className="text-xs text-on-surface-variant"> / {d.dailyGoal.targetMinutes}m</span>
          </div>
        </div>

        {/* Shimmer Bar */}
        <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden relative z-10">
          <div
            className="h-full bg-secondary rounded-full relative transition-all duration-500"
            style={{ width: `${d.dailyGoal.progressPct}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Continue Learning Featured Banner */}
      {d.recommendedLesson && (
        <div className="rounded-3xl bg-gradient-to-r from-primary-fixed to-surface-container-high border border-primary/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/25">
              <span className="material-symbols-outlined text-[28px]">play_arrow</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Recommended Next</span>
              <h3 className="text-base font-bold text-on-surface font-display">{d.recommendedLesson.title}</h3>
              {tamilEnabled && d.recommendedLesson.tamil_title && (
                <p className="text-xs font-tamil text-on-surface-variant">{d.recommendedLesson.tamil_title}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/lessons/${d.recommendedLesson.id}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all text-center"
          >
            Continue Learning
          </button>
        </div>
      )}

      {/* Core Learning Domains 4-Grid */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-on-surface font-display">
          Learning Modules <span className="text-xs font-tamil font-normal text-on-surface-variant">(பாடப் பிரிவுகள்)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Grammar */}
          <Link
            to="/grammar"
            className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/60 shadow-sm hover:shadow-md hover:border-primary/40 flex flex-col items-center text-center transition-all group active:scale-95"
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">menu_book</span>
            </div>
            <span className="font-bold text-sm text-on-surface font-display">Grammar</span>
            <span className="text-[11px] font-tamil text-on-surface-variant mt-0.5">இலக்கணம்</span>
          </Link>

          {/* Vocabulary */}
          <Link
            to="/vocabulary"
            className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/60 shadow-sm hover:shadow-md hover:border-tertiary/40 flex flex-col items-center text-center transition-all group active:scale-95"
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">auto_stories</span>
            </div>
            <span className="font-bold text-sm text-on-surface font-display">Vocabulary</span>
            <span className="text-[11px] font-tamil text-on-surface-variant mt-0.5">புதிய சொற்கள்</span>
          </Link>

          {/* Speaking */}
          <Link
            to="/speaking"
            className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/60 shadow-sm hover:shadow-md hover:border-secondary/40 flex flex-col items-center text-center transition-all group active:scale-95"
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">record_voice_over</span>
            </div>
            <span className="font-bold text-sm text-on-surface font-display">Speaking</span>
            <span className="text-[11px] font-tamil text-on-surface-variant mt-0.5">பேசிப் பழகலாம்</span>
          </Link>

          {/* Practice Hub */}
          <Link
            to="/practice"
            className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/60 shadow-sm hover:shadow-md hover:border-error/40 flex flex-col items-center text-center transition-all group active:scale-95"
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[28px]">fitness_center</span>
            </div>
            <span className="font-bold text-sm text-on-surface font-display">Daily Practice</span>
            <span className="text-[11px] font-tamil text-on-surface-variant mt-0.5">பயிற்சிக் கூடம்</span>
          </Link>

        </div>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-gradient-to-r from-tertiary-container to-tertiary text-white rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white">
            <span className="material-symbols-outlined text-[28px]">stars</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">Daily Challenge</span>
            <h4 className="text-base font-bold font-display">Master 5 New Words on Flashcards</h4>
            <p className="text-xs text-white/90 font-tamil">இன்றைய சவால்: 5 புதிய ஆங்கில சொற்கள்</p>
          </div>
        </div>

        <Link
          to="/vocabulary"
          className="relative z-10 w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white text-tertiary-container font-bold text-xs shadow-md hover:bg-white/90 transition-all text-center"
        >
          Start Challenge (+50 XP)
        </Link>
      </div>

      {/* Sentence Doctor Floating Modal */}
      <SentenceDoctorModal isOpen={doctorOpen} onClose={() => setDoctorOpen(false)} />

    </div>
  );
}
