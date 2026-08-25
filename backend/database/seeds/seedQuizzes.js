const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');

async function seedQuizzes() {
  const speakingTopics = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/speaking_topics.json'), 'utf8'));
  const conversations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/conversations.json'), 'utf8'));
  const reading = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/reading.json'), 'utf8'));
  const listening = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/listening.json'), 'utf8'));
  const writing = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/writing.json'), 'utf8'));
  const achievements = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/achievements.json'), 'utf8'));

  // 1. Speaking Topics
  for (const s of speakingTopics) {
    const existing = await db.query('SELECT id FROM speaking_topics WHERE id = ?', [s.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO speaking_topics (id, title, tamil_title, level_id, category, prompt_text, tamil_prompt, sample_sentence, key_vocabulary, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.id, s.title, s.tamil_title, s.level_id, s.category, s.prompt_text, s.tamil_prompt, s.sample_sentence, s.key_vocabulary, s.order_index]
      );
    }
  }

  // 2. Conversation Topics
  for (const c of conversations) {
    const existing = await db.query('SELECT id FROM conversation_topics WHERE id = ?', [c.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO conversation_topics (id, title, tamil_title, persona_name, persona_role, scenario_description, initial_message, tamil_initial_message, level_id, category, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.title, c.tamil_title, c.persona_name, c.persona_role, c.scenario_description, c.initial_message, c.tamil_initial_message, c.level_id, c.category, c.order_index]
      );
    }
  }

  // 3. Reading Passages
  for (const r of reading) {
    const existing = await db.query('SELECT id FROM reading_passages WHERE id = ?', [r.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO reading_passages (id, title, tamil_title, passage_text, level_id, word_count, vocabulary_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.title, r.tamil_title, r.passage_text, r.level_id, r.word_count, r.vocabulary_notes]
      );
    }
  }

  // 4. Listening Lessons
  for (const l of listening) {
    const existing = await db.query('SELECT id FROM listening_lessons WHERE id = ?', [l.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO listening_lessons (id, title, tamil_title, transcript, tamil_transcript, duration_seconds, level_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.title, l.tamil_title, l.transcript, l.tamil_transcript, l.duration_seconds, l.level_id]
      );
    }
  }

  // 5. Writing Prompts
  for (const w of writing) {
    const existing = await db.query('SELECT id FROM writing_prompts WHERE id = ?', [w.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO writing_prompts (id, title, tamil_title, prompt_type, instructions, sample_answer, level_id, min_words)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [w.id, w.title, w.tamil_title, w.prompt_type, w.instructions, w.sample_answer, w.level_id, w.min_words]
      );
    }
  }

  // 6. Achievements
  for (const a of achievements) {
    const existing = await db.query('SELECT id FROM achievements WHERE id = ?', [a.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO achievements (id, title, tamil_title, description, icon, xp_reward, badge_color, category, threshold_value)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.id, a.title, a.tamil_title, a.description, a.icon, a.xp_reward, a.badge_color, a.category, a.threshold_value]
      );
    }
  }

  // 7. Public Chat Rooms
  const publicRooms = [
    { id: 'room_beginners_hub', name: 'A1/A2 Beginners Practice Circle', tamil_name: 'அடிப்படை ஆங்கில உரையாடல் அரங்கம்', description: 'Practice basic daily conversation, greetings, and simple sentences in English.' },
    { id: 'room_samacheer_study', name: 'Samacheer Kalvi Study Circle (Class 6-12)', tamil_name: 'சமச்சீர் கல்வி பாட விவாதம் (6-12)', description: 'Discuss school English lessons, book back questions, prose summaries, and board exam grammar.' },
    { id: 'room_fluent_speaking', name: 'B1/B2 Spoken English & Fluency', tamil_name: 'தடையற்ற பேச்சுப் பயிற்சி அரங்கம்', description: 'Discuss daily topics, express opinions, tell stories, and improve spoken fluency.' },
    { id: 'room_general_lounge', name: 'English Mate Global Chat Lounge', tamil_name: 'பொது ஆங்கில நண்பர்கள் அரங்கம்', description: 'Open community lounge for English learners to make friends and chat.' }
  ];

  for (const room of publicRooms) {
    const existing = await db.query('SELECT id FROM chat_rooms WHERE id = ?', [room.id]);
    if (existing.length === 0) {
      await db.execute(
        `INSERT INTO chat_rooms (id, name, tamil_name, description, room_type)
         VALUES (?, ?, ?, ?, 'public')`,
        [room.id, room.name, room.tamil_name, room.description]
      );
    }
  }

  return {
    speakingTopics: speakingTopics.length,
    conversations: conversations.length,
    readingPassages: reading.length,
    listeningLessons: listening.length,
    writingPrompts: writing.length,
    achievements: achievements.length,
    chatRooms: publicRooms.length
  };
}

module.exports = seedQuizzes;
