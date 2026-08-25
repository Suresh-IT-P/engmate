# Architecture Guide — English Mate: AI English Bridge

## 1. System Overview

English Mate uses a decoupled, modern client-server architecture designed for high responsiveness, offline resilience, and cross-platform mobile compatibility.

```
┌────────────────────────────────────────────────────────┐
│               Frontend: React 18 + Vite                │
│  - TailwindCSS with Material Design 3 Palette          │
│  - React Router DOM v6                                 │
│  - Web Speech API (TTS & Speech-to-Text)               │
│  - HTML5 Canvas Confetti & Micro-animations            │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / Bearer Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Backend API: Express.js (Node.js)          │
│  - Modular Controllers, Services, & Routes             │
│  - Bcrypt Password Hashing & JWT Authentication        │
│  - AI Service Abstraction (Gemini / OpenAI / NLP)      │
│  - SuperMemo SM-2 Spaced Repetition Engine             │
│  - Analytics & Gamification Engine                     │
│  - Bulk JSON/CSV Validation & Ingestion Engine         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Database Layer: MySQL & Unified SQL         │
│  - 32+ Normalized Relational Tables                    │
│  - Strict Constraints, Indexes, Foreign Keys           │
│  - Portable JSON Seeders in version control            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Separation of Concerns: Learning Content vs User Data

A core architectural principle of English Mate is the strict separation between:

1. **Learning Content (Portable & Version-Controlled)**:
   - Levels, Courses, Modules, Lessons, Lesson Content
   - Vocabulary, Examples, Synonyms, Antonyms, Common Mistakes
   - Grammar Topics, Rules, Formula Cards
   - Exercises, Questions, Options
   - Speaking Prompts, Roleplay Scenarios, Reading Passages, Listening Dialogues, Writing Prompts
   - *Stored in `backend/database/data/*.json` and seeded automatically via `npm run db:seed`.*

2. **User & State Data (Relational MySQL)**:
   - User credentials (`users`)
   - Learner profiles (`user_profiles`)
   - Settings & accessibility preferences (`user_settings`)
   - Spaced repetition progress (`user_vocabulary`)
   - Lesson completions (`user_progress`)
   - Streaks & Daily Goals (`streaks`, `daily_goals`)
   - Quiz attempts & detailed answers (`quiz_attempts`, `quiz_answers`)
   - Mistake notebook entries (`mistake_logs`)
   - Saved bookmarks & notifications (`bookmarks`, `notifications`)
   - AI conversation logs (`ai_conversations`, `ai_messages`)

---

## 3. AI Service Provider Abstraction

The AI layer in `backend/src/services/aiService.js` follows the Provider Pattern:
- Client code calls `aiService.chat()`, `aiService.correctSentence()`, or `aiService.evaluateWriting()`.
- The provider checks environment variables:
  - If `AI_PROVIDER=gemini` and `AI_API_KEY` is present, it formats requests to Google Gemini REST API.
  - If `AI_PROVIDER=openai`, it formats requests to OpenAI.
  - If no external key is configured, it invokes the built-in English Teacher & NLP Grammar Doctor, ensuring zero downtime or crashes.

---

## 4. Live Grammar Battle (Socket.IO)

### Routes

| Route | Screen |
| :--- | :--- |
| `/battle` | Mode picker — AI or friends |
| `/battle/ai` | Topic picker, then the solo duel |
| `/battle/room` | Room setup: topic, seconds per question, number of questions |
| `/battle/room/:roomId` | The room itself — shareable, joinable directly |

Creating a room replaces the URL with `/battle/room/<CODE>`, so the address bar
*is* the invite link. Opening that link cold joins the room; opening it with a
session already in the room rejoins instead, preserving score and position.
Express falls back to `index.html` for non-`/api` paths, so a shared link works
on a hard load rather than 404ing.

### The server owns the clock

The host picks 5–60 seconds per question. That value is stored on the room,
sent to every player, and enforced by the server:

```
startRound()  → send question, schedule endRound at (seconds + 1s slack)
submit_answer → if everyone has answered, bring endRound forward to 400ms
endRound()    → broadcast round_over with the answer, then next round after 2.6s
```

Each round carries a `roundToken`; a timer from an already-finished round is
ignored. Before this the round advanced only when *all* players had answered, so
one disconnected player could hang the room indefinitely.

`answer_index` is never broadcast. Clients learn the correct answer only in
`answer_result` (their own submission) or `round_over` (the reveal), which is
also what lets a player who ran out of time still see the answer.

### Events

| Client → Server | Purpose |
| :--- | :--- |
| `create_room` | topic, `secondsPerQuestion`, `questionCount` |
| `join_room` / `rejoin_room` | join by code, or resume an existing seat |
| `start_game`, `submit_answer` | match flow |
| `update_settings` | host-only, lobby-only clock change |
| `rematch` | same room and settings, scores reset |
| `send_chat`, `send_emote` | the social layer |

| Server → Client | Purpose |
| :--- | :--- |
| `room_created` / `join_success` / `rejoin_success` | room metadata incl. timer |
| `new_question` | question, options, `secondsPerQuestion` — no answer |
| `answer_result` / `round_over` | private result, then the shared reveal |
| `opponent_answered` | "locked in" cue, without leaking the choice |
| `system_message` | banter: streaks, first-correct, timeouts, results |
| `game_finished`, `rematch_ready`, `settings_updated` | lifecycle |

Banter lines live in `BANTER` in `gameHandler.js` and are deliberately
good-natured — they celebrate speed and streaks, and never mock a wrong answer.

## 5. Spaced Repetition (SM-2) Engine

The vocabulary retention system implements the SuperMemo SM-2 algorithm in `backend/src/services/spacedRepetitionService.js`:
- Each review rates the card quality $q \in [0, 5]$.
- If $q \ge 3$, review streak increments; interval advances ($1 \to 6 \to I_{n-1} \times EF$).
- If $q < 3$, review streak resets to 0 and interval reverts to 1 day.
- Ease factor is updated dynamically:
  $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
  with a minimum threshold of $1.3$.

## 6. Mobile Layout System

The app is a fixed top bar, a scrolling `<main>`, and a fixed bottom nav. Three
component classes in `frontend/src/index.css` keep the scrolling area clear of
both bars on every device, including notched phones where the bars are taller
than their nominal height:

| Class | Used by | Does |
| :--- | :--- | :--- |
| `app-main` | `<main>` in `App.jsx` | `padding-top: 4rem + safe-area-inset-top` |
| `pb-nav` | every page's root container | bottom clearance for the nav **plus** the home-indicator inset |
| `h-app-pane` | chat, AI tutor | `100dvh` minus both bars and both insets |

Page roots use `pb-nav` rather than a hard-coded `pb-28`, which ignored the
home-indicator inset. Full-height panes use `h-app-pane` rather than
`h-[calc(100vh-5rem)]`: `vh` does not shrink when the mobile URL bar is showing,
so the composer sat below the fold.

Three base rules back this up:

- `overflow-x: clip` on `html, body` — a stray wide child can never turn the
  page into a sideways scroller. `clip` rather than `hidden` because `hidden`
  creates a scroll container and breaks `position: sticky` further down.
- `overflow-wrap: break-word` on `body` — long words, URLs and unbroken Tamil
  strings wrap instead of widening the layout.
- `input, textarea, select { font-size: 16px }` under `max-width: 639px`. iOS
  Safari zooms the page whenever a focused field is smaller than 16px. This
  matters now that `user-scalable=no` has been removed from the viewport meta:
  blocking pinch-zoom is an accessibility failure, so the app allows zoom and
  suppresses the autozoom instead.

An `xs: 400px` breakpoint covers the 320–399px phones that Tailwind's default
`sm: 640px` lumps in with tablets. It is where the navbar drops its badge, the
bottom-nav labels shrink, and the exercise header drops its button labels.

Two rules of thumb when adding UI: a box with an explicit square size
(`w-10 h-10`) always takes `shrink-0`, and a flex child that holds text always
takes `min-w-0` — without it the child refuses to shrink below its content
width and pushes its sibling off the screen.

## 7. Friend Chat & Voice Calls

### Where it lives

| Route | Screen |
| :--- | :--- |
| `/chat` | Chat hub — public practice rooms; tapping a friend DM opens the screen below |
| `/messages/:roomId` | One-to-one friend chat with presence, typing, and the call button |

`FriendsHub`'s Chat button and the hub's direct-room rows both land on
`/messages/:roomId`. Public rooms stay on the hub, which keeps its REST polling.

### One socket for the whole app

`frontend/src/services/socket.js` owns a single Socket.IO connection shared by
the battle, chat, presence and calls. It replaced a hard-coded
`http://localhost:5000` that only worked on the dev machine; the URL now falls
back to the page origin in a build, because Vite proxies `/api` but not the
socket. The connection carries the JWT in its handshake and re-handshakes on
login and logout, so presence follows the signed-in user.

Because the socket is shared, the battle screen detaches its own listeners on
unmount (`BATTLE_EVENTS`) instead of closing the connection.

### Messages

`chat:message` writes through `services/chatService.js`, the same path the REST
controller uses — a message must not differ depending on whether it arrived over
HTTP or the socket, particularly its AI Grammar Doctor pass. The server then
broadcasts `chat:new-message` to the room and `chat:room-activity` to the other
member's personal room, so an unread badge can appear on a screen they are not
currently looking at.

### Voice calls

The audio is peer-to-peer WebRTC and never reaches this server. The socket
carries only the handshake:

```
call:invite  → server checks friendship, presence and busy state
             → call:incoming rings the callee (45s timer)
call:accept  → call:accepted tells the caller to build the offer
call:signal  → blind relay of SDP offer / answer / ICE candidates
call:end     → call:ended to both, outcome written to call_logs
```

The microphone is not opened until a call is actually answered — the caller
opens it on `call:accepted`, the callee on accept. Ringing costs no permission
prompt.

Three guards are enforced server-side, not in the UI, so a crafted socket event
cannot get past them: you can only call an **accepted friend**, only one call
per user at a time, and `chat:join` requires room membership.

`call_logs` records the outcome of every attempt so the chat timeline can
interleave "missed call" and "voice call · 2:14" entries with the messages.

### Known limits

- **STUN only, no TURN.** Peers behind symmetric NAT (some mobile carriers,
  strict corporate wifi) cannot find a direct path and the call will fail to
  connect. A TURN relay is a paid service and would need adding to
  `ICE_SERVERS` in `context/CallContext.jsx`.
- **`getUserMedia` needs a secure context.** Calls work on `localhost` and over
  HTTPS. Testing on a phone against a plain `http://192.168.x.x` address fails
  at the microphone permission step — that is a browser rule, not a bug.
- **Socket identity inherits the REST layer's demo-mode fallback.** An
  unauthenticated socket is treated as the first active account, matching
  `authenticateToken`. Tighten `identify()` in `socket/chatHandler.js` to reject
  tokenless sockets before exposing the server publicly.
- Presence and call state are in-memory, so they are per-process. Running more
  than one backend instance needs a shared adapter (e.g. Redis).

## 8. Emoji Reactions

### The animation engine

`components/reactions/` holds one engine used by both the friend chat and the
battle:

| File | Role |
| :--- | :--- |
| `reactionKit.js` | emoji sets, particle physics, haptics, reduced-motion check |
| `ReactionBurstLayer.jsx` | the full-screen layer bursts are painted on |
| `ReactionPicker.jsx` | quick row, bottom sheet, and the count chips |

Every particle writes its own `--dx / --dy / --s / --r1 / --r2 / --dur` inline,
so the single `reactionFloat` keyframe in `tailwind.config.js` produces a whole
scatter of different arcs. Without that per-particle randomisation a burst reads
as one column of identical emoji, which is what makes cheap reaction effects
look cheap.

`ReactionBurstProvider` wraps the app in `App.jsx` and renders into a fixed,
`pointer-events-none` overlay. That placement is deliberate: animating the emoji
inside the message bubble that spawned it means the bubble's own rounding and
`overflow` clip the arc after a few pixels.

Bursts spring from the tapped element's `getBoundingClientRect()`, so a reaction
appears to leave the button rather than the middle of the screen.

### Mobile behaviour

- Every emoji target is at least 36px, 44px in the sheet.
- The palette is a **bottom sheet** on phones, a centred dialog from `sm:` up —
  a popover anchored to a message near the top of the list would open where the
  thumb cannot reach.
- The quick row scrolls horizontally inside `overflow-x-auto`: eight emoji plus
  the "more" button is ~364px, wider than a 320px screen.
- `navigator.vibrate` gives a short tap buzz where supported.
- `prefers-reduced-motion` drops the particle count to three, shortens the
  travel, and removes the sparkles and the buzz entirely.

### Gestures in the chat

| Gesture | Result |
| :--- | :--- |
| Double-tap a message | ❤️ |
| Press and hold (420ms) | opens the quick reaction row |
| Right-click / long-press menu | same row (context menu suppressed) |
| Tap a count chip | toggles your own reaction |

The listen button inside a bubble stops propagation, so playing a message never
also reacts to it.

### Persistence and sync

`message_reactions` is keyed `UNIQUE(message_id, user_id, emoji)` — that key is
what makes a tap a toggle rather than a stack. `chat:react` validates the emoji
(length and no markup), checks the message actually belongs to the room the
caller named, and re-checks room membership before writing.

`chat:reaction-update` carries `byUserId` and `added` so each client can decide
whether to animate: your own reaction already burst locally on tap, and removing
a reaction should never throw confetti.

`getRoomMessages` batches reactions for the whole page in one query — one query
per message would be N+1 on every room open.
