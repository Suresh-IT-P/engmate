# AI Architecture & Integration Guide — English Mate

## Architecture Overview

All AI logic is encapsulated in `backend/src/services/aiService.js`. The frontend **never** accesses external AI keys or third-party endpoints directly.

```
React Frontend ──(REST /api/ai/*)──> Express Backend ──> aiService.js
                                                              │
                    ┌─────────────────────────┬───────────────┴───────────────┐
                    ▼                         ▼                               ▼
            Google Gemini API           OpenAI API               Built-in English Teacher
         (gemini-1.5-flash)         (gpt-4o-mini)             Rule & NLP Grammar Doctor
```

---

## 1. Configuring External AI Providers

To connect Google Gemini:
```env
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

To connect OpenAI:
```env
AI_PROVIDER=openai
AI_API_KEY=sk-your_openai_key_here
AI_MODEL=gpt-4o-mini
```

---

## 2. Built-in Offline Fallback Engine
When `AI_API_KEY` is not set:
- **Sentence Doctor:** Parses common Indian/Tamil English errors (`Myself Alex` $\to$ `I am Alex`, `I am go` $\to$ `I am going`, `passed out of college` $\to$ `graduated from college`, `did not went` $\to$ `did not go`), and generates bilingual English-Tamil explanations and grammar rules.
- **AI Tutor Chat:** Maintains context across conversation personas (Friendly Tutor Maya, Job Interview Recruiter, Cafe Barista, Border Control Officer), provides suggested reply chips, and offers subtle grammar corrections.
- **Writing Evaluator:** Calculates Grammar (0-100), Vocabulary (0-100), Clarity (0-100), and provides structured feedback bullet points.
- **Pronunciation & Speaking Evaluator:** Compares speech-to-text transcript with target sentence, computes accuracy, fluency, pronunciation scores, and flags missed words.
