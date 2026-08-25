import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function ProgressAnalytics() {
  const { user, profile, streak } = useAuth();
  const { tamilEnabled } = useLearning();

  const [analytics, setAnalytics] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [anaRes, dashRes, leadRes] = await Promise.all([
        api.getSkillAnalytics(),
        api.getDashboardStats(),
        api.getLeaderboard()
      ]);
      if (anaRes.success) setAnalytics(anaRes.data);
      if (dashRes.success) setDashboardData(dashRes.data);
      if (leadRes.success) setLeaderboard(leadRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const skills = analytics?.skills || {
    vocabulary: 65,
    grammar: 70,
    speaking: 55,
    reading: 80,
    writing: 60,
    listening: 75,
    overallAccuracy: 82
  };

  const skillBars = [
    { label: 'Vocabulary (சொற்கள்)', value: skills.vocabulary, color: 'bg-primary' },
    { label: 'Grammar (இலக்கணம்)', value: skills.grammar, color: 'bg-secondary' },
    { label: 'Speaking (பேசுதல்)', value: skills.speaking, color: 'bg-tertiary' },
    { label: 'Listening (கேட்டல்)', value: skills.listening, color: 'bg-primary-container' },
    { label: 'Reading (வாசித்தல்)', value: skills.reading, color: 'bg-emerald-600' },
    { label: 'Writing (எழுதுதல்)', value: skills.writing, color: 'bg-purple-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          Learning Analytics & Mastery
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'உங்கள் முன்னேற்றம் மற்றும் திறன்களின் நிலை விவரங்கள்.' : 'Detailed breakdown of your competencies, weekly study time, and trophies.'}
        </p>
      </div>

      {/* Top Bento Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-surface-container-high border border-surface-variant/50 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Overall Level</span>
          <p className="text-2xl font-bold text-primary font-display mt-0.5">{profile?.current_level || 'A1'}</p>
          <span className="text-[10px] text-on-surface-variant">Beginner</span>
        </div>

        <div className="p-4 rounded-3xl bg-surface-container-high border border-surface-variant/50 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Total XP</span>
          <p className="text-2xl font-bold text-tertiary font-display mt-0.5">{profile?.xp || 540}</p>
          <span className="text-[10px] text-tertiary font-semibold">Top 15%</span>
        </div>

        <div className="p-4 rounded-3xl bg-surface-container-high border border-surface-variant/50 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Streak</span>
          <p className="text-2xl font-bold text-error font-display mt-0.5">{streak.current || 7} Days</p>
          <span className="text-[10px] text-on-surface-variant">Best: {streak.longest || 12}d</span>
        </div>

        <div className="p-4 rounded-3xl bg-surface-container-high border border-surface-variant/50 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Accuracy</span>
          <p className="text-2xl font-bold text-secondary font-display mt-0.5">{skills.overallAccuracy}%</p>
          <span className="text-[10px] text-secondary font-semibold">High precision</span>
        </div>
      </div>

      {/* Skill Breakdown Competency Bars */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3 gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-on-surface font-display">Skill Proficiency Breakdown</h3>
            <p className="text-xs text-on-surface-variant font-tamil">திறன் வாரியான தேர்ச்சி விழுக்காடு</p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 pt-1">
          {skillBars.map((sk) => (
            <div key={sk.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-on-surface gap-3">
                <span>{sk.label}</span>
                <span>{sk.value}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full ${sk.color} rounded-full transition-all duration-500`}
                  style={{ width: `${sk.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3 gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-on-surface font-display">Weekly Leaderboard</h3>
            <p className="text-xs text-on-surface-variant font-tamil">வாராந்திர வெற்றியாளர்கள் தரவரிசை</p>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">leaderboard</span>
            Global Rank
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {leaderboard.slice(0, 5).map((userRank, idx) => (
            <div
              key={userRank.id || idx}
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-colors ${
                userRank.id === user?.id
                  ? 'bg-primary-fixed border border-primary/30 font-bold'
                  : 'bg-surface-container-high'
              } gap-3`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-surface-container text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <span className="text-sm font-bold text-on-surface">{userRank.full_name || 'Learner'}</span>
                  <span className="text-[10px] text-on-surface-variant block uppercase">Level {userRank.current_level || 'A1'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-tertiary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  {userRank.xp || 0} XP
                </span>
                <span className="text-xs text-error font-bold">{userRank.current_streak || 1} 🔥</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trophy & Achievements Showcase */}
      {dashboardData?.recentAchievements && dashboardData.recentAchievements.length > 0 && (
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-bold text-on-surface font-display">Unlocked Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dashboardData.recentAchievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3.5 rounded-2xl bg-surface-container-high border border-surface-variant/50 flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: ach.badge_color || '#3525cd' }}
                >
                  <span className="material-symbols-outlined text-[24px]">{ach.icon || 'emoji_events'}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface font-display">{ach.title}</h4>
                  {tamilEnabled && ach.tamil_title && (
                    <p className="text-[11px] font-tamil text-secondary">{ach.tamil_title}</p>
                  )}
                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
