/**
 * Deterministic gate between generated content and the database.
 *
 * The vocabulary already shipped in this project was machine-generated without
 * a gate and it shows: 1,016 of 1,050 rows have a fake phonetic that just
 * echoes the word, 705 carry invented forms like "abilityly" and "un-ability",
 * and 945 "Tamil translations" are actually English. Nothing new gets in
 * without passing these checks.
 *
 * Every rule here is mechanical. Judgement about meaning belongs to the review
 * agents; this file only catches what code can prove.
 */

/** Tamil block. Real Tamil text must contain at least one of these. */
const TAMIL = /[஀-௿]/;

/** Latin letters, used to catch English hiding inside a "Tamil" field. */
const LATIN_RUN = /[A-Za-z]{3,}/g;

const VALID_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

const VALID_POS = new Set([
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction',
  'pronoun', 'interjection', 'phrase', 'phrasal verb', 'idiom', 'determiner',
  'article', 'numeral', 'abbreviation', 'proverb'
]);

/**
 * Fabricated-morphology detector. The old dataset built "related words" by
 * gluing suffixes onto any stem, producing non-words. Flag the shapes that
 * generator produced rather than trying to validate English morphology.
 */
function looksFabricated(candidate, headword) {
  const w = String(candidate || '').trim().toLowerCase();
  const head = String(headword || '').trim().toLowerCase();
  if (!w || !head) return false;

  // "un-ability", "non-ability" — hyphen-prefixed straight onto the headword.
  if (new RegExp(`^(un|non|dis|in|im)-${head}$`).test(w)) return true;

  // "abilityly", "abilitying", "abilityed", "abilityness" — suffix glued onto
  // the full headword. Real derivations almost always alter the stem.
  if (new RegExp(`^${head}(ly|ing|ed|ness|ity|ment|able)$`).test(w)) {
    // A few genuinely do stack cleanly; allow the short, common ones.
    const genuine = new Set(['quickly', 'slowly', 'kindly', 'badly', 'sadly', 'openly', 'lately']);
    if (!genuine.has(w)) return true;
  }

  // "ability-related" — the placeholder the old generator emitted.
  if (w.endsWith('-related') || w === `${head}-related`) return true;

  return false;
}

/** Is this string real Tamil rather than English wearing a Tamil label? */
function isRealTamil(text) {
  const s = String(text || '').trim();
  if (!s) return false;
  if (!TAMIL.test(s)) return false;

  // Reject "திறன்: He showed great ability in mathematics." — a Tamil token
  // followed by an English sentence. Allow a stray Latin word or two (proper
  // nouns, borrowed terms) but not a run of them.
  const latin = s.match(LATIN_RUN) || [];
  if (latin.length >= 3) return false;

  // Tamil characters should be the bulk of it.
  const tamilChars = (s.match(/[஀-௿]/g) || []).length;
  const latinChars = (s.match(/[A-Za-z]/g) || []).length;
  return tamilChars > latinChars;
}

/** A phonetic must be IPA in slashes, and must not just echo the word. */
function isUsablePhonetic(phonetic, word) {
  const p = String(phonetic || '').trim();
  if (!p) return true; // empty is explicitly allowed and honest
  if (!/^\/.+\/$/.test(p)) return false;
  const inner = p.slice(1, -1).trim().toLowerCase();
  if (inner === String(word || '').trim().toLowerCase()) return false; // "/ability/"
  return true;
}

/** Does the example sentence actually contain the word (or an inflection)? */
function sentenceContainsWord(sentence, word) {
  const s = String(sentence || '').toLowerCase();
  const w = String(word || '').trim().toLowerCase();
  if (!s || !w) return false;
  if (s.includes(w)) return true;

  // Allow ordinary inflection of a single-word headword.
  if (!w.includes(' ')) {
    const stem = w.replace(/(e|y)$/, '');
    if (stem.length >= 4 && new RegExp(`\\b${stem}[a-z]{0,4}\\b`).test(s)) return true;
  } else {
    // Phrasal verbs and idioms bend; require the first and last token.
    const parts = w.split(/\s+/);
    return s.includes(parts[0]) && s.includes(parts[parts.length - 1]);
  }
  return false;
}

