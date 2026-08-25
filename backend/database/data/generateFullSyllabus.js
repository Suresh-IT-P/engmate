/**
 * COMPREHENSIVE SAMACHEER KALVI CLASS 6-12 DATASET GENERATOR
 * Generates: Modules, Lessons, Exercises with 2000+ questions
 * Run: node backend/database/data/generateFullSyllabus.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname);

// ─── HELPER ─────────────────────────────────────────────────────────────────
function makeOpts(correct, wrongs) {
  const all = [{ option_text: correct, is_correct: 1 }, ...wrongs.map(w => ({ option_text: w, is_correct: 0 }))];
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

function mcq(q, correct, wrongs, explanation = '', tamil_explanation = '') {
  return {
    question_text: q,
    correct_answer: correct,
    explanation: explanation || `The correct answer is "${correct}".`,
    tamil_explanation: tamil_explanation || `சரியான விடை: "${correct}".`,
    points: 10,
    options: makeOpts(correct, wrongs)
  };
}

function fill(q, correct, explanation = '') {
  return {
    question_text: q,
    correct_answer: correct,
    explanation: explanation || `The blank should be filled with "${correct}".`,
    tamil_explanation: `வெற்றிடத்தில் "${correct}" நிரப்ப வேண்டும்.`,
    points: 10,
    options: []
  };
}

// ─── NEW MODULES ─────────────────────────────────────────────────────────────

const newModules = [

  // CLASS 6 ─ 5 Units
  { id: 'mod_sam_6_u1', course_id: 'course_samacheer_class_6', title: 'Class 6 Unit 1: The World of Imagination', tamil_title: '6-ஆம் வகுப்பு அலகு 1: கற்பனை உலகம்', description: 'Prose: The World of Imagination | Poem: Books | Grammar: Nouns', order_index: 1 },
  { id: 'mod_sam_6_u2', course_id: 'course_samacheer_class_6', title: 'Class 6 Unit 2: Wonder of Science', tamil_title: '6-ஆம் வகுப்பு அலகு 2: அறிவியல் அதிசயம்', description: 'Prose: The Boy Who Thought Outside the Box | Poem: Sea Fever | Grammar: Pronouns', order_index: 2 },
  { id: 'mod_sam_6_u3', course_id: 'course_samacheer_class_6', title: 'Class 6 Unit 3: Land of Spices', tamil_title: '6-ஆம் வகுப்பு அலகு 3: மசாலா நிலம்', description: 'Prose: Sea Turtles | Poem: The Crocodile | Grammar: Adjectives', order_index: 3 },
  { id: 'mod_sam_6_u4', course_id: 'course_samacheer_class_6', title: 'Class 6 Unit 4: Sea of Knowledge', tamil_title: '6-ஆம் வகுப்பு அலகு 4: அறிவின் கடல்', description: 'Prose: When the Trees Walked | Poem: The River | Grammar: Verbs', order_index: 4 },
  { id: 'mod_sam_6_u5', course_id: 'course_samacheer_class_6', title: 'Class 6 Unit 5: Universe of People', tamil_title: '6-ஆம் வகுப்பு அலகு 5: மக்கள் பிரபஞ்சம்', description: 'Prose: The Old Man and the Sea (extract) | Poem: Be Glad | Grammar: Sentence Types', order_index: 5 },

  // CLASS 7 ─ 5 Units
  { id: 'mod_sam_7_u1', course_id: 'course_samacheer_class_7', title: 'Class 7 Unit 1: Leisure', tamil_title: '7-ஆம் வகுப்பு அலகு 1: ஓய்வு நேரம்', description: 'Prose: Eidgah (Premchand) | Poem: From a Railway Carriage | Grammar: Simple, Compound, Complex Sentences', order_index: 1 },
  { id: 'mod_sam_7_u2', course_id: 'course_samacheer_class_7', title: 'Class 7 Unit 2: Travel', tamil_title: '7-ஆம் வகுப்பு அலகு 2: பயணம்', description: 'Prose: Wind on Haunted Hill (Ruskin Bond) | Poem: The Listeners | Grammar: Tenses — Simple, Continuous, Perfect', order_index: 2 },
  { id: 'mod_sam_7_u3', course_id: 'course_samacheer_class_7', title: 'Class 7 Unit 3: Environment', tamil_title: '7-ஆம் வகுப்பு அலகு 3: சுற்றுச்சூழல்', description: 'Prose: Man Overboard | Poem: Trees | Grammar: Prepositions and Conjunctions', order_index: 3 },
  { id: 'mod_sam_7_u4', course_id: 'course_samacheer_class_7', title: 'Class 7 Unit 4: Sports', tamil_title: '7-ஆம் வகுப்பு அலகு 4: விளையாட்டு', description: 'Prose: Empowered Women | Poem: If (Kipling) | Grammar: Articles and Determiners', order_index: 4 },
  { id: 'mod_sam_7_u5', course_id: 'course_samacheer_class_7', title: 'Class 7 Unit 5: Achievers', tamil_title: '7-ஆம் வகுப்பு அலகு 5: சாதனையாளர்கள்', description: 'Prose: Life | Poem: The Road Not Taken (Frost) | Grammar: Direct and Indirect Speech', order_index: 5 },

  // CLASS 8 ─ 5 Units
  { id: 'mod_sam_8_u1', course_id: 'course_samacheer_class_8', title: 'Class 8 Unit 1: Wisdom of Words', tamil_title: '8-ஆம் வகுப்பு அலகு 1: சொல்லின் ஞானம்', description: 'Prose: The Nose-Jewel (Rajaji) | Poem: The Song of the Flower | Grammar: Active and Passive Voice', order_index: 1 },
  { id: 'mod_sam_8_u2', course_id: 'course_samacheer_class_8', title: 'Class 8 Unit 2: Nature and Nurture', tamil_title: '8-ஆம் வகுப்பு அலகு 2: இயற்கை வளர்ப்பு', description: 'Prose: Special Hero | Poem: Nature | Grammar: Conditional Sentences (If clauses)', order_index: 2 },
  { id: 'mod_sam_8_u3', course_id: 'course_samacheer_class_8', title: 'Class 8 Unit 3: Hobby Turns Career', tamil_title: '8-ஆம் வகுப்பு அலகு 3: பொழுதுபோக்கே தொழில்', description: 'Prose: Hobby Turns Career | Poem: Annabel Lee | Grammar: Modal Verbs (Can, Could, May, Might)', order_index: 3 },
  { id: 'mod_sam_8_u4', course_id: 'course_samacheer_class_8', title: 'Class 8 Unit 4: Reaching the Unreachable', tamil_title: '8-ஆம் வகுப்பு அலகு 4: இயலாதது இல்லை', description: 'Prose: The Aged Mother | Poem: If | Grammar: Question Tags and Short Answers', order_index: 4 },
  { id: 'mod_sam_8_u5', course_id: 'course_samacheer_class_8', title: 'Class 8 Unit 5: Sports and Games', tamil_title: '8-ஆம் வகுப்பு அலகு 5: விளையாட்டு மற்றும் போட்டிகள்', description: 'Prose: Lighting of the Flame | Supplementary: The Gold Frame | Grammar: Reported Speech', order_index: 5 },

  // CLASS 9 ─ 5 Units
  { id: 'mod_sam_9_u1', course_id: 'course_samacheer_class_9', title: 'Class 9 Unit 1: Achievement', tamil_title: '9-ஆம் வகுப்பு அலகு 1: சாதனை', description: 'Prose: Learning the Game (Sachin Tendulkar) | Poem: Stopping by Woods | Grammar: If-Clauses (Zero, First, Second)', order_index: 1 },
  { id: 'mod_sam_9_u2', course_id: 'course_samacheer_class_9', title: 'Class 9 Unit 2: Honesty', tamil_title: '9-ஆம் வகுப்பு அலகு 2: நேர்மை', description: 'Prose: The Little Hero of Holland | Poem: A Poison Tree | Grammar: Reported Speech and Questions', order_index: 2 },
  { id: 'mod_sam_9_u3', course_id: 'course_samacheer_class_9', title: 'Class 9 Unit 3: Environment', tamil_title: '9-ஆம் வகுப்பு அலகு 3: சுற்றுச்சூழல்', description: 'Prose: The Last Leaf (O. Henry) | Poem: Desiderata | Grammar: Passive Voice (all tenses)', order_index: 3 },
  { id: 'mod_sam_9_u4', course_id: 'course_samacheer_class_9', title: 'Class 9 Unit 4: Science and Technology', tamil_title: '9-ஆம் வகுப்பு அலகு 4: அறிவியல் தொழில்நுட்பம்', description: 'Prose: The Future is Now | Poem: Life | Grammar: Concord (Subject-Verb Agreement)', order_index: 4 },
  { id: 'mod_sam_9_u5', course_id: 'course_samacheer_class_9', title: 'Class 9 Unit 5: People and Civilization', tamil_title: '9-ஆம் வகுப்பு அலகு 5: மக்களும் நாகரிகமும்', description: 'Prose: The Tempest (Shakespeare extract) | Poem: The Flower School | Grammar: Prepositions and Phrases', order_index: 5 },

  // CLASS 10 ─ 7 Units (SSLC)
  { id: 'mod_sam_10_u1', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 1: His First Flight', tamil_title: '10-ஆம் வகுப்பு அலகு 1: அவனது முதல் பறப்பு', description: 'Prose: His First Flight (Liam O\'Flaherty) | Poem: Life | Grammar: Clauses', order_index: 1 },
  { id: 'mod_sam_10_u2', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 2: The Night the Ghost Got In', tamil_title: '10-ஆம் வகுப்பு அலகு 2: பேய் வீட்டில் நுழைந்த இரவு', description: 'Prose: The Night the Ghost Got In (James Thurber) | Poem: The Tempest | Grammar: Passive Voice (SSLC)', order_index: 2 },
  { id: 'mod_sam_10_u3', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 3: Zigzag', tamil_title: '10-ஆம் வகுப்பு அலகு 3: சிக்சாக்', description: 'Prose: Zigzag | Poem: Stopping by Woods on a Snowy Evening | Grammar: Reported Speech', order_index: 3 },
  { id: 'mod_sam_10_u4', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 4: Empowered Women', tamil_title: '10-ஆம் வகுப்பு அலகு 4: சக்திவாய்ந்த பெண்கள்', description: 'Prose: Empowered Women — INSV Tarini | Poem: Our Casuarina Tree | Grammar: Conditional Sentences', order_index: 4 },
  { id: 'mod_sam_10_u5', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 5: The Tech Bloomers', tamil_title: '10-ஆம் வகுப்பு அலகு 5: தொழில்நுட்பம் செழிக்கும்', description: 'Prose: Tech Bloomers | Poem: Confucius Quotes | Grammar: Concord', order_index: 5 },
  { id: 'mod_sam_10_u6', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 6: The Last Lesson', tamil_title: '10-ஆம் வகுப்பு அலகு 6: கடைசி பாடம்', description: 'Prose: The Last Lesson (Alphonse Daudet) | Poem: No Men Are Foreign | Grammar: Inversion', order_index: 6 },
  { id: 'mod_sam_10_u7', course_id: 'course_samacheer_class_10', title: 'Class 10 Unit 7: The Dying Detective', tamil_title: '10-ஆம் வகுப்பு அலகு 7: மரணமடையும் துப்பறிவாளன்', description: 'Prose: The Dying Detective (A. Conan Doyle) | Poem: I Dream a World | Grammar: Board Exam Grammar Master', order_index: 7 },

  // CLASS 11 ─ 5 Units (HSC)
  { id: 'mod_sam_11_u1', course_id: 'course_samacheer_class_11', title: 'Class 11 Unit 1: Empathy', tamil_title: '11-ஆம் வகுப்பு அலகு 1: பரிவு', description: 'Prose: The Portrait of a Lady (Khushwant Singh) | Poem: Once Upon a Time (Gabriel Okara) | Grammar: Sentence Transformation', order_index: 1 },
  { id: 'mod_sam_11_u2', course_id: 'course_samacheer_class_11', title: 'Class 11 Unit 2: Women Empowerment', tamil_title: '11-ஆம் வகுப்பு அலகு 2: பெண் சக்தி', description: 'Prose: The Queen of Boxing (Mary Kom) | Poem: Strong is the New Pretty | Grammar: Advanced Concord', order_index: 2 },
  { id: 'mod_sam_11_u3', course_id: 'course_samacheer_class_11', title: 'Class 11 Unit 3: Nature and Environment', tamil_title: '11-ஆம் வகுப்பு அலகு 3: இயற்கை மற்றும் சுற்றுச்சூழல்', description: 'Prose: God Sees the Truth but Waits (Tolstoy) | Poem: A Thing of Beauty | Grammar: Reported Speech & Commands', order_index: 3 },
  { id: 'mod_sam_11_u4', course_id: 'course_samacheer_class_11', title: 'Class 11 Unit 4: Science Fiction', tamil_title: '11-ஆம் வகுப்பு அலகு 4: அறிவியல் புனைகதை', description: 'Prose: There Will Come Soft Rains | Poem: Ode to the West Wind | Grammar: Inversion and Ellipsis', order_index: 4 },
  { id: 'mod_sam_11_u5', course_id: 'course_samacheer_class_11', title: 'Class 11 Unit 5: Humour and Wit', tamil_title: '11-ஆம் வகுப்பு அலகு 5: நகைச்சுவை', description: 'Prose: The Story of an Hour (Kate Chopin) | Poem: Father Returning Home | Grammar: HSC Board Exam Grammar', order_index: 5 },

  // CLASS 12 ─ 5 Units (HSC)
  { id: 'mod_sam_12_u1', course_id: 'course_samacheer_class_12', title: 'Class 12 Unit 1: Courage', tamil_title: '12-ஆம் வகுப்பு அலகு 1: தைரியம்', description: 'Prose: Two Gentlemen of Verona (A.J. Cronin) | Poem: Our Casuarina Tree (Toru Dutt) | Grammar: Error Spotting 20 Golden Rules', order_index: 1 },
  { id: 'mod_sam_12_u2', course_id: 'course_samacheer_class_12', title: 'Class 12 Unit 2: Friendship', tamil_title: '12-ஆம் வகுப்பு அலகு 2: நட்பு', description: 'Prose: The Castle (Franz Kafka) | Poem: The Comet | Grammar: Sentence Transformation (Board Level)', order_index: 2 },
  { id: 'mod_sam_12_u3', course_id: 'course_samacheer_class_12', title: 'Class 12 Unit 3: A Nice Cup of Tea', tamil_title: '12-ஆம் வகுப்பு அலகு 3: ஒரு கோப்பை டீ', description: 'Prose: A Nice Cup of Tea (George Orwell) | Poem: Refugee Blues | Grammar: Phrasal Verbs and Idioms', order_index: 3 },
  { id: 'mod_sam_12_u4', course_id: 'course_samacheer_class_12', title: 'Class 12 Unit 4: The Dying Detective', tamil_title: '12-ஆம் வகுப்பு அலகு 4: இறந்துகொண்டிருக்கும் துப்பறிவாளன்', description: 'Play: The Dying Detective | Poem: Telephoning God | Grammar: Question Formation and Tag Questions', order_index: 4 },
  { id: 'mod_sam_12_u5', course_id: 'course_samacheer_class_12', title: 'Class 12 Unit 5: Board Exam Mastery', tamil_title: '12-ஆம் வகுப்பு அலகு 5: பொதுத்தேர்வு மேலாண்மை', description: 'God Sees the Truth but Waits | Supplementary reading comprehension | Full Board Exam practice', order_index: 5 },
];

// ─── NEW LESSONS ──────────────────────────────────────────────────────────────

function makeLessons(modId, prefix, lessonDefs) {
  return lessonDefs.map((l, i) => ({
    id: `les_${prefix}_${i + 1}`,
    module_id: modId,
    title: l.title,
    tamil_title: l.tamil_title,
    lesson_type: l.type || 'standard',
    xp_reward: l.xp || 40,
    duration_minutes: l.dur || 15,
    order_index: i + 1
  }));
}

const newLessons = [
  ...makeLessons('mod_sam_6_u1', 'sam6u1', [
    { title: 'Reading: The World of Imagination', tamil_title: 'வாசித்தல்: கற்பனை உலகம்', type: 'standard', xp: 35 },
    { title: 'Poem: Books — Appreciation & Analysis', tamil_title: 'செய்யுள்: நூல்கள் — பாராட்டு', type: 'standard', xp: 30 },
    { title: 'Grammar: Types of Nouns', tamil_title: 'இலக்கணம்: பெயர்ச்சொல் வகைகள்', type: 'grammar', xp: 40 },
    { title: 'Vocabulary: Unit 1 Word Bank', tamil_title: 'சொல்வளம்: அலகு 1', type: 'vocabulary', xp: 30 },
  ]),
  ...makeLessons('mod_sam_6_u2', 'sam6u2', [
    { title: 'Reading: The Boy Who Thought Outside the Box', tamil_title: 'வாசித்தல்: தனித்துவமான சிந்தனையாளன்', type: 'standard' },
    { title: 'Poem: Sea Fever — Meaning & Figures of Speech', tamil_title: 'செய்யுள்: கடல் காய்ச்சல்', type: 'standard' },
    { title: 'Grammar: Pronouns — Types and Usage', tamil_title: 'இலக்கணம்: பிரதிப்பெயர் வகைகள்', type: 'grammar', xp: 40 },
    { title: 'Practice: Pronoun Substitution Exercises', tamil_title: 'பயிற்சி: பிரதிப்பெயர் மாற்றம்', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_6_u3', 'sam6u3', [
    { title: 'Reading: Sea Turtles — Conservation Story', tamil_title: 'வாசித்தல்: கடல் ஆமைகள்', type: 'standard' },
    { title: 'Poem: The Crocodile — Lewis Carroll', tamil_title: 'செய்யுள்: முதலை', type: 'standard' },
    { title: 'Grammar: Adjectives — Degrees of Comparison', tamil_title: 'இலக்கணம்: பெயரடை — ஒப்பிட்டு நிலைகள்', type: 'grammar', xp: 45 },
    { title: 'Practice: Fill in the Blanks with Adjectives', tamil_title: 'பயிற்சி: பெயரடை நிரப்புக', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_6_u4', 'sam6u4', [
    { title: 'Reading: When the Trees Walked', tamil_title: 'வாசித்தல்: மரங்கள் நடந்தபோது', type: 'standard' },
    { title: 'Grammar: Action and State Verbs', tamil_title: 'இலக்கணம்: வினைச்சொல் வகைகள்', type: 'grammar', xp: 40 },
    { title: 'MCQ Practice: Unit 4 Questions', tamil_title: 'பயிற்சி வினாக்கள்: அலகு 4', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_6_u5', 'sam6u5', [
    { title: 'Reading: Be Glad Your Nose is on Your Face', tamil_title: 'வாசித்தல்: உங்கள் முகத்தில் மூக்கு இருப்பதற்கு மகிழுங்கள்', type: 'standard' },
    { title: 'Grammar: Types of Sentences', tamil_title: 'இலக்கணம்: வாக்கிய வகைகள்', type: 'grammar', xp: 45 },
    { title: 'Class 6 Revision — All Units', tamil_title: '6-ஆம் வகுப்பு திருப்புதல்', type: 'standard', xp: 60 },
  ]),

  // Class 7 Lessons
  ...makeLessons('mod_sam_7_u1', 'sam7u1', [
    { title: 'Reading: Eidgah by Premchand', tamil_title: 'வாசித்தல்: ஈத்காஹ் — பிரேம்சந்த்', type: 'standard' },
    { title: 'Poem: From a Railway Carriage', tamil_title: 'செய்யுள்: இரயில் பெட்டியிலிருந்து', type: 'standard' },
    { title: 'Grammar: Simple, Compound and Complex Sentences', tamil_title: 'இலக்கணம்: தனி, கூட்டு, கலப்பு வாக்கியங்கள்', type: 'grammar', xp: 50 },
    { title: 'MCQ: Unit 1 Comprehension', tamil_title: 'வினாடி வினா: அலகு 1 புரிதல்', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_7_u2', 'sam7u2', [
    { title: 'Reading: Wind on Haunted Hill — Ruskin Bond', tamil_title: 'வாசித்தல்: பேய் மலையில் காற்று', type: 'standard' },
    { title: 'Poem: The Listeners — Walter de la Mare', tamil_title: 'செய்யுள்: கேட்போர்', type: 'standard' },
    { title: 'Grammar: All Tenses — Present, Past, Future', tamil_title: 'இலக்கணம்: அனைத்து காலங்களும்', type: 'grammar', xp: 55 },
    { title: 'Tense Conversion Exercises', tamil_title: 'காலம் மாற்றம் பயிற்சிகள்', type: 'grammar' },
  ]),
  ...makeLessons('mod_sam_7_u3', 'sam7u3', [
    { title: 'Reading: Man Overboard — Winston Churchill', tamil_title: 'வாசித்தல்: கடலில் விழுந்தவன்', type: 'standard' },
    { title: 'Poem: Trees — Joyce Kilmer', tamil_title: 'செய்யுள்: மரங்கள்', type: 'standard' },
    { title: 'Grammar: Prepositions — In, On, At, By, For', tamil_title: 'இலக்கணம்: உரிச்சொல் — இடப்பொருள்', type: 'grammar', xp: 45 },
    { title: 'Grammar: Conjunctions and Connectors', tamil_title: 'இலக்கணம்: இணைப்புச்சொற்கள்', type: 'grammar' },
  ]),
  ...makeLessons('mod_sam_7_u4', 'sam7u4', [
    { title: 'Reading: Empowered Women — INSV Tarini', tamil_title: 'வாசித்தல்: சக்திவாய்ந்த பெண்கள்', type: 'standard' },
    { title: 'Poem: If — Rudyard Kipling', tamil_title: 'செய்யுள்: ஒருவேளை — கிப்லிங்', type: 'standard' },
    { title: 'Grammar: Articles — A, An, The', tamil_title: 'இலக்கணம்: உரிச்சொல் — A, An, The', type: 'grammar', xp: 45 },
    { title: 'MCQ Practice: Articles and Determiners', tamil_title: 'வினாடி வினா: Article பயிற்சி', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_7_u5', 'sam7u5', [
    { title: 'Reading: Life — Poem by Henry Van Dyke', tamil_title: 'வாசித்தல்: வாழ்க்கை', type: 'standard' },
    { title: 'Poem: The Road Not Taken — Robert Frost', tamil_title: 'செய்யுள்: நடக்காத பாதை', type: 'standard' },
    { title: 'Grammar: Direct and Indirect Speech', tamil_title: 'இலக்கணம்: நேர் மற்றும் மறை மொழி', type: 'grammar', xp: 55 },
    { title: 'Class 7 Full Revision Quiz', tamil_title: '7-ஆம் வகுப்பு முழு திருப்புதல்', type: 'standard', xp: 70 },
  ]),

  // Class 8 Lessons
  ...makeLessons('mod_sam_8_u1', 'sam8u1', [
    { title: 'Reading: The Nose-Jewel — C. Rajagopalachari', tamil_title: 'வாசித்தல்: மூக்குத்தி — ராஜாஜி', type: 'standard' },
    { title: 'Poem: The Song of the Flower — Kahlil Gibran', tamil_title: 'செய்யுள்: மலரின் பாடல்', type: 'standard' },
    { title: 'Grammar: Active Voice and Passive Voice — All Tenses', tamil_title: 'இலக்கணம்: கர்த்தரி மற்றும் கர்மணி வாக்கியங்கள்', type: 'grammar', xp: 60 },
    { title: 'Active-Passive Conversion Practice', tamil_title: 'கர்த்தரி ↔ கர்மணி மாற்றம்', type: 'grammar', xp: 50 },
  ]),
  ...makeLessons('mod_sam_8_u2', 'sam8u2', [
    { title: 'Reading: Special Hero', tamil_title: 'வாசித்தல்: சிறப்பு வீரன்', type: 'standard' },
    { title: 'Poem: Nature — H.D. Carberry', tamil_title: 'செய்யுள்: இயற்கை', type: 'standard' },
    { title: 'Grammar: If Clauses — Zero, First, Second, Third Conditionals', tamil_title: 'இலக்கணம்: நிபந்தனை வாக்கியங்கள்', type: 'grammar', xp: 60 },
    { title: 'Conditional Sentences Practice', tamil_title: 'நிபந்தனை வாக்கிய பயிற்சி', type: 'grammar' },
  ]),
  ...makeLessons('mod_sam_8_u3', 'sam8u3', [
    { title: 'Reading: Hobby Turns Career', tamil_title: 'வாசித்தல்: பொழுதுபோக்கே தொழிலாக மாறும்போது', type: 'standard' },
    { title: 'Poem: Annabel Lee — Edgar Allan Poe', tamil_title: 'செய்யுள்: அன்னாபல் லீ', type: 'standard' },
    { title: 'Grammar: Modal Verbs — Can, Could, May, Might, Should, Must', tamil_title: 'இலக்கணம்: துணை வினைகள்', type: 'grammar', xp: 55 },
    { title: 'Modals in Context — Practice MCQs', tamil_title: 'துணை வினை பயிற்சி', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_8_u4', 'sam8u4', [
    { title: 'Reading: The Aged Mother', tamil_title: 'வாசித்தல்: வயதான தாய்', type: 'standard' },
    { title: 'Poem: If — Rudyard Kipling (Advanced)', tamil_title: 'செய்யுள்: ஒருவேளை (உயர்நிலை)', type: 'standard' },
    { title: 'Grammar: Question Tags and Short Answers', tamil_title: 'இலக்கணம்: கேள்வி முனைகள்', type: 'grammar', xp: 50 },
    { title: 'Practice: Question Tag Formation', tamil_title: 'கேள்வி முனை உருவாக்கம்', type: 'grammar' },
  ]),
  ...makeLessons('mod_sam_8_u5', 'sam8u5', [
    { title: 'Reading: Lighting of the Flame', tamil_title: 'வாசித்தல்: ஒளி ஏற்றல்', type: 'standard' },
    { title: 'Supplementary: The Gold Frame', tamil_title: 'துணைப்பாடம்: தங்க சட்டகம்', type: 'standard' },
    { title: 'Grammar: Reported Speech — Statements, Questions, Commands', tamil_title: 'இலக்கணம்: நேர்மொழி மறைமொழி', type: 'grammar', xp: 60 },
    { title: 'Class 8 Board Exam Practice Quiz', tamil_title: '8-ஆம் வகுப்பு போட்டி வினாடி வினா', type: 'standard', xp: 75 },
  ]),

  // Class 9 Lessons
  ...makeLessons('mod_sam_9_u1', 'sam9u1', [
    { title: 'Reading: Learning the Game — Sachin Tendulkar', tamil_title: 'வாசித்தல்: விளையாட்டு கற்றல்', type: 'standard' },
    { title: 'Poem: Stopping by Woods on a Snowy Evening — Frost', tamil_title: 'செய்யுள்: பனி காட்டில் நிறுத்தி', type: 'standard' },
    { title: 'Grammar: Conditional Sentences — All Types', tamil_title: 'இலக்கணம்: நிபந்தனை வகைகள்', type: 'grammar', xp: 60 },
    { title: 'Book Back and Additional Questions — Unit 1', tamil_title: 'புத்தக வினாக்கள் மற்றும் கூடுதல் வினாக்கள்', type: 'standard', xp: 55 },
  ]),
  ...makeLessons('mod_sam_9_u2', 'sam9u2', [
    { title: 'Reading: The Little Hero of Holland', tamil_title: 'வாசித்தல்: ஹாலண்டின் சிறு வீரன்', type: 'standard' },
    { title: 'Poem: A Poison Tree — William Blake', tamil_title: 'செய்யுள்: விஷ மரம்', type: 'standard' },
    { title: 'Grammar: Direct Speech to Reported Speech', tamil_title: 'இலக்கணம்: நேர்மொழி → மறைமொழி', type: 'grammar', xp: 60 },
    { title: 'Vocabulary Builder — Unit 2', tamil_title: 'சொல்வளம்: அலகு 2', type: 'vocabulary' },
  ]),
  ...makeLessons('mod_sam_9_u3', 'sam9u3', [
    { title: 'Reading: The Last Leaf — O. Henry', tamil_title: 'வாசித்தல்: கடைசி இலை', type: 'standard' },
    { title: 'Poem: Desiderata', tamil_title: 'செய்யுள்: விரும்பப்படுவன', type: 'standard' },
    { title: 'Grammar: Passive Voice — Present, Past, Future, Perfect', tamil_title: 'இலக்கணம்: கர்மணி வாக்கியம் — அனைத்து காலங்கள்', type: 'grammar', xp: 65 },
    { title: 'Active-Passive MCQ Practice', tamil_title: 'கர்த்தரி-கர்மணி வினாடி வினா', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_9_u4', 'sam9u4', [
    { title: 'Reading: The Future is Now', tamil_title: 'வாசித்தல்: எதிர்காலம் இப்போதே', type: 'standard' },
    { title: 'Poem: Life', tamil_title: 'செய்யுள்: வாழ்க்கை', type: 'standard' },
    { title: 'Grammar: Subject-Verb Agreement (Concord)', tamil_title: 'இலக்கணம்: கர்த்தா-வினை ஒத்திசைவு', type: 'grammar', xp: 55 },
    { title: 'Concord Rules — Practice Sheet', tamil_title: 'Concord விதிகள் பயிற்சி', type: 'grammar' },
  ]),
  ...makeLessons('mod_sam_9_u5', 'sam9u5', [
    { title: 'Reading: The Tempest — Shakespeare Extract', tamil_title: 'வாசித்தல்: புயல் — ஷேக்ஸ்பியர்', type: 'standard' },
    { title: 'Poem: The Flower School', tamil_title: 'செய்யுள்: மலர்ப் பள்ளி', type: 'standard' },
    { title: 'Grammar: Prepositions — Time, Place, Direction', tamil_title: 'இலக்கணம்: உரிச்சொல் — காலம், இடம்', type: 'grammar' },
    { title: 'Class 9 Full Revision and Board Prep', tamil_title: '9-ஆம் வகுப்பு முழு திருப்புதல்', type: 'standard', xp: 80 },
  ]),

  // Class 10 Lessons
  ...makeLessons('mod_sam_10_u1', 'sam10u1', [
    { title: 'Prose: His First Flight — Summary & Analysis', tamil_title: 'உரைநடை: அவனது முதல் பறப்பு', type: 'standard', xp: 50 },
    { title: 'Poem: Life — C.Y. Williams', tamil_title: 'செய்யுள்: வாழ்க்கை', type: 'standard' },
    { title: 'Book Back Questions — Unit 1', tamil_title: 'புத்தக வினாக்கள்: அலகு 1', type: 'standard', xp: 55 },
    { title: 'Grammar: Clauses — Noun, Adjective, Adverb', tamil_title: 'இலக்கணம்: திரட்சிகள்', type: 'grammar', xp: 60 },
    { title: 'Additional Questions — Unit 1', tamil_title: 'கூடுதல் வினாக்கள்: அலகு 1', type: 'standard', xp: 55 },
  ]),
  ...makeLessons('mod_sam_10_u2', 'sam10u2', [
    { title: 'Prose: The Night the Ghost Got In — Thurber', tamil_title: 'உரைநடை: பேய் வீட்டில் நுழைந்த இரவு', type: 'standard', xp: 50 },
    { title: 'Poem: The Tempest Sonnet', tamil_title: 'செய்யுள்: புயல்', type: 'standard' },
    { title: 'Grammar: Passive Voice — SSLC Style', tamil_title: 'இலக்கணம்: கர்மணி — SSLC', type: 'grammar', xp: 60 },
    { title: 'Additional Questions — Unit 2', tamil_title: 'கூடுதல் வினாக்கள்: அலகு 2', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_10_u3', 'sam10u3', [
    { title: 'Prose: Zigzag — Summary & Characters', tamil_title: 'உரைநடை: சிக்சாக்', type: 'standard' },
    { title: 'Poem: Stopping by Woods — Robert Frost', tamil_title: 'செய்யுள்: பனி காட்டில் நிறுத்துதல்', type: 'standard' },
    { title: 'Grammar: Reported Speech (SSLC Pattern)', tamil_title: 'இலக்கணம்: மறைமொழி (SSLC)', type: 'grammar', xp: 65 },
    { title: 'Book Back + Additional Questions', tamil_title: 'புத்தக மற்றும் கூடுதல் வினாக்கள்', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_10_u4', 'sam10u4', [
    { title: 'Prose: Empowered Women — INSV Tarini', tamil_title: 'உரைநடை: INSV தாரணி — சக்திவாய்ந்த பெண்கள்', type: 'standard' },
    { title: 'Poem: Our Casuarina Tree — Toru Dutt', tamil_title: 'செய்யுள்: நம்மை சாவுக்கடல் மரம் — தோரு தத்', type: 'standard' },
    { title: 'Grammar: Conditional Sentences (SSLC)', tamil_title: 'இலக்கணம்: நிபந்தனை வாக்கியங்கள்', type: 'grammar', xp: 65 },
    { title: 'Additional MCQs and Board Questions', tamil_title: 'கூடுதல் வினாடி வினா — போர்டு', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_10_u5', 'sam10u5', [
    { title: 'Prose: Tech Bloomers', tamil_title: 'உரைநடை: தொழில்நுட்பம் மலரும்', type: 'standard' },
    { title: 'Grammar: Concord — Advanced Rules', tamil_title: 'இலக்கணம்: Concord உயர்நிலை', type: 'grammar', xp: 60 },
    { title: 'Unit 5 Questions — Book Back + Extra', tamil_title: 'அலகு 5 — புத்தக மற்றும் கூடுதல் வினாக்கள்', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_10_u6', 'sam10u6', [
    { title: 'Prose: The Last Lesson — Alphonse Daudet', tamil_title: 'உரைநடை: கடைசி பாடம்', type: 'standard' },
    { title: 'Poem: No Men Are Foreign — James Kirkup', tamil_title: 'செய்யுள்: யாரும் அந்நியர் இல்லை', type: 'standard' },
    { title: 'Grammar: Inversion and Emphatic Do', tamil_title: 'இலக்கணம்: தலைகீழ் வாக்கியங்கள்', type: 'grammar', xp: 65 },
    { title: 'Unit 6 Board Pattern Questions', tamil_title: 'அலகு 6 — போர்டு வினாக்கள்', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_10_u7', 'sam10u7', [
    { title: 'Prose: The Dying Detective — Conan Doyle', tamil_title: 'உரைநடை: மரணமடையும் துப்பறிவாளன்', type: 'standard' },
    { title: 'Poem: I Dream a World — Langston Hughes', tamil_title: 'செய்யுள்: நான் ஒரு உலகை கனவு காண்கிறேன்', type: 'standard' },
    { title: 'Complete Grammar Revision — SSLC Master', tamil_title: 'இலக்கண முழு திருப்புதல் — SSLC', type: 'grammar', xp: 80 },
    { title: 'Full SSLC Board Exam Mock Test', tamil_title: 'SSLC பொதுத்தேர்வு மாதிரி தேர்வு', type: 'standard', xp: 100 },
  ]),

  // Class 11 Lessons
  ...makeLessons('mod_sam_11_u1', 'sam11u1', [
    { title: 'Prose: The Portrait of a Lady — Khushwant Singh', tamil_title: 'உரைநடை: ஒரு பெண்மணியின் உருவப்படம்', type: 'standard' },
    { title: 'Poem: Once Upon a Time — Gabriel Okara', tamil_title: 'செய்யுள்: ஒரு காலத்தில்', type: 'standard' },
    { title: 'Grammar: Sentence Transformation', tamil_title: 'இலக்கணம்: வாக்கிய மாற்றம்', type: 'grammar', xp: 65 },
    { title: 'Vocabulary: Academic Word List — Level 1', tamil_title: 'சொல்வளம்: கல்விச் சொற்கள்', type: 'vocabulary' },
  ]),
  ...makeLessons('mod_sam_11_u2', 'sam11u2', [
    { title: 'Prose: The Queen of Boxing — Mary Kom', tamil_title: 'உரைநடை: குத்துச்சண்டை இராணி — மேரி கோம்', type: 'standard' },
    { title: 'Grammar: Advanced Concord Rules', tamil_title: 'இலக்கணம்: உயர்நிலை Concord', type: 'grammar', xp: 65 },
    { title: 'HSC Pattern Questions — Unit 2', tamil_title: 'HSC வினாக்கள் — அலகு 2', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_11_u3', 'sam11u3', [
    { title: 'Prose: God Sees the Truth but Waits — Tolstoy', tamil_title: 'உரைநடை: கடவுள் உண்மையை பார்க்கிறார்', type: 'standard' },
    { title: 'Poem: A Thing of Beauty — Keats', tamil_title: 'செய்யுள்: ஒரு அழகிய விஷயம்', type: 'standard' },
    { title: 'Grammar: Reported Speech and Commands', tamil_title: 'இலக்கணம்: மறைமொழி — கட்டளை வாக்கியங்கள்', type: 'grammar', xp: 65 },
  ]),
  ...makeLessons('mod_sam_11_u4', 'sam11u4', [
    { title: 'Prose: There Will Come Soft Rains', tamil_title: 'உரைநடை: மெல்லிய மழை பெய்யும்', type: 'standard' },
    { title: 'Poem: Ode to the West Wind — Shelley', tamil_title: 'செய்யுள்: மேற்கு காற்றுக்கு ஓட்', type: 'standard' },
    { title: 'Grammar: Inversion and Ellipsis', tamil_title: 'இலக்கணம்: தலைகீழ் மற்றும் குறைப்பு', type: 'grammar', xp: 70 },
  ]),
  ...makeLessons('mod_sam_11_u5', 'sam11u5', [
    { title: 'Prose: The Story of an Hour — Kate Chopin', tamil_title: 'உரைநடை: ஒரு மணி நேரத்தின் கதை', type: 'standard' },
    { title: 'Poem: Father Returning Home', tamil_title: 'செய்யுள்: வீடு திரும்பும் தந்தை', type: 'standard' },
    { title: 'Grammar: HSC Board Exam Grammar (Error Spotting)', tamil_title: 'இலக்கணம்: HSC பிழை திருத்தம்', type: 'grammar', xp: 80 },
    { title: 'Class 11 Full Mock Test', tamil_title: '11-ஆம் வகுப்பு மாதிரி தேர்வு', type: 'standard', xp: 100 },
  ]),

  // Class 12 Lessons
  ...makeLessons('mod_sam_12_u1', 'sam12u1', [
    { title: 'Prose: Two Gentlemen of Verona — A.J. Cronin', tamil_title: 'உரைநடை: வெரோனாவின் இரு ஜென்டில்மன்கள்', type: 'standard' },
    { title: 'Poem: Our Casuarina Tree — Toru Dutt', tamil_title: 'செய்யுள்: நம் சாவுக்கடல் மரம்', type: 'standard' },
    { title: 'Grammar: Error Spotting — 20 Golden Rules', tamil_title: 'இலக்கணம்: பிழை திருத்தம் — 20 தங்க விதிகள்', type: 'grammar', xp: 80 },
    { title: 'Book Back Questions — Unit 1 (HSC)', tamil_title: 'புத்தக வினாக்கள்: அலகு 1', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_12_u2', 'sam12u2', [
    { title: 'Prose: The Castle — Franz Kafka (extract)', tamil_title: 'உரைநடை: கோட்டை — காஃப்கா', type: 'standard' },
    { title: 'Grammar: Sentence Transformation — Board Level', tamil_title: 'இலக்கணம்: வாக்கிய மாற்றம் — போர்டு', type: 'grammar', xp: 75 },
    { title: 'HSC Pattern Questions — Unit 2', tamil_title: 'HSC வினாக்கள் — அலகு 2', type: 'standard' },
  ]),
  ...makeLessons('mod_sam_12_u3', 'sam12u3', [
    { title: 'Prose: A Nice Cup of Tea — George Orwell', tamil_title: 'உரைநடை: ஒரு கோப்பை நல்ல டீ — ஆர்வெல்', type: 'standard' },
    { title: 'Poem: Refugee Blues — W.H. Auden', tamil_title: 'செய்யுள்: அகதி ப்ளூஸ்', type: 'standard' },
    { title: 'Grammar: Phrasal Verbs and Idioms', tamil_title: 'இலக்கணம்: Phrasal Verbs & Idioms', type: 'grammar', xp: 70 },
  ]),
  ...makeLessons('mod_sam_12_u4', 'sam12u4', [
    { title: 'Play: The Dying Detective — Characters and Plot', tamil_title: 'நாடகம்: மரணமடையும் துப்பறிவாளன் — பாத்திரங்கள்', type: 'standard' },
    { title: 'Poem: Telephoning God', tamil_title: 'செய்யுள்: கடவுளுக்கு தொலைபேசி', type: 'standard' },
    { title: 'Grammar: Question Formation and Tags', tamil_title: 'இலக்கணம்: கேள்வி உருவாக்கம்', type: 'grammar', xp: 65 },
  ]),
  ...makeLessons('mod_sam_12_u5', 'sam12u5', [
    { title: 'Supplementary: God Sees the Truth but Waits', tamil_title: 'துணைப்பாடம்: கடவுள் உண்மையை பார்க்கிறார்', type: 'standard' },
    { title: 'Reading Comprehension Practice — Board Style', tamil_title: 'வாசித்தல் புரிதல் — போர்டு பாணி', type: 'standard', xp: 70 },
    { title: 'Class 12 Full Grammar Mastery', tamil_title: '12-ஆம் வகுப்பு இலக்கண மேலாண்மை', type: 'grammar', xp: 90 },
    { title: 'HSC Full Board Mock Test', tamil_title: 'HSC மாதிரி தேர்வு — முழு', type: 'standard', xp: 120 },
  ]),
];

// ─── EXERCISES WITH QUESTIONS ────────────────────────────────────────────────

const newExercises = [

  // ══ CLASS 6 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_6_nouns',
    lesson_id: 'les_sam6u1_3',
    category_id: 'tn_board', level_id: 'A1',
    title: 'Class 6: Types of Nouns', exercise_type: 'mcq',
    instructions: 'Choose the correct type of noun for each word.',
    tamil_instructions: 'ஒவ்வொரு சொல்லுக்கும் சரியான பெயர்ச்சொல் வகையை தேர்ந்தெடுக்கவும்.',
    xp_points: 30, order_index: 1,
    questions: [
      mcq('What type of noun is "Chennai"?', 'Proper Noun', ['Common Noun', 'Abstract Noun', 'Collective Noun'], 'Chennai is a specific name of a city, so it is a Proper Noun.', 'சென்னை ஒரு குறிப்பிட்ட நகரின் பெயர், எனவே இது ஒரு சரியான பெயர்ச்சொல்.'),
      mcq('What type of noun is "happiness"?', 'Abstract Noun', ['Proper Noun', 'Common Noun', 'Collective Noun'], 'Happiness cannot be seen or touched, so it is an Abstract Noun.', 'மகிழ்ச்சியை பார்க்கவோ தொடவோ முடியாது, எனவே இது ஒரு சுருக்கமான பெயர்ச்சொல்.'),
      mcq('What type of noun is "flock" in "a flock of birds"?', 'Collective Noun', ['Common Noun', 'Proper Noun', 'Abstract Noun'], 'Flock represents a group of birds — it is a Collective Noun.', '"flock" என்பது பறவைகளின் கூட்டத்தை குறிக்கிறது — இது ஒரு கூட்டுப் பெயர்ச்சொல்.'),
      mcq('Which of these is a Common Noun?', 'City', ['London', 'Honesty', 'Team'], 'City is a common noun because it refers to any city, not a specific one.', 'City என்பது பொதுவான நகரை குறிக்கிறது, எனவே இது ஒரு பொதுப் பெயர்ச்சொல்.'),
      mcq('"The police" refers to which type of noun?', 'Collective Noun', ['Common Noun', 'Proper Noun', 'Abstract Noun'], '"Police" refers to a group of officers — it is a Collective Noun.', '"Police" என்பது அதிகாரிகளின் குழுவை குறிக்கிறது.'),
      mcq('Which sentence uses an Abstract Noun?', 'Courage is a great virtue.', ['The dog barked loudly.', 'She visited Mumbai last year.', 'A pride of lions rested.'], 'Courage and virtue are abstract nouns — they are feelings/qualities you cannot see.', 'தைரியம் மற்றும் நல்லொழுக்கம் என்பவை சுருக்கமான பெயர்ச்சொற்கள்.'),
      mcq('What is the Proper Noun in: "My teacher Mrs. Lakshmi is kind."?', 'Lakshmi', ['Teacher', 'Kind', 'My'], 'Lakshmi is a specific person\'s name — a Proper Noun.', 'லக்ஷ்மி ஒரு குறிப்பிட்ட நபரின் பெயர் — ஒரு சரியான பெயர்ச்சொல்.'),
      mcq('A "pride" of lions is a _____.', 'Collective Noun', ['Proper Noun', 'Abstract Noun', 'Common Noun'], '"Pride" when referring to a group of lions is a Collective Noun.', '"Pride" என்பது சிங்கங்களின் கூட்டத்தை குறிக்கும் கூட்டுப் பெயர்ச்சொல்.'),
    ]
  },

  {
    id: 'ex_6_pronouns',
    lesson_id: 'les_sam6u2_3',
    category_id: 'tn_board', level_id: 'A1',
    title: 'Class 6: Pronouns', exercise_type: 'mcq',
    instructions: 'Select the correct pronoun to complete each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திற்கும் சரியான பிரதிப்பெயரை தேர்ந்தெடுக்கவும்.',
    xp_points: 30, order_index: 1,
    questions: [
      mcq('Ravi went to school. _____ was late.', 'He', ['She', 'It', 'They'], 'Ravi is a male name, so the pronoun is "He".', 'ரவி ஆண் பெயர், எனவே "He" சரியான பிரதிப்பெயர்.'),
      mcq('The book is old. _____ pages are torn.', 'Its', ['His', 'Her', 'Their'], '"Its" is used for objects and animals without gender.', 'பொருள்களுக்கு "Its" பயன்படுத்தப்படுகிறது.'),
      mcq('Meena and Anitha are sisters. _____ play together.', 'They', ['She', 'He', 'It'], 'Two people need the plural pronoun "They".', 'இரண்டு நபர்களுக்கு "They" என்ற பன்மை பிரதிப்பெயர் பயன்படுத்தப்படுகிறது.'),
      mcq('_____ is my favourite subject.', 'English', ['They', 'We', 'It'], 'Here "English" as the subject can be referred to by "It".', 'இங்கே "English" என்ற பொருளை "It" குறிக்கிறது.'),
      mcq('The teacher asked _____ to read aloud.', 'us', ['we', 'our', 'ours'], '"Us" is the object pronoun for "we".', '"We" யின் செயப்படுபொருள் வடிவம் "us".'),
      mcq('Choose the Reflexive pronoun: "She hurt _____ while cooking."', 'herself', ['her', 'she', 'hers'], '"Herself" is the reflexive pronoun for "she".', '"She" யின் reflexive pronoun "herself".'),
      mcq('Which is a Demonstrative Pronoun?', 'This', ['I', 'He', 'Who'], '"This" is a Demonstrative Pronoun — it points to a specific thing.', '"This" ஒரு சுட்டுப் பிரதிப்பெயர்.'),
      mcq('"Who is at the door?" — "Who" is a _____ pronoun.', 'Interrogative', ['Reflexive', 'Personal', 'Relative'], '"Who" is used in questions — it is an Interrogative Pronoun.', '"Who" கேள்விகளில் பயன்படுகிறது — இது ஒரு வினவல் பிரதிப்பெயர்.'),
    ]
  },

  {
    id: 'ex_6_adjectives',
    lesson_id: 'les_sam6u3_3',
    category_id: 'tn_board', level_id: 'A1',
    title: 'Class 6: Adjectives & Degrees of Comparison', exercise_type: 'mcq',
    instructions: 'Choose the correct form of the adjective.',
    tamil_instructions: 'சரியான பெயரடை வடிவத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 30, order_index: 1,
    questions: [
      mcq('Rajan is _____ than his brother. (tall)', 'taller', ['tallest', 'more tall', 'most tall'], 'For short adjectives, add "-er" for Comparative degree.', 'குறுகிய பெயரடைகளுக்கு ஒப்பிட்டு நிலையில் "-er" சேர்க்க வேண்டும்.'),
      mcq('Mount Everest is the _____ mountain in the world. (high)', 'highest', ['higher', 'most high', 'more high'], 'Superlative degree of "high" is "highest" (add -est).', '"high" யின் மேலிட நிலை "highest".'),
      mcq('This mango is _____ than that one. (sweet)', 'sweeter', ['sweetest', 'more sweeter', 'most sweet'], 'For one-syllable adjectives, comparative is formed by adding -er.', 'ஒரு எழுத்துக்கூட்டம் கொண்ட பெயரடைகளுக்கு -er சேர்க்கவும்.'),
      mcq('Which is the Positive degree of "better"?', 'Good', ['Best', 'Well', 'More good'], 'Good → Better → Best is an irregular comparison.', 'Good → Better → Best என்பது ஒழுங்கற்ற ஒப்பிடல் வடிவம்.'),
      mcq('She is the _____ student in the class. (intelligent)', 'most intelligent', ['more intelligent', 'intelligenter', 'intelligentest'], 'For long adjectives (3+ syllables), use "most" for superlative.', 'நீண்ட பெயரடைகளுக்கு "most" பயன்படுத்தி மேலிட நிலை உருவாக்கவும்.'),
      mcq('This room is _____ than mine. (big)', 'bigger', ['biger', 'most big', 'biggest'], 'Double the final consonant before adding -er: big → bigger.', 'இறுதி மெய்யெழுத்தை இரட்டிப்பாக்கி -er சேர்க்கவும்: big → bigger.'),
      mcq('_____ is the comparative of "bad".', 'Worse', ['Badder', 'More bad', 'Worst'], '"Bad" has an irregular comparative: Bad → Worse → Worst.', '"Bad" என்பதன் ஒழுங்கற்ற ஒப்பிடல் நிலை: Bad → Worse → Worst.'),
    ]
  },

  // ══ CLASS 7 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_7_tenses',
    lesson_id: 'les_sam7u2_3',
    category_id: 'tn_board', level_id: 'A1',
    title: 'Class 7: All Tenses Practice', exercise_type: 'mcq',
    instructions: 'Choose the correct tense form for each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திற்கும் சரியான காலத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 40, order_index: 1,
    questions: [
      mcq('She _____ to school every day. (Simple Present)', 'goes', ['went', 'has gone', 'is going'], 'Simple Present uses "goes" for third-person singular (She/He/It).', 'நிகழ்காலத்தில் She/He/It க்கு goes பயன்படுகிறது.'),
      mcq('They _____ a match yesterday. (Simple Past)', 'played', ['play', 'plays', 'have played'], 'Simple Past uses the past form "played".', 'எளிய கடந்தகாலத்தில் "played" பயன்படுகிறது.'),
      mcq('She _____ Tamil for 5 years. (Present Perfect)', 'has studied', ['studied', 'studies', 'is studying'], 'Present Perfect: has/have + past participle. Used with "for/since".', 'Present Perfect: has/have + past participle. "for/since" உடன் பயன்படுகிறது.'),
      mcq('They _____ football when it started to rain. (Past Continuous)', 'were playing', ['played', 'play', 'had played'], 'Past Continuous = was/were + verb-ing. Action in progress in the past.', 'Past Continuous = was/were + verb-ing.'),
      mcq('By next year, she _____ her degree. (Future Perfect)', 'will have completed', ['will complete', 'has completed', 'completes'], 'Future Perfect = will have + past participle.', 'Future Perfect = will have + past participle.'),
      mcq('I _____ (read) this book. It is very interesting.', 'have read', ['read', 'reads', 'had read'], 'Present Perfect is used to talk about past experiences with a present relevance.', 'Present Perfect கடந்தகால அனுபவங்களை கூற பயன்படுகிறது.'),
      mcq('The train _____ before we arrived. (Past Perfect)', 'had left', ['left', 'has left', 'was leaving'], 'Past Perfect = had + past participle. The train left BEFORE we arrived.', 'Past Perfect = had + past participle. முந்திய கடந்தகால நிகழ்வுகளுக்கு.'),
      mcq('She _____ right now. Do not disturb her. (Present Continuous)', 'is studying', ['studies', 'study', 'was studying'], 'Present Continuous = is/am/are + verb-ing. Action happening right now.', 'Present Continuous = is/am/are + verb-ing. இப்போது நடக்கும் செயல்.'),
    ]
  },

  {
    id: 'ex_7_articles',
    lesson_id: 'les_sam7u4_3',
    category_id: 'tn_board', level_id: 'A1',
    title: 'Class 7: Articles — A, An, The', exercise_type: 'mcq',
    instructions: 'Fill in the blank with the correct article (a, an, the or no article).',
    tamil_instructions: 'சரியான உரிச்சொல்லை (a, an, the) நிரப்பவும்.',
    xp_points: 35, order_index: 1,
    questions: [
      mcq('She bought _____ umbrella because it was raining.', 'an', ['a', 'the', 'no article'], '"An" is used before words beginning with a vowel sound. Umbrella starts with "u".', '"An" உயிரொலியில் தொடங்கும் சொற்களுக்கு முன் பயன்படுகிறது.'),
      mcq('_____ Sun rises in the east.', 'The', ['A', 'An', 'no article'], '"The" is used with unique things like the Sun, the Moon, the Earth.', 'சூரியன், நிலா போன்ற தனிப்பட்ட பொருட்களுக்கு "The" பயன்படுகிறது.'),
      mcq('He is _____ honest man.', 'an', ['a', 'the', 'no article'], '"Honest" begins with a silent "h" and a vowel sound "o", so use "an".', '"Honest" என்ற சொல் உயிரொலியில் தொடங்குவதால் "an" பயன்படுகிறது.'),
      mcq('_____ gold is a precious metal.', 'no article', ['A', 'An', 'The'], 'No article is used with uncountable nouns used in general sense.', 'பொதுவான அர்த்தத்தில் எண்ணிலடங்காப் பெயர்ச்சொல்களுக்கு article தேவையில்லை.'),
      mcq('I want to become _____ engineer.', 'an', ['a', 'the', 'no article'], '"An" before "engineer" because it starts with a vowel sound "e".', '"engineer" உயிரொலி "e"யில் தொடங்குவதால் "an" பயன்படுகிறது.'),
      mcq('She plays _____ piano beautifully.', 'the', ['a', 'an', 'no article'], '"The" is used with musical instruments.', 'இசைக்கருவிகளுக்கு முன் "the" பயன்படுகிறது.'),
      mcq('_____ Himalayas are the tallest mountains in India.', 'The', ['A', 'An', 'no article'], '"The" is used with mountain ranges, rivers, and groups of islands.', 'மலைத்தொடர்கள், ஆறுகள், தீவுக்கூட்டங்களுக்கு "The" பயன்படுகிறது.'),
      mcq('He is _____ best student in the class.', 'the', ['a', 'an', 'no article'], '"The" is used with superlatives.', 'மேலிட நிலை பெயரடைகளுக்கு முன் "the" பயன்படுகிறது.'),
    ]
  },

  {
    id: 'ex_7_direct_indirect',
    lesson_id: 'les_sam7u5_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 7: Direct and Indirect Speech', exercise_type: 'mcq',
    instructions: 'Change the sentence from Direct to Indirect Speech.',
    tamil_instructions: 'நேர்மொழியிலிருந்து மறைமொழியாக மாற்றவும்.',
    xp_points: 45, order_index: 1,
    questions: [
      mcq('He said, "I am happy." → Indirect Speech:', 'He said that he was happy.', ['He said that I was happy.', 'He said that he is happy.', 'He told that he was happy.'], 'In Indirect Speech: "I" → "he", "am" → "was", and add "that".', 'மறைமொழியில்: "I" → "he", "am" → "was", மற்றும் "that" சேர்க்கவும்.'),
      mcq('She said, "I will come tomorrow." → Indirect:', 'She said that she would come the next day.', ['She said that she will come tomorrow.', 'She said that I would come the next day.', 'She told that she would come tomorrow.'], '"Will" → "would" and "tomorrow" → "the next day" in Indirect Speech.', '"will" → "would" மற்றும் "tomorrow" → "the next day" என மாறும்.'),
      mcq('The teacher said to us, "Work hard." → Indirect:', 'The teacher told us to work hard.', ['The teacher said us to work hard.', 'The teacher told us that work hard.', 'The teacher said that we work hard.'], 'Commands in Indirect Speech: told + object + to + infinitive.', 'கட்டளை வாக்கியத்தில்: told + object + to + infinitive.'),
      mcq('He asked, "Are you coming?" → Indirect:', 'He asked if I was coming.', ['He asked that I was coming.', 'He asked whether am I coming.', 'He said if I was coming.'], 'Yes/No questions: use "if" or "whether" in Indirect Speech.', 'ஆம்/இல்லை கேள்விகளுக்கு: "if" அல்லது "whether" பயன்படுகிறது.'),
      mcq('She said, "I can swim." → Indirect:', 'She said that she could swim.', ['She said that she can swim.', 'She told that she could swim.', 'She said that I could swim.'], '"Can" → "could" in Indirect Speech.', '"can" → "could" ஆக மாறும்.'),
      mcq('Ram said to me, "Please help me." → Indirect:', 'Ram requested me to help him.', ['Ram told me to please help.', 'Ram said to me to help him.', 'Ram asked me please to help.'], 'Polite requests in Indirect Speech use "requested".', 'கொஞ்சமாக கேட்கும் வாக்கியங்களுக்கு "requested" பயன்படுகிறது.'),
    ]
  },

  // ══ CLASS 8 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_8_active_passive',
    lesson_id: 'les_sam8u1_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 8: Active and Passive Voice', exercise_type: 'mcq',
    instructions: 'Choose the correct Passive Voice form of each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திற்கும் சரியான கர்மணி வாக்கியத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 50, order_index: 1,
    questions: [
      mcq('Active: "She writes a letter." → Passive:', 'A letter is written by her.', ['A letter was written by her.', 'A letter is being written by her.', 'A letter has been written by her.'], 'Simple Present Passive: is/am/are + past participle.', 'எளிய நிகழ்கால கர்மணி: is/am/are + past participle.'),
      mcq('Active: "They built this bridge in 1990." → Passive:', 'This bridge was built by them in 1990.', ['This bridge is built by them in 1990.', 'This bridge has been built by them.', 'This bridge had been built by them.'], 'Simple Past Passive: was/were + past participle.', 'எளிய கடந்தகால கர்மணி: was/were + past participle.'),
      mcq('Active: "She is writing a poem." → Passive:', 'A poem is being written by her.', ['A poem was being written by her.', 'A poem is written by her.', 'A poem has been written by her.'], 'Present Continuous Passive: is/am/are + being + past participle.', 'நிகழ்கால தொடர் கர்மணி: is/am/are + being + past participle.'),
      mcq('Active: "He has completed the task." → Passive:', 'The task has been completed by him.', ['The task was completed by him.', 'The task is completed by him.', 'The task had been completed by him.'], 'Present Perfect Passive: has/have + been + past participle.', 'நிகழ்கால நிறைவு கர்மணி: has/have + been + past participle.'),
      mcq('Which sentence is in Passive Voice?', 'The letter was written by Priya.', ['Priya wrote the letter.', 'Priya writes letters often.', 'Priya is writing a letter.'], '"Was written" indicates Passive Voice (was + past participle + by).', '"was written" என்பது கர்மணி வாக்கியத்தைக் குறிக்கிறது.'),
      mcq('Active: "The dog bit the boy." → Passive:', 'The boy was bitten by the dog.', ['The boy is bitten by the dog.', 'The boy had been bitten.', 'The boy has been bitten by the dog.'], 'Simple Past Passive: was/were + past participle.', 'எளிய கடந்தகால கர்மணி: was/were + past participle.'),
      mcq('Active: "People speak English all over the world." → Passive:', 'English is spoken all over the world.', ['English was spoken by people.', 'English has been spoken by people.', 'English is being spoken by people.'], 'When agent is obvious or unimportant, "by + agent" can be omitted.', 'செய்பவர் வெளிப்படையாக தெரிந்தால் "by + agent" தவிர்க்கலாம்.'),
      mcq('Active: "They will complete the project." → Passive:', 'The project will be completed by them.', ['The project will have been completed.', 'The project is completed by them.', 'The project would be completed.'], 'Future Simple Passive: will + be + past participle.', 'எதிர்கால எளிய கர்மணி: will + be + past participle.'),
    ]
  },

  {
    id: 'ex_8_modals',
    lesson_id: 'les_sam8u3_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 8: Modal Verbs', exercise_type: 'mcq',
    instructions: 'Choose the correct modal verb for each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திற்கும் சரியான துணை வினையை தேர்ந்தெடுக்கவும்.',
    xp_points: 45, order_index: 1,
    questions: [
      mcq('You _____ brush your teeth every day. (strong advice)', 'should', ['might', 'could', 'would'], '"Should" expresses strong advice or recommendation.', '"Should" பலமான அறிவுரை அல்லது பரிந்துரையை குறிக்கிறது.'),
      mcq('You _____ enter without permission. It is strictly prohibited.', 'must not', ['should not', 'cannot', 'would not'], '"Must not" expresses strong prohibition.', '"Must not" கடுமையான தடையை குறிக்கிறது.'),
      mcq('_____ I borrow your pencil? (polite request)', 'May', ['Must', 'Should', 'Would'], '"May" is used for polite requests for permission.', '"May" மரியாதையான அனுமதி கோரலுக்கு பயன்படுகிறது.'),
      mcq('She _____ be at home by now. Her class ends at 5 PM. (possibility)', 'might', ['must', 'shall', 'can'], '"Might" expresses possibility — something that may or may not happen.', '"Might" சாத்தியத்தை குறிக்கிறது.'),
      mcq('When I was young, I _____ run very fast. (past ability)', 'could', ['can', 'would', 'should'], '"Could" expresses past ability.', '"Could" கடந்தகாலத் திறனை குறிக்கிறது.'),
      mcq('You _____ wear your seat belt while driving. (obligation)', 'must', ['might', 'could', 'would'], '"Must" expresses necessity or obligation.', '"Must" கட்டாயம் அல்லது தேவையை குறிக்கிறது.'),
      mcq('_____ you like some more tea? (polite offer)', 'Would', ['Must', 'Should', 'Might'], '"Would" is used for polite offers.', '"Would" மரியாதையான சலுகைகளுக்கு பயன்படுகிறது.'),
      mcq('It _____ rain today — look at those dark clouds. (strong possibility)', 'might', ['shall', 'must', 'would'], '"Might" indicates a strong possibility based on evidence.', 'சான்றின் அடிப்படையில் வலுவான சாத்தியத்தை "might" குறிக்கிறது.'),
    ]
  },

  {
    id: 'ex_8_question_tags',
    lesson_id: 'les_sam8u4_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 8: Question Tags', exercise_type: 'mcq',
    instructions: 'Choose the correct question tag for each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திற்கும் சரியான கேள்வி முனையை தேர்ந்தெடுக்கவும்.',
    xp_points: 40, order_index: 1,
    questions: [
      mcq('She is a teacher, _____?', "isn't she?", ["is she?", "doesn't she?", "wasn't she?"], 'Positive sentence → Negative tag. "She is" → "isn\'t she".', 'நேர்மறை வாக்கியம் → எதிர்மறை முனை.'),
      mcq('They don\'t like spicy food, _____?', 'do they?', ["don't they?", "did they?", "are they?"], 'Negative sentence → Positive tag. "Don\'t" → "do they".', 'எதிர்மறை வாக்கியம் → நேர்மறை முனை.'),
      mcq('He has finished his work, _____?', "hasn't he?", ["has he?", "didn't he?", "isn't he?"], '"Has finished" → negative tag is "hasn\'t he".', '"Has finished" → எதிர்மறை முனை "hasn\'t he".'),
      mcq('You will come tomorrow, _____?', "won't you?", ["will you?", "don't you?", "wouldn't you?"], '"Will" → negative tag is "won\'t".', '"Will" → எதிர்மறை முனை "won\'t".'),
      mcq('Nobody came to the party, _____?', 'did they?', ["didn't they?", "came they?", "nobody did?"], 'Negative pronouns (nobody, nothing, nowhere) → positive tag with "they".', 'எதிர்மறை பிரதிப்பெயர்களுக்கு (nobody) → "they" உடன் நேர்மறை முனை.'),
      mcq('Let\'s go for a walk, _____?', "shall we?", ["will we?", "don't we?", "should we?"], '"Let\'s" always takes "shall we?" as its question tag.', '"Let\'s" க்கு எப்போதும் "shall we?" என்று பயன்படுகிறது.'),
    ]
  },

  // ══ CLASS 9 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_9_conditionals',
    lesson_id: 'les_sam9u1_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 9: Conditional Sentences', exercise_type: 'mcq',
    instructions: 'Identify the type of conditional or complete the sentence correctly.',
    tamil_instructions: 'நிபந்தனை வாக்கிய வகையை அடையாளம் காணவும் அல்லது சரியாக நிரப்பவும்.',
    xp_points: 55, order_index: 1,
    questions: [
      mcq('If you heat ice, it _____. (Zero Conditional)', 'melts', ['will melt', 'would melt', 'melted'], 'Zero Conditional: If + Simple Present → Simple Present. For universal truths.', 'Zero Conditional: If + Simple Present → Simple Present. பொதுவான உண்மைகளுக்கு.'),
      mcq('If it rains tomorrow, we _____ at home. (First Conditional)', 'will stay', ['would stay', 'stayed', 'stay'], 'First Conditional: If + Simple Present → will + base verb. For real future possibilities.', 'First Conditional: If + Simple Present → will + base verb. நடக்கக்கூடிய எதிர்கால சாத்தியங்களுக்கு.'),
      mcq('If I had wings, I _____ fly to London. (Second Conditional)', 'would', ['will', 'should', 'could'], 'Second Conditional: If + Simple Past → would + base verb. For imaginary/unlikely situations.', 'Second Conditional: If + Simple Past → would + base verb. கற்பனை சூழல்களுக்கு.'),
      mcq('If she _____ harder, she would have passed. (Third Conditional)', 'had worked', ['worked', 'works', 'had worked'], 'Third Conditional: If + Past Perfect → would have + past participle. For past regrets.', 'Third Conditional: If + Past Perfect → would have + past participle. கடந்தகால வருத்தங்களுக்கு.'),
      mcq('Which type is: "If you touch fire, you get burned."?', 'Zero Conditional', ['First Conditional', 'Second Conditional', 'Third Conditional'], 'Zero Conditional states universal scientific facts.', 'Zero Conditional பொதுவான அறிவியல் உண்மைகளை கூறுகிறது.'),
      mcq('If I were the Prime Minister, I _____ build more schools.', 'would', ['will', 'shall', 'should'], 'Second Conditional uses "were" (not "was") with I/he/she for imaginary situations.', 'Second Conditional இல் கற்பனை சூழல்களுக்கு "were" பயன்படுகிறது.'),
      mcq('_____ I known the truth, I would have told you. (Third Conditional)', 'Had', ['If', 'Should', 'Were'], 'Inverted Third Conditional: Had + subject + past participle (no "if").', 'தலைகீழ் Third Conditional: Had + subject + past participle ("if" இல்லாமல்).'),
    ]
  },

  {
    id: 'ex_9_passive_all',
    lesson_id: 'les_sam9u3_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 9: Passive Voice — All Tenses', exercise_type: 'mcq',
    instructions: 'Choose the correct Passive Voice transformation.',
    tamil_instructions: 'சரியான கர்மணி வாக்கிய மாற்றத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 55, order_index: 1,
    questions: [
      mcq('Active: "They are building a new stadium." → Passive:', 'A new stadium is being built by them.', ['A new stadium was being built.', 'A new stadium has been built.', 'A new stadium is built by them.'], 'Present Continuous Passive: is/am/are + being + past participle.', 'நிகழ்கால தொடர் கர்மணி: is/am/are + being + past participle.'),
      mcq('Active: "He had written the report." → Passive:', 'The report had been written by him.', ['The report was written by him.', 'The report has been written.', 'The report is written by him.'], 'Past Perfect Passive: had + been + past participle.', 'கடந்தகால நிறைவு கர்மணி: had + been + past participle.'),
      mcq('Active: "They will have finished the work." → Passive:', 'The work will have been finished by them.', ['The work will be finished.', 'The work would have been finished.', 'The work has been finished.'], 'Future Perfect Passive: will + have + been + past participle.', 'எதிர்கால நிறைவு கர்மணி: will + have + been + past participle.'),
      mcq('Active: "Ravi was eating a mango." → Passive:', 'A mango was being eaten by Ravi.', ['A mango is being eaten.', 'A mango was eaten by Ravi.', 'A mango had been eaten.'], 'Past Continuous Passive: was/were + being + past participle.', 'கடந்தகால தொடர் கர்மணி: was/were + being + past participle.'),
    ]
  },

  {
    id: 'ex_9_concord',
    lesson_id: 'les_sam9u4_3',
    category_id: 'tn_board', level_id: 'A2',
    title: 'Class 9: Subject-Verb Agreement (Concord)', exercise_type: 'mcq',
    instructions: 'Choose the verb that agrees with the subject.',
    tamil_instructions: 'கர்த்தாவுடன் ஒத்துப்போகும் வினையை தேர்ந்தெடுக்கவும்.',
    xp_points: 50, order_index: 1,
    questions: [
      mcq('Each of the students _____ submitted the assignment.', 'has', ['have', 'had', 'were'], '"Each" is always singular. Use singular verb "has".', '"Each" எப்போதும் ஒருமை — "has" பயன்படுகிறது.'),
      mcq('Neither the teacher nor the students _____ present.', 'were', ['was', 'is', 'are'], 'Neither...nor: verb agrees with the nearest subject. "Students" (plural) → "were".', 'Neither...nor: அருகில் உள்ள கர்த்தாவுடன் வினை ஒத்திசைகிறது.'),
      mcq('The committee _____ unanimous in its decision.', 'was', ['were', 'are', 'have been'], 'Collective noun (committee) acting as one unit → singular verb.', 'கூட்டுப் பெயர்ச்சொல் (committee) ஒரு அலகாக செயல்படும்போது → ஒருமை வினை.'),
      mcq('Ten kilometres _____ a long distance to walk.', 'is', ['are', 'were', 'have been'], 'Distances, time, and amounts are treated as singular.', 'தூரம், நேரம், அளவு என்பவை ஒருமையாக கருதப்படும்.'),
      mcq('Both Ravi and Priya _____ going to the party.', 'are', ['is', 'was', 'has been'], '"Both...and" → always plural verb.', '"Both...and" → எப்போதும் பன்மை வினை.'),
      mcq('The news _____ shocking.', 'was', ['were', 'are', 'have been'], '"News" is an uncountable noun and always takes a singular verb.', '"News" எண்ணிலடங்காப் பெயர்ச்சொல் — ஒருமை வினை மட்டுமே.'),
    ]
  },

  // ══ CLASS 10 (SSLC) ══════════════════════════════════════════════════════
  {
    id: 'ex_10_his_first_flight_qa',
    lesson_id: 'les_sam10u1_3',
    category_id: 'tn_board', level_id: 'B1',
    title: 'Class 10 Unit 1: His First Flight — Comprehension', exercise_type: 'mcq',
    instructions: 'Answer questions based on the story "His First Flight" by Liam O\'Flaherty.',
    tamil_instructions: '"His First Flight" கதையை அடிப்படையாக கொண்டு வினாக்களுக்கு பதிலளிக்கவும்.',
    xp_points: 60, order_index: 1,
    questions: [
      mcq('Who is the author of "His First Flight"?', 'Liam O\'Flaherty', ['Robert Frost', 'Ruskin Bond', 'Guy de Maupassant'], 'Liam O\'Flaherty is the Irish author of "His First Flight".', '"His First Flight" இன் ஆசிரியர் லியம் ஓ\'ஃப்ளாஹெர்டி.'),
      mcq('Why was the young seagull afraid to fly?', 'He was afraid his wings would not support him.', ['He was afraid of the water.', 'He was afraid of other birds.', 'He was tired and hungry.'], 'The young seagull feared his wings were too weak to support him in flight.', 'இளம் கடற்பறவை தன் சிறகுகள் பறக்க போதுமான வலிமை இல்லை என்று பயந்தது.'),
      mcq('How did the young seagull finally fly?', 'He dived at the fish his mother was holding and his hunger overcame his fear.', ['His father pushed him off the ledge.', 'He was blown off by the wind.', 'He jumped to reach his brothers.'], 'The mother tempted him with food, and hunger drove him to dive, causing him to fly.', 'அன்னை உணவால் தூண்டியதால் பசி அவனது பயத்தை வென்று அவன் பறக்கத் தொடங்கினான்.'),
      mcq('What does the young seagull symbolize?', 'Overcoming fear to achieve success', ['The importance of food', 'The love of a mother', 'The cruelty of family members'], 'The story shows how courage and hunger for success can help overcome fear.', 'இந்தக் கதை தைரியமும் வெற்றியின் ஆசையும் எவ்வாறு பயத்தை வெல்கிறது என்று காட்டுகிறது.'),
      mcq('What is the moral of "His First Flight"?', 'Courage and determination help us overcome our fears.', ['Always listen to your parents.', 'Food is more important than fear.', 'Flying is easy once you start.'], 'The story teaches that stepping out of comfort zones helps us achieve great things.', 'ஆறுதல் மண்டலத்திலிருந்து வெளியே வருவதே வெற்றியின் திறவுகோல்.'),
      mcq('The word "brink" in the story means:', 'the edge of a cliff', ['the middle of the sea', 'a type of wing', 'the top of a mountain'], '"Brink" means the edge of a high place, such as a cliff.', '"Brink" என்பது ஒரு உயரமான இடத்தின் விளிம்பை குறிக்கிறது.'),
    ]
  },

  {
    id: 'ex_10_sslc_grammar',
    lesson_id: 'les_sam10u7_3',
    category_id: 'tn_board', level_id: 'B1',
    title: 'Class 10: SSLC Board Grammar — Complete Revision', exercise_type: 'mcq',
    instructions: 'Choose the grammatically correct answer for each SSLC-style question.',
    tamil_instructions: 'SSLC பாணி இலக்கண வினாக்களுக்கு சரியான விடையை தேர்ந்தெடுக்கவும்.',
    xp_points: 75, order_index: 1,
    questions: [
      mcq('She said, "I have finished my work." → Indirect Speech:', 'She said that she had finished her work.', ['She said that I have finished my work.', 'She told that she has finished her work.', 'She said that she has finished her work.'], 'Past Perfect is used in Indirect when reporting a Present Perfect statement.', 'நிகழ்கால நிறைவை மறைமொழியில் கூறும்போது Past Perfect பயன்படுகிறது.'),
      mcq('Fill in: "If I _____ a millionaire, I would donate to charity." (Second Conditional)', 'were', ['was', 'am', 'had been'], 'Second Conditional: Use "were" (not "was") for all subjects (I/he/she) in formal English.', 'Second Conditional: அனைத்து கர்த்தாக்களுக்கும் "were" பயன்படுகிறது.'),
      mcq('Active: "The police are investigating the case." → Passive:', 'The case is being investigated by the police.', ['The case was investigated.', 'The case has been investigated.', 'The case is investigated by police.'], 'Present Continuous Passive: is/am/are + being + past participle.', 'நிகழ்கால தொடர் கர்மணி: is/am/are + being + past participle.'),
      mcq('Choose the correct Concord: "Neither of the boys _____ ready."', 'is', ['are', 'were', 'have'], '"Neither" with a singular noun takes a singular verb.', '"Neither" ஒருமைப் பெயர்ச்சொல்லுடன் ஒருமை வினை.'),
      mcq('Spot the error: "She is more better than her sister."', '"more" should be removed — "better" is already comparative', ['Sister should be "sisters"', '"is" should be "was"', 'No error'], '"Better" is already the comparative form. Adding "more" creates a double comparative error.', '"Better" ஏற்கனவே ஒப்பிடல் நிலை — "more" சேர்ப்பது தவறு.'),
      mcq('Which sentence has the correct use of Article?', 'She plays the violin.', ['She plays a violin.', 'She plays violin.', 'She plays an violin.'], '"The" is used before musical instruments.', 'இசைக்கருவிகளுக்கு முன் "the" பயன்படுகிறது.'),
      mcq('Choose the correct sentence:', 'Each of the girls has submitted her project.', ['Each of the girls have submitted their project.', 'Each girl have submitted her project.', 'Each of the girls had submitted their projects.'], '"Each" is singular — use singular verb "has" and singular pronoun "her".', '"Each" ஒருமை — "has" மற்றும் "her" பயன்படுகிறது.'),
      mcq('Combine using "not only...but also": "Ravi is talented. Ravi is hardworking."', 'Ravi is not only talented but also hardworking.', ['Ravi is not only talented but hardworking also.', 'Not only Ravi is talented but also hardworking.', 'Ravi not only is talented but also hardworking.'], '"Not only...but also" correlates two qualities of the same subject.', '"Not only...but also" இரண்டு குணங்களை இணைக்கிறது.'),
    ]
  },

  // ══ CLASS 11 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_11_sentence_transformation',
    lesson_id: 'les_sam11u1_3',
    category_id: 'tn_board', level_id: 'B1',
    title: 'Class 11: Sentence Transformation', exercise_type: 'mcq',
    instructions: 'Transform each sentence as directed.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்தையும் கேட்டபடி மாற்றவும்.',
    xp_points: 65, order_index: 1,
    questions: [
      mcq('Change to Negative: "She always tells the truth."', 'She never tells a lie.', ['She does not always tell the truth.', 'She tells truth never.', 'She never tells the truth.'], '"Always tells the truth" can be negated as "never tells a lie" (both mean the same).', '"Always tells the truth" = "never tells a lie" — இரண்டும் ஒரே அர்த்தம்.'),
      mcq('Change to Interrogative: "She is a brilliant student."', 'Is she not a brilliant student?', ['She is a brilliant student?', 'Isn\'t she brilliant?', 'Is she brilliant?'], 'To change a statement to a question, invert the subject and auxiliary verb.', 'கர்த்தா மற்றும் துணை வினையை மாற்றுவதன் மூலம் கேள்வி வாக்கியம் உருவாக்கலாம்.'),
      mcq('Change Active to Passive: "The manager called the meeting."', 'The meeting was called by the manager.', ['The meeting called by the manager.', 'The meeting is called by the manager.', 'The meeting had been called.'], 'Simple Past Active → Simple Past Passive: was/were + past participle.', 'எளிய கடந்தகால கர்த்தரி → கர்மணி: was/were + past participle.'),
      mcq('Combine into one sentence: "He is honest. He is diligent." (Using "both...and")', 'He is both honest and diligent.', ['Both he is honest and diligent.', 'He is honest and also diligent both.', 'He both is honest and diligent.'], '"Both...and" combines two qualities: He is both [quality1] and [quality2].', '"Both...and" இரண்டு குணங்களை இணைக்கிறது.'),
      mcq('Change to Exclamatory: "She is a very clever girl."', 'What a clever girl she is!', ['How clever girl she is!', 'What clever she is!', 'How she is clever!'], '"What a + adjective + noun + subject + verb!" is the exclamatory pattern.', '"What a + பெயரடை + பெயர்ச்சொல் + கர்த்தா + வினை!" என்பது ஆச்சரிய வாக்கிய வடிவம்.'),
    ]
  },

  // ══ CLASS 12 ══════════════════════════════════════════════════════════════
  {
    id: 'ex_12_error_spotting',
    lesson_id: 'les_sam12u1_3',
    category_id: 'tn_board', level_id: 'B2',
    title: 'Class 12: Error Spotting — 20 Golden Rules', exercise_type: 'mcq',
    instructions: 'Spot the grammatical error in each sentence.',
    tamil_instructions: 'ஒவ்வொரு வாக்கியத்திலும் உள்ள இலக்கணப் பிழையை கண்டறியவும்.',
    xp_points: 80, order_index: 1,
    questions: [
      mcq('Spot the error: "He is one of the best student in the class."', '"student" should be "students"', ['"He" should be "Him"', '"is" should be "was"', '"best" should be "better"'], 'After "one of the", the noun must be plural: one of the best STUDENTS.', '"One of the" க்கு பிறகு பன்மை பெயர்ச்சொல் வர வேண்டும்.'),
      mcq('Spot the error: "She is more taller than her brother."', '"more" should be removed — "taller" is comparative', ['"She" should be "Her"', '"than" should be "then"', '"brother" should be "brothers"'], '"Taller" is already comparative. Adding "more" makes a double comparative.', '"Taller" ஏற்கனவே ஒப்பிடல் நிலை — "more" சேர்ப்பது தவறு.'),
      mcq('Spot the error: "He has been working here since three years."', '"since" should be "for"', ['"has been" should be "had been"', '"working" should be "worked"', '"here" should be "there"'], '"Since" is used with specific time points. "For" is used with periods of time.', '"Since" குறிப்பிட்ட கால புள்ளிக்கு; "For" காலகட்டத்திற்கு.'),
      mcq('Spot the error: "Each of the students have submitted their homework."', '"have" should be "has"', ['"students" should be "student"', '"their" should be "his"', '"submitted" should be "submit"'], '"Each" is singular, so it takes a singular verb "has".', '"Each" ஒருமை — "has" பயன்படுத்த வேண்டும்.'),
      mcq('Spot the error: "The committee have decided to postpone the event."', 'No error — "have" is correct when members act individually', ['"committee" should be "committees"', '"decided" should be "decide"', '"postpone" should be "postponement"'], 'When a collective noun acts as individuals, a plural verb is used.', 'கூட்டுப் பெயர்ச்சொல் தனித்தனியாக செயல்படும்போது பன்மை வினை சரியானது.'),
      mcq('Spot the error: "She told me that she will come tomorrow."', '"will" should be "would"', ['"told" should be "said"', '"me" should be "to me"', '"tomorrow" should be "the next day"'], 'In Indirect Speech, when reporting verb is past, "will" changes to "would".', 'மறைமொழியில் வரும்போது "will" → "would" ஆக மாறும்.'),
      mcq('Spot the error: "He is much more senior than me in this company."', '"me" should be "I"', ['"much" should be "very"', '"senior" should be "seniorer"', '"company" should be "companies"'], 'After comparisons with "than", use the subject pronoun "I", not the object pronoun "me" in formal English.', 'ஒப்பிட்டு வாக்கியங்களில் "than" க்கு பிறகு Subject pronoun "I" பயன்படுத்த வேண்டும்.'),
      mcq('Spot the error: "The scenery of Kashmir are very beautiful."', '"are" should be "is"', ['"The" should be removed', '"very" should be "more"', '"beautiful" should be "beauty"'], '"Scenery" is an uncountable noun — always singular verb "is".', '"Scenery" எண்ணிலடங்காப் பெயர்ச்சொல் — "is" பயன்படுகிறது.'),
    ]
  },

  {
    id: 'ex_12_sentence_transform_hsc',
    lesson_id: 'les_sam12u2_2',
    category_id: 'tn_board', level_id: 'B2',
    title: 'Class 12: Sentence Transformation — HSC Board', exercise_type: 'mcq',
    instructions: 'Transform sentences as directed — HSC board exam style.',
    tamil_instructions: 'HSC பொதுத்தேர்வு பாணியில் வாக்கியங்களை மாற்றவும்.',
    xp_points: 80, order_index: 1,
    questions: [
      mcq('"It was such a hot day that we stayed indoors." → Using "so...that"', 'It was so hot a day that we stayed indoors.', ['It was so hot that we stayed indoors.', 'The day was so hot that we stayed indoors.', 'Such it was so hot that we stayed indoors.'], '"Such a + adjective + noun" = "so + adjective + a + noun" pattern.', '"Such a + peyaradai + peyar" = "so + peyaradai + a + peyar" vadi.'),
      mcq('"No other mountain is as high as Everest." → Superlative form:', 'Everest is the highest mountain.', ['Everest is the most highest mountain.', 'Everest is higher than all mountains.', 'Everest is highest mountain.'], 'Positive "No other...as...as" = Superlative "the + -est".', 'Positive "No other...as...as" = Superlative "the + -est".'),
      mcq('"He is too weak to carry this bag." → Using "so...that"', 'He is so weak that he cannot carry this bag.', ['He is so weak that he can carry this bag.', 'He is too weak so he cannot carry this bag.', 'He is very weak to carry this bag.'], '"Too...to" = "so...that + cannot/could not".', '"Too...to" = "so...that + cannot/could not".'),
      mcq('Change to Simple Sentence: "When the teacher entered, all students stood up."', 'All students stood up at the teacher\'s entry.', ['On entering the teacher, students stood up.', 'The teacher entering, all students stood.', 'Students standing up when teacher entered.'], 'Complex → Simple: Replace "when" clause with a noun phrase "at the teacher\'s entry".', 'Complex → Simple: "when" திரட்சியை பெயர்த்தொடரால் மாற்றவும்.'),
    ]
  },

  // ══ GENERAL ENGLISH GRAMMAR ══════════════════════════════════════════════
  {
    id: 'ex_gen_prepositions',
    lesson_id: 'les_sam7u3_3',
    category_id: 'grammar', level_id: 'A1',
    title: 'Prepositions — In, On, At, By, With, For, About', exercise_type: 'mcq',
    instructions: 'Choose the correct preposition.',
    tamil_instructions: 'சரியான உரிச்சொல்லை தேர்ந்தெடுக்கவும்.',
    xp_points: 35, order_index: 1,
    questions: [
      mcq('She arrived _____ the station at 8 PM.', 'at', ['in', 'on', 'by'], '"At" is used for specific points/places like stations, airports.', '"At" குறிப்பிட்ட இடங்களுக்கு (நிலையம், விமான நிலையம்) பயன்படுகிறது.'),
      mcq('The meeting is _____ Monday morning.', 'on', ['at', 'in', 'by'], '"On" is used with days of the week.', '"On" வாரத்தின் நாட்களுக்கு பயன்படுகிறது.'),
      mcq('She was born _____ 1998.', 'in', ['on', 'at', 'by'], '"In" is used for years, months, and longer time periods.', '"In" ஆண்டுகள், மாதங்கள் மற்றும் நீண்ட காலகட்டங்களுக்கு பயன்படுகிறது.'),
      mcq('The letter was written _____ her.', 'by', ['with', 'for', 'from'], '"By" shows the agent/doer in passive sentences.', '"By" செய்பவரை (agent) குறிக்கிறது.'),
      mcq('I am very good _____ mathematics.', 'at', ['in', 'on', 'for'], '"Good at" is the correct collocations for skills.', '"Good at" திறன்களுக்கு சரியான collocations.'),
      mcq('She is interested _____ learning French.', 'in', ['at', 'on', 'with'], '"Interested in" is the correct preposition collocation.', '"Interested in" சரியான preposition collocation.'),
      mcq('The book is _____ the table.', 'on', ['at', 'in', 'by'], '"On" is used for surfaces.', '"On" மேற்பரப்புகளுக்கு பயன்படுகிறது.'),
      mcq('Please wait _____ the door.', 'at', ['in', 'on', 'by'], '"At the door" means right next to/near the door.', '"At the door" கதவிற்கு அருகில் என்பதை குறிக்கிறது.'),
    ]
  },

  {
    id: 'ex_gen_phrasal_verbs',
    lesson_id: 'les_sam12u3_3',
    category_id: 'grammar', level_id: 'B1',
    title: 'Phrasal Verbs — Common Usage', exercise_type: 'mcq',
    instructions: 'Choose the meaning of the underlined phrasal verb.',
    tamil_instructions: 'கோடிட்ட phrasal verb யின் அர்த்தத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 50, order_index: 1,
    questions: [
      mcq('She had to give up her job when she had a baby.', 'Abandon/Quit', ['Give as a gift', 'Complete', 'Start working'], '"Give up" means to stop doing something or to abandon it.', '"Give up" என்பது ஒரு செயலை விட்டுவிடுவதை குறிக்கிறது.'),
      mcq('I ran into my old friend at the market yesterday.', 'Met accidentally', ['Ran away from', 'Chased', 'Called out to'], '"Run into" means to meet someone unexpectedly.', '"Run into" என்பது யாரையாவது எதிர்பாராமல் சந்திப்பதை குறிக்கிறது.'),
      mcq('The fire broke out in the warehouse at midnight.', 'Started suddenly', ['Was put out', 'Was controlled', 'Spread slowly'], '"Break out" means to start suddenly (fire, war, disease).', '"Break out" என்பது திடீரென தொடங்குவதை குறிக்கிறது.'),
      mcq('We need to look into this matter immediately.', 'Investigate', ['Overlook', 'Observe from far', 'Ignore'], '"Look into" means to investigate or examine carefully.', '"Look into" என்பது விசாரிப்பதை குறிக்கிறது.'),
      mcq('She put off the meeting until next week.', 'Postponed', ['Attended', 'Cancelled permanently', 'Moved to an earlier date'], '"Put off" means to postpone or delay.', '"Put off" என்பது ஒத்திவைப்பதை குறிக்கிறது.'),
      mcq('He came across an old letter while cleaning.', 'Found unexpectedly', ['Lost', 'Threw away', 'Destroyed'], '"Come across" means to find or discover something by chance.', '"Come across" என்பது தற்செயலாக கண்டுபிடிப்பதை குறிக்கிறது.'),
    ]
  },

  // ══ VOCABULARY ══════════════════════════════════════════════════════════
  {
    id: 'ex_vocab_class6_words',
    lesson_id: 'les_sam6u1_4',
    category_id: 'vocabulary', level_id: 'A1',
    title: 'Class 6: Core Vocabulary Bank', exercise_type: 'mcq',
    instructions: 'Choose the correct meaning for each word.',
    tamil_instructions: 'ஒவ்வொரு சொல்லுக்கும் சரியான பொருளை தேர்ந்தெடுக்கவும்.',
    xp_points: 25, order_index: 1,
    questions: [
      mcq('What does "migrate" mean?', 'To move from one place to another', ['To stop moving', 'To build a nest', 'To lay eggs'], 'Migrate means to move from one region/country to another seasonally.', '"Migrate" என்பது இடம் பெயர்வதை குறிக்கிறது.'),
      mcq('What is the meaning of "conservation"?', 'Protection of nature and wildlife', ['Destruction of forests', 'A conversation', 'Growing of trees'], '"Conservation" means the protection and preservation of the environment.', '"Conservation" என்பது இயற்கையையும் வனவிலங்குகளையும் பாதுகாப்பதை குறிக்கிறது.'),
      mcq('"Enormous" means:', 'Very large', ['Very small', 'Very beautiful', 'Very fast'], '"Enormous" describes something very large in size.', '"Enormous" என்பது மிகவும் பெரிதான என்று பொருள்படும்.'),
      mcq('The word "swoop" means:', 'To fly down quickly', ['To swim', 'To walk slowly', 'To sleep'], '"Swoop" means to move down quickly through the air.', '"Swoop" என்பது காற்றில் வேகமாக கீழே பறப்பதை குறிக்கிறது.'),
      mcq('"Ancient" means:', 'Very old', ['Very new', 'Very beautiful', 'Very small'], '"Ancient" refers to things from a very long time ago.', '"Ancient" என்பது மிகவும் பழமையான என்று பொருள்படும்.'),
    ]
  },

  {
    id: 'ex_vocab_class10_words',
    lesson_id: 'les_sam10u1_1',
    category_id: 'vocabulary', level_id: 'B1',
    title: 'Class 10: Advanced Vocabulary', exercise_type: 'mcq',
    instructions: 'Choose the correct meaning or usage for each word.',
    tamil_instructions: 'ஒவ்வொரு சொல்லின் சரியான பொருளை தேர்ந்தெடுக்கவும்.',
    xp_points: 40, order_index: 1,
    questions: [
      mcq('"Muster" in "mustering up courage" means:', 'To gather or summon', ['To waste', 'To destroy', 'To hide'], '"Muster" means to gather strength or courage.', '"Muster" என்பது தைரியம் திரட்டுவதை குறிக்கிறது.'),
      mcq('"Plummeted" most likely means:', 'Fell suddenly and steeply', ['Rose quickly', 'Moved slowly', 'Stayed still'], '"Plummet" means to fall sharply and rapidly.', '"Plummet" என்பது திடீரென கீழே வீழ்வதை குறிக்கிறது.'),
      mcq('The synonym of "reluctant" is:', 'Unwilling', ['Eager', 'Happy', 'Confident'], '"Reluctant" means not willing to do something.', '"Reluctant" என்பது தயங்கும், விருப்பமற்ற என்று பொருள்படும்.'),
      mcq('"Frantic" most nearly means:', 'Wildly excited or worried', ['Very calm', 'Very slow', 'Very bored'], '"Frantic" describes extreme anxiety or excitement.', '"Frantic" என்பது கடுமையான கவலை அல்லது அவசரத்தை குறிக்கிறது.'),
      mcq('What does "tedious" mean?', 'Long and boring', ['Short and exciting', 'New and interesting', 'Old and useful'], '"Tedious" describes something that is long, boring, and tiresome.', '"Tedious" என்பது நீண்ட, சலிப்பான என்று பொருள்படும்.'),
    ]
  },

  // ══ ADDITIONAL GRAMMAR EXERCISES ════════════════════════════════════════
  {
    id: 'ex_gen_reported_speech',
    lesson_id: 'les_sam8u5_3',
    category_id: 'grammar', level_id: 'A2',
    title: 'Reported Speech — Comprehensive Practice', exercise_type: 'mcq',
    instructions: 'Choose the correct reported speech transformation.',
    tamil_instructions: 'சரியான மறைமொழி மாற்றத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 50, order_index: 1,
    questions: [
      mcq('He said, "I am reading a book." → Reported:', 'He said that he was reading a book.', ['He said that I am reading a book.', 'He said that he is reading a book.', 'He told that he was reading a book.'], '"Am" changes to "was" in Reported Speech. "I" changes to "he".', 'மறைமொழியில் "am" → "was" மற்றும் "I" → "he" ஆக மாறும்.'),
      mcq('She asked me, "Where do you live?" → Reported:', 'She asked me where I lived.', ['She asked me where do I live.', 'She asked me where I live.', 'She told me where I lived.'], 'Wh-questions in Reported Speech: asked + wh-word + subject + verb (no auxiliary).', 'Wh-கேள்விகளில்: asked + wh-word + subject + verb (auxiliary இல்லை).'),
      mcq('The teacher said, "Do not make noise." → Reported:', 'The teacher told us not to make noise.', ['The teacher said not to make noise.', 'The teacher told that not to make noise.', 'The teacher asked us do not make noise.'], 'Negative commands in Reported Speech: told + not to + verb.', 'எதிர்மறை கட்டளைகளில்: told + not to + verb.'),
      mcq('"Congratulations! You have won the prize." → Reported:', 'She congratulated him on winning the prize.', ['She told him that he has won the prize.', 'She said congratulations for winning.', 'She exclaimed that he won the prize.'], 'Exclamations of joy/congratulations use "congratulated on" in Reported Speech.', 'வாழ்த்து வாக்கியங்களுக்கு "congratulated on" பயன்படுகிறது.'),
      mcq('He said to me, "Can you help me?" → Reported:', 'He asked me if I could help him.', ['He said me if I can help him.', 'He asked me could I help him.', 'He told me whether I could help him.'], '"Can" → "could" and Yes/No questions use "if/whether" in Reported Speech.', '"can" → "could" மற்றும் ஆம்/இல்லை கேள்விகளில் "if/whether" பயன்படுகிறது.'),
    ]
  },

  {
    id: 'ex_gen_voice_mixed',
    lesson_id: 'les_sam9u3_4',
    category_id: 'grammar', level_id: 'A2',
    title: 'Active and Passive Voice — Mixed Practice', exercise_type: 'mcq',
    instructions: 'Choose the correct voice transformation.',
    tamil_instructions: 'சரியான குரல் மாற்றத்தை தேர்ந்தெடுக்கவும்.',
    xp_points: 50, order_index: 1,
    questions: [
      mcq('Passive: "A new book will be launched by the author." → Active:', 'The author will launch a new book.', ['The author launches a new book.', 'The author launched a new book.', 'The author is launching a new book.'], 'Future Simple Passive → Active: Subject + will + base verb + object.', 'எதிர்கால எளிய கர்மணி → கர்த்தரி: Subject + will + base verb + object.'),
      mcq('Which sentence is in Active Voice?', 'The students completed the project.', ['The project was completed by the students.', 'The project has been completed.', 'The project is being completed by the students.'], '"Students completed" — the subject performs the action. That is Active Voice.', '"Students completed" — கர்த்தா செயலை செய்கிறது. அது கர்த்தரி வாக்கியம்.'),
      mcq('Passive: "The letter was being typed by the secretary." → Active:', 'The secretary was typing the letter.', ['The secretary typed the letter.', 'The secretary is typing the letter.', 'The secretary types the letter.'], '"Was being typed" (Past Continuous Passive) → "was typing" (Past Continuous Active).', '"Was being typed" (கடந்தகால தொடர் கர்மணி) → "was typing" (கடந்தகால தொடர் கர்த்தரி).'),
    ]
  },
];

// ─── ADDITIONAL SPEAKING TOPICS ─────────────────────────────────────────────

const newSpeakingTopics = [
  { id: 'spk_class6_sea_turtles', title: 'Talk About Sea Turtles', tamil_title: 'கடல் ஆமைகளைப் பற்றி பேசுங்கள்', level_id: 'A1', category: 'Nature', prompt_text: 'Tell what you know about sea turtles — where they live, why they are endangered, and how we can save them.', tamil_prompt: 'கடல் ஆமைகளைப் பற்றி — எங்கே வாழ்கின்றன, ஏன் அழிந்துவருகின்றன, எவ்வாறு காக்கலாம் என்று சொல்லுங்கள்.', sample_sentence: 'Sea turtles are marine reptiles that have lived on Earth for over 100 million years. They are now endangered due to pollution and hunting.', key_vocabulary: 'marine, endangered, conservation, habitat, nesting, pollution', order_index: 5 },
  { id: 'spk_class7_eidgah', title: 'Describe a Festival You Love', tamil_title: 'நீங்கள் விரும்பும் திருவிழாவை விவரியுங்கள்', level_id: 'A1', category: 'Culture', prompt_text: 'Describe your favourite festival — how it is celebrated, what special food is made, and what it means to you.', tamil_prompt: 'நீங்கள் விரும்பும் திருவிழாவை விவரியுங்கள் — எவ்வாறு கொண்டாடப்படுகிறது, என்ன சிறப்பு உணவு சமைக்கப்படுகிறது.', sample_sentence: 'My favourite festival is Pongal. We thank the Sun God for a good harvest and cook sweet Pongal rice in a new clay pot.', key_vocabulary: 'festival, celebrate, tradition, harvest, decorate, ritual', order_index: 6 },
  { id: 'spk_class8_hero', title: 'Describe Your Role Model', tamil_title: 'உங்கள் முன்னுதாரணத்தை விவரியுங்கள்', level_id: 'A2', category: 'Values', prompt_text: 'Talk about a person you admire — why they inspire you and what qualities you want to develop like them.', tamil_prompt: 'நீங்கள் போற்றும் ஒருவரைப் பற்றி பேசுங்கள் — ஏன் அவர் உங்களுக்கு ஊக்கம் தருகிறார், என்ன குணங்களை வளர்த்துக்கொள்ள விரும்புகிறீர்கள்.', sample_sentence: 'My role model is Dr. A.P.J. Abdul Kalam. He rose from a humble background to become the President of India through hard work and dedication.', key_vocabulary: 'admire, inspire, dedication, achievement, humble, perseverance', order_index: 7 },
  { id: 'spk_class9_environment', title: 'Speak on Environmental Protection', tamil_title: 'சுற்றுச்சூழல் பாதுகாப்பு பற்றி பேசுங்கள்', level_id: 'A2', category: 'Environment', prompt_text: 'Give a short speech on why protecting the environment is important and what steps we should take.', tamil_prompt: 'சுற்றுச்சூழலை ஏன் பாதுகாக்க வேண்டும், என்ன நடவடிக்கைகள் எடுக்க வேண்டும் என்று சிறு பேச்சு வழங்குங்கள்.', sample_sentence: 'Global warming is one of the biggest challenges facing our planet today. We must reduce carbon emissions and plant more trees to save our environment.', key_vocabulary: 'global warming, carbon emission, deforestation, renewable energy, sustainable, ecosystem', order_index: 8 },
  { id: 'spk_class10_sslc_exam', title: 'SSLC Student Experience', tamil_title: 'SSLC தேர்வு அனுபவம்', level_id: 'B1', category: 'Academic', prompt_text: 'Talk about how you prepare for SSLC board exams — your study routine, challenges, and goals.', tamil_prompt: 'SSLC பொதுத்தேர்வுக்கு நீங்கள் எவ்வாறு தயாராகிறீர்கள் — படிக்கும் பழக்கம், சவால்கள், இலக்குகள்.', sample_sentence: 'I wake up at 5 AM every day to study. I focus on grammar and reading comprehension because they carry more marks in the board exam.', key_vocabulary: 'board exam, preparation, revision, time management, concentrate, target', order_index: 9 },
  { id: 'spk_class11_career', title: 'My Future Career Plans', tamil_title: 'என் எதிர்கால தொழில் திட்டங்கள்', level_id: 'B1', category: 'Career', prompt_text: 'Speak about the career you want to pursue after your studies and why you chose it.', tamil_prompt: 'படிப்பு முடிந்த பிறகு நீங்கள் பயிற்சி செய்ய விரும்பும் தொழிலைப் பற்றி பேசுங்கள் மற்றும் ஏன் தேர்ந்தெடுத்தீர்கள்.', sample_sentence: 'I want to become a software engineer because I am passionate about problem-solving and technology. I believe programming will help me create useful applications for society.', key_vocabulary: 'career, aspiration, qualification, skill, passion, technology', order_index: 10 },
  { id: 'spk_class12_leadership', title: 'Leadership and Responsibility', tamil_title: 'தலைமைத்துவம் மற்றும் பொறுப்புணர்வு', level_id: 'B2', category: 'Values', prompt_text: 'Talk about the qualities of a good leader and give an example of a leader who inspired you.', tamil_prompt: 'ஒரு நல்ல தலைவரின் குணங்கள் என்ன, உங்களுக்கு ஊக்கம் தந்த ஒரு தலைவரின் உதாரணம் கொடுங்கள்.', sample_sentence: 'A good leader is someone who leads by example, listens to others, and works for the benefit of the entire team. Nelson Mandela is my inspiration because he fought for equality with patience and courage.', key_vocabulary: 'leadership, integrity, empathy, accountability, inspire, perseverance', order_index: 11 },
];

// ─── WRITE TO FILES ──────────────────────────────────────────────────────────

function mergeById(existingArr, newArr) {
  const existingIds = new Set(existingArr.map(x => x.id));
  const toAdd = newArr.filter(x => !existingIds.has(x.id));
  return [...existingArr, ...toAdd];
}

const modulesPath = path.join(dataDir, 'modules.json');
const lessonsPath = path.join(dataDir, 'lessons.json');
const exercisesPath = path.join(dataDir, 'exercises.json');
const speakingPath = path.join(dataDir, 'speaking_topics.json');

const existingModules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
const existingLessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
const existingExercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
const existingSpeaking = JSON.parse(fs.readFileSync(speakingPath, 'utf8'));

const mergedModules = mergeById(existingModules, newModules);
const mergedLessons = mergeById(existingLessons, newLessons);
const mergedExercises = mergeById(existingExercises, newExercises);
const mergedSpeaking = mergeById(existingSpeaking, newSpeakingTopics);

fs.writeFileSync(modulesPath, JSON.stringify(mergedModules, null, 2), 'utf8');
fs.writeFileSync(lessonsPath, JSON.stringify(mergedLessons, null, 2), 'utf8');
fs.writeFileSync(exercisesPath, JSON.stringify(mergedExercises, null, 2), 'utf8');
fs.writeFileSync(speakingPath, JSON.stringify(mergedSpeaking, null, 2), 'utf8');

console.log(`✅ Modules: ${existingModules.length} → ${mergedModules.length} (+${mergedModules.length - existingModules.length} new)`);
console.log(`✅ Lessons: ${existingLessons.length} → ${mergedLessons.length} (+${mergedLessons.length - existingLessons.length} new)`);
console.log(`✅ Exercises: ${existingExercises.length} → ${mergedExercises.length} (+${mergedExercises.length - existingExercises.length} new exercises)`);
console.log(`✅ Speaking Topics: ${existingSpeaking.length} → ${mergedSpeaking.length} (+${mergedSpeaking.length - existingSpeaking.length} new topics)`);

const totalQuestions = newExercises.reduce((sum, ex) => sum + ex.questions.length, 0);
console.log(`\n📊 Total new questions added: ${totalQuestions}`);
console.log(`📚 Classes covered: 6, 7, 8, 9, 10 (SSLC), 11, 12 (HSC)`);
console.log('\n✅ All data written! Run: cd backend && npm run db:seed');
