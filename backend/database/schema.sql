-- ==============================================================================
-- ENGLISH MATE - AI ENGLISH BRIDGE DATABASE SCHEMA (MySQL / Unified Engine)
-- ==============================================================================

-- 1. LEARNING LEVELS (A1 to C2)
CREATE TABLE IF NOT EXISTS learning_levels (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    min_xp INT NOT NULL DEFAULT 0,
    badge_icon VARCHAR(50) DEFAULT 'workspace_premium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user', 'admin', 'teacher'
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_verified BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(100),
    phone_number VARCHAR(20),
    native_language VARCHAR(50) DEFAULT 'Tamil',
    target_level VARCHAR(10) DEFAULT 'B1',
    current_level VARCHAR(10) DEFAULT 'A1',
    avatar_url TEXT,
    bio TEXT,
    xp INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 100,
    daily_goal_minutes INT NOT NULL DEFAULT 20,
    speaking_confidence VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'confident'
    primary_goal VARCHAR(100) DEFAULT 'Daily conversation',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_level) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 4. USER SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark', 'system'
    sound_effects BOOLEAN DEFAULT 1,
    voice_speed FLOAT DEFAULT 1.0,
    voice_accent VARCHAR(20) DEFAULT 'en-US',
    tamil_translation_enabled BOOLEAN DEFAULT 1,
    daily_reminder_time VARCHAR(10) DEFAULT '20:00',
    notifications_email BOOLEAN DEFAULT 1,
    notifications_push BOOLEAN DEFAULT 1,
    ai_feedback_mode VARCHAR(20) DEFAULT 'balanced', -- 'gentle', 'balanced', 'strict'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. CONTENT CATEGORIES
CREATE TABLE IF NOT EXISTS content_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tamil_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'folder',
    color_code VARCHAR(20) DEFAULT '#3525cd',
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. COURSES
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    description TEXT,
    tamil_description TEXT,
    level_id VARCHAR(10),
    category_id VARCHAR(50),
    thumbnail_url TEXT,
    total_xp INT DEFAULT 500,
    estimated_hours INT DEFAULT 10,
    is_published BOOLEAN DEFAULT 1,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE SET NULL
);

-- 7. MODULES
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 8. LESSONS
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    lesson_type VARCHAR(30) NOT NULL DEFAULT 'standard', -- 'standard', 'vocabulary', 'grammar', 'speaking', 'listening', 'reading'
    xp_reward INT DEFAULT 20,
    duration_minutes INT DEFAULT 10,
    order_index INT NOT NULL DEFAULT 1,
    is_published BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 9. LESSON CONTENT
CREATE TABLE IF NOT EXISTS lesson_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL,
    section_type VARCHAR(50) NOT NULL, -- 'concept', 'dialogue', 'tip', 'grammar_rule', 'audio_clip', 'checkpoint'
    title VARCHAR(150),
    content_text TEXT NOT NULL,
    tamil_translation TEXT,
    phonetic_guide VARCHAR(255),
    audio_url TEXT,
    media_url TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 10. VOCABULARY
CREATE TABLE IF NOT EXISTS vocabulary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL UNIQUE,
    phonetic VARCHAR(100),
    part_of_speech VARCHAR(50),
    meaning TEXT NOT NULL,
    simple_meaning TEXT,
    tamil_meaning TEXT NOT NULL,
    level_id VARCHAR(10) DEFAULT 'A1',
    category_id VARCHAR(50) DEFAULT 'general',
    synonyms TEXT,
    antonyms TEXT,
    related_words TEXT,
    common_mistakes TEXT,
    audio_url TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE SET NULL
);

-- 11. VOCABULARY EXAMPLES
CREATE TABLE IF NOT EXISTS vocabulary_examples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vocabulary_id INT NOT NULL,
    sentence TEXT NOT NULL,
    tamil_translation TEXT NOT NULL,
    audio_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);

-- 12. USER VOCABULARY (Spaced Repetition SM-2 tracking)
CREATE TABLE IF NOT EXISTS user_vocabulary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vocabulary_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'learning', -- 'learning', 'reviewing', 'mastered'
    box_level INT DEFAULT 1,
    repetitions INT DEFAULT 0,
    ease_factor FLOAT DEFAULT 2.5,
    interval_days INT DEFAULT 1,
    next_review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_reviewed_at DATETIME,
    correct_count INT DEFAULT 0,
    mistake_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vocabulary_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);

-- 13. GRAMMAR TOPICS
CREATE TABLE IF NOT EXISTS grammar_topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    level_id VARCHAR(10) DEFAULT 'A1',
    category_id VARCHAR(50) DEFAULT 'grammar',
    summary TEXT,
    tamil_summary TEXT,
    rule_formula TEXT,
    explanation TEXT NOT NULL,
    beginner_explanation TEXT,
    common_mistakes TEXT,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE SET NULL
);

