/**
 * Builds practice exercises for the Class 11 course from the Way to Success
 * guide: authentic exam MCQs lifted verbatim, plus generated drills built on
 * the guide's own glossary, phrasal-verb, idiom and error tables.
 *
 * Output matches the shape consumed by seeds/seedExercises.js.
 */

const { parseMcqs, extractSources, safeQuestion } = require('./wtsGuideParser');

const COURSE_LEVEL = 'B1';
const CATEGORY = 'tn_board';

/** Deterministic PRNG so re-running the build produces identical rows. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Pick `n` distractors from `pool` that cannot be mistaken for the answer.
 * Deterministic: the same index always yields the same set.
 */
function distractors(pool, answer, n, seed) {
  const rand = rng(seed);
  const banned = new Set([norm(answer)]);
  // A distractor sharing a content word with the answer risks being defensible.
  const answerWords = new Set(String(answer).toLowerCase().match(/[a-z]{4,}/g) || []);

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked = [];
  for (const cand of shuffled) {
    if (picked.length === n) break;
    const key = norm(cand);
    if (!key || banned.has(key)) continue;
    const candWords = (String(cand).toLowerCase().match(/[a-z]{4,}/g) || []);
    if (candWords.some((w) => answerWords.has(w))) continue;
    banned.add(key);
    picked.push(cand);
  }
  // Relax the overlap rule only if the pool was too small.
  for (const cand of shuffled) {
    if (picked.length === n) break;
    const key = norm(cand);
    if (banned.has(key)) continue;
    banned.add(key);
    picked.push(cand);
  }
  return picked;
}

function mcq({ question, answer, wrong, explanation, hint, points = 10 }) {
  const options = [answer, ...wrong].map((t) => ({ option_text: t, is_correct: t === answer ? 1 : 0 }));
  return {
    question_text: safeQuestion(question),
    tamil_subtext: null,
    correct_answer: answer,
    explanation: explanation || null,
    tamil_explanation: null,
    hint: hint || '',
    points,
    options
  };
}

/** Split a list into exercises of at most `size` questions each. */
function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function makeExercise({ id, title, tamilTitle, type, instructions, tamilInstructions, questions, order }) {
  return {
    id,
    lesson_id: null,
    grammar_id: null,
    category_id: CATEGORY,
    level_id: COURSE_LEVEL,
    title,
    tamil_title: tamilTitle,
    exercise_type: type,
    instructions,
    tamil_instructions: tamilInstructions,
    xp_points: Math.max(10, questions.length * 2),
    order_index: order,
    questions: questions.map((q, i) => ({ ...q, order_index: i + 1 }))
  };
}

/**
 * Route an authentic MCQ to the drill it belongs in. The section heading is
 * more reliable than the stem, because synonym and antonym questions are bare
 * sentences whose stem says nothing about the task.
 */
function classify(q) {
  const s = (q.section || '').toLowerCase();
  if (/antonym|opposite/.test(s)) return 'antonyms';
  if (/synonym/.test(s)) return 'synonyms';
  if (/foreign word/.test(s)) return 'foreign';
  if (/proverb/.test(s)) return 'proverbs';
  if (/phrasal verb/.test(s)) return 'phrasal';
  if (/idiom/.test(s)) return 'idioms';
  if (/abbreviation|acronym|expansion/.test(s)) return 'abbreviations';
  if (/clipped/.test(s)) return 'clipped';
  if (/compound word/.test(s)) return 'compound';
  if (/definition for the given term|definition/.test(s)) return 'definitions';

  const t = q.question.toLowerCase();
  if (/expanded form|expansion|abbreviat|acronym/.test(t)) return 'abbreviations';
  if (/compound word/.test(t)) return 'compound';
  if (/clipped/.test(t)) return 'clipped';
  if (/antonym|opposite/.test(t)) return 'antonyms';
  if (/prefix|suffix/.test(t)) return 'affixes';
  if (/idiom/.test(t)) return 'idioms';
  if (/phrasal verb/.test(t)) return 'phrasal';
  if (/foreign|phrase.*mean/.test(t)) return 'foreign';
  if (/syllable|syllabif/.test(t)) return 'syllables';
  if (/question tag|tag/.test(t)) return 'tags';
  if (/preposition/.test(t)) return 'prepositions';
  if (/modal/.test(t)) return 'modals';
  if (/sentence pattern|pattern of the/.test(t)) return 'patterns';
  if (/plural|singular/.test(t)) return 'number';
  if (/american|british/.test(t)) return 'britam';
  if (/definition|term/.test(t)) return 'definitions';
  if (/synonym|meaning of the underlined|appropriate meaning/.test(t)) return 'synonyms';
  return 'mixed';
}

