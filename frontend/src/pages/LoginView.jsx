import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function LoginView() {
  const { login } = useAuth();
  const { tamilEnabled } = useLearning();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await login(phone, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-nav min-h-[80vh] flex flex-col justify-center">
      <div className="p-4 sm:p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/80 shadow-2xl flex flex-col gap-6">

        {/* Brand Banner */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-[32px]">translate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface font-display">Welcome Back!</h1>
          <p className="text-xs text-on-surface-variant font-tamil">
            {tamilEnabled ? 'உங்கள் கற்றல் பயணத்தைத் தொடர உள்நுழையவும்.' : 'Sign in to continue your English learning streak.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-surface-container border border-surface-variant/70 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-primary text-white font-extrabold text-sm shadow-md shadow-primary/25 hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
}
