# Dataset Architecture & Extensibility — English Mate

All core learning content is stored in version-controlled JSON files under `backend/database/data/`.

---

## Dataset Files

1. `levels.json`: CEFR levels A1, A2, B1, B2, C1, C2.
2. `categories.json`: Categories (General English, Grammar, Vocabulary, Speaking, Interview, TN State Board).
3. `courses.json`: Hierarchical learning paths.
4. `modules.json`: Chapters per course.
5. `lessons.json`: Lesson catalog with XP rewards and estimated times.
6. `lesson_content.json`: Modular content sections (Concept explanations, dialogues, tips, grammar formulas, audio links).
7. `vocabulary.json`: Curated vocabulary with phonetics, definitions, Tamil translations, example sentences, synonyms, antonyms, common mistakes.
8. `grammar.json`: In-depth grammar topics with rule formulas, beginner Tamil explanations, and correct/incorrect example comparisons.
9. `exercises.json`: Question bank with options, hints, explanations, and Tamil translation notes.
10. `speaking_topics.json`: Speaking prompts and sample model sentences.
11. `conversations.json`: AI roleplay scenarios.
12. `reading.json`: Reading passages and comprehension notes.
13. `listening.json`: Listening dialogues and transcripts.
14. `writing.json`: Writing prompts and sample responses.
15. `achievements.json`: Gamification badge criteria.

---

## Expanding the Dataset
To add more lessons or vocabulary:
1. Simply append new entries to the appropriate JSON file in `backend/database/data/`.
2. Run `npm run db:seed`. The seeder will automatically insert new records without duplicating or corrupting existing user data.

---

## Class 11 Expansion Pack (Way to Success 2019)

A second content set built for the Tamil Nadu Class 11 syllabus. Files live in
`backend/database/data/` alongside the originals:

| File | Contents |
| :--- | :--- |
| `grammar_expanded.json` | 26 grammar topics with rule formulas, Tamil explanations and 78 worked examples |
| `reading_expanded.json` | 12 reading passages with key vocabulary and comprehension checks |
| `writing_expanded.json` | 20 writing tasks (bio-data, letters, notice, email, essay, report, dialogue…) with model answers |
| `conversations_expanded.json` | 20 AI roleplay scenarios with bilingual opening lines |

Practice questions are **generated, not stored as JSON**. Two modules build them
from the source guide at seed time:

- `wtsGuideParser.js` — extracts exam MCQs and the glossary, phrasal-verb, idiom,
  proverb, error-correction and British/American tables from
  `namma_kalvi_-_11th_wts_english_guide_2019.md`. The guide is a PDF conversion,
  so the parser also strips page furniture, discards Bamini-encoded Tamil, and
  repairs words whose spaces were lost in conversion.
- `buildWtsExercises.js` — turns that material into 30 exercises / ~363 questions,
  with deterministic distractor selection so every rebuild is identical.

### Seeding

```bash
node backend/database/seeds/seedExpandedContent.js
```

Idempotent — every row is checked before insert, so re-running adds nothing and
never touches user progress. Because questions are generated, editing either
builder module changes the output: clear the generated rows before re-seeding.

```sql
DELETE FROM question_options WHERE question_id IN (SELECT id FROM questions WHERE exercise_id LIKE 'ex_wts_%');
DELETE FROM questions WHERE exercise_id LIKE 'ex_wts_%';
DELETE FROM exercises WHERE id LIKE 'ex_wts_%';
```

> **Note on the running server.** The SQLite engine (`sql.js`) holds the whole
> database in memory and rewrites the file on save. A backend process started
> before a seed run keeps the old snapshot and will overwrite the new rows.
> Always restart the backend after seeding.

---

## Grammar Battle Bank

The Live Grammar Battle draws from its own tables — `battle_topics` and
`battle_questions` — deliberately kept apart from `questions`. The Daily Quiz
and Practice sprints sample `questions` at random, so folding five thousand
generated drills into it would bury the curated exam content.

| File | Role |
| :--- | :--- |
| `backend/database/data/battle/banks.js` | Hand-checked reference data: verb forms, SVO sentences, collocations, word pairs |
| `backend/database/data/buildBattleQuestions.js` | Generators that combine the banks into questions |
| `backend/database/seeds/seedBattleQuestions.js` | Seeder (idempotent, keyed by a hash of question + answer) |

**5,384 questions across 23 topics**, plus a "Mixed Challenge" pseudo-topic that
draws from all of them. Largest banks: Word Meanings (1,016), Find the Word
(1,016), Vocabulary in Context (777), Question Tags (552), Verb Forms (393),
Active & Passive Voice (360).

```bash
node backend/database/migrations/migrate.js      # creates the two tables
node backend/database/seeds/seedBattleQuestions.js
```

Preview the bank without touching the database:

```bash
node backend/database/data/buildBattleQuestions.js   # prints per-topic counts
```

### API

- `GET /api/battle/topics` — topics with question counts, "mixed" first
- `GET /api/battle/questions?topic=<id>&count=<n>` — random questions (max 50)

The AI duel fetches through this route and scores on the client. Multiplayer
does **not**: `gameHandler.js` reads `battle_questions` directly, holds the set
on the room, and never broadcasts `answer_index`.

### Rules the generators follow

Two mistakes are easy to make at this scale and both were caught in testing:

- **Every distractor must be wrong.** Pulling agreement distractors from the
  whole bank produced "Neither of the answers ______ correct" with both *is* and
  *was* available — two correct answers. Distractors for agreement questions now
  come from a number-only family map.
- **A cloze sentence must identify one word.** The vocabulary file reuses filler
  sentences across dozens of entries; blanked, those accept any of them. Cloze
  items whose sentence is not unique to a single word are discarded.

Plurality is stored explicitly in the banks rather than guessed from a trailing
"s" — otherwise "The children" and "The police" take singular verbs.

### Constraint when authoring questions

`ExerciseEngine` renders any question whose `question_text` contains `/` as a
word-scramble rather than a multiple-choice question, hiding the options. Keep
slashes out of `question_text`; the parser rewrites them to " or ".