const GROUP_META = {
  synonyms: ['Synonyms — Previous Govt Exam Questions', 'இணைச்சொற்கள் — அரசுத் தேர்வு வினாக்கள்'],
  antonyms: ['Antonyms — Previous Govt Exam Questions', 'எதிர்ச்சொற்கள் — அரசுத் தேர்வு வினாக்கள்'],
  abbreviations: ['Abbreviations & Acronyms — Exam Questions', 'சுருக்கக் குறியீடுகள் — தேர்வு வினாக்கள்'],
  compound: ['Compound Words — Exam Questions', 'கூட்டுச் சொற்கள் — தேர்வு வினாக்கள்'],
  clipped: ['Clipped Words — Exam Questions', 'சுருக்கப்பட்ட சொற்கள்'],
  affixes: ['Prefixes & Suffixes — Exam Questions', 'முன்னொட்டு & பின்னொட்டு'],
  idioms: ['Idioms & Their Meanings', 'மரபுத்தொடர்களும் பொருளும்'],
  phrasal: ['Phrasal Verbs — Exam Questions', 'கூட்டு வினைச்சொற்கள்'],
  foreign: ['Foreign Words & Phrases', 'அயல்மொழிச் சொற்கள்'],
  syllables: ['Syllabification', 'அசைப் பிரிப்பு'],
  tags: ['Question Tags', 'வினா ஒட்டுகள்'],
  prepositions: ['Prepositions', 'முன்னுருபுகள்'],
  modals: ['Modal Verbs', 'துணை வினைகள்'],
  patterns: ['Sentence Patterns', 'வாக்கிய அமைப்புகள்'],
  number: ['Singular & Plural Forms', 'ஒருமை & பன்மை'],
  britam: ['British vs American English', 'பிரிட்டிஷ் & அமெரிக்க ஆங்கிலம்'],
  definitions: ['One-Word Definitions', 'ஒரு சொல் விளக்கம்'],
  proverbs: ['Proverbs — Exam Questions', 'பழமொழிகள் — தேர்வு வினாக்கள்'],
  mixed: ['Part I Mixed Revision', 'பகுதி I கலப்பு மீள்பார்வை']
};