/** Clean a synonyms/antonyms/related list, dropping fabricated members. */
function cleanList(raw, headword) {
  return String(raw || '')
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x && x.length > 1 && !looksFabricated(x, headword) && /^[A-Za-z][A-Za-z\s'-]*$/.test(x))
    .filter((x) => x.toLowerCase() !== String(headword || '').toLowerCase())
    .slice(0, 6)
    .join(', ');
}

/**
 * Validate and normalise one vocabulary entry.
 * @returns {{ok: true, entry: object} | {ok: false, reason: string}}
 */
function validateVocabEntry(raw) {
  const word = String(raw.word || '').trim();

  if (!word) return { ok: false, reason: 'empty word' };
  if (word.length > 60) return { ok: false, reason: 'word too long' };
  if (!/^[A-Za-z][A-Za-z\s'.-]*$/.test(word)) return { ok: false, reason: `non-English characters in "${word}"` };

  const meaning = String(raw.meaning || '').trim();
  if (meaning.length < 8) return { ok: false, reason: `meaning too thin for "${word}"` };
  if (TAMIL.test(meaning)) return { ok: false, reason: `Tamil leaked into the English meaning of "${word}"` };

  const tamilMeaning = String(raw.tamil_meaning || '').trim();
  if (!isRealTamil(tamilMeaning)) return { ok: false, reason: `tamil_meaning is not real Tamil for "${word}"` };

  const sentence = String(raw.example_sentence || '').trim();
  if (sentence && !sentenceContainsWord(sentence, word)) {
    return { ok: false, reason: `example does not contain "${word}"` };
  }

  const exampleTamil = String(raw.example_tamil || '').trim();
  const keepExample = sentence && isRealTamil(exampleTamil);

  const pos = String(raw.part_of_speech || '').trim().toLowerCase();
  const level = VALID_LEVELS.has(raw.level_id) ? raw.level_id : 'B1';

  return {
    ok: true,
    entry: {
      word,
      // An unusable phonetic becomes empty rather than a lie.
      phonetic: isUsablePhonetic(raw.phonetic, word) ? String(raw.phonetic || '').trim() : '',
      part_of_speech: VALID_POS.has(pos) ? pos : 'noun',
      meaning,
      simple_meaning: String(raw.simple_meaning || '').trim() || meaning,
      tamil_meaning: tamilMeaning,
      level_id: level,
      synonyms: cleanList(raw.synonyms, word),
      antonyms: cleanList(raw.antonyms, word),
      related_words: cleanList(raw.related_words, word),
      common_mistakes: TAMIL.test(String(raw.common_mistakes || '')) ? '' : String(raw.common_mistakes || '').trim(),
      example: keepExample ? { sentence, tamil_translation: exampleTamil } : null
    }
  };
}

/**
 * Validate one grammar example.
 */
function validateGrammarExample(raw) {
  const sentence = String(raw.example_sentence || '').trim();
  if (sentence.length < 5) return { ok: false, reason: 'example sentence too short' };
  if (TAMIL.test(sentence)) return { ok: false, reason: 'Tamil leaked into the English example sentence' };

  const tamil = String(raw.tamil_translation || '').trim();
  if (!isRealTamil(tamil)) return { ok: false, reason: `tamil_translation is not real Tamil: "${sentence.slice(0, 40)}"` };

  const isCorrect = raw.is_correct === 0 || raw.is_correct === '0' ? 0 : 1;
  const explanation = String(raw.explanation || '').trim();

  // A "wrong" example is useless without the correction spelled out.
  if (isCorrect === 0 && explanation.length < 10) {
    return { ok: false, reason: 'incorrect example carries no correction' };
  }

  return {
    ok: true,
    example: { example_sentence: sentence, tamil_translation: tamil, is_correct: isCorrect, explanation }
  };
}

/**
 * Validate one grammar topic and its examples.
 */
function validateGrammarTopic(raw) {
  const id = String(raw.id || '').trim().toLowerCase();
  if (!/^gram_[a-z0-9_]+$/.test(id)) return { ok: false, reason: `bad topic id "${raw.id}"` };

  const title = String(raw.title || '').trim();
  if (title.length < 3) return { ok: false, reason: `topic ${id} has no title` };

  const explanation = String(raw.explanation || '').trim();
  if (explanation.length < 20) return { ok: false, reason: `topic ${id} explanation too thin` };

  const beginner = String(raw.beginner_explanation || '').trim();
  // The beginner explanation is the Tamil one; it must actually be Tamil.
  const beginnerOk = isRealTamil(beginner);

  const examples = [];
  const rejected = [];
  for (const ex of raw.examples || []) {
    const v = validateGrammarExample(ex);
    if (v.ok) examples.push(v.example);
    else rejected.push(v.reason);
  }

  return {
    ok: true,
    rejected,
    topic: {
      id,
      title,
      tamil_title: String(raw.tamil_title || '').trim() || title,
      level_id: VALID_LEVELS.has(raw.level_id) ? raw.level_id : 'B1',
      summary: String(raw.summary || '').trim(),
      tamil_summary: isRealTamil(raw.tamil_summary) ? String(raw.tamil_summary).trim() : '',
      rule_formula: String(raw.rule_formula || '').trim(),
      explanation,
      beginner_explanation: beginnerOk ? beginner : '',
      common_mistakes: String(raw.common_mistakes || '').trim(),
      examples
    }
  };
}

/** Case-insensitive dedupe across batches, first occurrence wins. */
function dedupeByWord(entries) {
  const seen = new Set();
  const out = [];
  for (const e of entries) {
    const key = e.word.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

module.exports = {
  validateVocabEntry,
  validateGrammarTopic,
  validateGrammarExample,
  dedupeByWord,
  isRealTamil,
  isUsablePhonetic,
  looksFabricated,
  sentenceContainsWord,
  TAMIL
};
