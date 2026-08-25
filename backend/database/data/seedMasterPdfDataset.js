/**
 * UNIFIED MASTER SEEDER FOR +1 WAY TO SUCCESS ENGLISH GUIDE PDF (2019)
 * With EXTREMELY CLEAN, HIGHLY STRUCTURED TABLES, BADGES & PRACTICE CARDS
 * Run: node backend/database/data/seedMasterPdfDataset.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedMasterPdfDataset() {
  console.log('🧹 Wiping SQLite tables and performing UNIFIED Master Seeding with Structured Tables...');
  await runMigration();

  // 1. Clear database
  await db.execute('DELETE FROM user_progress');
  await db.execute('DELETE FROM questions');
  await db.execute('DELETE FROM exercises');
  await db.execute('DELETE FROM lesson_content');
  await db.execute('DELETE FROM lessons');
  await db.execute('DELETE FROM modules');
  await db.execute('DELETE FROM courses');
  await db.execute('DELETE FROM vocabulary');

  // 2. Insert Main Course
  await db.execute(
    `INSERT INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (Way to Success முழுப் பாடத்திட்டம்)', 'Complete +1 English Study Material: Part I (Q1-20), Part II (Q21-30), Part III (Q31-40), Part IV (Q41-47). All questions, answers, grammar, ERC, essays, and letters included.', 1, 1)`
  );

  // 3. Insert 4 Master Modules
  const modules = [
    {
      id: 'mod_wts_part1',
      title: 'Part I: 1-Mark Questions & Vocabulary (Q1–Q20 | 20 Marks)',
      tamil: 'பகுதி 1: ஒரு மதிப்பெண் வினாக்கள் & இலக்கணம் (20 மதிப்பெண்கள்)',
      desc: 'Q1-Q20: Synonyms, Antonyms, Compound Words, Prefixes & Suffixes, Abbreviations, Clipped Words, Word Definitions, Phrasal Verbs, Idioms, Foreign Words, Euphemism, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns.',
      order: 1
    },
    {
      id: 'mod_wts_part2',
      title: 'Part II: Poetry Appreciation & Transformations (Q21–Q30 | 14 Marks)',
      tamil: 'பகுதி 2: செய்யுள் வினாக்கள் & வாக்கிய மாற்றம் (14 மதிப்பெண்கள்)',
      desc: 'Q21-Q26: Poetry Appreciation & Figures of Speech for Poems 1 to 6. Q27-Q30: Direct/Indirect Speech, Active/Passive Voice, Simple/Compound/Complex, Conditional (If) Clauses.',
      order: 2
    },
    {
      id: 'mod_wts_part3',
      title: 'Part III: ERC, Short Answers & Practical Writing (Q31–Q40 | 21 Marks)',
      tamil: 'பகுதி 3: இடம்பெற்று விளக்குதல், சிறு வினாக்கள் & எழுத்துப்பயிற்சி (21 மதிப்பெண்கள்)',
      desc: 'Q31-Q33: Poem ERC (Context, Explanation, Comment). Q34-Q36: Prose Short Answers (Units 1-6). Q37-Q40: Dialogue Writing, Non-verbal Pie Charts, Process Descriptions, Proverbs, Semantic Fields, Notice Writing, Headline Expansion, Email Writing, Error Spotting.',
      order: 3
    },
    {
      id: 'mod_wts_part4',
      title: 'Part IV: Paragraphs, Essays & Bio-data Applications (Q41–Q47 | 35 Marks)',
      tamil: 'பகுதி 4: நெடு வினாக்கள், கட்டுரைகள் & வேலை விண்ணப்பம் (35 மதிப்பெண்கள்)',
      desc: 'Q41: Prose Paragraphs. Q42: Poetry Paragraphs. Q43: Supplementary Reader Stories. Q44: Summary Writing & Note-Making. Q44B: Bio-data & Job Application. Q45: Reading Passages. Q46: Official & Personal Letters. Q46B: General Essays & Story Expansions.',
      order: 4
    }
  ];

  for (const m of modules) {
    await db.execute(
      `INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
       VALUES (?, 'crs_class11', ?, ?, ?, ?)`,
      [m.id, m.title, m.tamil, m.desc, m.order]
    );
  }

  // 4. MASTER LESSONS LIST
  const allLessons = [
    // --- MODULE 1 ---
    {
      id: "lsn_wts_p1_synonyms_antonyms",
      moduleId: "mod_wts_part1",
      title: "1-6. Synonyms & Antonyms (சொற்களின் பொருள் & எதிர்ச்சொல்)",
      tamil: "உரைநடை 1-6 கலைச்சொற்கள் & எதிர்ச்சொற்கள்",
      content: `## 📖 Q1–Q3: Synonyms Master Table (Prose 1 to 6)

### Prose 1: The Portrait of a Lady (Khushwant Singh)

| English Word | English Meaning | தமிழ் விளக்கம் |
| :--- | :--- | :--- |
| **mantelpiece** | shelf above the fireplace | வீட்டின் எறிமாடம் |
| **absurd** | inconsistent / illogical | பொருத்தமற்ற, அற்பத்தனமான |
| **fables** | tales / stories | கதைகள் |
| **hobbled** | walked unsteadily | தள்ளாடி நடத்தல் |
| **pucker** | wrinkle | சுருக்கம், மடிப்பு |
| **expanse** | widespread | பரவுதல் |
| **monotonous** | boring, unchanging | சலிப்பூட்டும் |
| **snapped** | broke / cut | துண்டித்தல் |
| **seclusion** | isolation, separation | தனிமைப்படுத்துதல் |
| **bedlam** | noisy confusion | கூச்சலான குழப்பம் |
| **perched** | sat comfortably, rested | சௌகரியமாக அமர்ந்து ஓய்வெடுத்தல் |
| **rebukes** | scoldings | எதிர்ப்பு, திட்டுதல் |
| **dilapidated** | damaged | சேதமான, ஓரங்கட்டப்பட்ட |
| **pallor** | unhealthy pale appearance | வெளிறிய தோற்றம் |
| **shroud** | cloth used to wrap a dead person | இறந்த உடலை மூடும் துணி |

---

### Prose 2: The Queen of Boxing (M. C. Mary Kom)

| English Word | English Meaning | தமிழ் விளக்கம் |
| :--- | :--- | :--- |
| **princely** | very large, handsome | தாளாரமாக, மிகவும் அதிகமாக |
| **jet lag** | tiredness after long flight | விமான பயணத்தின் பின் ஏற்படும் களைப்பு |
| **appetite** | hunger | பசி |
| **lauded** | appreciated | வெகுவாகப் புகழ்வது |
| **conviction** | firm faith or belief | உறுதியான நம்பிக்கை |
| **sate** | satisfy | திருப்திப்படுத்து |
| **palate** | sense of taste | சுவை |
| **felicitation** | congratulatory address | பாராட்டு உரை |

---

### Prose 3: Forgetting (Robert Lynd)

| English Word | English Meaning | தமிழ் விளக்கம் |
| :--- | :--- | :--- |
| **vintages** | wine of high quality | தரமான திராட்சை மது |
| **antipathy** | strong dislike | அதிகமான வெறுப்பு |
| **reluctant** | unwilling | வேண்டா வெறுப்பாக |
| **delinquent** | wrong doer | தவறு செய்பவன், குற்றவாளி |
| **exploits** | daring / heroic acts | வீரச்செயல்கள், சாதனைகள் |
| **prosaic** | dull, simple, plain | எளிய, சாதாரண |
| **audacious** | bold and daring | தைரியமான |

---

##### 🏛️ Government Exam Questions (MDL-18)
1. Her silver locks were scattered untidily over her pale, **puckered** face:
   > 💡 **Answer**: **d) wrinkled** (Options: a) graceful  b) fresh  c) smoothed  d) wrinkled)
2. It is the **efficiency** rather than the inefficiency of human memory that compels my wonder:
   > 💡 **Answer**: **d) ability** (Options: a) irritation  b) inability  c) inferiority  d) ability)
3. We have to re-call the struggles of the past and realize the **perils** and possibilities:
   > 💡 **Answer**: **b) dangers** (Options: a) safeties  b) dangers  c) securities  d) certainty)

---

## 🔄 Q4–Q6: Antonyms Master Table (Prose 1 to 6)

| # | Word | English Meaning | Antonym / Opposite | தமிழ் எதிர்ச்சொல் |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **wrinkled** | சுருக்கம் விழுந்த | **smooth, unwrinkled** | மென்மையான |
| **02** | **pretty** | கவர்ச்சியான | **ugly** | அசிங்கமான |
| **03** | **absurd** | பொருத்தமற்ற | **logical** | சரியான |
| **04** | **undignified** | தரமற்ற | **honoured, respected** | மரியாதைக்குரிய |
| **05** | **scattered** | சிதறிய | **gathered** | சேகரிக்கப்பட்ட |
| **06** | **inaudible** | கேட்க இயலாத | **audible, heard** | கேட்கக் கூடிய |
| **07** | **expanse** | பரந்த | **narrow** | குறுகிய |
| **08** | **serenity** | அமைதியான | **agitation** | கலவரமான |
| **09** | **contentment** | திருப்தி | **greediness** | பேராசை |
| **10** | **monotonous** | சலிப்பூட்டும் | **interesting** | ஆர்வமூட்டும் |
| **11** | **compulsory** | கட்டாயமான | **voluntary** | விருப்பத்திற்குரிய |
| **12** | **prosperous** | வசதியான | **poor** | ஏழ்மையான |
| **13** | **exasperation** | எரிச்சல் | **calmness** | அமைதி |

---

##### 🏛️ Government Exam Antonym Questions (MDL-18)
1. The other teams had already completed their weight in, which is **compulsory** for all players:
   > 💡 **Answer**: **c) voluntary**
2. The staff looked so **prosperous** and unsympathetic:
   > 💡 **Answer**: **c) poor**
3. My wife looked at me with an expression of wonder - not anger or **exasperation**:
   > 💡 **Answer**: **b) calmness**`
    },
    {
      id: "lsn_wts_p1_compound_and_affixes",
      moduleId: "mod_wts_part1",
      title: "7-8. Compound Words & Prefixes/Suffixes",
      tamil: "கூட்டுச் சொற்கள் & முன்னொட்டு/பின்னொட்டு",
      content: `## 🔗 Q7A. Compound Words Master Table

### 15 Combination Types Table

| # | Combination Type | Examples & Words |
| :---: | :--- | :--- |
| **01** | **Noun + Noun** | shop-owner, dream-world, bed-time, rabbit-hole, chessmen, cork-screw, sun-dial, wonderland, postman, motorcycle, honeybee, craftsman |
| **02** | **Noun + Adjective** | knee-deep, homesick, henpecked |
| **03** | **Adverb + Noun** | insight, postscript |
| **04** | **Gerund + Noun** | looking-glass, washing machine, dining table, reading room, walking stick, swimming pool |
| **05** | **Adjective + Gerund** | curious-looking, shabby-looking |
| **06** | **Adjective + Past Participle** | dreamy-eyed, long-awaited |
| **07** | **Adjective + Adjective** | kindhearted, blue-green, red-handed |
| **08** | **Verb + Noun** | push-button, treadmill |
| **09** | **Adjective + Verb** | safeguard, whitewash |
| **10** | **Adverb + Verb** | overthrow, upset |
| **11** | **Object(Noun) + Noun** | telephone operator, science teacher |
| **12** | **Object(Noun) + Gerund** | air-conditioning, sightseeing |
| **13** | **Adjective + Noun** | blackboard, blueprint, grandmother |
| **14** | **Noun + Adjective** | lifelong, jet black, snow white |
| **15** | **Verb + Noun** | popcorn, crybaby |

---

##### 🏛️ Board Exam Question (MDL-18)
> **Question**: Choose the word from options to form a compound word with **"toll"**:
> - a) plaza &nbsp;&nbsp; b) late &nbsp;&nbsp; c) proof &nbsp;&nbsp; d) wheel
>
> 💡 **Answer**: **a) plaza** (toll plaza)

---

### ✏️ Type-1 Practice Exercises (Forming Compound Words)

1. **mantel** + **piece** = \`mantelpiece\`
2. **eye** + **lashes** = \`eyelashes\`
3. **water** + **proof** = \`waterproof\`
4. **bee** + **hive** = \`beehive\`
5. **toll** + **gate** = \`tollgate\`
6. **door** + **knob** = \`doorknob\`
7. **spinning** + **wheel** = \`spinning wheel\`
8. **grand** + **mother** = \`grandmother\`
9. **sing** + **song** = \`singsong\`
10. **sun** + **set** = \`sunset\`

---

### ✏️ Type-2 Practice Exercises (Combination Identification)

1. **Whitewash** -> \`Adjective + Verb\`
2. **Birthplace** -> \`Noun + Noun\`
3. **Kitchen garden** -> \`Noun + Noun\`
4. **Handshake** -> \`Noun + Verb\`
5. **Washing soap** -> \`Gerund + Noun\`

---

## ✂️ Q7B. Prefixes & Suffixes Master Class

### Common Prefixes Table
| Prefix | Meaning | Root Word | Formed Word |
| :---: | :--- | :--- | :--- |
| **in-** | not | audible | **inaudible** |
| **un-** | not | happy | **unhappy** |
| **dis-** | opposite | honest | **dishonest** |
| **il-** | not | legitimate | **illegitimate** |
| **im-** | not | possible | **impossible** |
| **ir-** | not | regular | **irregular** |

##### 🏛️ Board Exam Question (MDL-18)
> Form a new word by adding suitable prefix to root word **"audible"**:
> 💡 **Answer**: **in-** (inaudible)`
    },
    {
      id: "lsn_wts_p1_abbrev_clipped_def",
      moduleId: "mod_wts_part1",
      title: "9-11. Abbreviations, Clipped Words & One-Word Definitions",
      tamil: "சுருக்கக் குறியீடுகள் & சொற்பொருள் விளக்கம்",
      content: `## 🔤 Q7C. Abbreviations & Acronyms Master Table

| # | Abbreviation | Full Form Expansion |
| :---: | :--- | :--- |
| **01** | **RSC** | Referee Stopped Contest |
| **02** | **USA** | United States of America |
| **03** | **AIBA** | Association Internationale de Boxe Amateur |
| **04** | **IELTS** | International English Language Testing System |
| **05** | **GST** | Goods and Services Tax |
| **06** | **TNPSC** | Tamil Nadu Public Service Commission |
| **07** | **STD** | Subscribers' Trunk Dialing |
| **08** | **ISD** | International Subscribers' Dialing |
| **09** | **MBA** | Master of Business Administration |
| **10** | **MHRD** | Ministry of Human Resource Development |
| **11** | **GPS** | Global Positioning System |
| **12** | **NSS** | National Service Scheme |
| **13** | **PTA** | Parent-Teacher Association |
| **14** | **NGO** | Non-Governmental Organization |
| **15** | **ICU** | Intensive Care Unit |
| **16** | **IIM** | Indian Institute of Management |
| **17** | **MRI** | Magnetic Resonance Imaging |
| **18** | **ECG** | Electro-Cardio Gram |
| **19** | **NCC** | National Cadet Corps |
| **20** | **LED** | Light Emitting Diode |
| **21** | **CPU** | Central Processing Unit |
| **22** | **CBSE** | Central Board of Secondary Education |
| **23** | **GDP** | Gross Domestic Product |
| **24** | **LCD** | Liquid Crystal Display |
| **25** | **NRI** | Non Resident Indian |

---

## ✂️ Q7D. Clipped Words Master Table

| # | Original Word | Clipped Form |
| :---: | :--- | :--- |
| **01** | **Demonstration** | **Demo** |
| **02** | **Chimpanzee** | **Chimp** |
| **03** | **Photograph** | **Photo** |
| **04** | **Microphone** | **Mic / Mike** |
| **05** | **Cafeteria** | **Cafe** |
| **06** | **Gasoline** | **Gas** |
| **07** | **Helicopter** | **Copter** |
| **08** | **Telephone** | **Phone** |
| **09** | **University** | **Varsity** |
| **10** | **Memorandum** | **Memo** |
| **11** | **Influenza** | **Flu** |
| **12** | **Hippopotamus** | **Hippo** |
| **13** | **Bridegroom** | **Groom** |
| **14** | **Fanatic** | **Fan** |
| **15** | **Refrigerator** | **Fridge** |
| **16** | **Aeroplane** | **Plane** |
| **17** | **Examination** | **Exam** |
| **18** | **Perambulator** | **Pram** |

---

## 📖 Q7E. Definition of Words / One-Word Substitutions

| # | Word / Specialist | Definition |
| :---: | :--- | :--- |
| **01** | **bibliophile** | great lover of books |
| **02** | **polyglot** | fluent in multiple languages |
| **03** | **ambidextrous** | able to use both hands effectively at same time |
| **04** | **philanthropist** | donates large sums to set up public library/welfare |
| **05** | **teetotaller** | one who always refuses alcohol |
| **06** | **optimist** | one who believes everything turns out for the best |
| **07** | **Cardiologist** | doctor who treats heart diseases |
| **08** | **Ornithologist** | scientist who studies birds |
| **09** | **Entomologist** | scientist who studies insects |
| **10** | **Archaeologist** | scientist who studies artefacts & physical remains |
| **11** | **Seismologist** | scientist who studies earthquakes |
| **12** | **Pathologist** | scientist who studies diseases |`
    },
    {
      id: "lsn_wts_p1_phrasal_idioms_foreign",
      moduleId: "mod_wts_part1",
      title: "12-14. Phrasal Verbs, Idioms & Foreign Phrases",
      tamil: "கூட்டு வினைகள் & மரபுத்தொடர்கள்",
      content: `## 🗣️ Q7F. Phrasal Verbs Master Table

| Phrasal Verb | Meaning | Example Sentence |
| :--- | :--- | :--- |
| **stand up** | maintain, withstand | Your statement will not stand up as proof. |
| **stand for** | support, accept | My father always stands for truth. |
| **look into** | examine | The police officer looked into the matter. |
| **run over** | hit with vehicle | The lorry ran over the dog. |
| **put on** | wear | I put on my new uniform. |
| **put off** | postpone | They put off the football match. |
| **call off** | cancel | The manager called off the meeting. |
| **give up** | abandon | He should give up bad habits. |
| **take after** | resemble | He takes after his mother. |

---

## 💡 Q7G. Common Idioms Master Table

| # | Idiom | Meaning |
| :---: | :--- | :--- |
| **01** | **throw in the towel** | to give up |
| **02** | **in our corner** | on your side in an argument |
| **03** | **on the ropes** | state of near collapse or defeat |
| **04** | **below the belt** | unfair or unsporting behavior |
| **05** | **square off** | prepare for a conflict |
| **06** | **alarm bells ringing** | sign of something going wrong |
| **07** | **back to the wall** | in serious difficulty |
| **08** | **saved by the bell** | rescued at the last moment |
| **09** | **right up one's alley** | type of thing you enjoy doing |
| **10** | **drive one up the wall** | to annoy or irritate someone |
| **11** | **hit the road** | to leave; depart; begin journey |
| **12** | **take for a ride** | to trick, cheat, or lie to someone |
| **13** | **have cold feet** | feel nervousness and anxiety |

---

## 🌐 Q7I. Foreign Words & Phrases Master Table

| Foreign Word/Phrase | Origin | Meaning |
| :--- | :---: | :--- |
| **viva voce** | Latin | a spoken examination |
| **bonafide** | Latin | genuine |
| **sine die** | Latin | without a date being fixed, indefinitely |
| **in toto** | Latin | totally |
| **rapport** | French | a close relationship |
| **liaison** | French | coordination of activities |
| **bon voyage** | French | saying goodbye |
| **en route** | French | on the way |
| **de facto** | Latin | in fact |
| **ex gratia** | Latin | given as a favour |
| **ad hoc** | Latin | for a particular purpose |
| **prima facie** | Latin | at first sight |
| **en masse** | French | as a group |
| **faux pas** | French | social blunder |

---

## 🕊️ Q7J. Euphemisms (Polite Substitutes)

| Direct / Taboo Term | Polite Euphemism |
| :--- | :--- |
| **blind** | visually challenged |
| **disabled / handicapped** | differently-abled / special child |
| **lavatory** | rest-room |
| **housewife** | homemaker |
| **poor** | low income level |
| **slow-learners** | late-bloomers |
| **fat** | full-figured |
| **died** | passed away |
| **jail** | correctional facility |`
    },
    {
      id: "lsn_wts_p1_modals_preps_tags",
      moduleId: "mod_wts_part1",
      title: "15-20. Modals, Prepositions, Question Tags & Patterns",
      tamil: "Modals, Prepositions, Tags & Sentence Patterns",
      content: `## ⚙️ Q7K–Q7Q. Grammar Masterclass

### 13 Modal Auxiliaries Breakdown Table

| Type | Verb | Primary Usage | Example |
| :---: | :--- | :--- | :--- |
| **Modal** | **Will** | Futurity / Determination | They will come tomorrow. |
| **Modal** | **Would** | Request / Improbable | Would you mind moving a bit? |
| **Modal** | **Shall** | Futurity / Suggestion | Shall I close the door? |
| **Modal** | **Should** | Advice / Duty | Children should obey parents. |
| **Modal** | **Can** | Ability / Capacity | I can drive a car. |
| **Modal** | **Could** | Polite Request | Could you lend me a pen? |
| **Modal** | **May** | Possibility / Permission | It may rain tonight. |
| **Modal** | **Must** | Compulsion / Necessity | You must obey the rules. |
| **Semi-Modal** | **Used to** | Past Habit | He used to play football. |
| **Semi-Modal** | **Ought to** | Moral Duty | You ought to help the poor. |

---

### 🎵 Q7N. Syllabification Master Table

| Syllable Count | Classification | Example Words |
| :---: | :--- | :--- |
| **1 Syllable** | Monosyllabic | thought, dropped, glum, queue |
| **2 Syllables** | Disyllabic | a-bout, in-side, mu-sic, bit-ter |
| **3 Syllables** | Trisyllabic | pro-per-ly, per-ma-nent, beau-ti-ful |
| **4 Syllables** | Tetrasyllabic | en-ter-tain-ment, as-tro-no-my |
| **5 Syllables** | Pentasyllabic | ex-tra-va-gan-za, ex-am-i-na-tion |

---

### 🇺🇸 Q7O. American vs British English Table

| British English | American English |
| :--- | :--- |
| **advertisement** | notice |
| **biscuit** | cookie |
| **flat** | apartment |
| **lift** | elevator |
| **lorry** | truck |
| **centre** | center |
| **colour** | color |
| **tyre** | tire |

---

### 🎯 Q7Q. Sentence Patterns (S-V-O-C-A)

| # | Sentence | Pattern Breakdown |
| :---: | :--- | :---: |
| **01** | He / kicked / the dog | **S V O** |
| **02** | Please bring / me / some water | **V IO DO** |
| **03** | The actor / turned / politician | **S V C** |
| **04** | He / tore / the letter / open | **S V O C** |
| **05** | Children / are sleeping / in the bedroom | **S V A** |
| **06** | Yesterday / I / bought / my children / sweets | **A S V IO DO** |`
    },

    // --- MODULE 2 ---
    {
      id: "lsn_wts_p2_poetry_appreciation",
      moduleId: "mod_wts_part2",
      title: "21-26. Poetry Appreciation & Figures of Speech",
      tamil: "6 செய்யுள்களின் கவிதை வினாக்கள் & Figures of Speech",
      content: `## 📜 Q21–Q26: Poetry Appreciation Questions & Figures of Speech

### Poem 1: ONCE UPON A TIME (Gabriel Okara)
> **Extract**: *"laugh with their teeth while their ice-block-cold eyes..."*
- **Who are 'they'?**: Modern people.
- **ice-block-cold eyes**: Eyes without any warmth of feeling.
- **Figure of Speech**: **Metaphor** (*ice-block-cold eyes*), **Simile** (*like a fixed portrait smile*).

---

### Poem 2: CONFESSIONS OF A BORN SPECTATOR (Ogden Nash)
> **Extract**: *"snaps the knee and cracks the wrist..."*
- **Whom does poet admire?**: Athletes who sweat for fun or hire.
- **Literary Device**: **Onomatopoeia** (*snaps, cracks*).

---

### Poem 3: LINES WRITTEN IN EARLY SPRING (William Wordsworth)
> **Extract**: *"every flower enjoys the air it breathes..."*
- **Poet's Faith**: Flowers enjoy every ounce of air they breathe.
- **Rhyme Scheme**: **abab**.

---

### Poem 4: MACAVITY – THE MYSTERY CAT (T.S. Eliot)
> **Extract**: *"he's called the Hidden Paw"*
- **Why Hidden Paw?**: Master criminal escaping Scotland Yard.
- **Rhyme Scheme**: **aabb**.

---

### 📊 Figures of Speech & Rhyme Schemes Summary Table

| Poem Title | Poet Name | Rhyme Scheme | Key Figures of Speech |
| :--- | :--- | :---: | :--- |
| **1. Once Upon a Time** | Gabriel Okara | Irregular | Metaphor, Simile, Repetition |
| **2. Confessions of Spectator** | Ogden Nash | aabbcc | Onomatopoeia, Alliteration |
| **3. Lines Written in Early Spring** | William Wordsworth | abab | Personification, Aphorism |
| **4. Macavity – Mystery Cat** | T.S. Eliot | aabb | Simile, Personification, Alliteration |
| **5. Everest Is Not Only Peak** | Kulothungan | Irregular | Metaphor, Alliteration |
| **6. The Hollow Crown** | William Shakespeare | Blank Verse | Personification, Metaphor, Simile |`
    },
    {
      id: "lsn_wts_p2_transformations",
      moduleId: "mod_wts_part2",
      title: "27-30. Transformation of Sentences",
      tamil: "Direct/Indirect, Active/Passive, Simple/Compound/Complex, If-Clauses",
      content: `## 🔄 Q27–Q30: 4 Major Sentence Transformations

### 27. Direct & Indirect Speech

| Direct Speech Adverbial | Indirect Speech Adverbial |
| :--- | :--- |
| **this** | **that** |
| **these** | **those** |
| **here** | **there** |
| **now** | **then** |
| **today** | **that day** |
| **yesterday** | **the previous day** |
| **tomorrow** | **the next day** |

---

### 28. Active Voice to Passive Voice (8 Tenses Formula)

| Tense | Active Voice Formula | Passive Voice Formula |
| :--- | :--- | :--- |
| **Simple Present** | V1 / V1+s | **am / is / are + V3** |
| **Simple Past** | V2 | **was / were + V3** |
| **Simple Future** | shall / will + V1 | **shall / will + be + V3** |
| **Present Continuous** | am / is / are + V-ing | **am / is / are + being + V3** |
| **Past Continuous** | was / were + V-ing | **was / were + being + V3** |
| **Present Perfect** | have / has + V3 | **have / has + been + V3** |
| **Past Perfect** | had + V3 | **had + been + V3** |

---

### 29. Simple, Compound & Complex Conjunctions Table

| Purpose | Simple Phrase | Compound Conjunction | Complex Clause |
| :--- | :--- | :--- | :--- |
| **Reason** | Because of / Due to | **and so / therefore** | **As / Since / Because** |
| **Contrast** | In spite of / Despite | **but / yet / still** | **Though / Although** |
| **Condition** | In the event of | **and** | **If...will** |
| **Negative Condition** | In case of not | **or / otherwise** | **Unless...can** |

---

### 30. Conditional Clauses (If-Clauses 4 Types)

| Type | Meaning | Condition (If) Clause | Result Clause |
| :---: | :--- | :--- | :--- |
| **Type 0** | Scientific Fact | **If + Present Simple** | **Present Simple** |
| **Type I** | Possible | **If + Present Simple** | **will + V1** |
| **Type II** | Imaginary | **If + Past Simple / were** | **would + V1** |
| **Type III** | Impossible Past | **If + Past Perfect (had+V3)** | **would have + V3** |`
    },

    // --- MODULE 3 ---
    {
      id: "lsn_wts_p3_erc_and_prose_qa",
      moduleId: "mod_wts_part3",
      title: "31-36. Poem ERC & Prose Short Answers",
      tamil: "Poem ERC & 6 Prose Short Answer QA",
      content: `## ✍️ Q31–Q36: Poem ERC & Prose Short Answers

### Poem ERC Format Table

| Field | Standard Statement Format |
| :--- | :--- |
| **Context** | These lines are taken from the poem **"[Poem Name]"** written by **[Poet Name]**. |
| **Explanation** | The poet explains that [Explanation of the line]. |
| **Comment** | This line highlights [Poetic message / theme]. |

---

### Prose Short Answers Breakdown

1. **Portrait of a Lady**: Grandfather wore big turban, long white beard, looked 100 years old.
2. **Queen of Boxing**: Mary Kom's father raised Rs. 2000; friends collected Rs. 8000 from MPs.
3. **Forgetting**: Lynd wonders at the great efficiency of human memory.
4. **Tight Corners**: Auction room at King Street selling Barbizon pictures.`
    },
    {
      id: "lsn_wts_p3_practical_writing",
      moduleId: "mod_wts_part3",
      title: "37-40. Practical Writing & Communication Skills",
      tamil: "Dialogue, Process, Notice, Email, Headlines, Error Spotting",
      content: `## 📝 Q37–Q40: Practical Writing & Communication

### Practical Writing Format Overview

- **Dialogue Writing**: 3 Complete exchanges (Patient-Doctor, Student-Manager).
- **Process Description**: Bulleted step-by-step instructions (*Binding a book, Making tea*).
- **Notice Writing**: 50-word official box notice format.
- **E-mail Writing**: Formal order email layout with Subject, Salutation & Body.
- **Error Spotting**: 20 Golden Rules (*one of the + plural noun, senior to, etc.*).`
    },

    // --- MODULE 4 ---
    {
      id: "lsn_wts_p4_paragraphs_mastery",
      moduleId: "mod_wts_part4",
      title: "41-43. Paragraph Answers (Prose, Poetry & Supplementary)",
      tamil: "உரைநடை, கவிதை & கதை நெடு வினாக்கள்",
      content: `## 📚 Q41–Q43: Paragraph Answers Master Guide

- **Prose Paragraphs**: *Portrait of a Lady*, *Queen of Boxing*, *Convocation Address*.
- **Poetry Paragraphs**: *Once Upon a Time*, *Born Spectator*, *Hollow Crown*.
- **Supplementary Reader**: *After Twenty Years*, *A Shot in the Dark*, *The First Patient*.`
    },
    {
      id: "lsn_wts_p4_bio_data_and_essays",
      moduleId: "mod_wts_part4",
      title: "44-47. Bio-Data, Job Application, Essays & Story Expansion",
      tamil: "வேலை விண்ணப்பம், சுயவிவரக் குறிப்பு & பொதுக் கட்டுரைகள்",
      content: `## 📑 Q44–Q47: Job Application, Bio-Data & General Essays

### 12-Field Bio-Data / Resume Layout

1. **Name**: [Your Name]
2. **Father's Name**: [Father's Name]
3. **Date of Birth**: [DD/MM/YYYY]
4. **Address**: [Postal Address]
5. **Educational Qualification**: B.Com / B.A. English (First Class)
6. **Experience**: 3 Years
7. **Languages Known**: Tamil, English
8. **Declaration**: I hereby declare that the details above are true to the best of my knowledge.`
    }
  ];

  for (let idx = 0; idx < allLessons.length; idx++) {
    const l = allLessons[idx];
    await db.execute(
      `INSERT INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  // 5. Quiz Exercises
  await db.execute(
    `INSERT INTO exercises (id, lesson_id, level_id, title, exercise_type, instructions, tamil_instructions, xp_points, order_index)
     VALUES ('ex_wts_master_quiz', 'lsn_wts_p1_synonyms_antonyms', 'B1', '11th Standard WTS Master Quiz', 'mcq', 'Choose the correct option', 'சரியான விடையைத் தேர்ந்தெடுக்க', 100, 1)`
  );

  const quizQuestions = [
    { q: "Choose synonym for 'puckered' (MDL-18)", ta: "puckered என்பதன் பொருள்:", ans: "wrinkled" },
    { q: "Choose antonym for 'compulsory' (MDL-18)", ta: "compulsory என்பதன் எதிர்ச்சொல்:", ans: "voluntary" },
    { q: "Form compound word with 'toll'", ta: "toll என்பதன் கூட்டுச் சொல்:", ans: "plaza" },
    { q: "Prefix for 'audible'", ta: "audible என்பதன் முன்னொட்டு:", ans: "in" },
    { q: "Expanded form of 'GST'", ta: "GST விரிவாக்கம்:", ans: "Goods and Services Tax" },
    { q: "Clipped form of 'Demonstration'", ta: "Demonstration என்பதன் சுருக்கப்பட்ட சொல்:", ans: "Demo" },
    { q: "Definition of 'Ornithologist'", ta: "Ornithologist என்பதன் விளக்கம்:", ans: "one who studies birds" }
  ];

  for (let i = 0; i < quizQuestions.length; i++) {
    const qz = quizQuestions[i];
    await db.execute(
      `INSERT INTO questions (exercise_id, question_text, tamil_subtext, correct_answer, order_index)
       VALUES ('ex_wts_master_quiz', ?, ?, ?, ?)`,
      [qz.q, qz.ta, qz.ans, i + 1]
    );
  }

  console.log('🎉 UNIFIED Master Seeding with Structured Tables successfully completed!');
}

if (require.main === module) {
  seedMasterPdfDataset()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedMasterPdfDataset;
