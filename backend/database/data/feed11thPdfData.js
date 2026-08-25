/**
 * 11TH STANDARD FULL PDF DATASET SEEDER (Way to Success +1 English Curriculum)
 * Run: node backend/database/data/feed11thPdfData.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function feed11thPdfData() {
  console.log('🚀 Feeding Way to Success +1 English Complete PDF Dataset into SQLite Database...');
  await runMigration();

  // 1. Ensure Class 11 Course Exists
  await db.execute(
    `INSERT OR IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi - Way to Success)', '11ஆம் வகுப்பு சமச்சீர் கல்வி ஆங்கிலம் (Way to Success)', 'Complete +1 English curriculum: Part I (1-mark Synonyms, Antonyms, Grammar, Idioms), Part II (2-mark Poetry & Transformations), Part III (3-mark ERC, Short Answers, Writing), Part IV (5-mark Paragraphs, Essay, Bio-data, Letters).', 1, 1)`
  );

  // 2. Ensure Modules Exist for +1 English Parts
  const modulesData = [
    { id: 'mod_11th_part1', title: 'Part I: 1-Mark Questions & Grammar (20 Marks)', tamil: 'பகுதி 1: ஒரு மதிப்பெண் வினாக்கள் & இலக்கணம்', desc: 'Synonyms, Antonyms, Compound Words, Prefixes/Suffixes, Abbreviations, Clipped Words, Phrasal Verbs, Idioms, Foreign Words, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns', index: 1 },
    { id: 'mod_11th_part2', title: 'Part II: Poetry Appreciation & Transformations (14 Marks)', tamil: 'பகுதி 2: கவிதை வினாக்கள் & இலக்கண மாற்றங்கள்', desc: 'Poetry Appreciation, Figures of Speech, Direct/Indirect Speech, Active/Passive Voice, Simple/Compound/Complex, If-Clauses', index: 2 },
    { id: 'mod_11th_part3', title: 'Part III: ERC, Short Answers & Practical Writing (21 Marks)', tamil: 'பகுதி 3: இடம்பெற்று விளக்குதல், சிறு வினாக்கள் & எழுத்துப்பயிற்சி', desc: 'ERC (Reference to Context), Prose Short Answers, Dialogue Writing, Process Description, Proverbs, Semantic Fields, Notice Writing, Headline Expansion, Email Writing, Error Spotting', index: 3 },
    { id: 'mod_11th_part4', title: 'Part IV: Paragraphs, Essays & Job Applications (35 Marks)', tamil: 'பகுதி 4: நெடு வினாக்கள், கட்டுரைகள் & வேலை விண்ணப்பம்', desc: 'Prose Paragraphs, Poetry Paragraphs, Supplementary Stories, Note-Making/Summary, Bio-Data/Resume, Letter Writing, General Essays, Story Expansion', index: 4 }
  ];

  for (const m of modulesData) {
    await db.execute(
      `INSERT OR IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
       VALUES (?, 'crs_class11', ?, ?, ?, ?)`,
      [m.id, m.title, m.tamil, m.desc, m.index]
    );
  }

  // 3. SEED PART I LESSONS & DATA
  const part1Lessons = [
    {
      id: "lsn_11th_compound_words",
      title: "Compound Words (கூட்டுச் சொற்கள்)",
      tamil_title: "கூட்டுச் சொற்கள் இலக்கணம்",
      content: `### 🔗 Compound Words (Text Book pg 6)

A compound word is formed when two distinct words combine to create a new word with a single meaning.

#### Key Combinations:
1. **Noun + Noun**: shop-owner, dream-world, bed-time, rabbit-hole, chessmen, cork-screw, sun-dial, wonderland, postman, motorcycle, honeybee, craftsman
2. **Noun + Adjective**: knee-deep, homesick, henpecked
3. **Adverb + Noun**: insight, postscript
4. **Gerund + Noun**: looking-glass, washing machine, dining table, reading room, walking stick, swimming pool
5. **Adjective + Gerund**: curious-looking, shabby-looking
6. **Adjective + Past Participle**: dreamy-eyed, long-awaited
7. **Adjective + Adjective**: kindhearted, blue-green, red-handed
8. **Verb + Noun**: push-button, treadmill
9. **Adjective + Verb**: safeguard, whitewash
10. **Adverb + Verb**: overthrow, upset
11. **Object(Noun) + Noun**: telephone operator, science teacher
12. **Object(Noun) + Gerund**: air-conditioning, sightseeing
13. **Adjective + Noun**: blackboard, blueprint, grandmother
14. **Noun + Adjective**: lifelong, jet black, snow white
15. **Verb + Noun**: popcorn, crybaby

#### Exam Practice:
- **mantel + piece** = mantelpiece (வீட்டின் எறிமாடம்)
- **eye + lashes** = eyelashes (கண் இமைகள்)
- **water + proof** = waterproof (நீர்ப்புகா)
- **bee + hive** = beehive (தேனீக்கூடு)
- **toll + plaza** = tollgate / toll plaza (கட்டணச்சாவடி)`,
      tamil_translation: "இரண்டு வார்த்தைகள் இணைந்து புதிய அர்த்தத்தைக் கொடுத்தால் அது Compound word ஆகும்."
    },
    {
      id: "lsn_11th_prefix_suffix",
      title: "Prefixes & Suffixes (முன்னொட்டு & பின்னொட்டு)",
      tamil_title: "Prefix & Suffix இலக்கணம்",
      content: `### 🔤 Prefixes & Suffixes (Text Book pg 7, 39)

- **Prefix**: A syllable added BEFORE a root word.
  - un- : untidy, unnecessary, unable, uneducated
  - dis- : dishonest, disagree, disobedient, dislike
  - in- : inaudible, inactive, infinite
  - il- : illegitimate, illiterate, illogical
  - im- : impossible, imperfect, immature
  - ir- : irregular, irresponsible, irreplaceable

- **Suffix**: A syllable added AFTER a root word.
  - -able : beatable, readable, comfortable
  - -ous : famous, continuous, dangerous
  - -ment : agreement, excitement, achievement
  - -ful : painful, beautiful, truthful`,
      tamil_translation: "வார்த்தைக்கு முன்னால் சேர்ப்பது Prefix, பின்னால் சேர்ப்பது Suffix."
    },
    {
      id: "lsn_11th_abbreviations",
      title: "Abbreviations & Acronyms (சுருக்கக் குறியீடுகள்)",
      tamil_title: "அபிப்ரவேஷன் & அக்ரோனிம்",
      content: `### 🔤 Abbreviations & Acronyms (Text Book pg 39, 190)

- RSC: Referee Stopped Contest
- USA: United States of America
- AIBA: Association Internationale de Boxe Amateur
- IELTS: International English Language Testing System
- GST: Goods and Services Tax
- TNPSC: Tamil Nadu Public Service Commission
- STD: Subscribers Trunk Dialing
- ISD: International Subscribers Dialing
- MBA: Master of Business Administration
- MHRD: Ministry of Human Resource Development
- GPS: Global Positioning System
- NSS: National Service Scheme
- PTA: Parent-Teacher Association
- NGO: Non-Governmental Organization
- ICU: Intensive Care Unit
- IIM: Indian Institute of Management
- MRI: Magnetic Resonance Imaging
- ECG: Electro-Cardio Gram
- NCC: National Cadet Corps
- LED: Light Emitting Diode
- CPU: Central Processing Unit
- CBSE: Central Board of Secondary Education
- GDP: Gross Domestic Product
- LCD: Liquid Crystal Display
- NRI: Non Resident Indian
- IIT: Indian Institute of Technology
- ITI: Industrial Training Institute
- EMI: Equated Monthly Installments`,
      tamil_translation: "விரிவான சொற்றொடரின் முதல் எழுத்துக்களைக் கொண்ட சுருக்கம்."
    },
    {
      id: "lsn_11th_phrasal_verbs",
      title: "Phrasal Verbs (கூட்டு வினைச்சொற்கள்)",
      tamil_title: "Phrasal Verbs விளக்கம் & பயிற்சி",
      content: `### 🗣️ Phrasal Verbs (Text Book pg 112, 113)

- stand up: maintain, withstand (Your statement will not stand up in court.)
- stand for: support, willing to accept (My father stands for truth.)
- stand by: ready to help (I will standby you in times of trouble.)
- look into: examine (The officer looked into the matter.)
- look through: glance, skim (I am looking through your books.)
- run over: hit by vehicle (The lorry ran over the motorist.)
- run away: escape (The thief ran away on seeing police.)
- put on: wear (I put on my new shirt.)
- put off: postpone (They put off the match.)
- call off: cancel (The manager will call off the meeting.)
- call on: visit (My friend called on me yesterday.)
- carry out: perform (She carried out her duties with dedication.)
- give up: abandon, stop (He gave up smoking.)
- get over: recover from (She got over her grief.)`,
      tamil_translation: "ஒரு வினைச்சொல்லும் இடைச்சொல்லும் இணைந்து புதிய அர்த்தத்தைத் தருவது Phrasal Verb."
    },
    {
      id: "lsn_11th_idioms",
      title: "Common Idioms & Phrases (மரபுத்தொடர்கள்)",
      tamil_title: "ஆங்கில மரபுத்தொடர்கள்",
      content: `### 💡 Common Idioms (Text Book pg 40, 111, 112, 173)

- throw in the towel: to give up / accept defeat
- in our corner: on your side in an argument or dispute
- on the ropes: state of near collapse or defeat
- below the belt: unfair or unsporting behavior
- square off: prepare for a conflict
- alarm bells ringing: sign of something going wrong
- back to the wall: in serious difficulty
- saved by the bell: rescued at the last moment from a crisis
- right up one's alley: perfectly suited to one's interest
- drive someone up the wall: to irritate or annoy severely
- hit the road: to leave or begin a journey
- in tight corners: in a difficult financial or personal situation
- cold feet: feel intense nervousness and anxiety
- shot his bolt: exhausted one's maximum effort`,
      tamil_translation: "ஒரு கருத்தை குறிப்பால் உணர்த்தும் சொற்றொடர்கள் Idioms எனப்படும்."
    },
    {
      id: "lsn_11th_foreign_words",
      title: "Foreign Words & Phrases (பிறமொழிச் சொற்கள்)",
      tamil_title: "Foreign Words",
      content: `### 🌐 Foreign Words & Phrases (Text Book pg 172)

- viva voce: a spoken oral examination
- bonafide: genuine, authentic
- sine die: without fixing a future date (indefinitely)
- resume: a summary of qualification and experience
- in toto: totally, completely
- rapport: a close harmonious relationship
- liaison: coordination of activities between groups
- bon voyage: wishing someone a good journey
- postmortem: examination conducted after death
- en route: on the way to a destination
- de facto: in fact, in reality
- ex gratia: given as a favor without legal obligation
- ad hoc: for a particular specific purpose
- prima facie: at first sight
- en masse: all together as a group
- faux pas: a social blunder or mistake`,
      tamil_translation: "வேற்று மொழியிலிருந்து வந்து ஆங்கிலத்தில் பயன்படுத்தப்படும் சொற்கள்."
    },
    {
      id: "lsn_11th_euphemism",
      title: "Euphemisms & Polite Expressions (நாகரிகச் சொற்கள்)",
      tamil_title: "Euphemisms",
      content: `### 🕊️ Euphemistic Expressions (Polite Alternatives)

- blind: visually challenged
- disabled / handicapped: differently-abled
- disabled child: a special child
- undertaker: funeral director / mortician
- maid: domestic engineer
- garbage man: sanitation engineer
- lavatory / toilet: rest-room / comfort station
- housewife: homemaker
- poor: low income level / economically disadvantaged
- slow-learners: late-bloomers
- fat / overweight: full-figured / big-boned
- died: passed away / departed
- unemployed: between jobs
- jail: correctional facility`,
      tamil_translation: "மற்றவர் வருத்தமடையாத வண்ணம் மறைமுகமாக குறிப்பிடும் சொற்கள் Euphemism எனப்படும்."
    },
    {
      id: "lsn_11th_modals",
      title: "Modal Verbs & Semi-Modals (துணை வினைச்சொற்கள்)",
      tamil_title: "Modals & Semi-modals",
      content: `### ⚙️ Modal Verbs & Semi-Modals (Text Book pg 42-44)

#### 9 Primary Modals:
- will / would: futurity, intention, willingness, polite request (Will you give me a hand? / If I were a bird, I would fly.)
- shall / should: suggestion, obligation, duty (Shall I close the door? / Children should obey parents.)
- can / could: ability, possibility, polite request (I can drive a car. / Could you lend me your book?)
- may / might: permission, possibility, blessing (May I come in? / It might rain tonight.)
- must: necessity, strong compulsion, certainty (You must recite this poem.)

#### 4 Semi-Modals (Quasi-Modals):
- used to: discontinued past habit (He used to play football in college.)
- ought to: moral duty/obligation (You ought to respect elders.)
- need: necessity (You need not wait for him.)
- dare: courage to face (How dare you ask for more money?)`,
      tamil_translation: "உணர்வுகளை வெளிப்படுத்த உதவும் துணை வினைச்சொற்கள் Modal Verbs எனப்படும்."
    }
  ];

  for (let idx = 0; idx < part1Lessons.length; idx++) {
    const l = part1Lessons[idx];
    await db.execute(
      `INSERT OR IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, 'mod_11th_part1', ?, ?, 1, ?)`,
      [l.id, l.title, l.tamil_title, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil_translation]
    );
  }

  // 4. SEED PART II LESSONS (Transformations)
  const part2Lessons = [
    {
      id: "lsn_11th_direct_indirect",
      title: "Direct & Indirect Speech (நேர்க்கூற்று & அயற்கூற்று)",
      tamil_title: "Direct - Indirect Speech Rules",
      content: `### 🗣️ Direct to Indirect Speech Rules (Text Book pg 148-151)

#### 7 Essential Steps:
1. Reporting Verb Change:
   - Statement: said to -> told, said -> said (Conjunction: that)
   - Question: said to -> asked (Conjunction: same Wh- word or if/whether)
   - Imperative: said to -> ordered / requested / advised (Conjunction: to / not to)
   - Exclamatory: said to -> exclaimed joyfully/sorrowfully (Conjunction: that)
2. Remove Quotation Marks ("...").
3. Change Tense (Present -> Past, Past -> Past Perfect).
4. Change Time & Place Adverbials:
   - this -> that, these -> those, here -> there, now -> then, today -> that day, yesterday -> the previous day, tomorrow -> the next day.

#### Example Transformation:
- Direct: Balu said to his friend, "How long have I been waiting for you? It is getting late."
- Indirect: Balu asked his friend how long he had been waiting for him and added that it was getting late.`,
      tamil_translation: "ஒருவர் கூறுவதை அப்படியே திருப்பிக் சொன்னால் நேர்க்கூற்று, மாற்றிச் சொன்னால் அயற்கூற்று."
    },
    {
      id: "lsn_11th_active_passive",
      title: "Active Voice & Passive Voice (செய்வினை & செயப்பாட்டுவினை)",
      tamil_title: "Active - Passive Voice",
      content: `### ⚡ Active Voice to Passive Voice (Text Book pg 77, 78)

#### 5 Rules for Passive Voice:
1. Identify Object and make it the new Subject.
2. Add appropriate be-form verb according to tense + V3 (Past Participle).
3. Add preposition by after V3.
4. Move old Subject to Object position.

#### Tense Conversion Table:
- Simple Present: am / is / are + V3
- Simple Past: was / were + V3
- Simple Future: shall / will + be + V3
- Present Continuous: am / is / are + being + V3
- Past Continuous: was / were + being + V3
- Present Perfect: have / has + been + V3
- Past Perfect: had + been + V3

#### Examples:
- Active: Vani wrote a letter to the editor.
- Passive: A letter was written by Vani to the editor.`,
      tamil_translation: "எழுவாய் செய்யும் செயல் செய்வினை, செயப்படுபொருள் முன்னிலைப்படுத்தப்பட்டால் செயப்பாட்டுவினை."
    },
    {
      id: "lsn_11th_if_clauses",
      title: "Conditional Clauses / If Clauses (நிபந்தனை வாக்கியங்கள்)",
      tamil_title: "If Clauses Rules",
      content: `### 🔀 Conditional Clauses (Text Book pg 116-118)

- Type 0 (Universal / Scientific Truth):
  - Condition: If + Present V1 -> Result: Present V1 (If you heat ice, it melts.)
- Type I (Possible & Probable Condition):
  - Condition: If + Present V1 -> Result: will / shall / can + V1 (If Sita studies well, she will pass the exam.)
- Type II (Imaginary / Unlikely Condition):
  - Condition: If + Past V2 / Were -> Result: would / could + V1 (If I were a bird, I would fly in the sky.)
- Type III (Impossible / Unfulfilled Past Condition):
  - Condition: If + Past Perfect (had + V3) -> Result: would have + V3 (If he had studied well, he would have passed.)`,
      tamil_translation: "ஒரு செயலின் நிபந்தனையும் அதன் விளைவும் Conditional Clause எனப்படும்."
    }
  ];

  for (let idx = 0; idx < part2Lessons.length; idx++) {
    const l = part2Lessons[idx];
    await db.execute(
      `INSERT OR IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, 'mod_11th_part2', ?, ?, 1, ?)`,
      [l.id, l.title, l.tamil_title, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil_translation]
    );
  }

  // 5. SEED SAMPLE PRACTICE QUIZZES & EXERCISES FOR 11TH SYLLABUS
  const sample11thQuizzes = [
    { q: "Choose the correct clipped word for 'Chimpanzee'", ta: "Chimpanzee என்பதன் சுருக்கப்பட்ட வார்த்தை:", ans: "chimp", opts: ["chimp", "pan", "panzee", "chimpan"] },
    { q: "Choose the correct compound word for 'toll'", ta: "toll என்பதன் கூட்டு வார்த்தை:", ans: "plaza", opts: ["plaza", "late", "proof", "wheel"] },
    { q: "Choose the expanded form of 'GST'", ta: "GST என்பதன் விரிவான வடிவம்:", ans: "Goods and Services Tax", opts: ["Goods and Services Tax", "Goods and Service Trade", "Goods and Savings Term", "Good Social Tax"] },
    { q: "Choose the right definition for 'Ornithologist'", ta: "Ornithologist என்பதன் சரியான பொருள்:", ans: "one who studies birds", opts: ["one who studies birds", "one who studies insects", "one who studies animals", "one who studies reptiles"] },
    { q: "Choose the phrasal verb meaning 'to cancel'", ta: "ரத்து செய் என்ற பொருள் தரும் phrasal verb:", ans: "call off", opts: ["call off", "put on", "look into", "carry out"] },
    { q: "Choose the meaning of idiom 'throw in the towel'", ta: "throw in the towel மரபுத்தொடரின் பொருள்:", ans: "to give up", opts: ["to give up", "to accept it", "to overcome", "to put up"] },
    { q: "Choose the euphemistic expression for 'blind'", ta: "blind என்பதற்கான நாகரிகச் சொல்:", ans: "visually challenged", opts: ["visually challenged", "unsighted", "sightless", "visual failure"] }
  ];

  await db.execute(
    `INSERT OR IGNORE INTO exercises (id, lesson_id, level_id, title, exercise_type, instructions, tamil_instructions, xp_points, order_index)
     VALUES ('ex_11th_part1_quiz', 'lsn_11th_compound_words', 'B1', '11th Standard English 1-Mark Quiz', 'mcq', 'Choose the correct answer from options', 'சரியான விடையைத் தேர்ந்தெடுக்க', 50, 1)`
  );

  for (let i = 0; i < sample11thQuizzes.length; i++) {
    const qz = sample11thQuizzes[i];
    await db.execute(
      `INSERT INTO questions (exercise_id, question_text, tamil_subtext, correct_answer, order_index)
       VALUES ('ex_11th_part1_quiz', ?, ?, ?, ?)`,
      [qz.q, qz.ta, qz.ans, i + 1]
    );
  }

  console.log('✅ Successfully fed Complete +1 English Way to Success PDF Dataset into SQLite!');
}

if (require.main === module) {
  feed11thPdfData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = feed11thPdfData;