function build() {
  const authentic = parseMcqs();
  const src = extractSources();
  const exercises = [];
  let order = 100;

  // ---- 1. Authentic exam MCQs, grouped by question type -------------------
  const groups = {};
  for (const q of authentic) {
    (groups[classify(q)] = groups[classify(q)] || []).push(q);
  }

  for (const [key, list] of Object.entries(groups)) {
    const [title, tamilTitle] = GROUP_META[key] || GROUP_META.mixed;
    chunk(list, 15).forEach((part, i) => {
      const questions = part.map((q) => mcq({
        question: q.question,
        answer: q.answer,
        wrong: q.options.filter((o) => o !== q.answer),
        explanation: `Correct answer: ${q.answer}. From the Way to Success 2019 guide, Part I.`,
        hint: 'This question has appeared in a previous government exam.'
      }));
      exercises.push(makeExercise({
        id: `ex_wts_exam_${key}${list.length > 15 ? `_${i + 1}` : ''}`,
        title: `${title}${list.length > 15 ? ` (Set ${i + 1})` : ''}`,
        tamilTitle,
        type: 'mcq',
        instructions: 'Choose the correct answer from the options given.',
        tamilInstructions: 'கொடுக்கப்பட்டுள்ள விடைகளிலிருந்து சரியானதைத் தேர்ந்தெடுக்கவும்.',
        questions,
        order: order++
      }));
    });
  }

  // ---- 2. Prose glossary -> synonym drills --------------------------------
  const meanings = src.glossary.map((g) => g.meaning);
  chunk(src.glossary, 20).forEach((part, i) => {
    const questions = part.map((g, j) => mcq({
      question: `Choose the correct meaning of the word "${g.word}".`,
      answer: g.meaning,
      wrong: distractors(meanings, g.meaning, 3, i * 1000 + j),
      explanation: `"${g.word}" means ${g.meaning}. (Textbook glossary — ${g.source})`,
      hint: `From the prose glossary of your textbook.`
    }));
    exercises.push(makeExercise({
      id: `ex_wts_glossary_${i + 1}`,
      title: `Textbook Glossary — Word Meanings (Set ${i + 1})`,
      tamilTitle: 'பாடநூல் சொற்பொருள் — சொல் விளக்கம்',
      type: 'mcq',
      instructions: 'Choose the correct meaning of the given word.',
      tamilInstructions: 'கொடுக்கப்பட்ட சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்.',
      questions,
      order: order++
    }));
  });

  // ---- 3. Phrasal verbs ---------------------------------------------------
  const phrasalMeanings = src.phrasal.map((p) => p.meaning);
  chunk(src.phrasal, 15).forEach((part, i) => {
    const questions = part.map((p, j) => mcq({
      question: p.usage
        ? `In the sentence "${p.usage}", what does "${p.verb}" mean?`
        : `Choose the correct meaning of the phrasal verb "${p.verb}".`,
      answer: p.meaning,
      wrong: distractors(phrasalMeanings, p.meaning, 3, 20000 + i * 100 + j),
      explanation: `"${p.verb}" means ${p.meaning}.`,
      hint: 'Think about the whole phrase, not the verb alone.'
    }));
    exercises.push(makeExercise({
      id: `ex_wts_phrasal_${i + 1}`,
      title: `Phrasal Verbs in Context (Set ${i + 1})`,
      tamilTitle: 'கூட்டு வினைச்சொற்கள் — பயன்பாடு',
      type: 'mcq',
      instructions: 'Choose the correct meaning of the phrasal verb.',
      tamilInstructions: 'கூட்டு வினைச்சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்.',
      questions,
      order: order++
    }));
  });

  // ---- 4. Foreign words ---------------------------------------------------
  const foreignMeanings = src.foreign.map((f) => f.meaning);
  chunk(src.foreign, 15).forEach((part, i) => {
    const questions = part.map((f, j) => mcq({
      question: `Choose the correct meaning of the foreign phrase "${f.word}".`,
      answer: f.meaning,
      wrong: distractors(foreignMeanings, f.meaning, 3, 30000 + i * 100 + j),
      explanation: `"${f.word}" means ${f.meaning}.`,
      hint: 'These appear in the Part I foreign-words question.'
    }));
    exercises.push(makeExercise({
      id: `ex_wts_foreign_${i + 1}`,
      title: `Foreign Words & Phrases (Set ${i + 1})`,
      tamilTitle: 'அயல்மொழிச் சொற்களும் தொடர்களும்',
      type: 'mcq',
      instructions: 'Choose the correct meaning of the foreign word or phrase.',
      tamilInstructions: 'அயல்மொழிச் சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்.',
      questions,
      order: order++
    }));
  });

  // ---- 5. Semantic field / -ism words -------------------------------------
  if (src.semantic.length) {
    const semMeanings = src.semantic.map((s) => s.meaning);
    const questions = src.semantic.map((s, j) => mcq({
      question: `Choose the correct definition of "${s.word}".`,
      answer: s.meaning,
      wrong: distractors(semMeanings, s.meaning, 3, 40000 + j),
      explanation: `"${s.word}" means ${s.meaning}.`,
      hint: 'Semantic field — book back words.'
    }));
    chunk(questions, 15).forEach((part, i) => {
      exercises.push(makeExercise({
        id: `ex_wts_semantic_${i + 1}`,
        title: `Semantic Field — Word Definitions (Set ${i + 1})`,
        tamilTitle: 'சொற்களின் வரையறை',
        type: 'mcq',
        instructions: 'Choose the correct definition for the given term.',
        tamilInstructions: 'கொடுக்கப்பட்ட சொல்லுக்கான சரியான விளக்கத்தைத் தேர்ந்தெடுக்கவும்.',
        questions: part,
        order: order++
      }));
    });
  }

  // ---- 6. Proverbs --------------------------------------------------------
  if (src.proverbs.length) {
    const provMeanings = src.proverbs.map((p) => p.meaning);
    const questions = src.proverbs.map((p, j) => mcq({
      question: `What does the proverb "${p.proverb}" mean?`,
      answer: p.meaning,
      wrong: distractors(provMeanings, p.meaning, 3, 50000 + j),
      explanation: `"${p.proverb}" — ${p.meaning}`,
      hint: 'Proverbs are asked in Part III.'
    }));
    exercises.push(makeExercise({
      id: 'ex_wts_proverbs_1',
      title: 'Proverbs & Their Meanings',
      tamilTitle: 'பழமொழிகளும் பொருளும்',
      type: 'mcq',
      instructions: 'Choose the correct meaning of the proverb.',
      tamilInstructions: 'பழமொழியின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்.',
      questions,
      order: order++
    }));
  }

  // ---- 7. British vs American English -------------------------------------
  chunk(src.britAm, 15).forEach((part, i) => {
    const americanPool = src.britAm.map((b) => b.american);
    const questions = part.map((b, j) => mcq({
      question: `Choose the American English equivalent of the British word "${b.british}".`,
      answer: b.american,
      wrong: distractors(americanPool, b.american, 3, 60000 + i * 100 + j),
      explanation: `British "${b.british}" = American "${b.american}".`,
      hint: 'Part I asks you to convert between the two varieties.'
    }));
    exercises.push(makeExercise({
      id: `ex_wts_britam_${i + 1}`,
      title: `British vs American English (Set ${i + 1})`,
      tamilTitle: 'பிரிட்டிஷ் & அமெரிக்க ஆங்கிலம்',
      type: 'mcq',
      instructions: 'Choose the American English word for the given British word.',
      tamilInstructions: 'கொடுக்கப்பட்ட பிரிட்டிஷ் சொல்லுக்கான அமெரிக்க ஆங்கிலச் சொல்லைத் தேர்ந்தெடுக்கவும்.',
      questions,
      order: order++
    }));
  });

  // ---- 8. Error spotting ---------------------------------------------------
  const allWrong = src.errorPairs.map((p) => p.wrong);
  chunk(src.errorPairs, 15).forEach((part, i) => {
    const questions = part.map((p, j) => {
      const others = distractors(allWrong, p.right, 2, 70000 + i * 100 + j)
        .filter((w) => norm(w) !== norm(p.wrong));
      const wrong = [p.wrong, ...others].slice(0, 3);
      return mcq({
        question: 'Which of the following sentences is grammatically correct?',
        answer: p.right,
        wrong,
        explanation: `Correct: "${p.right}" — the other sentences break subject-verb agreement or verb-form rules.`,
        hint: 'Check the subject and the verb form carefully.'
      });
    });
    exercises.push(makeExercise({
      id: `ex_wts_errors_${i + 1}`,
      title: `Spot the Error — Grammar Corrections (Set ${i + 1})`,
      tamilTitle: 'பிழை கண்டறிதல் — இலக்கணத் திருத்தம்',
      type: 'error_spotting',
      instructions: 'Identify the grammatically correct sentence.',
      tamilInstructions: 'இலக்கணப்படி சரியான வாக்கியத்தைக் கண்டறியவும்.',
      questions,
      order: order++
    }));
  });

  return exercises;
}

module.exports = { build };

if (require.main === module) {
  const ex = build();
  const q = ex.reduce((s, e) => s + e.questions.length, 0);
  console.log(`exercises: ${ex.length}  questions: ${q}`);
  for (const e of ex) console.log(`  ${String(e.questions.length).padStart(3)}q  ${e.id}  —  ${e.title}`);
}