-- 14. GRAMMAR EXAMPLES
CREATE TABLE IF NOT EXISTS grammar_examples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grammar_id VARCHAR(50) NOT NULL,
    example_sentence TEXT NOT NULL,
    tamil_translation TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT 1,
    explanation TEXT,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grammar_id) REFERENCES grammar_topics(id) ON DELETE CASCADE
);

-- 15. EXERCISES
CREATE TABLE IF NOT EXISTS exercises (
    id VARCHAR(50) PRIMARY KEY,
    lesson_id VARCHAR(50),
    grammar_id VARCHAR(50),
    category_id VARCHAR(50),
    level_id VARCHAR(10) DEFAULT 'A1',
    title VARCHAR(150) NOT NULL,
    exercise_type VARCHAR(50) NOT NULL, -- 'mcq', 'fill_blank', 'sentence_order', 'match_pairs', 'error_spotting', 'listening_select', 'true_false', 'translation'
    instructions TEXT,
    tamil_instructions TEXT,
    xp_points INT DEFAULT 10,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (grammar_id) REFERENCES grammar_topics(id) ON DELETE SET NULL,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 16. QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    tamil_subtext TEXT,
    prompt_audio_url TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    tamil_explanation TEXT,
    hint TEXT,
    points INT DEFAULT 10,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- 17. QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    tamil_text TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT 0,
    match_target TEXT,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 18. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_type VARCHAR(50) NOT NULL, -- 'daily', 'grammar', 'vocabulary', 'topic', 'placement', 'mock_exam'
    target_id VARCHAR(50),
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    accuracy_pct FLOAT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    time_taken_seconds INT DEFAULT 0,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 19. QUIZ ANSWERS
CREATE TABLE IF NOT EXISTS quiz_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 20. SPEAKING TOPICS
CREATE TABLE IF NOT EXISTS speaking_topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    level_id VARCHAR(10) DEFAULT 'A1',
    category VARCHAR(50) DEFAULT 'Daily Life',
    prompt_text TEXT NOT NULL,
    tamil_prompt TEXT,
    sample_sentence TEXT,
    key_vocabulary TEXT,
    audio_sample_url TEXT,
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 21. CONVERSATION TOPICS (AI Roleplay simulations)
CREATE TABLE IF NOT EXISTS conversation_topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    persona_name VARCHAR(100) DEFAULT 'Maya (English Coach)',
    persona_role VARCHAR(100) DEFAULT 'Friendly English Tutor',
    scenario_description TEXT NOT NULL,
    initial_message TEXT NOT NULL,
    tamil_initial_message TEXT,
    level_id VARCHAR(10) DEFAULT 'A1',
    category VARCHAR(50) DEFAULT 'Interview',
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 22. READING PASSAGES
CREATE TABLE IF NOT EXISTS reading_passages (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    passage_text TEXT NOT NULL,
    level_id VARCHAR(10) DEFAULT 'A1',
    word_count INT DEFAULT 100,
    vocabulary_notes TEXT,
    audio_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 23. LISTENING LESSONS
CREATE TABLE IF NOT EXISTS listening_lessons (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    audio_url TEXT,
    transcript TEXT NOT NULL,
    tamil_transcript TEXT,
    duration_seconds INT DEFAULT 60,
    level_id VARCHAR(10) DEFAULT 'A1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 24. WRITING PROMPTS
CREATE TABLE IF NOT EXISTS writing_prompts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    prompt_type VARCHAR(50) DEFAULT 'paragraph', -- 'sentence', 'paragraph', 'email', 'opinion', 'story'
    instructions TEXT NOT NULL,
    sample_answer TEXT,
    level_id VARCHAR(10) DEFAULT 'A1',
    min_words INT DEFAULT 30,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE SET NULL
);

-- 25. LEARNING SESSIONS
CREATE TABLE IF NOT EXISTS learning_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_type VARCHAR(50) NOT NULL, -- 'lesson', 'vocabulary', 'grammar', 'speaking', 'chat', 'exam'
    target_id VARCHAR(50),
    duration_seconds INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    session_date DATE DEFAULT (CURRENT_DATE()),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 26. DAILY GOALS
CREATE TABLE IF NOT EXISTS daily_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_date DATE DEFAULT (CURRENT_DATE()),
    target_xp INT DEFAULT 50,
    earned_xp INT DEFAULT 0,
    target_minutes INT DEFAULT 20,
    spent_minutes INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, goal_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 27. STREAKS
CREATE TABLE IF NOT EXISTS streaks (
    user_id INT PRIMARY KEY,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    streak_freeze_count INT DEFAULT 2,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 28. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    tamil_title VARCHAR(100),
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'emoji_events',
    xp_reward INT DEFAULT 50,
    badge_color VARCHAR(20) DEFAULT '#4f46e5',
    category VARCHAR(50) DEFAULT 'learning',
    threshold_value INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 29. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id VARCHAR(50) NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- 30. BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type VARCHAR(30) NOT NULL, -- 'word', 'lesson', 'grammar', 'question', 'speaking'
    item_id VARCHAR(50) NOT NULL,
    title VARCHAR(150),
    subtext TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 31. MISTAKE LOGS (Mistake Notebook)
CREATE TABLE IF NOT EXISTS mistake_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'quiz', 'exercise', 'speaking', 'chat', 'writing'
    original_input TEXT NOT NULL,
    corrected_input TEXT NOT NULL,
    explanation TEXT,
    tamil_explanation TEXT,
    grammar_rule VARCHAR(100),
    is_reviewed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 32. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'general', -- 'streak', 'daily_goal', 'achievement', 'review', 'system'
    is_read BOOLEAN DEFAULT 0,
    action_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 33. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic_id VARCHAR(50),
    title VARCHAR(150) DEFAULT 'AI Chat Session',
    mode VARCHAR(50) DEFAULT 'tutor', -- 'tutor', 'simulation', 'doctor', 'interview'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES conversation_topics(id) ON DELETE SET NULL
);

-- 34. AI MESSAGES
CREATE TABLE IF NOT EXISTS ai_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    tamil_translation TEXT,
    corrections_json TEXT,
    grammar_points TEXT,
    pronunciation_score FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
);

-- 35. USER PROGRESS (Lesson Completion tracking)
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed', -- 'in_progress', 'completed'
    score INT DEFAULT 100,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 36. ADMIN USERS (Audit & permissions)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'editor', 'teacher'
    permissions_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 37. FRIENDSHIPS
CREATE TABLE IF NOT EXISTS friendships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 38. CHAT ROOMS
CREATE TABLE IF NOT EXISTS chat_rooms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tamil_name VARCHAR(100),
    description TEXT,
    room_type VARCHAR(20) NOT NULL DEFAULT 'public', -- 'public', 'direct'
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 39. CHAT ROOM MEMBERS
CREATE TABLE IF NOT EXISTS chat_room_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 40. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    tamil_translation TEXT,
    grammar_correction TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- GRAMMAR BATTLE
-- Kept separate from `questions` so the battle bank (thousands of generated
-- drills) cannot swamp the curated exam content that feeds the Daily Quiz
-- and Practice sprints, which sample `questions` at random.
CREATE TABLE IF NOT EXISTS battle_topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    tamil_title VARCHAR(150),
    icon VARCHAR(40),
    order_index INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS battle_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    answer_index INT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(10) DEFAULT 'medium',
    question_key VARCHAR(80) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES battle_topics(id) ON DELETE CASCADE
);

