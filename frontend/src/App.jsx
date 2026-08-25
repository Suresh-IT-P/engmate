import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { CallProvider } from './context/CallContext';
import { ReactionBurstProvider } from './components/reactions/ReactionBurstLayer';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import GlobalSearchModal from './components/GlobalSearchModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import CallOverlay from './components/CallOverlay';

import HomeDashboard from './pages/HomeDashboard';
import LearnHub from './pages/LearnHub';
import CourseDetailView from './pages/CourseDetailView';
import LessonDetailView from './pages/LessonDetailView';
import VocabularyTrainer from './pages/VocabularyTrainer';
import GrammarCoach from './pages/GrammarCoach';
import GrammarTopicDetail from './pages/GrammarTopicDetail';
import SpeakingPracticeView from './pages/SpeakingPracticeView';
import AITutorView from './pages/AITutorView';
import PracticeHub from './pages/PracticeHub';
import DailyQuizView from './pages/DailyQuizView';
import LiveGrammarBattle from './pages/LiveGrammarBattle';
import AIBattleRoute from './pages/AIBattleRoute';
import MultiplayerBattle from './pages/MultiplayerBattle';
import ReadingPracticeView from './pages/ReadingPracticeView';
import ListeningPracticeView from './pages/ListeningPracticeView';
import WritingPracticeView from './pages/WritingPracticeView';
import ProgressAnalytics from './pages/ProgressAnalytics';
import MistakeNotebook from './pages/MistakeNotebook';
import BookmarksView from './pages/BookmarksView';
import OnboardingView from './pages/OnboardingView';
import AdminDashboard from './pages/AdminDashboard';
import ProfileView from './pages/ProfileView';
import SettingsView from './pages/SettingsView';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';
import FriendsHub from './pages/FriendsHub';
import ChatRoomHub from './pages/ChatRoomHub';
import FriendChatView from './pages/FriendChatView';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />
      <GlobalSearchModal />
      <main className="flex-1 min-w-0 app-main">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/learn" element={<LearnHub />} />
          <Route path="/courses/:id" element={<CourseDetailView />} />
          <Route path="/lessons/:id" element={<LessonDetailView />} />
          <Route path="/vocabulary" element={<VocabularyTrainer />} />
          <Route path="/grammar" element={<GrammarCoach />} />
          <Route path="/grammar/:id" element={<GrammarTopicDetail />} />
          <Route path="/speaking" element={<SpeakingPracticeView />} />
          <Route path="/ai-tutor" element={<AITutorView />} />
          <Route path="/chat" element={<ChatRoomHub />} />
          <Route path="/messages/:roomId" element={<ProtectedRoute><FriendChatView /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><FriendsHub /></ProtectedRoute>} />
          <Route path="/practice" element={<PracticeHub />} />
          <Route path="/quiz/daily" element={<DailyQuizView />} />
          <Route path="/battle" element={<LiveGrammarBattle />} />
          <Route path="/battle/ai" element={<AIBattleRoute />} />
          <Route path="/battle/room" element={<MultiplayerBattle />} />
          <Route path="/battle/room/:roomId" element={<MultiplayerBattle />} />
          <Route path="/skills/reading" element={<ReadingPracticeView />} />
          <Route path="/skills/listening" element={<ListeningPracticeView />} />
          <Route path="/skills/writing" element={<WritingPracticeView />} />
          <Route path="/progress" element={<ProgressAnalytics />} />
          <Route path="/mistakes" element={<MistakeNotebook />} />
          <Route path="/bookmarks" element={<BookmarksView />} />
          <Route path="/onboarding" element={<OnboardingView />} />
          <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FloatingChatWidget />
      <CallOverlay />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LearningProvider>
          <ReactionBurstProvider>
            <CallProvider>
              <AppContent />
            </CallProvider>
          </ReactionBurstProvider>
        </LearningProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
