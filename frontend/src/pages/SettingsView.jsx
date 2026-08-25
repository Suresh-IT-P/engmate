import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function SettingsView() {
  const { settings, refreshUserData } = useAuth();
  const { tamilEnabled, setTamilEnabled, voiceSpeed, setVoiceSpeed } = useLearning();

  const [soundEffects, setSoundEffects] = useState(settings?.sound_effects ?? true);
  const [dailyReminder, setDailyReminder] = useState(settings?.daily_reminder_time || '20:00');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await api.updateSettings({
        soundEffects: soundEffects ? 1 : 0,
        tamilTranslationEnabled: tamilEnabled ? 1 : 0,
        voiceSpeed,
        dailyReminderTime: dailyReminder
      });
      await refreshUserData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display">
          App Settings & Preferences
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
          {tamilEnabled ? 'மொழிபெயர்ப்பு, குரல் வேகம் மற்றும் நினைவூட்டல் அமைப்புகள்.' : 'Customize audio voice speed, Tamil translation hints, and reminder alarms.'}
        </p>
      </div>

      <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-6">
        
        {saved && (
          <div className="p-3 rounded-xl bg-secondary-container/30 border border-secondary/20 text-secondary text-xs font-bold text-center">
            Settings updated successfully!
          </div>
        )}

        {/* 1. Tamil Translation Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-on-surface font-display">Tamil Bilingual Bridge (தமிழ் மொழிபெயர்ப்பு)</h4>
            <p className="text-xs text-on-surface-variant">Show Tamil meanings, hints, and grammar rule explanations across all lessons.</p>
          </div>
          <button
            onClick={() => setTamilEnabled(!tamilEnabled)}
            className={`w-12 h-7 shrink-0 rounded-full transition-colors relative p-1 ${
              tamilEnabled ? 'bg-primary' : 'bg-surface-variant'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                tamilEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        <hr className="border-surface-variant/40" />

        {/* 2. Voice Playback Speed */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-on-surface font-display">Text-to-Speech Voice Speed</h4>
              <p className="text-xs text-on-surface-variant">Adjust pronunciation narration pace (0.75x to 1.25x).</p>
            </div>
            <span className="text-xs font-bold text-primary font-mono shrink-0">{voiceSpeed}x</span>
          </div>

          <div className="flex gap-2">
            {[0.75, 0.9, 1.0, 1.15, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => setVoiceSpeed(speed)}
                className={`flex-1 min-w-0 py-2 rounded-xl text-xs font-bold transition-all ${
                  voiceSpeed === speed
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <hr className="border-surface-variant/40" />

        {/* 3. Daily Practice Reminder */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-on-surface font-display">Daily Practice Alarm Reminder</h4>
            <p className="text-xs text-on-surface-variant">Choose your daily streak study notification time.</p>
          </div>
          <input
            type="time"
            value={dailyReminder}
            onChange={(e) => setDailyReminder(e.target.value)}
            className="p-2 shrink-0 rounded-xl bg-surface-container border border-surface-variant/70 text-xs font-bold text-on-surface outline-none"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="self-end px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-container transition-all"
        >
          Save All Settings
        </button>

      </div>

    </div>
  );
}
