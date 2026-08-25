import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { api } from '../services/api';

export default function OnboardingView() {
  const { user, profile, refreshUserData } = useAuth();
  const { tamilEnabled, triggerCelebration } = useLearning();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Goals, 2: Daily time, 3: Placement test, 4: Results
  const [fullName, setFullName] = useState(profile?.full_name || 'Suresh');
  const [selectedGoal, setSelectedGoal] = useState('Job Interview & Career');
  const [dailyMinutes, setDailyMinutes] = useState(20);

  // Diagnostic questions
  const [currentDiagIndex, setCurrentDiagIndex] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState({});
  const [evaluatedLevel, setEvaluatedLevel] = useState('A2');

  const diagnosticQuestions = [
    {
      q: "She ________ to the office every morning at 9:00 AM.",
      options: ["goes", "go", "is go", "going"],
      correct: "goes"
    },
    {
      q: "Which sentence is completely correct?",
      options: [
        "I did not went there yesterday.",
        "I did not go there yesterday.",
        "I was not go there yesterday.",
        "I haven't went there yesterday."
      ],
      correct: "I did not go there yesterday."
    },
    {
      q: "If it rains tomorrow, we ________ our outdoor meeting.",
      options: ["will postpone", "would postponed", "postponed", "are postpone"],
      correct: "will postpone"
    },
    {
      q: "What does 'meticulous' mean?",
      options: [
        "Showing extreme attention to detail and precision",
        "Very fast and hasty",
        "Confused and doubtful",
        "Loud and aggressive"
      ],
      correct: "Showing extreme attention to detail and precision"
    }
  ];

  const handleDiagSelect = (opt) => {
    setDiagAnswers({ ...diagAnswers, [currentDiagIndex]: opt });
    if (currentDiagIndex < diagnosticQuestions.length - 1) {
      setCurrentDiagIndex(currentDiagIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      diagnosticQuestions.forEach((dq, idx) => {
        if ((idx === currentDiagIndex ? opt : diagAnswers[idx]) === dq.correct) {
          score++;
        }
      });

      let recLevel = 'A1';
      if (score >= 4) recLevel = 'B2';
      else if (score >= 3) recLevel = 'B1';
      else if (score >= 2) recLevel = 'A2';
      else recLevel = 'A1';

      setEvaluatedLevel(recLevel);
      setStep(4);
      triggerCelebration();
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      await api.updateProfile({
        fullName,
        primaryGoal: selectedGoal,
        dailyGoalMinutes: dailyMinutes,
        currentLevel: evaluatedLevel
      });
      await refreshUserData();
      navigate('/');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const goals = [
    { title: 'Job Interview & Career', tamil: 'நேர்காணல் & வேலைவாய்ப்பு', icon: 'work' },
    { title: 'Daily Spoken Fluency', tamil: 'அன்றாட உரையாடல்', icon: 'record_voice_over' },
    { title: 'College & School English', tamil: 'பள்ளி & கல்லூரி ஆங்கிலம்', icon: 'school' },
    { title: 'Travel & Communication', tamil: 'பயணம் & தகவல் தொடர்பு', icon: 'flight' },
    { title: 'IELTS / Exam Preparation', tamil: 'IELTS & போட்டித் தேர்வுகள்', icon: 'military_tech' },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 pt-8 pb-nav min-h-[85vh] flex flex-col justify-center">
      
      {/* STEP 1: Name & Goals */}
      {step === 1 && (
        <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 1 of 3</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display mt-1">
              What is your primary goal?
            </h1>
            <p className="text-xs text-on-surface-variant font-tamil mt-1">
              உங்கள் முக்கிய ஆங்கில கற்றல் இலக்கைத் தேர்ந்தெடுக்கவும்.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Your Name (உங்கள் பெயர்)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-3.5 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-on-surface">Choose Goal</label>
            {goals.map((g) => (
              <button
                key={g.title}
                onClick={() => setSelectedGoal(g.title)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                  selectedGoal === g.title
                    ? 'bg-primary-fixed border-primary text-primary font-bold shadow-sm'
                    : 'bg-surface-container border-surface-variant/60 text-on-surface hover:border-primary/40'
                } gap-3`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px]">{g.icon}</span>
                  <div>
                    <span className="text-sm font-bold block">{g.title}</span>
                    {tamilEnabled && <span className="text-xs font-tamil opacity-75">{g.tamil}</span>}
                  </div>
                </div>
                {selectedGoal === g.title && (
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-md shadow-primary/25 hover:bg-primary-container transition-all"
          >
            Continue to Daily Commitment →
          </button>
        </div>
      )}

      {/* STEP 2: Daily Commitment */}
      {step === 2 && (
        <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 2 of 3</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display mt-1">
              Daily Practice Time
            </h2>
            <p className="text-xs text-on-surface-variant font-tamil mt-1">
              தினமும் எவ்வளவு நேரம் பயிற்சி செய்ய விரும்புகிறீர்கள்?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { min: 15, label: 'Casual (15m)', tamil: 'எளிதானது' },
              { min: 20, label: 'Standard (20m)', tamil: 'வழக்கமானது' },
              { min: 30, label: 'Serious (30m)', tamil: 'தீவிரமானது' },
              { min: 45, label: 'Intense (45m)', tamil: 'முழுமையானது' },
            ].map((t) => (
              <button
                key={t.min}
                onClick={() => setDailyMinutes(t.min)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-center flex flex-col items-center justify-center transition-all ${
                  dailyMinutes === t.min
                    ? 'bg-primary-fixed border-primary text-primary font-bold shadow-sm'
                    : 'bg-surface-container border-surface-variant/60 text-on-surface'
                }`}
              >
                <span className="text-xl font-extrabold font-display">{t.min}m</span>
                <span className="text-xs font-bold mt-0.5">{t.label}</span>
                {tamilEnabled && <span className="text-[11px] font-tamil opacity-75 mt-0.5">{t.tamil}</span>}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-md shadow-primary/25 hover:bg-primary-container transition-all"
          >
            Start Quick Diagnostic Test (4 Questions) →
          </button>
        </div>
      )}

      {/* STEP 3: Quick Diagnostic Test */}
      {step === 3 && (
        <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Diagnostic Question {currentDiagIndex + 1} of {diagnosticQuestions.length}
            </span>
            <h3 className="text-lg font-bold text-on-surface font-display mt-2">
              {diagnosticQuestions[currentDiagIndex].q}
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {diagnosticQuestions[currentDiagIndex].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleDiagSelect(opt)}
                className="w-full p-4 rounded-2xl bg-surface-container hover:bg-primary-fixed hover:text-primary border border-surface-variant/60 text-left font-semibold text-sm transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Assessment Result & Personalized Path */}
      {step === 4 && (
        <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col items-center text-center gap-5 animate-[slideIn_0.3s_ease-out]">
          <div className="w-20 h-20 shrink-0 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Assessment Complete</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display mt-1">
              Recommended: Level {evaluatedLevel}
            </h2>
            <p className="text-xs text-on-surface-variant font-tamil mt-1">
              உங்கள் பதில்களின் அடிப்படையில் ஆரம்ப நிலை பரிந்துரைக்கப்பட்டுள்ளது.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container w-full text-left flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold gap-3">
              <span className="text-on-surface-variant uppercase">Goal</span>
              <span className="text-primary">{selectedGoal}</span>
            </div>
            <div className="flex justify-between text-xs font-bold gap-3">
              <span className="text-on-surface-variant uppercase">Daily Target</span>
              <span className="text-secondary">{dailyMinutes} Minutes</span>
            </div>
          </div>

          <button
            onClick={handleFinishOnboarding}
            className="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-lg shadow-primary/25 hover:bg-primary-container transition-all"
          >
            Launch Personalized Dashboard 🚀
          </button>
        </div>
      )}

    </div>
  );
}
