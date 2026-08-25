# Database Schema & Migration Guide — English Mate

## Database Engine
- **Primary:** MySQL (tested on MySQL 8.x / 5.7) via `mysql2` connection pool.
- **Embedded Fallback:** SQLite WebAssembly (`sql.js`) for zero-setup local dev/tests without external daemons.

---

## Complete Table Inventory (36 Tables)

| # | Table Name | Purpose |
| :--- | :--- | :--- |
| 1 | `learning_levels` | CEFR proficiency levels (A1 to C2) |
| 2 | `users` | User authentication credentials & status |
| 3 | `user_profiles` | Learner profile details, XP, coins, target level |
| 4 | `user_settings` | Theme, sound effects, voice speed, Tamil toggle |
| 5 | `content_categories` | Curriculum categories (General, Grammar, Vocab, etc.) |
| 6 | `courses` | Top-level courses |
| 7 | `modules` | Units / chapters within a course |
| 8 | `lessons` | Specific lesson units |
| 9 | `lesson_content` | Modular sections within lessons |
| 10 | `vocabulary` | Vocabulary words, meanings, phonetics, Tamil translations |
| 11 | `vocabulary_examples` | Sample sentences for vocabulary |
| 12 | `user_vocabulary` | Spaced repetition SM-2 tracking per user |
| 13 | `grammar_topics` | Grammar rules, formulas, common pitfalls |
| 14 | `grammar_examples` | Example sentences for grammar topics |
| 15 | `exercises` | Interactive exercise containers |
| 16 | `questions` | Individual exercise questions |
| 17 | `question_options` | Options / answers for questions |
| 18 | `quiz_attempts` | Historical quiz and assessment attempts |
| 19 | `quiz_answers` | Detailed answers per attempt |
| 20 | `speaking_topics` | Speaking practice prompts and sample audio |
| 21 | `conversation_topics` | AI roleplay scenarios (Interview, Cafe, etc.) |
| 22 | `reading_passages` | Reading comprehension stories and articles |
| 23 | `listening_lessons` | Listening practice dialogues and transcripts |
| 24 | `writing_prompts` | Writing practice topics |
| 25 | `learning_sessions` | Time spent and XP earned per session |
| 26 | `daily_goals` | Daily goal tracking per calendar day |
| 27 | `streaks` | Current and longest learning streaks |
| 28 | `achievements` | Gamification badge master catalog |
| 29 | `user_achievements` | Badges unlocked by users |
| 30 | `bookmarks` | Bookmarked words, lessons, grammar rules |
| 31 | `mistake_logs` | Mistake notebook entries for smart revision |
| 32 | `notifications` | In-app alerts, streak reminders, achievements |
| 33 | `ai_conversations` | Conversation threads with AI Tutor |
| 34 | `ai_messages` | Individual messages with corrections & Tamil translations |
| 35 | `user_progress` | Completed lessons tracking |
| 36 | `admin_users` | Admin & teacher permissions |

---

## Database Commands

```bash
# Execute schema migration
npm run db:migrate

# Seed learning dataset from JSON files
npm run db:seed

# Drop tables, re-migrate, and re-seed
npm run db:reset
```

---

## Backup and Restore

### Backup MySQL Database
```bash
mysqldump -u root -p englishmate > backup_englishmate_$(date +%Y%m%d).sql
```

### Restore MySQL Database
```bash
mysql -u root -p englishmate < backup_englishmate_20260822.sql
```
