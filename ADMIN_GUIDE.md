# Administrator & Teacher Portal Guide — English Mate

The Admin Portal is available at `/admin` for users with role `admin` or `teacher`.

---

## 1. Accessing Admin Panel
1. Sign in with admin credentials (`admin@englishmate.ai` / `EnglishMate@2026`).
2. Click the top-right profile avatar and select **Admin & Teacher CMS**.

---

## 2. Managing Learners & Roles
- Navigate to the **Users** tab.
- View learner email, current level, XP, and streak.
- Change roles dynamically between `user`, `teacher`, and `admin`.

---

## 3. Creating Vocabulary Words
- Navigate to the **Vocab** tab.
- Enter Word, Phonetic guide, CEFR Level (A1 to C2), English meaning, and Tamil translation.
- Optionally provide sample sentence and Tamil example translation.
- Click **Save Word to Database**.

---

## 4. Bulk JSON Ingestion Engine
- Navigate to the **Import** tab.
- Select target entity: `Vocabulary`, `Grammar`, or `Lessons`.
- Click **Load Sample JSON Template** or paste your structured JSON array.
- Click **Validate & Import Records**.
- Review the live statistics output:
  - Valid records
  - Inserted records
  - Duplicate records skipped
  - Invalid records flagged
