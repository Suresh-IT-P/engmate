const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('englishmate_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getMe: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload }),
  updateSettings: (payload) => request('/auth/settings', { method: 'PUT', body: payload }),
  submitPlacementTest: (payload) => request('/auth/placement-test', { method: 'POST', body: payload }),

  // Courses & Lessons
  getCourses: (params = '') => request(`/courses${params ? '?' + params : ''}`),
  getCourseById: (id) => request(`/courses/${id}`),
  getCategories: () => request('/courses/categories'),
  getLevels: () => request('/courses/levels'),
  getLessonById: (id) => request(`/lessons/${id}`),
  completeLesson: (id, payload) => request(`/lessons/${id}/complete`, { method: 'POST', body: payload }),

  // Vocabulary
  getVocabulary: (params = '') => request(`/vocabulary${params ? '?' + params : ''}`),
  getWordOfTheDay: () => request('/vocabulary/word-of-the-day'),
  getReviewQueue: (limit = 15) => request(`/vocabulary/review-queue?limit=${limit}`),
  submitWordReview: (id, quality) => request(`/vocabulary/${id}/review`, { method: 'POST', body: { quality } }),

  // Grammar
  getGrammarTopics: (params = '') => request(`/grammar${params ? '?' + params : ''}`),
  getGrammarTopicById: (id) => request(`/grammar/${id}`),

  // Exercises & Quizzes
  getExercises: (params = '') => request(`/exercises${params ? '?' + params : ''}`),
  getExerciseById: (id) => request(`/exercises/${id}`),
  getCustomPracticeSet: (count = 10) => request(`/exercises/practice/custom?count=${count}`),
  submitExercise: (id, payload) => request(`/exercises/${id}/submit`, { method: 'POST', body: payload }),
  getDailyQuiz: () => request('/quiz/daily'),

  // Grammar Battle
  getBattleTopics: () => request('/battle/topics'),
  getBattleQuestions: (topic = 'mixed', count = 10) =>
    request(`/battle/questions?topic=${encodeURIComponent(topic)}&count=${count}`),

  submitQuizAttempt: (payload) => request('/quiz/attempt', { method: 'POST', body: payload }),
  getQuizHistory: () => request('/quiz/history'),

  // Speaking
  getSpeakingTopics: (params = '') => request(`/speaking/topics${params ? '?' + params : ''}`),
  evaluateSpeaking: (payload) => request('/speaking/evaluate', { method: 'POST', body: payload }),

  // AI Tutor & Tools
  chatWithAI: (payload) => request('/ai/chat', { method: 'POST', body: payload }),
  correctSentence: (sentence) => request('/ai/correct-sentence', { method: 'POST', body: { sentence } }),
  evaluateWriting: (payload) => request('/ai/evaluate-writing', { method: 'POST', body: payload }),
  getAIScenarios: () => request('/ai/scenarios'),
  getConversationHistory: (id) => request(`/ai/history/${id}`),

  // Skills
  getReadingPassages: (params = '') => request(`/skills/reading${params ? '?' + params : ''}`),
  getListeningLessons: (params = '') => request(`/skills/listening${params ? '?' + params : ''}`),
  getWritingPrompts: (params = '') => request(`/skills/writing${params ? '?' + params : ''}`),
  completeSkillSession: (payload) => request('/skills/complete-session', { method: 'POST', body: payload }),

  // Progress & Gamification
  getDashboardStats: () => request('/progress/dashboard'),
  getSkillAnalytics: () => request('/progress/analytics'),
  getMistakes: () => request('/progress/mistakes'),
  markMistakeReviewed: (id) => request(`/progress/mistakes/${id}/reviewed`, { method: 'POST' }),
  getLeaderboard: () => request('/progress/leaderboard'),

  // Bookmarks & Notifications
  getBookmarks: (type = '') => request(`/bookmarks${type ? '?type=' + type : ''}`),
  addBookmark: (payload) => request('/bookmarks', { method: 'POST', body: payload }),
  removeBookmark: (id) => request(`/bookmarks/${id}`, { method: 'DELETE' }),
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Global Search
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),

  // Friends & Social
  searchFriends: (q) => request(`/friends/search?q=${encodeURIComponent(q)}`),
  sendFriendRequest: (payload) => request('/friends/request', { method: 'POST', body: payload }),
  getFriends: () => request('/friends'),
  respondFriendRequest: (payload) => request('/friends/respond', { method: 'PUT', body: payload }),
  removeFriend: (friendId) => request(`/friends/${friendId}`, { method: 'DELETE' }),

  // Chat Rooms & Direct Messaging
  getChatRooms: () => request('/chat/rooms'),
  getOrCreateDirectRoom: (friendId) => request('/chat/rooms/direct', { method: 'POST', body: { friendId } }),
  getRoomMessages: (roomId, limit = 50) => request(`/chat/rooms/${roomId}/messages?limit=${limit}`),
  getDirectRoomDetail: (roomId) => request(`/chat/rooms/${roomId}/detail`),
  getRoomCalls: (roomId, limit = 50) => request(`/chat/rooms/${roomId}/calls?limit=${limit}`),
  sendChatMessage: (roomId, payload) => request(`/chat/rooms/${roomId}/messages`, { method: 'POST', body: payload }),
  createChatRoom: (payload) => request('/chat/rooms', { method: 'POST', body: payload }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAllUsers: (params = '') => request(`/admin/users${params ? '?' + params : ''}`),
  updateUserStatus: (id, payload) => request(`/admin/users/${id}`, { method: 'PUT', body: payload }),
  importContent: (payload) => request('/admin/import', { method: 'POST', body: payload }),
  createVocabulary: (payload) => request('/admin/vocabulary', { method: 'POST', body: payload }),
  deleteVocabulary: (id) => request(`/admin/vocabulary/${id}`, { method: 'DELETE' }),
};
