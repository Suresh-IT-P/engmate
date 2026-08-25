import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function Navbar() {
  const { user, profile, streak, logout } = useAuth();
  const { tamilEnabled, setTamilEnabled, setSearchOpen } = useLearning();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-surface-variant/40 pt-safe">
      <div className="max-w-6xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">translate</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-bold text-base sm:text-lg text-primary leading-none truncate">English Mate</span>
              {/* The badge is the first thing to go: on a 320px screen the brand
                  block and the action cluster together overran the bar. */}
              <span className="hidden md:inline-block shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-secondary-container/60 text-on-secondary-container">AI Bridge</span>
            </div>
            {tamilEnabled && (
              <span className="hidden xs:block text-[11px] font-tamil font-medium text-on-surface-variant leading-tight truncate">ஆங்கிலக் கற்றல் பாலம்</span>
            )}
          </div>
        </Link>

        {/* Right: Search, Tamil toggle, XP, Streak, Profile Avatar */}
        <div className="flex items-center gap-1.5 xs:gap-2 md:gap-3 shrink-0">
          
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
            title="Search topics & words"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Tamil Translation Toggle */}
          <button
            onClick={() => setTamilEnabled(!tamilEnabled)}
            className={`px-2 xs:px-2.5 py-1.5 shrink-0 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              tamilEnabled
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
            }`}
            title="Toggle Tamil explanations"
          >
            <span className="text-[11px]">தமிழ்</span>
            <span className={`w-2 h-2 rounded-full ${tamilEnabled ? 'bg-secondary-container' : 'bg-outline-variant'}`}></span>
          </button>

          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-tertiary-container/15 rounded-full border border-tertiary-container/30">
            <span className="material-symbols-outlined text-tertiary text-[18px]">workspace_premium</span>
            <span className="text-xs font-bold text-on-surface font-display">{profile?.xp || 0} XP</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2.5 py-1 shrink-0 bg-error-container/40 rounded-full border border-error-container/60">
            <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="text-xs font-bold text-on-surface font-display">{streak.current || 1}</span>
          </div>

          {/* User Profile / Auth Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-container text-white font-bold text-sm flex items-center justify-center shadow-sm hover:ring-2 hover:ring-primary/40 transition-all"
                aria-label="User Menu"
              >
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant/60 py-2 z-50 animate-slide-in">
                  <div className="px-4 py-2 border-b border-surface-variant/40">
                    <p className="text-xs font-bold text-on-surface font-display truncate">{profile?.full_name || user.email}</p>
                    <p className="text-[11px] text-on-surface-variant capitalize">{user.role} • Level {profile?.current_level || 'A1'}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    My Profile & Progress
                  </Link>

                  <Link
                    to="/mistakes"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-error">auto_fix_high</span>
                    Mistake Notebook
                  </Link>

                  <Link
                    to="/friends"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">group</span>
                    Friends Circle
                  </Link>

                  <Link
                    to="/chat"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
                    Chat Rooms
                  </Link>

                  <Link
                    to="/bookmarks"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-tertiary">bookmark</span>
                    Saved Bookmarks
                  </Link>

                  {(user.role === 'admin' || user.role === 'teacher') && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors border-t border-surface-variant/30"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      Admin & Teacher CMS
                    </Link>
                  )}

                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">settings</span>
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-error hover:bg-error-container/30 transition-colors border-t border-surface-variant/40"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-2 shrink-0 whitespace-nowrap bg-primary text-white text-xs font-bold rounded-full shadow-sm hover:bg-primary-container transition-colors"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
