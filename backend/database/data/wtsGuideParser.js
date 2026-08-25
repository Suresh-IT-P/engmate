/**
 * Way to Success 2019 — 11th English guide parser.
 *
 * The guide is a PDF-to-markdown conversion, so it carries page furniture,
 * Bamini-encoded Tamil (which renders as ASCII gibberish and is discarded),
 * and questions that are sometimes packed into table cells. This module turns
 * that into clean, structured learning data.
 *
 * Exports:
 *   parseMcqs()      -> authentic exam MCQs with the bolded key as the answer
 *   parseTables()    -> markdown tables grouped by the heading above them
 *   extractSources() -> glossary / phrasal verbs / foreign words / proverbs /
 *                       error pairs / British-American pairs
 */

const fs = require('fs');
const path = require('path');

const GUIDE_PATH = path.join(__dirname, '../../../namma_kalvi_-_11th_wts_english_guide_2019.md');

const NOISE = [
  /wtsteam100@gmail\.com/i,
  /www\.waytosuccess\.org/i,
  /www\.nammakalvi\.org/i,
  /New Question Pattern/i,
  /Refer Complete Guide/i
];

/** Bamini-encoded Tamil survives conversion as punctuation-dense ASCII. */
function isGibberish(line) {
  const t = line.replace(/\s/g, '');
  if (t.length < 12) return false;
  return (t.match(/[;:'\[\]{}\\|~^`<>]/g) || []).length / t.length > 0.12;
}

function readGuide() {
  return fs.readFileSync(GUIDE_PATH, 'utf8');
}

const stripTags = (s) => s.replace(/<\/?(u|mark|b|i|em|strong|sub|sup)\s*\/?>/gi, '');

const clean = (t) => t
  .replace(/([a-z])\(/g, '$1 (')
  .replace(/[*_#]/g, ' ')
  .replace(/ /g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/^[\s.,;:\-–—]+|[\s.,;:\-–—]+$/g, '')
  .trim();

/**
 * A `/` in question_text makes ExerciseEngine render the question as a word
 * scramble instead of an MCQ, so it must never reach the database.
 */
const safeQuestion = (t) => t.replace(/\s*\/\s*/g, ' or ').replace(/\s+/g, ' ').trim();

/**
 * Remove `**` while recording where the emphasis was, so the bolded answer
 * key survives. A space is inserted when stripping would fuse two words.
 */
function markBold(raw) {
  const s = stripTags(raw);
  const bolds = [];
  let out = '';
  let last = 0;
  let m;
  const re = /\*\*([\s\S]*?)\*\*/g;
  while ((m = re.exec(s))) {
    out += s.slice(last, m.index);
    // Only a multi-character emphasis is a separate word; `make**s**` is an
    // inflection and must stay glued.
    const standalone = m[1].trim().length >= 3;
    if (standalone && /\w$/.test(out) && /^\w/.test(m[1])) out += ' ';
    const start = out.length;
    out += m[1];
    bolds.push([start, out.length]);
    last = re.lastIndex;
    if (standalone && /\w$/.test(out) && /^\w/.test(s.slice(last))) out += ' ';
  }
  out += s.slice(last);
  return { text: out, bolds };
}

// Text that signals an option body has run into the next heading.
const STOP = /\s*(?:Type\s*-?\s*\d|Govt Exam|Practice Question|Exercises?\s*:|Tips\s*:|Method\s*:|Book Back|Refer |Choose the|Prose\s*[–-]|Poem\s*[–-])/i;

/** Flatten <br> and table pipes so every question starts its own line. */
function preprocess(md) {
  return md
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .filter((l) => !NOISE.some((r) => r.test(l)))
    .join('\n')
    .replace(/\|/g, '\n')
    .split('\n')
    .filter((l) => !/^\s*-+\s*$/.test(l) && !isGibberish(l))
    .join('\n');
}

/** Heading offsets, so each question can inherit the section it sits under. */
function headingIndex(text) {
  const marks = [];
  const re = /^[^\S\n]*#{1,6}[^\S\n]*(.+)$/gm;
  let m;
  while ((m = re.exec(text))) {
    const title = clean(stripTags(m[1]));
    if (title.length > 2 && title.length < 90) marks.push({ at: m.index, title });
  }
  return marks;
}

function segments(text) {
  const heads = headingIndex(text);
  const re = /(?:^|\n|\s)(?:#{1,6}\s*)?(?:\*{1,2}\s*)?(\d{1,3})\s*[.)]\s+(?=[A-Z“"'(……_*])/g;
  const marks = [];
  let m;
  while ((m = re.exec(text))) marks.push({ at: m.index, num: Number(m[1]) });

  let h = 0;
  return marks.map((mk, i) => {
    while (h + 1 < heads.length && heads[h + 1].at <= mk.at) h++;
    const section = heads.length && heads[h].at <= mk.at ? heads[h].title : '';
    return {
      num: mk.num,
      section,
      raw: text.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : Math.min(text.length, mk.at + 1200))
    };
  });
}

function parseMcq(seg) {
  // The word being tested is underlined in the guide. Keep it visible as a
  // quoted word, otherwise the sentence gives no clue which word to replace.
  const withTarget = seg.raw.replace(/<u>\s*([^<]{1,40}?)\s*<\/u>/gi, (_, w) => `“${w.trim()}”`);
  const { text, bolds } = markBold(withTarget);

  const optRe = /(?:^|[\s(\[”"'.,])([a-dA-D])\s*[)\].]\s+/g;
  const hits = [];
  let m;
  while ((m = optRe.exec(text))) {
    hits.push({ label: m[1].toLowerCase(), s: m.index + m[0].length, at: m.index });
  }
  if (hits.length < 4) return null;

  // In table-sourced questions the tested word is emphasised rather than
  // underlined; quote it so the sentence still shows what is being asked.
  const qEnd = hits[0].at;
  let qRaw = text.slice(0, qEnd);
  const inQuestion = bolds
    .filter(([bs, be]) => be <= qEnd && be - bs >= 3 && be - bs <= 30)
    .filter(([bs, be]) => {
      const t = text.slice(bs, be).trim();
      return /[A-Za-z]{3}/.test(t) && !/^\(?\s*(MDL|MQP|PTA|SEP|SEPT|JUNE|MAR|GM|HY|QY|TB)\b/i.test(t);
    })
    .sort((a, b) => b[0] - a[0]);
  if (inQuestion.length && !/[“”]/.test(qRaw)) {
    const [bs, be] = inQuestion[0];
    // `compul**sory**` emphasises half a word; quoting it would print
    // `compul “sory”`, so the question is damaged rather than markable.
    if (/[A-Za-z]$/.test(qRaw.slice(0, bs)) || /^[A-Za-z]/.test(qRaw.slice(be))) return null;
    qRaw = `${qRaw.slice(0, bs)}“${qRaw.slice(bs, be).trim()}”${qRaw.slice(be)}`;
  }

  let q = clean(qRaw).replace(/^\d{1,3}\s*[.)]\s*/, '');
  q = q.replace(/\(\s*(MDL|MQP|PTA|SEP|SEPT|JUNE|MAR|GM|HY|QY)[^)]*\)/gi, '')
    .replace(/\(\s*TB\s*[^)]*\)/gi, '')
    .trim();
  q = deglue(clean(q));
  if (q.length < 10 || q.length > 300) return null;
  if (/^(paragraph|essay|write|explain|answer the|read the|attempt|describe)/i.test(q)) return null;
  // An orphaned suffix means the source line was scrambled during conversion.
  if (/\b(er|ry|ing|ion|ous|ed|ly|tion)\b/i.test(q)) return null;

  const collected = [];
  for (let i = 0; i < hits.length; i++) {
    const s = hits[i].s;
    const e = i + 1 < hits.length ? hits[i + 1].at : text.length;
    let slice = text.slice(s, e);
    const stop = slice.search(STOP);
    if (stop > 0) slice = slice.slice(0, stop);
    const body = clean(slice).split(/\s\d{1,3}\s*[.)]\s+[A-Z]/)[0]
      .replace(/^[“”"']+|[“”"']+$/g, '').trim();
    if (!body || body.length > 100) continue;
    const overlap = bolds.some(([bs, be]) =>
      Math.min(be, s + body.length) - Math.max(bs, s) > Math.min(5, body.length * 0.5));
    collected.push({ label: hits[i].label, text: body, correct: overlap });
  }

  // Keep the first complete a–d run; a later run belongs to the next question.
  const byLabel = new Map();
  for (const o of collected) {
    if (byLabel.size === 4 && !byLabel.has(o.label)) break;
    const prev = byLabel.get(o.label);
    if (!prev) { byLabel.set(o.label, o); continue; }
    if (o.correct && !prev.correct) byLabel.set(o.label, o);
  }

  const final = ['a', 'b', 'c', 'd'].map((l) => byLabel.get(l)).filter(Boolean);
  if (final.length !== 4) return null;

  const correct = final.filter((o) => o.correct);
  if (correct.length !== 1) return null;
  if (new Set(final.map((o) => o.text.toLowerCase())).size !== 4) return null;

  return {
    question: safeQuestion(q),
    section: seg.section || '',
    options: final.map((o) => o.text),
    answer: correct[0].text
  };
}

function parseMcqs() {
  const segs = segments(preprocess(readGuide()));
  const out = [];
  const seen = new Set();
  for (const seg of segs) {
    const p = parseMcq(seg);
    if (!p) continue;
    // Keyed on the question alone. The guide repeats a few questions with
    // conflicting keys (e.g. "toll" -> gate in one place, plaza in another);
    // keeping both would show a student two identical questions with
    // different right answers.
    const key = p.question.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 70);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/** Markdown tables grouped under the nearest preceding heading. */
function parseTables() {
  const lines = readGuide().split('\n');
  const groups = {};
  let heading = '(none)';

  for (const line of lines) {
    if (/^\s*#{1,6}\s/.test(line)) {
      const h = clean(stripTags(line));
      if (h.length > 2 && h.length < 90) heading = h;
      continue;
    }
    if (!/^\s*\|/.test(line)) continue;

    const cells = line.split('|').slice(1, -1)
      .map((c) => clean(stripTags(c.replace(/<br\s*\/?>/gi, ' ')).replace(/\*\*/g, '')));
    if (cells.every((c) => /^-+$/.test(c) || c === '')) continue;
    if (cells.filter(Boolean).length < 2) continue;

    (groups[heading] = groups[heading] || []).push(cells);
  }
  return groups;
}

const isWordish = (w) => /^[A-Za-z][A-Za-z'’\- ]{1,28}$/.test(w);

/**
 * A trustworthy English word list, built from the project's own curated
 * vocabulary file. The guide's own text cannot serve this purpose: its
 * Bamini-encoded Tamil contributes tokens like "mwjy" and "jpwik", which
 * would then be accepted as English.
 */
const ENGLISH_SOURCES = [
  'vocabulary.json', 'speaking_topics.json', 'listening.json', 'exercises.json',
  'grammar.json', 'grammar_expanded.json', 'reading_expanded.json',
  'writing_expanded.json', 'conversations_expanded.json'
];

let ENGLISH = null;
function englishLexicon() {
  if (ENGLISH) return ENGLISH;
  ENGLISH = new Set();

  // Walk every string in the file. Tamil is stored in Unicode script here, so
  // the ASCII-only pattern skips it without any per-field bookkeeping.
  const harvest = (node) => {
    if (typeof node === 'string') {
      for (const w of node.toLowerCase().match(/[a-z]+/g) || []) {
        if (w.length >= 2) ENGLISH.add(w);
      }
    } else if (Array.isArray(node)) {
      node.forEach(harvest);
    } else if (node && typeof node === 'object') {
      Object.values(node).forEach(harvest);
    }
  };

  for (const file of ENGLISH_SOURCES) {
    try {
      harvest(JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8')));
    } catch (err) {
      // A missing source simply narrows the list; the symbol test still applies.
    }
  }
  return ENGLISH;
}

/**
 * Short Bamini fragments ("epug;G", "MWjy", "jpwik Aila") are too short for
 * the ratio-based gibberish test. They either carry the pulli `;` or consist
 * of tokens that are absent from any English word list.
 */
function isEnglishText(m) {
  if (/[;{}\[\]\\|~^`]/.test(m)) return false;
  const words = m.toLowerCase().match(/[a-z]{3,}/g) || [];
  if (!words.length) return false;
  const eng = englishLexicon();
  if (!eng.size) return true;
  // One confirmed English word is enough. Bamini glosses contain none at all,
  // while a valid gloss may well use a rare word the vocabulary file lacks.
  return words.some((w) => eng.has(w));
}

const isMeaningish = (m) =>
  m.length >= 3 && m.length <= 90 && /[A-Za-z]/.test(m) && !isGibberish(m) && isEnglishText(m);

/**
 * PDF conversion dropped spaces inside phrases ("noisyconfusion"). Rebuild a
 * lexicon from the guide's own correctly-spaced prose, then split any long
 * unknown token back into known words.
 */
const SHORT_OK = new Set(['or', 'of', 'to', 'in', 'is', 'be', 'no', 'at', 'on', 'as', 'an', 'a',
  'and', 'the', 'for', 'not', 'by', 'up', 'we', 'us', 'it', 'his', 'her', 'you', 'our']);
/** Common compounds the word lists happen to miss; never split these. */
const PROTECTED = new Set([
  'nothing', 'anything', 'everything', 'something', 'nobody', 'anybody',
  'everybody', 'somebody', 'nowhere', 'anywhere', 'everywhere', 'somewhere',
  'cannot', 'himself', 'herself', 'myself', 'yourself', 'themselves', 'ourselves',
  'without', 'within', 'therefore', 'however', 'because', 'together', 'understand',
  'otherwise', 'whatever', 'whenever', 'wherever', 'become', 'before', 'behind'
]);

let LEXICON = null;

/**
 * Two vocabularies from the same guide:
 *  - `prose` (non-table lines) decides whether a token is a genuine word. The
 *    conversion dropped spaces inside tables, so a token that never appears in
 *    prose is a glue artefact.
 *  - `all` (every line) validates the pieces a split produces, since many
 *    ordinary words appear only in the glossary tables.
 */
function lexicon() {
  if (LEXICON) return LEXICON;
  const lines = readGuide().split('\n');
  const count = (text) => {
    const m = new Map();
    // Match whole runs, then discard over-long ones. A capped pattern would
    // chop "congratulatoryaddress" into fragments and teach them as words.
    for (const w of text.toLowerCase().match(/[a-z]+/g) || []) {
      if (w.length >= 2 && w.length <= 16) m.set(w, (m.get(w) || 0) + 1);
    }
    return m;
  };
  LEXICON = {
    prose: count(lines.filter((l) => !/^\s*\|/.test(l)).join(' ')),
    all: count(lines.join(' '))
  };
  return LEXICON;
}

function splitGlued(token) {
  const { prose, all } = lexicon();
  const eng = englishLexicon();
  const lower = token.toLowerCase();
  // A token any trustworthy word list already knows is a real word, never a
  // glue artefact. This guard is what makes the low length threshold safe:
  // "nothing" and "cannot" survive, while "inyou" and "aredamaged" do not.
  if (lower.length < 5 || PROTECTED.has(lower) || eng.has(lower) || prose.has(lower)) return null;

  const known = (w) => SHORT_OK.has(w)
    || (w.length >= 3 && eng.has(w))
    || (w.length >= 4 && all.has(w));

  const solve = (s, depth) => {
    if (!s) return [];
    if (depth === 0) return null;
    for (let i = Math.min(s.length, 14); i >= 2; i--) {
      const head = s.slice(0, i);
      if (!known(head)) continue;
      if (i === s.length) return [head];
      const rest = solve(s.slice(i), depth - 1);
      if (rest) return [head, ...rest];
    }
    return null;
  };

  // Force at least two parts: the whole token is known not to be a word.
  // Longest head first, so "nothingto" splits as "nothing to" rather than
  // "no thing to". The head must be 3+ characters, otherwise every word
  // beginning with a short word ("inconsistent" -> "in consistent") would be
  // torn apart; the handful of genuine two-letter cases live in FIXUPS.
  for (let i = lower.length - 2; i >= 3; i--) {
    const head = lower.slice(0, i);
    if (!known(head)) continue;
    const rest = solve(lower.slice(i), 2);
    if (rest) return [head, ...rest].join(' ');
  }
  return null;
}

/**
 * Residual glue the lexicon cannot break, because neither half appears
 * spaced anywhere in the guide.
 */
const FIXUPS = new Map(Object.entries({
  noisyconfusion: 'noisy confusion',
  congratulatoryaddress: 'congratulatory address',
  lackingconcentration: 'lacking concentration',
  strongdislike: 'strong dislike',
  promissorynote: 'promissory note',
  aggressivelyresisting: 'aggressively resisting',
  notwaste: 'not waste',
  inpoverty: 'in poverty',
  seeingis: 'seeing is',
  nogarland: 'no garland',
  makesmany: 'makes many',
  bepowerful: 'be powerful',
  singleperson: 'single person',
  takinga: 'taking a',
  verylarge: 'very large',
  weneither: 'we neither',
  inyou: 'in you',
  onyou: 'on you',
  inus: 'in us'
}));

/** Re-apply the casing of the original token to a corrected replacement. */
const matchCase = (original, fixed) =>
  (/^[A-Z]/.test(original) ? fixed.charAt(0).toUpperCase() + fixed.slice(1) : fixed);

function deglue(text) {
  return text.split(/(\s+)/).map((tok) => {
    const core = tok.replace(/[^A-Za-z]/g, '');
    if (core.length < 5) return tok;
    const manual = FIXUPS.get(core.toLowerCase());
    if (manual) return tok.replace(core, matchCase(core, manual));
    const fixed = splitGlued(core);
    return fixed ? tok.replace(core, matchCase(core, fixed)) : tok;
  }).join('');
}

/** Split "walked unsteadily,rested" style cells into readable meanings. */
const tidyMeaning = (m) => deglue(clean(m)
  .replace(/\s*[,/]\s*/g, ', ')
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/\s+/g, ' ')
  .trim()).replace(/\s+/g, ' ').trim();

/** Table header rows repeat the column captions; they are not content. */
const HEADER_CELL = /^(s\.?\s*no\.?|no\.?|type|words?|meanings?( in ?tamil)?|phrasal verbs?|foreign words?|proverbs?|usage|british english|american english|wrong sentence.*|right sentence.*|reason.*|example.*)$/i;
const isHeaderRow = (cells) => cells.filter(Boolean).slice(0, 3).some((c) => HEADER_CELL.test(c.trim()));

function extractSources() {
  const tables = parseTables();
  const glossary = [];
  const phrasal = [];
  const foreign = [];
  const proverbs = [];
  const semantic = [];
  const errorPairs = [];
  const britAm = [];
  const seen = new Set();

  const pushGlossary = (word, meaning, source) => {
    const w = clean(word).toLowerCase().replace(/^\d+[.)]\s*/, '');
    const mean = tidyMeaning(meaning);
    if (!isWordish(w) || !isMeaningish(mean)) return;
    if (w === mean.toLowerCase()) return;
    if (seen.has(w)) return;
    seen.add(w);
    glossary.push({ word: w, meaning: mean, source });
  };

  for (const [heading, allRows] of Object.entries(tables)) {
    const h = heading.toLowerCase();
    const rows = allRows.filter((r) => !isHeaderRow(r));

    if (/^prose\s*[–-]|^poem\s*[–-]|text book\s*[-–]/.test(h)) {
      for (const r of rows) pushGlossary(r[0], r[1], heading);
      continue;
    }
    if (/phrasal verb/.test(h)) {
      for (const r of rows) {
        const verb = clean(r[0]).toLowerCase();
        const mean = tidyMeaning(r[1]);
        const usage = deglue(clean(r[3] || ''));
        if (!/^[a-z]+( [a-z]+){1,2}$/.test(verb) || !isMeaningish(mean)) continue;
        phrasal.push({ verb, meaning: mean, usage });
      }
      continue;
    }
    if (/foreign word/.test(h)) {
      for (const r of rows) {
        const w = clean(r[0]).replace(/^\d+[.)]\s*/, '').toLowerCase();
        const mean = tidyMeaning(r[2] || r[1]);
        if (!isWordish(w) || !isMeaningish(mean)) continue;
        foreign.push({ word: w, meaning: mean });
      }
      continue;
    }
    if (/proverb/.test(h)) {
      for (const r of rows) {
        const p = deglue(clean(r[1]));
        const mean = tidyMeaning(r[2] || '');
        if (p.length < 8 || p.length > 80 || !isMeaningish(mean)) continue;
        proverbs.push({ proverb: p, meaning: mean });
      }
      continue;
    }
    if (/^book back:?$/.test(h)) {
      for (const r of rows) {
        const w = clean(r[1]).toLowerCase();
        const mean = tidyMeaning(r[2] || '');
        if (!isWordish(w) || !isMeaningish(mean)) continue;
        semantic.push({ word: w, meaning: mean });
      }
      continue;
    }
    if (/spot the error/.test(h)) {
      for (const r of rows) {
        const wrong = deglue(clean(r[1]));
        const right = deglue(clean(r[2])).replace(/\(.*?\)/g, '').trim();
        if (wrong.length < 10 || right.length < 10) continue;
        if (!/^[A-Z]/.test(wrong) || wrong.toLowerCase() === right.toLowerCase()) continue;
        if (isGibberish(wrong) || isGibberish(right)) continue;
        errorPairs.push({ wrong, right });
      }
      continue;
    }
    if (/american english and british/.test(h)) {
      for (const r of rows) {
        for (const [b, a] of [[r[0], r[1]], [r[2], r[3]]]) {
          const br = clean(b || '').toLowerCase();
          const am = clean(a || '').toLowerCase();
          if (!isWordish(br) || !isWordish(am)) continue;
          if (br === 'british english' || br === am) continue;
          britAm.push({ british: br, american: am });
        }
      }
    }
  }

  return { glossary, phrasal, foreign, proverbs, semantic, errorPairs, britAm };
}

module.exports = {
  GUIDE_PATH,
  parseMcqs,
  parseTables,
  extractSources,
  clean,
  safeQuestion,
  isGibberish
};
