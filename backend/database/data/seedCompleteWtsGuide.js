/**
 * SEED COMPLETE +1 ENGLISH WAY TO SUCCESS GUIDE (2019 NEW SYLLABUS)
 * Seeds all 4 Parts (20 Marks + 14 Marks + 21 Marks + 35 Marks) into SQLite
 * Run: node backend/database/data/seedCompleteWtsGuide.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedCompleteGuide() {
  console.log('🚀 Seeding Complete Way to Success +1 English Guide 2019 into SQLite Database...');
  await runMigration();

  // 1. Ensure Course Exists
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (சமச்சீர் & Way to Success)', 'Complete +1 English Syllabus Guide: Part I (1-Mark Grammar & Vocabulary), Part II (2-Mark Poetry & Transformations), Part III (3-Mark ERC & Practical Writing), Part IV (5-Mark Paragraphs, Essays & Bio-data).', 1, 1)`
  );

  // 2. Ensure Modules for 4 Parts
  const modules = [
    {
      id: 'mod_wts_part1',
      title: 'Part I: 1-Mark Questions & Grammar (Q1–Q20 | 20 Marks)',
      tamil: 'பகுதி 1: ஒரு மதிப்பெண் வினாக்கள் & இலக்கணம் (20 மதிப்பெண்கள்)',
      desc: 'Synonyms, Antonyms, Compound Words, Prefixes & Suffixes, Abbreviations, Clipped Words, Word Definitions, Phrasal Verbs, Idioms, Foreign Words, Euphemism, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns',
      order: 1
    },
    {
      id: 'mod_wts_part2',
      title: 'Part II: Poetry Appreciation & Transformations (Q21–Q30 | 14 Marks)',
      tamil: 'பகுதி 2: கவிதை வினாக்கள் & இலக்கண மாற்றங்கள் (14 மதிப்பெண்கள்)',
      desc: 'Poetry Appreciation Questions, Figures of Speech, Direct/Indirect Speech, Active/Passive Voice, Simple/Compound/Complex Sentences, Conditional (If) Clauses',
      order: 2
    },
    {
      id: 'mod_wts_part3',
      title: 'Part III: ERC, Short Answers & Practical Writing (Q31–Q40 | 21 Marks)',
      tamil: 'பகுதி 3: இடம்பெற்று விளக்குதல், சிறு வினாக்கள் & எழுத்துப்பயிற்சி (21 மதிப்பெண்கள்)',
      desc: 'Poem ERC (Reference to Context), Prose Short Answers, Dialogue Writing, Non-verbal Comprehension, Describing a Process, Proverbs, Semantic Fields, Notice Writing, Headline Expansion, Email Writing, Spot the Errors, Question Framing',
      order: 3
    },
    {
      id: 'mod_wts_part4',
      title: 'Part IV: Paragraphs, Essays & Bio-data Applications (Q41–Q47 | 35 Marks)',
      tamil: 'பகுதி 4: நெடு வினாக்கள், கட்டுரைகள் & வேலை விண்ணப்பம் (35 மதிப்பெண்கள்)',
      desc: 'Prose Paragraphs, Poetry Paragraphs, Supplementary Stories, Note-Making & Summary Writing, Bio-Data & Job Application, Letter Writing, General Essays, Story Expansion',
      order: 4
    }
  ];

  for (const m of modules) {
    await db.execute(
      `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
       VALUES (?, 'crs_class11', ?, ?, ?, ?)`,
      [m.id, m.title, m.tamil, m.desc, m.order]
    );
  }

  // 3. SEED PART I LESSONS
  const part1Lessons = [
    {
      id: "lsn_wts_synonyms_antonyms",
      moduleId: "mod_wts_part1",
      title: "1-6. Synonyms & Antonyms (சொற்களின் பொருள் & எதிர்ச்சொல்)",
      tamil: "உரைநடை 1 முதல் 6 கலைச்சொற்கள் & எதிர்ச்சொற்கள்",
      content: `### 📖 1 to 6. Synonyms & Antonyms Glossary (Text Book pg 4,5,6,38,70,108,142,170,171)

#### Prose 1: The Portrait of a Lady (Khushwant Singh)
- **mantelpiece**: shelf above the fireplace (வீட்டின் எறிமாடம்)
- **absurd**: inconsistent / illogical (பொருத்தமற்ற, அற்பத்தனமான)
- **fables**: tales / stories (கதைகள்)
- **hobbled**: walked unsteadily (தள்ளாடி நடத்தல்)
- **pucker**: wrinkle (சுருக்கம், மடிப்பு)
- **expanse**: widespread (பரவுதல்)
- **monotonous**: boring, unchanging (தனிமை, சலிப்பூட்டும்)
- **snapped**: broke / cut (துண்டித்தல்)
- **seclusion**: isolation, separation (தனிமைப்படுத்து)
- **bedlam**: noisy confusion (கூச்சலான குழப்பம்)
- **perched**: sat comfortably, rested (சௌகரியமாக அமர்ந்து ஓய்வெடுத்தல்)
- **rebukes**: scoldings (எதிர்ப்பு, திட்டுதல்)
- **dilapidated**: damaged (சேதமான, ஓரங்கட்டப்பட்ட)
- **pallor**: unhealthy pale appearance (வெளிறிய தோற்றம்)
- **shroud**: cloth used to wrap a dead person (இறந்த உடலை மூடும் துணி)

**Antonyms (Prose 1):**
- **wrinkled** X smooth / unwrinkled
- **pretty** X ugly
- **absurd** X logical
- **scattered** X gathered
- **inaudible** X audible / heard
- **monotonous** X interesting

---

#### Prose 2: The Queen of Boxing (M. C. Mary Kom)
- **princely**: very large, handsome (தாளாரமாக, மிகவும் அதிகமாக)
- **jet lag**: tiredness after a long flight journey (விமான பயணத்திற்கு பின் ஏற்படும் களைப்பு)
- **appetite**: hunger (பசி)
- **lauded**: appreciated (வெகுவாகப் புகழ்வது)
- **conviction**: firm faith or belief (உறுதியான நம்பிக்கை)
- **sate**: satisfy (திருப்திப்படுத்து)
- **palate**: sense of taste (சுவை)
- **felicitation**: congratulatory address (பாராட்டு உரை)

---

#### Prose 3: Forgetting (Robert Lynd)
- **vintages**: wine of high quality produced in a particular year (குறிப்பிட்ட திராட்சை மது)
- **antipathy**: strong dislike (அதிகமான வெறுப்பு)
- **reluctant**: unwilling (வேண்டா வெறுப்பாக)
- **delinquent**: wrong doer (தவறு செய்பவன், குற்றவாளி)
- **exploits**: daring / heroic acts / achievements (வீரச்செயல்கள், சாதனைகள்)
- **abstracted**: lacking concentration (கவனமின்மை)
- **prosaic**: dull, simple, plain (எளிய, சாதாரண)
- **audacious**: bold and daring (தைரியமான)
- **eccentric**: tending to act strangely (விநோதமாக செயல்பட விருப்பம்)
- **indignant**: being very angry (கோபமடைந்த)
- **quivering**: trembling, shivering (நடுங்குதல்)

---

#### Prose 4: A Tight Corner (E. V. Lucas)
- **electrified**: shocked by something unexpected (அதிர்ச்சியடைவது)
- **crescendo**: progress towards a climax (முன்னேற்றம்)
- **congealed**: thickened as if frozen (உறைந்துபோதல்)
- **nonchalantly**: unconcernedly, coolly (ஆர்வம் இல்லாமல்)
- **glibly**: smoothly but not sincerely (அலங்காரமாக)
- **rectitude**: honesty, good behaviour (நேர்மை)
- **guile**: cunning, deceit (சூழ்ச்சிக்காரர், ஏமாற்றுக்காரர்)
- **indelible**: cannot be rubbed out (அழியாத, மறக்க இயலாத)

---

#### Prose 5: Convocation Address (Dr. Arcot Ramasamy Mudaliar)
- **conferred**: granted a title or degree (விருது / பட்டம் வழங்குதல்)
- **reiterate**: repeat, say or do again (மீண்டும் வலியுறுத்தி சொல்லுதல்)
- **enunciated**: spoke clearly (தெளிவாக பேசுதல்)
- **ruggedness**: toughness, strength (மிக்க கடினமான உழைப்பு)
- **perseverance**: steadfastness, continuous efforts (விடாமுயற்சி)
- **inherent**: inborn, innate (பிறப்பிலேயே பெற்றது)
- **perils**: dangers, risks (ஆபத்துகள்)

---

#### Prose 6: The Accidental Tourist (Bill Bryson)
- **alley**: narrow passage between buildings (குறுக்குப் பாதை, சந்து)
- **en famille**: as a family (குடும்பமாக)
- **yanked**: pulled with jerk (இழுத்த)
- **consternation**: worry (துன்பம்)
- **extravagantly**: excessively (உதாரியாக)
- **cascade**: waterfall (நீர்வழ்ச்சி)`
    },
    {
      id: "lsn_wts_compound_and_affixes",
      moduleId: "mod_wts_part1",
      title: "7-8. Compound Words & Prefixes/Suffixes",
      tamil_title: "கூட்டுச் சொற்கள் & முன்னொட்டு/பின்னொட்டு",
      content: `### 🔗 Compound Words & Prefixes / Suffixes (Text Book pg 6, 7, 39)

#### 1. Compound Words:
Combining two separate words to form a single new word.

- **Noun + Noun**: shop-owner, dream-world, bed-time, postman, motorcycle, honeybee
- **Gerund + Noun**: washing machine, dining table, reading room, swimming pool
- **Adjective + Noun**: blackboard, blueprint, grandmother
- **Verb + Noun**: push-button, treadmill, popcorn
- **Noun + Adjective**: knee-deep, homesick, lifelong, snow white

#### 2. Prefixes & Suffixes:
- **Prefixes** (சேர்க்கப்படும் முன்னொட்டுகள்):
  - *un-* : untidy, unable, unnecessary
  - *dis-* : honest -> **dishonest**, agree -> **disagree**
  - *in-* : active -> **inactive**, finite -> **infinite**
  - *il-* : legitimate -> **illegitimate**, legal -> **illegal**
  - *im-* : possible -> **impossible**, pure -> **impure**
  - *ir-* : regular -> **irregular**, responsible -> **irresponsible**

- **Suffixes** (சேர்க்கப்படும் பின்னொட்டுகள்):
  - *-able* : beatable, readable
  - *-ous* : famous, dangerous
  - *-ment* : agreement, achievement
  - *-ful* : painful, beautiful`
    },
    {
      id: "lsn_wts_abbrev_clipped_def",
      moduleId: "mod_wts_part1",
      title: "9-11. Abbreviations, Clipped Words & One-Word Definitions",
      tamil_title: "சுருக்கக் குறியீடுகள், சுருக்கப்பட்ட வார்த்தைகள் & கலைச்சொல் விளக்கம்",
      content: `### 🔤 Abbreviations, Clipped Words & Definitions (Text Book pg 39, 72, 73, 190)

#### 1. Abbreviations & Acronyms:
- **RSC**: Referee Stopped Contest
- **AIBA**: Association Internationale de Boxe Amateur
- **IELTS**: International English Language Testing System
- **GST**: Goods and Services Tax
- **TNPSC**: Tamil Nadu Public Service Commission
- **STD**: Subscribers Trunk Dialing
- **ISD**: International Subscribers Dialing
- **MHRD**: Ministry of Human Resource Development
- **GPS**: Global Positioning System
- **NSS**: National Service Scheme

#### 2. Clipped Words:
- **Demonstration** -> Demo
- **Chimpanzee** -> Chimp
- **Photograph** -> Photo
- **Microphone** -> Mic / Mike
- **Cafeteria** -> Cafe
- **Gasoline** -> Gas
- **Helicopter** -> Copter
- **Telephone** -> Phone
- **University** -> Varsity
- **Memorandum** -> Memo
- **Influenza** -> Flu
- **Refrigerator** -> Fridge
- **Aeroplane** -> Plane
- **Examination** -> Exam

#### 3. One-Word Definitions:
- **patriotism**: love of country and willingness to sacrifice for it
- **nationalism**: doctrine that your country\'s interests are superior
- **feminism**: doctrine advocating equal rights for women
- **amateurism**: participating in sports as a hobby
- **bibliophile**: great lover of books
- **polyglot**: fluent in multiple languages
- **ambidextrous**: able to use both hands with equal skill
- **philanthropist**: donates large sums for public welfare
- **teetotaller**: one who completely avoids alcohol
- **optimist**: one who believes everything turns out for the best
- **Cardiologist**: doctor who treats heart diseases
- **Pathologist**: scientist who studies diseases`
    },
    {
      id: "lsn_wts_phrasal_idioms_foreign",
      moduleId: "mod_wts_part1",
      title: "12-14. Phrasal Verbs, Idioms & Foreign Phrases",
      tamil_title: "கூட்டு வினைகள், மரபுத்தொடர்கள் & பிறமொழிச் சொற்கள்",
      content: `### 🗣️ Phrasal Verbs, Idioms & Foreign Phrases (Text Book pg 40, 112, 172, 173)

#### 1. Phrasal Verbs:
- **stand up**: maintain, withstand (*Statement will not stand up in court*)
- **stand for**: support (*My father stands for truth*)
- **look into**: examine (*The officer looked into the matter*)
- **look through**: glance, skim (*Looking through cookery books*)
- **run over**: hit by vehicle (*The lorry ran over the motorist*)
- **put on**: wear (*I put on my new shirt*)
- **put off**: postpone (*They put off the match*)
- **call off**: cancel (*The manager will call off the meeting*)
- **carry out**: perform (*She carried out her duties*)
- **give up**: abandon (*He gave up smoking*)

#### 2. Common Idioms:
- **throw in the towel**: to give up
- **in our corner**: on your side in an argument
- **on the ropes**: near collapse or defeat
- **below the belt**: unfair or unsporting behavior
- **square off**: prepare for conflict
- **alarm bells ringing**: sign of something going wrong
- **back to the wall**: in serious difficulty
- **saved by the bell**: help at the last moment
- **right up one\'s alley**: type of thing you enjoy doing
- **drive up the wall**: to annoy or irritate someone
- **hit the road**: to begin a journey
- **cold feet**: nervousness and anxiety

#### 3. Foreign Words & Phrases:
- **viva voce**: a spoken oral examination
- **bonafide**: genuine
- **sine die**: without date fixed, indefinitely
- **resume**: summary
- **in toto**: totally
- **rapport**: close relationship
- **liaison**: coordination of activities
- **bon voyage**: saying goodbye
- **postmortem**: after death
- **en route**: on the way
- **de facto**: in fact
- **ex gratia**: given as a favor without legal requirement
- **ad hoc**: for a particular purpose
- **prima facie**: at first sight`
    },
    {
      id: "lsn_wts_grammar_core_part1",
      title: "15-20. Prepositions, Question Tags, Syllabification & Patterns",
      tamil_title: "முன்இடைச்சொற்கள், வினா இணைப்புகள், அசைபிரித்தல் & வாக்கிய அமைப்பு",
      content: `### ⚙️ Core Part-I Grammar Topics (Text Book pg 6, 12, 44, 118, 120, 175)

#### 1. Modals & Semi-Modals (13 Modals):
- **will / would**: futurity, intention, willingness, polite request
- **shall / should**: suggestion, obligation, advice
- **can / could**: ability, possibility, permission
- **may / might**: possibility, permission, blessing
- **must**: necessity, compulsion
- **used to**: discontinued past habit
- **ought to**: moral obligation
- **need**: necessity
- **dare**: courage

#### 2. Prepositions (in, on, at, for, by, from, to, since):
- **in**: Place inside (*in the box*), Month (*in May*)
- **on**: Surface (*on the table*), Day (*on Monday*)
- **at**: Specific place (*at Madurai*), Specific time (*at 5 p.m.*)
- **since**: Point of time in past (*since 2011*)
- **for**: Duration of time (*for 5 hours*)

#### 3. Question Tags:
- Positive sentence -> Negative tag (*You are good, aren\'t you?*)
- Negative sentence -> Positive tag (*She didn\'t get bail, did she?*)
- Words like *hardly, barely, seldom, few, little, never* make sentence negative (*She rarely goes, does she?*)
- Imperative suggestions (*Let us go -> shall we?*)
- Imperative requests (*Come with me -> will you?*)

#### 4. Syllabification:
- **1 Syllable**: thought, dropped
- **2 Syllables**: a-bout (2), in-side (2), mu-sic (2), bare-ly (2)
- **3 Syllables**: pro-per-ly (3), per-ma-nent (3), gui-ta-rist (3), sur-vi-val (3)
- **4 Syllables**: en-ter-tain-ment (4), as-tro-no-my (4), ar-ti-cu-late (4)
- **5 Syllables**: ex-tra-va-gan-za (5), ex-am-i-na-tion (5)

#### 5. Sentence Pattern (S-V-O-C-A):
- **Subject (S)**: Who / what does the action? (*The students*)
- **Verb (V)**: Action or state (*are playing*)
- **Direct Object (DO)**: What? (*football*)
- **Indirect Object (IO)**: To whom? (*me*)
- **Complement (C)**: Completes meaning (*a teacher, silent, HM*)
- **Adjunct (A)**: MPTR (Method-How, Place-Where, Time-When, Reason-Why) (*now, in the market, fast*)`
    }
  ];

  for (let idx = 0; idx < part1Lessons.length; idx++) {
    const l = part1Lessons[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  // 4. SEED PART II LESSONS
  const part2Lessons = [
    {
      id: "lsn_wts_poetry_appreciation",
      moduleId: "mod_wts_part2",
      title: "21-26. Poetry Appreciation & Figures of Speech (கவிதை நயம் & அணி இலக்கணம்)",
      tamil: "6 செய்யுள்களின் கவிதை வினாக்கள் & Figures of Speech",
      content: `### 📜 6 Poems Appreciation & Figures of Speech (Text Book pg 148-151)

#### Poem 1: Once Upon a Time (Gabriel Okara)
- **Poetic Lines & QA**:
  - *"laugh with their teeth while their ice-block-cold eyes..."*
  - **Who are 'they'?**: Modern people.
  - **Explanation of 'ice-block-cold eyes'**: Eyes without any genuine warmth or feeling.
  - **Figure of Speech**: Metaphor (*ice-block-cold eyes*), Simile (*like a fixed portrait smile, like a snake\'s bare fangs*).

#### Poem 2: Confessions of a Born Spectator (Ogden Nash)
- **Whom does the poet admire?**: Athletes who sweat for fun or hire.
- **Why does the poet prefer to be a spectator?**: His own spirit is weak and shy; he prefers sitting safely in the stands rather than having broken bones.
- **Figure of Speech**: Onomatopoeia (*snaps the knee and cracks the wrist*), Alliteration (*most-modest, they-their*).

#### Poem 3: Lines Written in Early Spring (William Wordsworth)
- **What is the poet\'s faith?**: That every blooming flower enjoys the air it breathes.
- **What grieves the poet?**: "What man has made of man" through war and hatred.
- **Figure of Speech**: Personification (*To her works did Nature link*), Aphorism (*What Man has made of Man?*).

#### Poem 4: Macavity – The Mystery Cat (T. S. Eliot)
- **Why is he called 'Hidden Paw'?**: He is a master criminal who always escapes Scotland Yard.
- **Figure of Speech**: Simile (*movements like a snake*), Metaphor (*fiend in feline shape, monster of depravity*), Personification (*they say he cheats at cards*).

#### Poem 5: Everest Is Not The Only Peak (Kulothungan)
- **Theme**: Virtue, self-respect, and dignity in every modest duty of life.
- **Figure of Speech**: Metaphor (*He who does not stoop is a king*).

#### Poem 6: The Hollow Crown (William Shakespeare)
- **What sits inside the hollow crown?**: Death sits inside the hollow crown mocking royal power.
- **Figure of Speech**: Personification (*Keeps Death his court*), Interrogation (*And yet not so - for what can we bequeath?*).`
    },
    {
      id: "lsn_wts_transformations_mastery",
      moduleId: "mod_wts_part2",
      title: "27-30. Transformation of Sentences (வாக்கிய மாற்றங்கள்)",
      tamil: "Direct/Indirect, Active/Passive, Simple/Compound/Complex, If-Clauses",
      content: `### 🔄 4 Core Grammar Transformations (Text Book pg 77, 116, 148, 175)

#### 1. Direct to Indirect Speech (7 Rules):
- **Reporting Verb**: Statement (*said to -> told*), Question (*asked*), Imperative (*ordered / requested*), Exclamatory (*exclaimed*).
- **Conjunction**: Statement (*that*), Question (*same Wh- word or if/whether*), Imperative (*to / not to*).
- **Tense & Pronoun Changes**: Present -> Past, Past -> Past Perfect.
- *Example*: Balu said to his friend, "How long have I been waiting for you?" -> **Balu asked his friend how long he had been waiting for him.**

#### 2. Active Voice to Passive Voice (5 Rules):
- **Formula**: Object + be-verb + V3 (Past Participle) + by + Subject.
- *Present Simple*: am/is/are + V3 | *Past Simple*: was/were + V3 | *Perfect*: have/has/had + been + V3.
- *Example*: Vani wrote a letter to the editor. -> **A letter was written by Vani to the editor.**

#### 3. Simple, Compound & Complex Sentences:
- **Simple**: Phrase + Main Clause (*Because of her hard work, she won the medal.*)
- **Compound**: Main Clause + Conjunction + Main Clause (*She worked hard and so she won the medal.*)
- **Complex**: Subordinate Clause + Main Clause (*As she worked hard, she won the medal.*)

#### 4. Conditional Clauses (If-Clauses):
- **Type 0**: Scientific truth (*If you heat ice, it melts.*)
- **Type I**: Possible condition (*If Sita studies well, she will pass.*)
- **Type II**: Imaginary condition (*If I were a bird, I would fly.*)
- **Type III**: Impossible past (*If he had studied well, he would have passed.*)`
    }
  ];

  for (let idx = 0; idx < part2Lessons.length; idx++) {
    const l = part2Lessons[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  // 5. SEED PART III LESSONS (ERC, Short Answers & Practical Writing)
  const part3Lessons = [
    {
      id: "lsn_wts_erc_and_prose_qa",
      moduleId: "mod_wts_part3",
      title: "31-36. Poem ERC & Prose Short Answers (இடம்பெற்று விளக்குதல் & வினாக்கள்)",
      tamil: "Poem ERC & 6 Prose Short Answer QA",
      content: `### ✍️ ERC & Prose Short Answers (Text Book pg 8, 75, 102, 118, 123)

#### 1. Poem ERC Format (Context, Explanation, Comment):
- **Context**: *"The above lines are taken from the poem [Poem Name] written by [Poet Name]."*
- **Explanation**: Summary of the given line in simple words.
- **Comment**: Significance, theme, or emotion expressed.

#### 2. Prose Short Answers (Units 1 to 6):
- **Prose 1: Portrait of a Lady**:
  - *Q: Describe the grandfather in the portrait.*
  - *Ans*: He wore a big turban, loose clothes, and had a long white beard covering his chest. He looked at least 100 years old.
- **Prose 2: Queen of Boxing**:
  - *Q: How did Mary Kom manage financial support for USA trip?*
  - *Ans*: Her father raised Rs. 2000 and two MPs donated Rs. 8000 through her friends\' effort.
- **Prose 3: Forgetting**:
  - *Q: What does Lynd wonder at?*
  - *Ans*: Lynd actually wonders at the great efficiency of human memory.
- **Prose 4: A Tight Corner**:
  - *Q: What was the narrator\'s financial condition at Christie\'s auction?*
  - *Ans*: He had only 63 guineas in his bank account and no securities to borrow money.
- **Prose 5: Convocation Address**:
  - *Q: What should youngsters aim for after graduation?*
  - *Ans*: First, earn an honest living for family. Second, give back knowledge and hope to society.
- **Prose 6: The Accidental Tourist**:
  - *Q: What was Bryson\'s worst accident on a plane?*
  - *Ans*: Sucking his pen while chatting with a lady for 20 minutes, leaving his mouth, chin, and teeth stained navy-blue.`
    },
    {
      id: "lsn_wts_practical_writing",
      moduleId: "mod_wts_part3",
      title: "37-40. Practical Writing & Communication Skills (செய்முறை எழுத்துப் பயிற்சி)",
      tamil: "Dialogue, Process, Notice, Email, Headlines, Error Spotting",
      content: `### 📝 Practical Writing Skills Masterclass (Text Book pg 17, 78, 79, 151, 176)

#### 1. Dialogue Writing (Minimum 3 Exchanges):
- *Between Doctor and Patient*:
  - **Patient**: Good morning, Sir.
  - **Doctor**: Good morning. What is your problem?
  - **Patient**: I am suffering from headache and fever since yesterday.
  - **Doctor**: Take this medicine twice a day and rest.
  - **Patient**: Thank you, Sir.
  - **Doctor**: You are welcome.

#### 2. Describing a Process:
- **Binding a Book**: Gather cardboard, brown sheet, thread, needle, glue. Stitch pages, wrap brown sheet, apply cardboard covers with glue, attach calico cloth spine, wrap gift paper.
- **Making Tea**: Boil 250ml water, add 2 tsp tea powder, add 1 cup milk, add sugar and spices, stir, strain, and serve hot.

#### 3. Notice Writing Format:
\`\`\`text
NOTICE
Govt. Hr. Sec. School, Minjur.
1st February 2018
Workshop on Precis Writing
This is to inform all Class 11 and 12 students that a workshop on Precis Writing will be held on 2nd February 2018 at 9.00 a.m. in the school auditorium. Attendance is mandatory.
(Sd/-) Head Girl
\`\`\`

#### 4. E-mail Writing Format:
\`\`\`text
To: order@englishbooks.com
Subject: Order for Complete Encyclopedia Set
Dear Sir,
I am the Library Incharge of Avvai Govt. High School. We would like to order one complete set of Encyclopedia for our library. Kindly email us price and payment details.
Thank you.
(Sd/-) Satish Kumar
\`\`\``
    }
  ];

  for (let idx = 0; idx < part3Lessons.length; idx++) {
    const l = part3Lessons[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  // 6. SEED PART IV LESSONS (Paragraphs, Essays & Bio-Data)
  const part4Lessons = [
    {
      id: "lsn_wts_paragraphs_mastery",
      moduleId: "mod_wts_part4",
      title: "41-43. Paragraph Answers (Prose, Poetry & Supplementary Reader)",
      tamil: "உரைநடை, கவிதை & கதை நெடு வினாக்கள்",
      content: `### 📚 5-Mark Paragraph Answers (Text Book pg 48, 76, 109, 112, 114)

#### 1. Prose Paragraph 1: The Portrait of a Lady (Khushwant Singh)
The author\'s grandmother was short, fat, and slightly bent. Her white hair made her look peaceful. In the village, she got her grandson ready for school, walked with him to the temple school, read scriptures, and fed stale chapatis to stray dogs. In the city, she fed hundreds of sparrows in the verandah. When she died, thousands of sparrows sat in total silence around her body without touching bread crumbs and flew away quietly after cremation.

#### 2. Prose Paragraph 2: The Queen of Boxing (Mary Kom)
Mary Kom came from a poor agricultural family in Manipur. When selected for the World Boxing Championship in USA, her father raised Rs. 2000 and friends gathered Rs. 8000 from MPs. Despite jet lag and unaccustomed food, she won the Silver Medal. Later she won six World Gold Medals and earned the title "Magnificent Mary" and "Queen of Boxing."

#### 3. Poetry Paragraph 1: Once Upon a Time (Gabriel Okara)
The poet contrasts genuine past warmth with modern artificial social behavior. People used to laugh sincerely from the heart, but now they smile fake smiles "with teeth" and evaluate status during handshakes. The poet asks his son to teach him how to unlearn fake habits and laugh innocently again.

#### 4. Supplementary Paragraph 1: After Twenty Years (O. Henry)
Bob waits outside a New York store at 10 PM to keep a 20-year-old pact with his best friend Jimmy Wells. A cop speaks to him and leaves. Later a tall plainclothes officer arrests Bob and hands him a note from Jimmy. Jimmy had recognized Bob as a wanted Chicago criminal, but could not arrest his friend himself, so he sent another officer.`
    },
    {
      id: "lsn_wts_bio_data_and_essays",
      moduleId: "mod_wts_part4",
      title: "44-47. Bio-Data, Job Application, Essays & Story Expansion",
      tamil: "வேலை விண்ணப்பம், சுயவிவரக் குறிப்பு & பொதுக் கட்டுரைகள்",
      content: `### 📄 Job Application with Bio-Data & General Essays (Text Book pg 76, 130, 131, 176)

#### 1. Job Application Format with Resume / Bio-Data:
\`\`\`text
From: XXXXX, 45, Nehru Nagar, Trichy.
To: The Manager, ABC & Co., Trichy.
Sir,
Sub: Application for the post of Typist / Data Entry Operator - Reg.
I saw your advertisement in the newspaper. I have passed Higher Grade Typewriting in first class and completed B.Sc with NIIT computer courses. I enclose my resume for your consideration.

Resume / Bio-Data:
Name: XXXXX
Father\'s Name: Mr. T. Ram
Date of Birth: 05-06-1980
Educational Qualification: B.Sc.
Professional Qualification: Typewriting 1st Class, Java, Oracle
Languages Known: English and Tamil
Experience: 5 Years as Computer Operator in LG Company
Declaration: I hereby declare that the above information is true to the best of my knowledge.
Signature: XXXXX
\`\`\`

#### 2. General Essay: My Ambition in Life
A life without ambition is like a train journey without a destination. Everyone should have a noble goal. My ambition is to become a doctor. Daily on my way to school, I see poor people suffering from diseases near temple entrances. 90% of our people are poor and cannot afford expensive medical treatment. My motto is "Service to humanity is service to God." I want to open a clinic in my village to treat the needy free of cost.

#### 3. Story Expansion from Proverb: 'A Bad Workman Always Blames His Tools'
Raj and Ravi were two farmers owning oxen. Raj worked hard, took care of his animals, and ploughed his land on time. Ravi was lazy, neglected his tractor maintenance, and when the monsoon arrived, his tractor broke down. Instead of realizing his own laziness and poor maintenance, Ravi blamed bad luck and tools. Raj succeeded with limited resources. **Moral: It is never too late to mend.**`
    }
  ];

  for (let idx = 0; idx < part4Lessons.length; idx++) {
    const l = part4Lessons[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  console.log('✅ Successfully seeded ALL 4 Parts of Way to Success +1 English Guide 2019 into SQLite!');
}

if (require.main === module) {
  seedCompleteGuide()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedCompleteGuide;
