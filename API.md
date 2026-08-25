# REST API Documentation — English Mate

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### Register
`POST /api/auth/register`
```json
{
  "email": "learner@example.com",
  "password": "Password123!",
  "fullName": "Suresh Kumar",
  "nativeLanguage": "Tamil",
  "targetLevel": "B1",
  "primaryGoal": "Job Interview"
}
```

### Login
`POST /api/auth/login`
```json
{
  "email": "learner@example.com",
  "password": "Password123!"
}
```

### Current User Profile
`GET /api/auth/me`

### Update Profile
`PUT /api/auth/profile`

---

## 2. Curriculum & Lessons

### List Courses
`GET /api/courses?level_id=A1&category_id=general`

### Get Course with Modules & Lessons
`GET /api/courses/:id`

### Get Lesson Details & Content
`GET /api/lessons/:id`

### Complete Lesson
`POST /api/lessons/:id/complete`
```json
{
  "score": 100,
  "durationSeconds": 180
}
```

---

## 3. Vocabulary & Flashcards

### Browse Vocabulary
`GET /api/vocabulary?level_id=A1&search=improve&limit=20&offset=0`

### Word of the Day
`GET /api/vocabulary/word-of-the-day`

### Spaced Repetition Review Queue
`GET /api/vocabulary/review-queue?limit=15`

### Submit Flashcard Review (SM-2 Rating)
`POST /api/vocabulary/:id/review`
```json
{
  "quality": 4
}
```

---

## 4. Grammar & Exercises

### List Grammar Topics
`GET /api/grammar?level_id=A1`

### Get Grammar Topic by ID
`GET /api/grammar/:id`

### List Exercises
`GET /api/exercises?level_id=A1`

### Submit Exercise Answers
`POST /api/exercises/:id/submit`
```json
{
  "answers": [
    { "questionId": 1, "answer": "Hello, my name is Karthik." }
  ],
  "durationSeconds": 60
}
```

---

## 5. AI Tutor & Speaking

### AI Conversational Chat
`POST /api/ai/chat`
```json
{
  "message": "Can you explain when to use present continuous?",
  "conversationId": null,
  "scenario": "General Chat",
  "enableTamil": true
}
```

### Sentence Doctor
`POST /api/ai/correct-sentence`
```json
{
  "sentence": "Myself Suresh. I am go to college yesterday."
}
```

### Writing Evaluation
`POST /api/ai/evaluate-writing`
```json
{
  "promptId": "wri_leave_email",
  "promptTitle": "Sick Leave Email",
  "text": "Dear Sir, I am having fever today...",
  "minWords": 30
}
```

### Speaking Pronunciation Evaluation
`POST /api/speaking/evaluate`
```json
{
  "topicId": "spk_self_intro",
  "targetSentence": "Hello! My name is Rajesh and I live in Madurai.",
  "spokenTranscript": "Hello my name is Rajesh and I live in Madurai",
  "durationSeconds": 20
}
```

---

## 6. Progress & Admin

### User Dashboard Stats
`GET /api/progress/dashboard`

### Competency Skill Radar
`GET /api/progress/analytics`

### Mistake Notebook
`GET /api/progress/mistakes`

### Admin Stats
`GET /api/admin/stats`

### Bulk JSON Import
`POST /api/admin/import`
```json
{
  "entityType": "vocabulary",
  "data": [
    {
      "word": "resilient",
      "meaning": "Able to recover quickly from difficulty",
      "tamil_meaning": "மீண்டு வரும் ஆற்றல்",
      "level_id": "C1"
    }
  ]
}
```
