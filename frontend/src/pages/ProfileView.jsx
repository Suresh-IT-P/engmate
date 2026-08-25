import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function ProfileView() {
  const { user, profile, streak, refreshUserData } = useAuth();
  const { tamilEnabled, triggerCelebration } = useLearning();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(user?.username || profile?.username || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || profile?.phone_number || '');
  const [primaryGoal, setPrimaryGoal] = useState(profile?.primary_goal || 'Daily conversation');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile?.daily_goal_minutes || 20);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        fullName,
        username,
        phoneNumber,
        primaryGoal,
        dailyGoalMinutes
      });
      await refreshUserData();
      setSavedMsg(true);
      triggerCelebration();
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Profile Hero Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-high border border-surface-variant/60 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 shrink-0 rounded-3xl bg-gradient-to-tr from-primary to-primary-container text-white text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-primary/25">
          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-display">{profile?.full_name || user?.email}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white uppercase">
              {user?.role || 'User'}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant mt-0.5">
            {user?.email} {username ? `• @${username}` : ''} {phoneNumber ? `• 📞 ${phoneNumber}` : ''}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container border border-surface-variant/60 text-primary">
              Level {profile?.current_level || 'A1'}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary">
              {profile?.xp || 0} XP
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-error-container/40 text-error">
              {streak.current || 1} Days Streak 🔥
            </span>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/friends'}
          className="px-4 py-2.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          Friends Circle
        </button>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-on-surface font-display">Personal Profile & Learning Preferences</h3>

        {savedMsg && (
          <div className="p-3 rounded-xl bg-secondary-container/30 border border-secondary/20 text-secondary text-xs font-bold text-center">
            Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-xs font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Username (Unique handle)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. karthik99"
              className="w-full p-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-xs font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full p-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-xs font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Primary Learning Goal</label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full p-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-xs font-bold text-on-surface outline-none"
            >
              <option value="Daily conversation">Daily Conversation (அன்றாட உரையாடல்)</option>
              <option value="Job Interview & Career">Job Interview & Career (நேர்காணல்)</option>
              <option value="College English">College English (கல்லூரி)</option>
              <option value="Travel English">Travel English (பயணம்)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Daily Target (Minutes)</label>
            <select
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-xs font-bold text-on-surface outline-none"
            >
              <option value={10}>10 Mins / Day (Casual)</option>
              <option value={20}>20 Mins / Day (Regular)</option>
              <option value={30}>30 Mins / Day (Serious)</option>
              <option value={45}>45 Mins / Day (Intensive)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-container transition-all mt-2"
        >
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>

    </div>
  );
}
