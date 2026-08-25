/**
 * Builds the Grammar Battle question bank.
 *
 * Every question is generated from hand-checked reference data in
 * ./battle/banks.js, the project's curated vocabulary file, and the material
 * already extracted from the Way to Success guide. Generation is deterministic:
 * the same inputs always produce the same questions in the same order, so the
 * seeder can be re-run without churning the bank.
 *
 * Output: [{ topic, title, tamil_title, questions: [{ q, options, ans, explanation, difficulty }] }]
 * `ans` is the INDEX of the correct option, matching what gameHandler expects.
 */

const path = require('path');
const B = require('./battle/banks');
const { extractSources } = require('./wtsGuideParser');

const vocabulary = require('./vocabulary.json');

/* ------------------------------------------------------------- utilities */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(list, seed) {
  const rand = rng(seed);
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

/** Pick `n` distractors from `pool` that cannot be confused with `answer`. */
function distractors(pool, answer, n, seed) {
  const banned = new Set([norm(answer)]);
  const picked = [];
  for (const cand of shuffled(pool, seed)) {
    if (picked.length === n) break;
    const key = norm(cand);
    if (!key || banned.has(key)) continue;
    banned.add(key);
    picked.push(cand);
  }
  return picked;
}

/**
 * Assemble one question, shuffling the options so the answer is not always in
 * the same slot, and reporting where it landed.
 */
function mcq({ q, answer, wrong, explanation, difficulty = 'medium' }, seed) {
  const options = shuffled([answer, ...wrong], seed + 7);
  const ans = options.indexOf(answer);
  if (ans < 0 || options.length !== 4) return null;
  if (new Set(options.map(norm)).size !== 4) return null;
  return { q, options, ans, explanation, difficulty };
}

/** Third-person singular form. The rule is reliable for every verb we use. */
function s3(verb) {
  if (/(?:s|sh|ch|x|z|o)$/.test(verb)) return `${verb}es`;
  if (/[^aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ies`;
  return `${verb}s`;
}

const VERB_MAP = new Map(B.VERBS.map(([v1, v2, v3, ving]) => [v1, { v1, v2, v3, ving }]));

/** Regular -ed / -ing forms for verbs outside the irregular table. */
function regular(verb) {
  const known = VERB_MAP.get(verb);
  if (known) return known;
  const ed = /e$/.test(verb) ? `${verb}d`
    : /[^aeiou]y$/.test(verb) ? `${verb.slice(0, -1)}ied`
      : `${verb}ed`;
  const ing = /e$/.test(verb) ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
  return { v1: verb, v2: ed, v3: ed, ving: ing };
}

/** "The cat" -> "the cat", for use after "by". */
const lower = (subject) => subject.charAt(0).toLowerCase() + subject.slice(1);

const topics = [];
function topic(key, title, tamil, questions) {
  const seen = new Set();
  const clean = questions.filter(Boolean).filter((item) => {
    const k = norm(item.q) + '|' + norm(item.options[item.ans]);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (clean.length) topics.push({ topic: key, title, tamil_title: tamil, questions: clean });
}

/* ------------------------------------------------------------ 1. tenses */

const TENSES = [
  {
    key: 'simple present',
    marker: 'every day',
    form: (v, pl) => (pl ? v.v1 : s3(v.v1)),
    wrong: (v, pl) => (pl ? [s3(v.v1), v.ving, v.v2] : [v.v1, v.ving, v.v2]),
    why: 'In the simple present, a singular subject takes the "-s" form and a plural subject takes the base verb.'
  },
  {
    key: 'present continuous',
    marker: 'now',
    form: (v, pl) => `${pl ? 'are' : 'is'} ${v.ving}`,
    wrong: (v, pl) => [`${pl ? 'are' : 'is'} ${v.v1}`, `${pl ? 'is' : 'are'} ${v.ving}`, `was ${v.v1}`],
    why: 'The present continuous is "is/are + verb-ing".'
  },
  {
    key: 'simple past',
    marker: 'yesterday',
    form: (v) => v.v2,
    wrong: (v) => [v.v1, s3(v.v1), `has ${v.v3}`],
    why: 'A finished action with a past time marker takes the simple past.'
  },
  {
    key: 'present perfect',
    marker: 'recently',
    form: (v, pl) => `${pl ? 'have' : 'has'} ${v.v3}`,
    wrong: (v, pl) => [`${pl ? 'have' : 'has'} ${v.v2}`, `${pl ? 'has' : 'have'} ${v.v3}`, `is ${v.v3}`],
    why: 'The present perfect is "has/have + past participle".'
  },
  {
    key: 'past perfect',
    marker: 'before the guests arrived',
    form: (v) => `had ${v.v3}`,
    wrong: (v, pl) => [`${pl ? 'have' : 'has'} ${v.v3}`, `had ${v.v2}`, `was ${v.v3}`],
    why: 'The earlier of two past actions takes "had + past participle".'
  },
  {
    key: 'simple future',
    marker: 'tomorrow',
    form: () => null,
    wrong: () => null,
    why: 'The simple future is "will + base verb".'
  }
];

topic('tenses', 'Tenses', 'கால வழக்குகள்', B.SVO.flatMap((row, i) =>
  TENSES.map((tense, t) => {
    const { subject, subjectPlural, verb, object } = row;
    const v = regular(verb);
    const seed = i * 100 + t;

    if (tense.key === 'simple future') {
      return mcq({
        q: `Fill in the blank: "${subject} ______ ${object} tomorrow."`,
        answer: `will ${v.v1}`,
        wrong: [`will ${v.v2}`, `will ${s3(v.v1)}`, `will be ${v.v1}`],
        explanation: tense.why,
        difficulty: 'easy'
      }, seed);
    }

    return mcq({
      q: `Fill in the blank: "${subject} ______ ${object} ${tense.marker}."`,
      answer: tense.form(v, subjectPlural),
      wrong: tense.wrong(v, subjectPlural),
      explanation: tense.why,
      difficulty: t <= 2 ? 'easy' : 'medium'
    }, seed);
  })
));

/* ------------------------------------------------------- 2. verb forms */

topic('verb_forms', 'Verb Forms (V1 V2 V3)', 'வினைச்சொல் வடிவங்கள்',
  B.VERBS.flatMap(([v1, v2, v3, ving], i) => {
    const otherPast = B.VERBS.filter((x) => x[0] !== v1).map((x) => x[1]);
    const otherPart = B.VERBS.filter((x) => x[0] !== v1).map((x) => x[2]);
    const otherIng = B.VERBS.filter((x) => x[0] !== v1).map((x) => x[3]);
    return [
      mcq({
        q: `What is the past tense (V2) of "${v1}"?`,
        answer: v2,
        wrong: distractors(otherPast.concat(v3 === v2 ? [] : [v3]), v2, 3, i * 31 + 1),
        explanation: `${v1} - ${v2} - ${v3}`,
        difficulty: 'easy'
      }, i * 31 + 1),
      mcq({
        q: `What is the past participle (V3) of "${v1}"?`,
        answer: v3,
        wrong: distractors(otherPart.concat(v2 === v3 ? [] : [v2]), v3, 3, i * 31 + 2),
        explanation: `${v1} - ${v2} - ${v3}`,
        difficulty: 'medium'
      }, i * 31 + 2),
      mcq({
        q: `What is the present participle (V4, "-ing" form) of "${v1}"?`,
        answer: ving,
        wrong: distractors(otherIng, ving, 3, i * 31 + 3),
        explanation: `The "-ing" form of "${v1}" is "${ving}".`,
        difficulty: 'easy'
      }, i * 31 + 3)
    ];
  })
);

/* --------------------------------------------------- 3. active/passive */

const PASSIVE_TENSES = [
  { label: 'simple present', be: (pl) => (pl ? 'are' : 'is'), active: (v, pl) => (pl ? v.v1 : s3(v.v1)) },
  { label: 'simple past', be: (pl) => (pl ? 'were' : 'was'), active: (v) => v.v2 },
  { label: 'present perfect', be: (pl) => (pl ? 'have been' : 'has been'), active: (v, pl) => `${pl ? 'have' : 'has'} ${v.v3}` },
  { label: 'simple future', be: () => 'will be', active: (v) => `will ${v.v1}` },
  { label: 'past perfect', be: () => 'had been', active: (v) => `had ${v.v3}` },
  { label: 'present continuous', be: (pl) => (pl ? 'are being' : 'is being'), active: (v, pl) => `${pl ? 'are' : 'is'} ${v.ving}` }
];

topic('active_passive', 'Active & Passive Voice', 'செய்வினை & செயப்பாட்டு வினை',
  B.SVO.flatMap((row, i) =>
    PASSIVE_TENSES.flatMap((tense, t) => {
      const { subject, subjectPlural, verb, object, objectPlural } = row;
      const v = regular(verb);
      // The active verb agrees with the SUBJECT; the passive auxiliary agrees
      // with the OBJECT, which becomes the subject of the passive sentence.
      const activeSentence = `${subject} ${tense.active(v, subjectPlural)} ${object}.`;
      const objectCap = object.charAt(0).toUpperCase() + object.slice(1);
      const passiveSentence = `${objectCap} ${tense.be(objectPlural)} ${v.v3} by ${lower(subject)}.`;

      const wrongPassives = PASSIVE_TENSES
        .filter((x) => x.label !== tense.label)
        .map((x) => `${objectCap} ${x.be(objectPlural)} ${v.v3} by ${lower(subject)}.`);

      const seed = i * 61 + t;
      const out = [mcq({
        q: `Change into the passive voice: "${activeSentence}"`,
        answer: passiveSentence,
        wrong: distractors(wrongPassives, passiveSentence, 3, seed),
        explanation: `The object becomes the subject, and the verb becomes "${tense.be(objectPlural)} ${v.v3}".`,
        difficulty: 'medium'
      }, seed)];

      // The reverse direction, for the three commonest tenses.
      if (t < 3) {
        const wrongActives = PASSIVE_TENSES
          .filter((x) => x.label !== tense.label)
          .map((x) => `${subject} ${x.active(v, subjectPlural)} ${object}.`);
        out.push(mcq({
          q: `Change into the active voice: "${passiveSentence}"`,
          answer: activeSentence,
          wrong: distractors(wrongActives, activeSentence, 3, seed + 500),
          explanation: `The agent after "by" becomes the subject of the active sentence.`,
          difficulty: 'medium'
        }, seed + 500));
      }
      return out;
    })
  )
);

/* ------------------------------------------------------- 4. vocabulary */

/** Deduplicate the "word_2" entries the vocabulary file carries. */
const VOCAB = (() => {
  const seen = new Set();
  const out = [];
  for (const v of vocabulary) {
    const word = v.word.replace(/_\d+$/, '').trim();
    if (!word || seen.has(word.toLowerCase())) continue;
    if (!v.meaning || v.meaning.length < 5) continue;
    seen.add(word.toLowerCase());
    out.push({ ...v, word });
  }
  return out;
})();

const ALL_MEANINGS = VOCAB.map((v) => v.meaning);
const ALL_WORDS = VOCAB.map((v) => v.word);

topic('word_meanings', 'Word Meanings', 'சொற்பொருள்',
  VOCAB.map((v, i) => mcq({
    q: `What does the word "${v.word}" mean?`,
    answer: v.meaning,
    wrong: distractors(ALL_MEANINGS, v.meaning, 3, i * 13 + 5),
    explanation: `"${v.word}" means ${v.meaning}`,
    difficulty: 'medium'
  }, i * 13 + 5))
);

topic('find_the_word', 'Find the Word', 'சரியான சொல்லைக் கண்டறி',
  VOCAB.map((v, i) => mcq({
    q: `Which word means "${v.meaning}"?`,
    answer: v.word,
    wrong: distractors(ALL_WORDS, v.word, 3, i * 17 + 9),
    explanation: `"${v.word}" means ${v.meaning}`,
    difficulty: 'medium'
  }, i * 17 + 9))
);

/** Cloze questions built from the vocabulary file's own example sentences. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Cloze items, one per word. The vocabulary file reuses a few filler sentences
 * ("Consistent focus on ______ leads to English mastery.") across dozens of
 * entries; blanked, those have many equally valid answers, so any sentence that
 * is not unique to a single word is discarded.
 */
const CLOZE = (() => {
  const blanked = new Map();
  const rows = VOCAB.map((v) => {
    const re = new RegExp(`\\b${escapeRe(v.word)}\\b`, 'i');
    const sentence = (v.examples || []).map((e) => e.sentence).find((s) => s && re.test(s));
    if (!sentence) return null;
    const gap = sentence.replace(re, '______');
    blanked.set(gap, (blanked.get(gap) || 0) + 1);
    return { v, gap };
  }).filter(Boolean);
  return rows.filter((r) => blanked.get(r.gap) === 1);
})();

topic('vocab_context', 'Vocabulary in Context', 'சொல் பயன்பாடு',
  CLOZE.map(({ v, gap }, i) => {
    const samePos = VOCAB.filter((x) => x.part_of_speech === v.part_of_speech).map((x) => x.word);
    const pool = samePos.length >= 12 ? samePos : ALL_WORDS;
    return mcq({
      q: `Fill in the blank: "${gap}"`,
      answer: v.word,
      wrong: distractors(pool, v.word, 3, i * 19 + 3),
      explanation: `"${v.word}" means ${v.meaning}`,
      difficulty: 'medium'
    }, i * 19 + 3);
  })
);

/* ----------------------------------------------------- 5. prepositions */

const PREP_POOL = ['in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'among', 'between', 'since', 'over', 'under', 'through', 'towards', 'beside', 'into', 'across', 'behind', 'before', 'after'];

topic('prepositions', 'Prepositions', 'முன்னுருபுகள்', [
  ...B.PREP_COLLOCATIONS.map(([before, prep, after], i) => mcq({
    q: `Choose the correct preposition: "${before} ______ ${after}."`,
    answer: prep,
    wrong: distractors(PREP_POOL, prep, 3, i * 23 + 1),
    explanation: `The fixed expression is "${before.split(' ').slice(-2).join(' ')} ${prep}".`,
    difficulty: 'medium'
  }, i * 23 + 1)),
  ...B.MONTHS.map((m, i) => mcq({
    q: `Choose the correct preposition: "The festival falls ______ ${m}."`,
    answer: 'in',
    wrong: ['on', 'at', 'by'],
    explanation: 'Months take "in".',
    difficulty: 'easy'
  }, 3000 + i)),
  ...B.DAYS.map((d, i) => mcq({
    q: `Choose the correct preposition: "We shall meet ______ ${d}."`,
    answer: 'on',
    wrong: ['in', 'at', 'from'],
    explanation: 'Days of the week take "on".',
    difficulty: 'easy'
  }, 3100 + i)),
  ...B.CLOCK_TIMES.map((t, i) => mcq({
    q: `Choose the correct preposition: "The train leaves ______ ${t}."`,
    answer: 'at',
    wrong: ['in', 'on', 'by'],
    explanation: 'A precise time takes "at".',
    difficulty: 'easy'
  }, 3200 + i)),
  ...B.ENCLOSED_PLACES.map((p, i) => mcq({
    q: `Choose the correct preposition: "She left her bag ______ ${p}."`,
    answer: 'in',
    wrong: ['on', 'at', 'over'],
    explanation: 'An enclosed space takes "in".',
    difficulty: 'easy'
  }, 3300 + i)),
  ...B.SURFACES.map((p, i) => mcq({
    q: `Choose the correct preposition: "He placed the book ______ ${p}."`,
    answer: 'on',
    wrong: ['in', 'at', 'into'],
    explanation: 'A surface takes "on".',
    difficulty: 'easy'
  }, 3400 + i)),
  ...B.POINTS.map((p, i) => mcq({
    q: `Choose the correct preposition: "I will wait for you ______ ${p}."`,
    answer: 'at',
    wrong: ['in', 'on', 'by'],
    explanation: 'An exact point takes "at".',
    difficulty: 'easy'
  }, 3500 + i))
]);

/* --------------------------------------------------------- 6. articles */

topic('articles', 'Articles', 'சுட்டிடைச் சொற்கள்', [
  ...B.ARTICLE_TRICKY.flatMap(([phrase, article], i) => [
    mcq({
      q: `Choose the correct article: "He is ______ ${phrase}."`,
      answer: article,
      wrong: [article === 'a' ? 'an' : 'a', 'the', 'no article'],
      explanation: `"${phrase}" begins with a ${article === 'an' ? 'vowel' : 'consonant'} SOUND, so it takes "${article}".`,
      difficulty: 'medium'
    }, 4000 + i),
    mcq({
      q: `Choose the correct article: "I saw ______ ${phrase} near the gate."`,
      answer: article,
      wrong: [article === 'a' ? 'an' : 'a', 'the', 'no article'],
      explanation: `The article follows the SOUND of "${phrase.split(' ')[0]}", so it takes "${article}".`,
      difficulty: 'medium'
    }, 4200 + i)
  ]),
  ...B.THE_NOUNS.map(([noun, sentence], i) => mcq({
    q: `Choose the correct article: "______ ${sentence.replace(/^the /, '')}."`,
    answer: 'The',
    wrong: ['A', 'An', 'No article'],
    explanation: `"${noun}" is unique or already known, so it takes "the".`,
    difficulty: 'easy'
  }, 4400 + i))
]);

/* ---------------------------------------------------------- 7. plurals */

const PLURAL_POOL = B.PLURALS.map((p) => p[1]);
const SINGULAR_POOL = B.PLURALS.map((p) => p[0]);

topic('plurals', 'Singular & Plural', 'ஒருமை & பன்மை', [
  ...B.PLURALS.map(([sing, plur], i) => mcq({
    q: `What is the plural of "${sing}"?`,
    answer: plur,
    wrong: distractors(PLURAL_POOL.concat([`${sing}s`, `${sing}es`]), plur, 3, 5000 + i),
    explanation: `The plural of "${sing}" is "${plur}".`,
    difficulty: sing === plur ? 'hard' : 'easy'
  }, 5000 + i)),
  ...B.PLURALS.filter(([s, p]) => s !== p).map(([sing, plur], i) => mcq({
    q: `What is the singular of "${plur}"?`,
    answer: sing,
    wrong: distractors(SINGULAR_POOL, sing, 3, 5300 + i),
    explanation: `The singular of "${plur}" is "${sing}".`,
    difficulty: 'medium'
  }, 5300 + i))
]);

/* ---------------------------------------------------------- 8. degrees */

const COMPARATIVES = B.DEGREES.map((d) => d[1]);
const SUPERLATIVES = B.DEGREES.map((d) => d[2]);

topic('degrees', 'Degrees of Comparison', 'ஒப்பீட்டு நிலைகள்', [
  ...B.DEGREES.map(([pos, comp], i) => mcq({
    q: `What is the comparative degree of "${pos}"?`,
    answer: comp,
    wrong: distractors(COMPARATIVES.concat([`more ${pos}`, `${pos}er`]), comp, 3, 6000 + i),
    explanation: `${pos} - ${comp} - ${B.DEGREES[i][2]}`,
    difficulty: 'easy'
  }, 6000 + i)),
  ...B.DEGREES.map(([pos, comp, sup], i) => mcq({
    q: `What is the superlative degree of "${pos}"?`,
    answer: sup,
    wrong: distractors(SUPERLATIVES.concat([`most ${pos}`, `${pos}est`]), sup, 3, 6200 + i),
    explanation: `${pos} - ${comp} - ${sup}`,
    difficulty: 'medium'
  }, 6200 + i))
]);

/* --------------------------------------------------- 9. question tags */

/**
 * Only pronouns that actually agree with each auxiliary, so distractors are
 * wrong tags rather than impossible English ("hasn't you").
 */
const TAG_AUX = [
  { pos: 'is', neg: "isn't", pronouns: ['he', 'she', 'it'] },
  { pos: 'are', neg: "aren't", pronouns: ['you', 'we', 'they'] },
  { pos: 'was', neg: "wasn't", pronouns: ['he', 'she', 'it'] },
  { pos: 'were', neg: "weren't", pronouns: ['you', 'we', 'they'] },
  { pos: 'has', neg: "hasn't", pronouns: ['he', 'she', 'it'] },
  { pos: 'have', neg: "haven't", pronouns: ['you', 'we', 'they'] },
  { pos: 'does', neg: "doesn't", pronouns: ['he', 'she', 'it'] },
  { pos: 'do', neg: "don't", pronouns: ['you', 'we', 'they'] },
  { pos: 'did', neg: "didn't", pronouns: ['he', 'she', 'it', 'you', 'we', 'they'] },
  { pos: 'can', neg: "can't", pronouns: ['he', 'she', 'it', 'you', 'we', 'they'] },
  { pos: 'will', neg: "won't", pronouns: ['he', 'she', 'it', 'you', 'we', 'they'] },
  { pos: 'should', neg: "shouldn't", pronouns: ['he', 'she', 'it', 'you', 'we', 'they'] }
];
const ALL_TAGS = TAG_AUX.flatMap((a) => a.pronouns.flatMap((p) => [`${a.neg} ${p}`, `${a.pos} ${p}`]));

const SING_SUBJECTS = [['She', 'she'], ['He', 'he'], ['Ravi', 'he'], ['Meena', 'she']];
const PLUR_SUBJECTS = [['They', 'they'], ['We', 'we'], ['The students', 'they'], ['My friends', 'they']];

/** Predicates that read naturally with either a singular or a plural subject. */
const BE_PREDICATES = ['very busy', 'at home', 'ready for the test', 'angry with me', 'late again'];
const HAVE_PREDICATES = ['finished the work', 'gone home', 'eaten the food', 'completed the project'];
const MODAL_PREDICATES = ['swim well', 'come tomorrow', 'help us', 'finish it today'];
/** [base, third-person singular, past] */
const DO_VERBS = [['play cricket', 'plays cricket', 'played cricket'],
  ['like coffee', 'likes coffee', 'liked coffee'],
  ['work hard', 'works hard', 'worked hard'],
  ['help others', 'helps others', 'helped others']];

/** Every statement is built so that exactly one tag can be correct. */
function tagQuestions() {
  const out = [];
  let seed = 7100;

  const emit = (statement, tag, why) => {
    out.push(mcq({
      q: `Add the correct question tag: "${statement}, ______?"`,
      answer: tag,
      wrong: distractors(ALL_TAGS, tag, 3, seed),
      explanation: why,
      difficulty: 'medium'
    }, seed++));
  };

  const POSITIVE = 'A positive statement takes a negative tag.';
  const NEGATIVE = 'A negative statement takes a positive tag.';

  for (const [aux, neg, subjects] of [
    ['is', "isn't", SING_SUBJECTS], ['are', "aren't", PLUR_SUBJECTS],
    ['was', "wasn't", SING_SUBJECTS], ['were', "weren't", PLUR_SUBJECTS]
  ]) {
    for (const [subject, pronoun] of subjects) {
      for (const predicate of BE_PREDICATES) {
        emit(`${subject} ${aux} ${predicate}`, `${neg} ${pronoun}`, POSITIVE);
        emit(`${subject} ${aux} not ${predicate}`, `${aux} ${pronoun}`, NEGATIVE);
      }
    }
  }

  for (const [aux, neg, subjects] of [
    ['has', "hasn't", SING_SUBJECTS], ['have', "haven't", PLUR_SUBJECTS]
  ]) {
    for (const [subject, pronoun] of subjects) {
      for (const predicate of HAVE_PREDICATES) {
        emit(`${subject} ${aux} ${predicate}`, `${neg} ${pronoun}`, POSITIVE);
        emit(`${subject} ${aux} not ${predicate}`, `${aux} ${pronoun}`, NEGATIVE);
      }
    }
  }

  // "Does/do/did" never appear in the positive statement — the main verb carries
  // the tense — but they do appear in the tag.
  for (const [subject, pronoun] of SING_SUBJECTS) {
    for (const [, third, past] of DO_VERBS) {
      emit(`${subject} ${third}`, `doesn't ${pronoun}`, POSITIVE);
      emit(`${subject} does not ${third.replace(/^(\w+)s\b/, '$1')}`, `does ${pronoun}`, NEGATIVE);
      emit(`${subject} ${past}`, `didn't ${pronoun}`, POSITIVE);
    }
  }
  for (const [subject, pronoun] of PLUR_SUBJECTS) {
    for (const [base, , past] of DO_VERBS) {
      emit(`${subject} ${base}`, `don't ${pronoun}`, POSITIVE);
      emit(`${subject} do not ${base}`, `do ${pronoun}`, NEGATIVE);
      emit(`${subject} ${past}`, `didn't ${pronoun}`, POSITIVE);
    }
  }

  for (const [modal, negForm, negTag] of [
    ['can', 'cannot', "can't"], ['will', 'will not', "won't"], ['should', 'should not', "shouldn't"]
  ]) {
    for (const [subject, pronoun] of [...SING_SUBJECTS, ...PLUR_SUBJECTS]) {
      for (const predicate of MODAL_PREDICATES) {
        emit(`${subject} ${modal} ${predicate}`, `${negTag} ${pronoun}`, POSITIVE);
        emit(`${subject} ${negForm} ${predicate}`, `${modal} ${pronoun}`, NEGATIVE);
      }
    }
  }

  return out;
}

topic('question_tags', 'Question Tags', 'வினா ஒட்டுகள்', [
  ...B.TAG_ITEMS.map(([statement, tag], i) => mcq({
    q: `Add the correct question tag: "${statement}, ______?"`,
    answer: tag,
    wrong: distractors(B.TAG_ITEMS.map((t) => t[1]).concat(ALL_TAGS), tag, 3, 7000 + i),
    explanation: 'A positive statement takes a negative tag, and a negative statement takes a positive tag.',
    difficulty: 'medium'
  }, 7000 + i)),
  ...tagQuestions()
]);

/* ------------------------------------------------ 10. subject-verb agreement */

/**
 * Distractors for agreement questions must be wrong in NUMBER only. Pulling
 * them from the whole bank produced options like "was" for "Neither of the
 * answers ______ correct", which is perfectly grammatical — two right answers.
 */
const VERB_FAMILY = {
  is: ['are', 'am', 'be'],
  are: ['is', 'am', 'be'],
  was: ['were', 'are', 'have been'],
  has: ['have', 'having', 'are having'],
  have: ['has', 'having', 'is having'],
  leads: ['lead', 'leading', 'to lead'],
  lead: ['leads', 'leading', 'to lead'],
  behave: ['behaves', 'behaving', 'to behave'],
  behaves: ['behave', 'behaving', 'to behave'],
  makes: ['make', 'making', 'to make'],
  make: ['makes', 'making', 'to make']
};

topic('concord', 'Subject-Verb Agreement', 'எழுவாய் - பயனிலை ஒப்புமை',
  B.CONCORD_ITEMS.map(([sentence, right, wrong, why], i) => {
    const family = VERB_FAMILY[right];
    if (!family) return null;
    const wrongOptions = [wrong, ...family.filter((f) => f !== wrong)].slice(0, 3);
    return mcq({
      q: `Choose the correct verb: "${sentence}"`,
      answer: right,
      wrong: wrongOptions,
      explanation: why,
      difficulty: 'hard'
    }, 8000 + i);
  })
);

/* ----------------------------------------------------------- 11. modals */

const MODAL_POOL = ['must', 'should', 'may', 'might', 'can', 'could', 'would', 'shall', 'will', 'ought', 'need', 'had better', 'have to', 'is', 'did'];

topic('modals', 'Modal Verbs', 'துணை வினைகள்',
  B.MODAL_ITEMS.map(([sentence, modal, why], i) => mcq({
    q: `Choose the correct modal: "${sentence}"`,
    answer: modal,
    wrong: distractors(MODAL_POOL, modal, 3, 9000 + i),
    explanation: `"${modal}" expresses ${why}.`,
    difficulty: 'medium'
  }, 9000 + i))
);

/* -------------------------------------------------- 12. clauses & links */

topic('clauses', 'Clauses & Connectives', 'கிளைவாக்கியம் & இணைப்புச் சொற்கள்', [
  ...B.CONDITIONAL_ITEMS.map(([sentence, right, wrong, why], i) => mcq({
    q: `Choose the correct form: "${sentence}"`,
    answer: right,
    wrong,
    explanation: why,
    difficulty: 'hard'
  }, 10000 + i)),
  ...B.RELATIVE_ITEMS.map(([sentence, pronoun, why], i) => mcq({
    q: `Choose the correct relative pronoun: "${sentence}"`,
    answer: pronoun,
    wrong: distractors(['who', 'whom', 'whose', 'which', 'that', 'where', 'when', 'why'], pronoun, 3, 10100 + i),
    explanation: `"${pronoun}" is used for ${why}.`,
    difficulty: 'medium'
  }, 10100 + i)),
  ...B.LINKER_ITEMS.map(([sentence, right, wrong], i) => mcq({
    q: `Choose the correct connective: "${sentence}"`,
    answer: right,
    wrong,
    explanation: `"${right}" shows the correct relation between the two ideas.`,
    difficulty: 'medium'
  }, 10200 + i)),
  ...B.GERUND_ITEMS.map(([sentence, right, wrong, why], i) => mcq({
    q: `Choose the correct form: "${sentence}"`,
    answer: right,
    wrong: distractors(
      [wrong, ...B.GERUND_ITEMS.map((g) => g[1]), ...B.GERUND_ITEMS.map((g) => g[2])],
      right, 3, 10300 + i
    ),
    explanation: why,
    difficulty: 'hard'
  }, 10300 + i))
]);

/* ------------------------------------------------- 13. confusable words */

topic('confusables', 'Confusable Words', 'குழப்பமான சொற்கள்',
  B.CONFUSABLE_ITEMS.map(([sentence, right, wrong, why], i) => mcq({
    q: `Choose the correct word: "${sentence}"`,
    answer: right,
    wrong: distractors(
      [wrong, ...B.CONFUSABLE_ITEMS.map((c) => c[1]), ...B.CONFUSABLE_ITEMS.map((c) => c[2])],
      right, 3, 11000 + i
    ),
    explanation: why,
    difficulty: 'hard'
  }, 11000 + i))
);

/* ------------------------------------------------ 14. prefixes/suffixes */

topic('affixes', 'Prefixes & Suffixes', 'முன்னொட்டு & பின்னொட்டு', [
  ...B.PREFIX_ITEMS.map(([root, prefix, word], i) => mcq({
    q: `Add a suitable prefix to the root word "${root}".`,
    answer: word,
    wrong: distractors(['un', 'in', 'im', 'il', 'ir', 'dis', 'mis', 'non', 'pre', 'en']
      .filter((p) => p !== prefix).map((p) => p + root), word, 3, 12000 + i),
    explanation: `"${prefix}-" is the correct negative prefix here, giving "${word}".`,
    difficulty: 'medium'
  }, 12000 + i)),
  ...B.SUFFIX_ITEMS.map(([root, suffix, word], i) => mcq({
    q: `Add a suitable suffix to the root word "${root}".`,
    answer: word,
    wrong: distractors(['er', 'ment', 'ous', 'ful', 'less', 'ness', 'ship', 'able', 'ist', 'ly']
      .filter((s) => s !== suffix).map((s) => root + s), word, 3, 12200 + i),
    explanation: `Adding "-${suffix}" gives "${word}".`,
    difficulty: 'medium'
  }, 12200 + i))
]);

/* ------------------------------------------------------ 15. idioms etc. */

const guide = extractSources();

topic('idioms', 'Idioms & Phrasal Verbs', 'மரபுத்தொடர் & கூட்டு வினை', [
  ...B.IDIOMS.map(([idiom, meaning], i) => mcq({
    q: `What does the idiom "${idiom}" mean?`,
    answer: meaning,
    wrong: distractors(B.IDIOMS.map((x) => x[1]), meaning, 3, 13000 + i),
    explanation: `"${idiom}" means ${meaning}.`,
    difficulty: 'medium'
  }, 13000 + i)),
  ...guide.phrasal.map((p, i) => mcq({
    q: p.usage
      ? `In the sentence "${p.usage}", what does "${p.verb}" mean?`
      : `What does the phrasal verb "${p.verb}" mean?`,
    answer: p.meaning,
    wrong: distractors(guide.phrasal.map((x) => x.meaning), p.meaning, 3, 13300 + i),
    explanation: `"${p.verb}" means ${p.meaning}.`,
    difficulty: 'medium'
  }, 13300 + i))
]);

/* --------------------------------------------------- 16. synonyms etc. */

topic('synonyms', 'Synonyms & Word Study', 'இணைச்சொற்கள்', [
  ...guide.glossary.map((g, i) => mcq({
    q: `Choose the correct meaning of "${g.word}".`,
    answer: g.meaning,
    wrong: distractors(guide.glossary.map((x) => x.meaning), g.meaning, 3, 14000 + i),
    explanation: `"${g.word}" means ${g.meaning}.`,
    difficulty: 'medium'
  }, 14000 + i)),
  ...guide.foreign.map((f, i) => mcq({
    q: `What does the foreign phrase "${f.word}" mean?`,
    answer: f.meaning,
    wrong: distractors(guide.foreign.map((x) => x.meaning), f.meaning, 3, 14300 + i),
    explanation: `"${f.word}" means ${f.meaning}.`,
    difficulty: 'hard'
  }, 14300 + i)),
  ...guide.semantic.map((s, i) => mcq({
    q: `Choose the correct definition of "${s.word}".`,
    answer: s.meaning,
    wrong: distractors(guide.semantic.map((x) => x.meaning), s.meaning, 3, 14500 + i),
    explanation: `"${s.word}" means ${s.meaning}.`,
    difficulty: 'hard'
  }, 14500 + i))
]);

/* ------------------------------------------------------- 17. spellings */

topic('spelling', 'Spelling', 'சரியான எழுத்துக்கூட்டல்',
  B.SPELLINGS.map(([right, wrongs], i) => mcq({
    q: 'Choose the correctly spelt word.',
    answer: right,
    wrong: wrongs.slice(0, 3),
    explanation: `The correct spelling is "${right}".`,
    difficulty: 'medium'
  }, 15000 + i))
);

/* ------------------------------------------- 18. figures & patterns etc. */

topic('figures', 'Figures of Speech', 'அணி இலக்கணம்',
  B.FIGURES.map(([line, figure, why], i) => mcq({
    q: `Identify the figure of speech: "${line}"`,
    answer: figure,
    wrong: distractors(['Simile', 'Metaphor', 'Personification', 'Alliteration', 'Hyperbole', 'Onomatopoeia'], figure, 3, 16000 + i),
    explanation: why,
    difficulty: 'medium'
  }, 16000 + i))
);

topic('sentence_patterns', 'Sentence Patterns', 'வாக்கிய அமைப்புகள்',
  B.SENTENCE_PATTERNS.map(([sentence, pattern], i) => mcq({
    q: `Identify the sentence pattern: "${sentence}"`,
    answer: pattern,
    wrong: distractors(['S V', 'S V O', 'S V C', 'S V IO DO', 'S V O C', 'S V A'], pattern, 3, 17000 + i),
    explanation: `"${sentence}" follows the ${pattern} pattern.`,
    difficulty: 'hard'
  }, 17000 + i))
);

topic('british_american', 'British & American English', 'பிரிட்டிஷ் & அமெரிக்க ஆங்கிலம்',
  guide.britAm.map((b, i) => mcq({
    q: `What is the American English equivalent of the British word "${b.british}"?`,
    answer: b.american,
    wrong: distractors(guide.britAm.map((x) => x.american), b.american, 3, 18000 + i),
    explanation: `British "${b.british}" = American "${b.american}".`,
    difficulty: 'medium'
  }, 18000 + i))
);

topic('error_spotting', 'Spot the Error', 'பிழை கண்டறிதல்',
  guide.errorPairs.map((p, i) => mcq({
    q: 'Which sentence is grammatically correct?',
    answer: p.right,
    wrong: [p.wrong, ...distractors(guide.errorPairs.map((x) => x.wrong), p.right, 2, 19000 + i)].slice(0, 3),
    explanation: `The correct sentence is "${p.right}".`,
    difficulty: 'hard'
  }, 19000 + i))
);

/* ------------------------------------------------------------- exports */

function build() {
  return topics;
}

module.exports = { build };

if (require.main === module) {
  const all = build();
  let total = 0;
  for (const t of all) {
    total += t.questions.length;
    console.log(String(t.questions.length).padStart(5), ' ', t.topic.padEnd(20), t.title);
  }
  console.log('-'.repeat(50));
  console.log(String(total).padStart(5), '  TOTAL across', all.length, 'topics');
}
