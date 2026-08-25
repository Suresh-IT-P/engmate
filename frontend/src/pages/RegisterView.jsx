import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function RegisterView() {
  const { register } = useAuth();
  const { tamilEnabled } = useLearning();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [targetLevel, setTargetLevel] = useState('B1');
  const [primaryGoal, setPrimaryGoal] = useState('Daily conversation');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    try {
      await register({
        fullName,
        phoneNumber: phone.trim(),
        password,
        targetLevel,
        primaryGoal,
        nativeLanguage: 'Tamil'
      });
      navigate('/onboarding');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-nav min-h-[80vh] flex flex-col justify-center">
      <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col gap-6">

        {/* Brand Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-[32px]">translate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface font-display">Create Account</h1>
          <p className="text-xs text-on-surface-variant font-tamil">
            {tamilEnabled ? 'இலவசமாக பதிவு செய்து உங்கள் கற்றலைத் தொடங்குங்கள்.' : 'Join English Mate to start mastering spoken English.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Full Name (முழு பெயர்)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Keerthu"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">
              Phone Number (தொலைபேசி எண்)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">phone</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Level & Goal */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Target Level</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container border border-surface-variant/70 text-xs font-bold"
              >
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Fluent</option>
                <option value="C1">C1 - Professional</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Primary Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container border border-surface-variant/70 text-xs font-bold"
              >
                <option value="Job Interview">Job Interview</option>
                <option value="Daily conversation">Daily Chat</option>
                <option value="College English">College</option>
                <option value="Travel English">Travel</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              'Create Account & Start'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
