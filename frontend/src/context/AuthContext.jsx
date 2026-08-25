import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('englishmate_token');
    if (token) {
      loadCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);


  async function loadCurrentUser() {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        setSettings(res.data.settings);
        setStreak({
          current: res.data.streak.current_streak || 0,
          longest: res.data.streak.longest_streak || 0
        });
        connectSocket(); // Restore socket for existing session
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(phone, password) {
    const res = await api.login({ identifier: phone, password });
    if (res.success && res.data) {
      localStorage.setItem('englishmate_token', res.data.token);
      connectSocket();
      setUser(res.data.user);
      setProfile({
        full_name: res.data.user.fullName,
        current_level: res.data.user.currentLevel,
        target_level: res.data.user.targetLevel,
        xp: res.data.user.xp,
        coins: res.data.user.coins,
        daily_goal_minutes: res.data.user.dailyGoalMinutes,
        primary_goal: res.data.user.primaryGoal
      });
      setSettings(res.data.user.settings || {});
      setStreak({
        current: res.data.user.streak || 1,
        longest: res.data.user.longestStreak || 1
      });
      return res.data.user;
    }
    throw new Error(res.message || 'Login failed');
  }

  async function register(payload) {
    const res = await api.register(payload);
    if (res.success && res.data) {
      localStorage.setItem('englishmate_token', res.data.token);
      connectSocket();
      setUser(res.data.user);
      setProfile({
        full_name: res.data.user.fullName,
        current_level: res.data.user.currentLevel,
        target_level: res.data.user.targetLevel,
        xp: res.data.user.xp,
        primary_goal: payload.primaryGoal
      });
      setStreak({ current: 1, longest: 1 });
      return res.data.user;
    }
    throw new Error(res.message || 'Registration failed');
  }

  function logout() {
    localStorage.removeItem('englishmate_token');
    disconnectSocket();
    setUser(null);
    setProfile(null);
    setSettings(null);
    setStreak({ current: 0, longest: 0 });
  }

  async function refreshUserData() {
    await loadCurrentUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        settings,
        streak,
        loading,
        login,
        register,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