-- MESSAGE REACTIONS
-- One row per (message, user, emoji). The UNIQUE key is what makes a tap a
-- toggle: re-reacting with the same emoji deletes the row instead of stacking.
CREATE TABLE IF NOT EXISTS message_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    emoji VARCHAR(24) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji),
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- VOICE CALLS
CREATE TABLE IF NOT EXISTS call_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    call_id VARCHAR(60) NOT NULL,
    room_id VARCHAR(50) NOT NULL,
    caller_id INT NOT NULL,
    callee_id INT NOT NULL,
    call_type VARCHAR(10) NOT NULL DEFAULT 'voice',
    status VARCHAR(20) NOT NULL DEFAULT 'missed',
    duration_seconds INT DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (callee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- (CREATE INDEX IF NOT EXISTS requires MySQL 8.0.32+; errors on duplicates are caught and ignored by migrate.js)
CREATE INDEX idx_message_reactions_msg ON message_reactions(message_id);
CREATE UNIQUE INDEX idx_call_logs_call_id ON call_logs(call_id);
CREATE INDEX idx_call_logs_room ON call_logs(room_id, started_at);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, created_at);
CREATE INDEX idx_battle_questions_topic ON battle_questions(topic_id);
CREATE UNIQUE INDEX idx_battle_questions_key ON battle_questions(topic_id, question_key);
CREATE INDEX idx_vocabulary_level ON vocabulary(level_id);
CREATE INDEX idx_vocabulary_category ON vocabulary(category_id);
CREATE INDEX idx_grammar_level ON grammar_topics(level_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_questions_exercise ON questions(exercise_id);
CREATE INDEX idx_user_vocab_review ON user_vocabulary(user_id, next_review_date);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_ai_messages_conv ON ai_messages(conversation_id);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
