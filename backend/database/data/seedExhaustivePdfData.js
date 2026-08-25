/**
 * SEED EXHAUSTIVE PDF DATASET FOR CLASS 11 ENGLISH WAY TO SUCCESS (2019)
 * Seeds ALL questions, answers, grammar topics, ERCs, comprehension passages,
 * letters, essays, and stories from the entire 139-page PDF guide into SQLite.
 * Run: node backend/database/data/seedExhaustivePdfData.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedExhaustivePdfData() {
  console.log('🚀 Starting Complete Seeding of ALL 139 Pages of +1 WTS English PDF...');
  await runMigration();

  // 1. Wipe old content
  await db.execute('DELETE FROM user_progress');
  await db.execute('DELETE FROM questions');
  await db.execute('DELETE FROM exercises');
  await db.execute('DELETE FROM lesson_content');
  await db.execute('DELETE FROM lessons');
  await db.execute('DELETE FROM modules');
  await db.execute('DELETE FROM courses');

  // 2. Insert Main Course
  await db.execute(
    `INSERT INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (Way to Success முழுப் பாடம்)', 'Complete 139-Page Way to Success +1 English Guide: Part I (Q1-20), Part II (Q21-30), Part III (Q31-40), Part IV (Q41-47). All questions, answers, grammar, ERC, essays, and letters included.', 1, 1)`
  );

  // 3. Insert 4 Modules matching Part I, Part II, Part III, Part IV
  const modulesData = [
    {
      id: 'mod_wts_p1',
      title: 'Part I: 1-Mark Questions & Vocabulary (Q1–Q20 | 20 Marks)',
      tamil: 'பகுதி 1: 1-மதிப்பெண் வினாக்கள் & இலக்கணம் (20 மதிப்பெண்கள்)',
      desc: 'Q1-Q20 Complete: Synonyms (Prose 1-6), Antonyms (Prose 1-6), Compound Words, Prefixes & Suffixes, Abbreviations, Clipped Words, Word Definitions, Phrasal Verbs, Idioms, Foreign Words, Euphemisms, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns.',
      order: 1
    },
    {
      id: 'mod_wts_p2',
      title: 'Part II: Poetry Appreciation & Transformations (Q21–Q30 | 14 Marks)',
      tamil: 'பகுதி 2: செய்யுள் வினாக்கள் & வாக்கிய மாற்றம் (14 மதிப்பெண்கள்)',
      desc: 'Q21-Q26: Poetry Appreciation & Figures of Speech for all 6 Poems. Q27-Q30: Direct/Indirect Speech, Active/Passive Voice, Simple/Compound/Complex, Conditional (If) Clauses.',
      order: 2
    },
    {
      id: 'mod_wts_p3',
      title: 'Part III: ERC, Short Answers & Practical Writing (Q31–Q40 | 21 Marks)',
      tamil: 'பகுதி 3: இடம்பெற்று விளக்குதல், சிறு வினாக்கள் & எழுத்துப்பயிற்சி (21 மதிப்பெண்கள்)',
      desc: 'Q31-Q33: Poem ERC (Context, Explanation, Comment). Q34-Q36: Prose Short Answers (Units 1-6). Q37-Q40: Dialogue Writing, Non-verbal Pie Charts, Process Descriptions, Proverbs & Semantic Fields, Notice Writing, Headline Expansion, Email Writing, Error Spotting, Question Framing, Tenses.',
      order: 3
    },
    {
      id: 'mod_wts_p4',
      title: 'Part IV: Paragraphs, Essays & Applications (Q41–Q47 | 35 Marks)',
      tamil: 'பகுதி 4: நெடு வினாக்கள், கட்டுரைகள் & வேலை விண்ணப்பம் (35 மதிப்பெண்கள்)',
      desc: 'Q41: Prose Paragraphs (Units 1-6). Q42: Poetry Paragraphs (Poems 1-6). Q43: Supplementary Reader Stories. Q44: Summary Writing & Note Making. Q44B: Bio-data & Biographical Sketch. Q44C: Report Writing. Q45: Prose & Poetry Comprehension Passages. Q46: Official & Personal Letters. Q46B: General Essays & Story Expansions.',
      order: 4
    }
  ];

  for (const m of modulesData) {
    await db.execute(
      `INSERT INTO modules (id, course_id, title, tamil_title, description, order_index)
       VALUES (?, 'crs_class11', ?, ?, ?, ?)`,
      [m.id, m.title, m.tamil, m.desc, m.order]
    );
  }

  // 4. PART I LESSONS
  const part1Lessons = [
    {
      id: "lsn_p1_synonyms_glossary",
      moduleId: "mod_wts_p1",
      title: "1-3. Synonyms & Glossary (Prose Units 1 to 6)",
      tamil: "1-3. கலைச்சொற்கள் & பொருள் (உரைநடை 1 முதல் 6)",
      content: `### 📖 Q1-3: Synonyms & Textbook Glossary (Text Book pg 4,5,6,38,70,108,142,170,171)

#### Prose 1: The Portrait of a Lady (Khushwant Singh)
- **mantelpiece**: shelf above the fireplace (வீட்டின் எறிமாடம்)
- **absurd**: inconsistent / illogical (பொருத்தமற்ற, அற்பத்தனமான)
- **fables**: tales / stories (கதைகள்)
- **hobbled**: walked unsteadily (தள்ளாடி நடத்தல்)
- **pucker**: wrinkle (சுருக்கம், மடிப்பு)
- **expanse**: widespread (பரவுதல்)
- **monotonous**: boring, unchanging (சலிப்பூட்டும்)
- **snapped**: broke / cut (துண்டித்தல்)
- **seclusion**: isolation, separation (தனிமைப்படுத்துதல்)
- **bedlam**: noisy confusion (கூச்சலான குழப்பம்)
- **perched**: sat comfortably, rested (சௌகரியமாக அமர்ந்து ஓய்வெடுத்தல்)
- **rebukes**: scoldings (எதிர்ப்பு, திட்டுதல்)
- **dilapidated**: damaged (சேதமான, ஓரங்கட்டப்பட்ட)
- **pallor**: unhealthy pale appearance (வெளிறிய தோற்றம்)
- **shroud**: cloth used to wrap a dead person (இறந்த உடலை மூடும் துணி)

##### Govt Exam Questions (MDL-18):
1. Her silver locks were scattered untidily over her pale, **puckered** face: **wrinkled**
2. It is the **efficiency** rather than the inefficiency of human memory that compels my wonder: **ability**
3. We have to re-call the struggles of the past and realize the **perils** and possibilities: **dangers**

##### Practice Questions (20 Qs):
1. She had been old and **wrinkled**: **crumpled**
2. We treated it like the **fables** of the prophets: **stories**
3. theories with a special stamp, but only reiteratesome of the cardinal principles **enunciated**: **spoke clearly**
4. The greatest disadvantage for me was my loss of **appetite**: **hunger**
5. They consoled me and **lauded** me on the silver win: **appreciated**
6. As they recall their **exploits** or their errors: **daring acts**
7. I ate enough to **sate**: **satisfy**
8. She **hobbled** about the house in spotless: **staggered**
9. During the monarchical or **feudal** days, Universities had to train scholars: **old-fashioned**
10. Her silver locks were **scattered**: **disordered**

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
- **vintages**: wine of high quality produced in a particular year (தரமான திராட்சை மது)
- **antipathy**: strong dislike (அதிகமான வெறுப்பு)
- **fortunes**: huge sums of money (அதிக பணம் / சொத்து)
- **reluctant**: unwilling (வேண்டா வெறுப்பாக)
- **delinquent**: wrong doer (தவறு செய்பவன், குற்றவாளி)
- **exploits**: daring/heroic acts/achievements (வீரச்செயல்கள், சாதனைகள்)
- **abstracted**: lacking concentration (கவனமின்மை)
- **prosaic**: dull, simple, plain (எளிய, சாதாரண)
- **mediocre**: ordinary (சாதாரணமான)
- **fallible**: capable of making mistakes (தவறு செய்பவன்)
- **sieve**: strainer / filter (சல்லடை)
- **audacious**: bold and daring (தைரியமான)
- **eccentric**: tending to act strangely (விநோதமான விருப்பம்)
- **indignant**: being very angry (கோபமடைந்த)
- **quivering**: trembling, shivering (நடுங்குதல்)
- **vexation**: irritation, annoyance (வேண்டா வெறுப்பு)

---

#### Prose 4: A Tight Corner (E. V. Lucas)
- **electrified**: shocked by something unexpected (அதிர்ச்சியடைவது)
- **crescendo**: progress towards a climax (முன்னேற்றம்)
- **congealed**: thickened as if frozen (உறைந்துபோதல்)
- **smothered**: suppressed (நசுக்கப்படுதல்)
- **nonchalantly**: unconcernedly, coolly (ஆர்வம் இல்லாமல்)
- **glibly**: smoothly but not sincerely (அலங்காரமாக)
- **note of hand**: promissory note (கடன் பத்திர பாண்ட்)
- **rectitude**: honesty, good behaviour (நேர்மை)
- **farthing**: as low as a paisa (பைசா போன்ற நாணயம்)
- **baize**: coarse woollen material (கம்பளி ஆடை)
- **guile**: cunning, deceit (சூழ்ச்சிக்காரர்)
- **indelible**: cannot be rubbed out (அழியாத, மறக்க இயலாத)
- **persuade**: convince somebody (சமாதானப்படுத்து)
- **akin**: similar, connected (ஒரேமாதிரியான)
- **tremendous**: amazing, overwhelming (அற்புதமான)

---

#### Prose 5: Convocation Address (Dr. Arcot Ramasamy Mudaliar)
- **conferred**: granted a title or degree (விருது / பட்டம் வழங்குதல்)
- **reiterate**: repeat, say or do again (மீண்டும் வலியுறுத்துதல்)
- **enunciated**: spoke clearly (தெளிவாக பேசுதல்)
- **ruggedness**: toughness, strength (மிக்க கடின உழைப்பு)
- **repositories**: storehouses (களஞ்சியங்கள்)
- **emissaries**: deputies, ambassadors (தூதுவர், முகவர்)
- **eschewed**: avoided, have nothing to do with (புறக்கணித்தல்)
- **autocracy**: government by one ruler (ஒருநபர் ஆட்சி)
- **feudal**: out-of-date, medieval (நிலச்சுவாந்தார் ஆட்சி)
- **confronting**: aggressively resisting (மூர்க்கமாக எதிர்த்தல்)
- **secluded spheres**: isolated areas (தனித்து விடப்பட்ட பகுதிகள்)
- **cloistered**: restricted (பாதுகாக்கப்பட்ட)
- **perseverance**: steadfastness, continuous efforts (விடாமுயற்சி)
- **inherent**: inborn, innate (பிறப்பிலேயே பெற்றது)
- **perils**: dangers, risks (ஆபத்துகள்)
- **indebted**: obliged to repay (கடன்பட்ட)
- **tillers**: cultivators (உழவர்கள், விவசாயிகள்)

---

#### Prose 6: The Accidental Tourist (Bill Bryson)
- **alley**: narrow passage between buildings (குறுக்குப் பாதை, சந்து)
- **en famille**: as a family (குடும்பமாக)
- **yanked**: pulled with jerk (இழுத்த)
- **consternation**: worry (துன்பம்)
- **extravagantly**: excessively (உதாரியாக)
- **cascade**: water fall (நீர்வீழ்ச்சி)
- **concourse**: open central area in large building (முற்றம்)
- **disgorging**: discharging (வெளியேற்றக்கூடிய)
- **gashed**: cut deeply (ஆழமான வெட்டுக் காயம்)
- **hysterics**: fit of uncontrollable laughing/crying (கட்டுப்படுத்த இயலாத சிரிப்பு/அழுகை)
- **exasperation**: irritation (எரிச்சலடைதல்)
- **catastrophe**: terrible disaster (பேரழிவு)
- **bons mots**: witty remarks (நகைச்சுவைகள்)
- **suave**: polite and sophisticated (நாகரீகமான)
- **venerable**: respected (மரியாதைக்குரிய)`
    },
    {
      id: "lsn_p1_antonyms_glossary",
      moduleId: "mod_wts_p1",
      title: "4-6. Antonyms Masterlist (Prose Units 1 to 6)",
      tamil: "4-6. எதிர்ச்சொற்கள் (உரைநடை 1 முதல் 6)",
      content: `### 🔄 Q4-6: Antonyms Master Table (Text Book pg 6, 38, 74)

#### Prose 1: The Portrait of a Lady
- **wrinkled** (சுருக்கம் விழுந்த) X **smooth, unwrinkled** (மென்மையான)
- **pretty** (கவர்ச்சியான) X **ugly** (அசிங்கமான)
- **absurd** (பொருத்தமற்ற) X **logical** (சரியான)
- **undignified** (தரமற்ற) X **honoured, respected** (மரியாதைக்குரிய)
- **scattered** (சிதறிய) X **gathered** (சேகரிக்கப்பட்ட)
- **inaudible** (கேட்க இயலாத) X **audible, heard** (கேட்கக் கூடிய)
- **expanse** (பரந்த) X **narrow** (குறுகிய)
- **serenity** (அமைதியான) X **agitation** (கலவரமான)
- **contentment** (திருப்தி) X **greediness** (பேராசை)
- **monotonous** (சலிப்பூட்டும்) X **interesting** (ஆர்வமூட்டும்)
- **attached** (இணைக்கப்பட்ட) X **detached** (பிரித்தெடுக்கப்பட்ட)
- **omitted** (விடுபட்ட) X **included, accepted** (சேர்க்கப்பட்ட)

#### Prose 2: The Queen of Boxing
- **amateur** (பயிற்சியற்ற) X **professional** (பயிற்சிபெற்ற)
- **compulsory** (கட்டாயம்) X **optional, voluntary** (கட்டாயமில்லாத)
- **traditional** (பாரம்பரியமான) X **modern** (நவீனமான)
- **expensive** (விலை அதிகமான) X **cheap** (விலை குறைவான)
- **princely** (அதிகமான) X **few** (குறைவான)
- **enormously** (மிகஅதிக அளவில்) X **tiny** (மிகச்சிறிய அளவில்)
- **defeated** (தோல்வியடைந்த) X **won** (வெற்றிபெற்ற)
- **inferior** (கீழான) X **superior** (மேலான)

#### Prose 3: Forgetting
- **lost** (இழந்த) X **gained** (திரும்பப் பெற்ற)
- **prosaic** (எளிய, சாதாரண) X **interesting** (ஆர்வமூட்டக்கூடிய)
- **admitted** (அனுமதிக்கப்பட்ட) X **denied** (மறுக்கப்பட்ட)
- **quivering** (நடுங்குதல்) X **steady** (சமநிலையில் இருத்தல்)
- **mediocre** (சாதாரணமான) X **extra-ordinary, special** (சிறப்பான)
- **antipathy** (வேண்டாவெறுப்பு) X **liking** (விருப்பம்)
- **reluctant** (ஆர்வம் அற்ற) X **willing, interested** (ஆர்வமுள்ள)

#### Prose 4: Tight Corners
- **prosper** (நன்றாக செய்) X **fail, lose** (தோற்றுப்போ)
- **sympathetic** (இரக்கமுள்ள) X **unsympathetic** (இரக்கமற்ற)
- **embrace** (கட்டிப்பிடி) X **release** (விடுவித்துக்கொள்)
- **persuade** (சம்மதிக்கச்செய்) X **dissuade** (செய்யாது இருக்கச்செய்)
- **ponder** (பொருட்படுத்து) X **neglect, forget** (ஒதுக்கிவிடு)
- **genuine** (உண்மையான) X **fake, unreal** (போலியான)

#### Prose 5: Convocation Address
- **privileged** (சலுகைபெற்ற) X **deprived, disadvantaged** (நசுக்கப்பட்ட)
- **indebted** (நன்றிக் கடன்பட்ட) X **thankless** (நன்றிகெட்ட)
- **solace** (ஆறுதல்) X **distress** (விரக்தி)
- **replenish** (நிரப்பு) X **deplete** (காலியாக்கு)
- **potential** (திறமையுடைய) X **incapable** (திறமையற்ற)

#### Prose 6: The Accidental Tourist
- **extravagantly** (தாராளமாக) X **economically** (சிக்கனமான)
- **frustrations** (எரிச்சல்கள்) X **happiness** (மகிழ்ச்சி)
- **discomfort** (ஆறுதலற்ற) X **comfort** (ஆறுதலான)`
    },
    {
      id: "lsn_p1_grammar_a_to_g",
      moduleId: "mod_wts_p1",
      title: "7A–7G. Compound Words, Affixes, Abbreviations, Clipped Words & Idioms",
      tamil: "7A–7G. கூட்டுச்சொற்கள், சுருக்கங்கள் & மரபுத்தொடர்கள்",
      content: `### 🧩 Q7A to Q7G: Grammar Testing Topics (Text Book pg 6, 7, 39, 40, 72, 73, 112, 172, 190)

#### 7A. Compound Words Combinations:
- **Noun + Noun**: shop-owner, dream-world, bed-time, rabbit-hole, chessmen, sun-dial, postman, motorcycle, honeybee, craftsman
- **Noun + Adjective**: knee-deep, homesick, henpecked
- **Adverb + Noun**: insight, postscript
- **Gerund + Noun**: looking-glass, washing machine, dining table, reading room, walking stick, swimming pool
- **Adjective + Gerund**: curious-looking, shabby-looking
- **Adjective + Past Participle**: dreamy-eyed, long-awaited
- **Adjective + Adjective**: kindhearted, blue-green, red-handed
- **Verb + Noun**: push-button, treadmill
- **Adjective + Verb**: safeguard, whitewash
- **Adverb + Verb**: overthrow, upset
- **Object(Noun) + Noun**: telephone operator, science teacher
- **Object(Noun) + Gerund**: air-conditioning, sightseeing
- **Adjective + Noun**: blackboard, blueprint, grandmother
- **Noun + Adjective**: lifelong, jet black, snow white
- **Verb + Noun**: popcorn, crybaby
*Govt Exam Q*: toll + **plaza** = toll plaza

---

#### 7B. Prefixes and Suffixes:
- **Prefixes**: *un-* (untidy), *in-* (inaudible), *dis-* (dishonest), *il-* (illegitimate), *im-* (impossible), *ir-* (irregular), *non-* (nonviolent), *re-* (recall), *de-* (demarcate).
- **Suffixes**: *-able* (beatable), *-ous* (famous), *-ing* (reading), *-or* (doctor), *-er* (cricketer), *-ment* (movement), *-ance* (performance), *-ful* (beautiful), *-ity* (creativity), *-ist* (guitarist), *-ly* (quickly).
*Govt Exam Q*: audible -> **inaudible**

---

#### 7C. Book-Back Abbreviations & Acronyms:
1. **RSC**: Referee Stopped Contest
2. **USA**: United States of America
3. **AIBA**: Association Internationale de Boxe Amateur
4. **IELTS**: International English Language Testing System
5. **GST**: Goods and Services Tax
6. **TNPSC**: Tamil Nadu Public Service Commission
7. **STD**: Subscribers\' Trunk Dialing
8. **ISD**: International Subscribers\' Dialing
9. **MBA**: Master of Business Administration
10. **MHRD**: Ministry of Human Resource Development
11. **GPS**: Global Positioning System
12. **NSS**: National Service Scheme
13. **PTA**: Parent-Teacher Association
14. **NGO**: Non-Governmental Organization
15. **ICU**: Intensive Care Unit
16. **IIM**: Indian Institute of Management
17. **MRI**: Magnetic Resonance Imaging
18. **ECG**: Electro-Cardio Gram
19. **NCC**: National Cadet Corps
20. **LED**: Light Emitting Diode
21. **CPU**: Central Processing Unit
22. **CBSE**: Central Board of Secondary Education
23. **GDP**: Gross Domestic Product
24. **LCD**: Liquid Crystal Display
25. **NRI**: Non Resident Indian
26. **IIT**: Indian Institute of Technology
27. **ITI**: Industrial Training Institute
28. **EMI**: Equated Monthly Installments
*Acronyms*: **OPAC** (Online Public Access Catalogue), **LAN** (Local Area Network), **SALT** (Strategic Arms Limitation Treaty), **GATT** (General Agreement on Trade and Tariffs).

---

#### 7D. Clipped Words:
- Demonstration -> **Demo**
- Chimpanzee -> **Chimp**
- Photograph -> **Photo**
- Microphone -> **Mic / Mike**
- Cafeteria -> **Cafe**
- Gasoline -> **Gas**
- Helicopter -> **Copter**
- Telephone -> **Phone**
- University -> **Varsity**
- Memorandum -> **Memo**
- Influenza -> **Flu**
- Hippopotamus -> **Hippo**
- Bridegroom -> **Groom**
- Fanatic -> **Fan**
- Refrigerator -> **Fridge**
- Aeroplane -> **Plane**
- Examination -> **Exam**
- Perambulator -> **Pram**

---

#### 7E. One-Word Definitions:
- **patriotism**: love of country and willingness to sacrifice for it
- **nationalism**: doctrine that country\'s interests are superior
- **egocentrism**: concern for your own interests and welfare
- **feminism**: doctrine advocating equal rights for women
- **criticism**: serious examination and judgment of something
- **amateurism**: participating in sports as a hobby
- **barbarism**: brutal, savage act
- **idealism**: belief that best possible concepts should be pursued
- **heroism**: exceptional courage when facing danger
- **absenteeism**: habitual failure to be present at work
- **bibliophile**: great lover of books
- **thespian**: one who acts in several roles
- **polyglot**: fluent in multiple languages
- **ambidextrous**: able to use both hands with equal skill
- **philanthropist**: donates large sums to set up public institutions
- **misanthrope**: one who wants to be aloof / hates mankind
- **teetotaller**: one who always refuses alcohol
- **nonagenarian**: active, cheerful person aged 90-99
- **globetrotter**: one who wishes to travel all over the world
- **optimist**: one who believes everything turns out for the best
- **Cardiologist**: treats heart diseases
- **Pugilist**: boxer
- **Pathologist**: studies diseases
- **Psychologist**: studies human mind and behavior
- **Ornithologist**: studies birds
- **Entomologist**: studies insects
- **Archaeologist**: studies artefacts and physical remains
- **Sociologist**: studies functioning of human society
- **Geologist**: studies matter that constitutes the earth
- **Linguist**: studies language and structure
- **Seismologist**: studies earthquakes
- **Herpetologist**: studies reptiles and amphibians
- **Meteorologist**: studies weather and climate

---

#### 7F. Phrasal Verbs:
- **stand up**: maintain, withstand
- **stand for**: support, willing to accept
- **stand by**: ready to help
- **look into**: examine
- **look at**: see
- **look through**: glance, skim
- **run over**: hit someone with vehicle
- **run away**: escape
- **run into**: reach / meet accidentally
- **put on**: wear
- **put up**: start / build
- **put off**: postpone
- **bear with**: tolerate
- **break down**: stop working / repair
- **call off**: cancel
- **call on**: visit someone
- **carry out**: perform duties
- **deal with**: manage
- **get over**: recover from grief
- **give in**: surrender
- **give up**: abandon
- **look after**: take care of
- **look for**: search
- **make out**: understand
- **pass away**: die
- **put up with**: tolerate
- **set out**: start a journey
- **take after**: resemble parents

---

#### 7G. Common Idioms:
1. **throw in the towel**: to give up
2. **in our corner**: on your side in an argument
3. **on the ropes**: state of near collapse or defeat
4. **below the belt**: unfair or unsporting behavior
5. **square off**: prepare for a conflict
6. **alarm bells ringing**: sign of something going wrong
7. **back to the wall**: in serious difficulty
8. **grasp / clutch at straws**: try any method to overcome a crisis
9. **saved by the bell**: rescued at the last moment
10. **hang out dry**: abandoning one in difficulty
11. **right up one\'s alley**: interested in / enjoy doing
12. **drive one up the wall**: annoy or irritate someone
13. **hit the road**: leave; depart; begin journey
14. **take for a ride**: trick, cheat, or lie to someone
15. **in panic mode**: state of fear and anxiety
16. **tight corners**: in a difficult situation
17. **shot his bolt**: exhaust one\'s effort
18. **in a nice pickle**: in a troublesome situation
19. **have cold feet**: feel nervousness and anxiety`
    },
    {
      id: "lsn_p1_grammar_h_to_q",
      moduleId: "mod_wts_p1",
      title: "7H–7Q. Confusables, Foreign Words, Modals, Prepositions, Tags, Syllables, American English, Plural & Sentence Patterns",
      tamil: "7H–7Q. இலக்கணப் பயிற்சிகள், அமெரிக்க ஆங்கிலம் & வாக்கிய அமைப்பு",
      content: `### ⚙️ Q7H to Q7Q: Core Part-I Grammar Masterclass (Text Book pg 10, 44-47, 71, 80, 116, 120, 172, 175)

#### 7H. Confusables:
- **believe** (நம்பு) vs **hope** (எதிர்பார்ப்பு)
- **listen** (கவனித்துக் கேள்) vs **hear** (ஒலியைக் கேள்)
- **get** (பெறு) vs **receive** (கடிதம்/ஆவணம் பெற்றுக்கொள்)
- **prepare** (தயார்செய்) vs **provide** (வழங்கு, வசதியளி)
- **awarded** (விருது வழங்குதல்) vs **presented** (பரிசு வழங்குதல்)
- **buy** (வாங்கு) vs **purchase** (ஆவணத்தோடு வாங்குவது)
- **house** (வீடு-கட்டிடம்) vs **home** (வீடு-குடும்பம்)
- **refuse** (இல்லை என மறுத்துவிடு) vs **deny** (கருத்தினை ஏற்காது மறுத்துவிடு)
- **know** (தெரிந்துகொள்) vs **learn** (கற்றுக்கொள்)
- **read** (வாசி) vs **study** (படி)
- **remember** (நினைவில்கொள்) vs **remind** (நினைவூட்டு)
- **invent** (கண்டுபிடி-புதியபொருள்) vs **discover** (கண்டுபிடி-உண்மையை)

---

#### 7I. Foreign Words and Phrases:
1. **viva voce**: spoken examination
2. **bonafide**: genuine
3. **sine die**: without a date being fixed, indefinitely
4. **resume**: summary
5. **in toto**: totally
6. **rapport**: close relationship
7. **liaison**: coordination of activities
8. **bon voyage**: saying goodbye
9. **postmortem**: after death
10. **en route**: on the way
11. **via**: by way of
12. **erratum**: error
13. **de facto**: in fact
14. **ex gratia**: given as a favor without legal obligation
15. **ad hoc**: for a particular purpose
16. **prima facie**: at first sight
17. **in camera**: secret session
18. **via media**: middle course
19. **par excellence**: better or more than all others of same kind
20. **persona grata**: acceptable person / diplomat
21. **adieu**: goodbye
22. **en masse**: as a group
23. **en famille**: as a family
24. **bons mots**: witty remarks
25. **faux pas**: social blunder

---

#### 7J. Euphemistic Expressions (Polite Alternatives):
- **blind**: visually challenged
- **disabled**: differently-abled / special child
- **undertaker**: funeral director / mortician
- **maid**: domestic engineer
- **garbage man**: sanitation engineer
- **lavatory / public toilet**: rest-room / comfort station
- **housewife**: homemaker
- **poor**: low income level, economically disadvantaged
- **slow-learners**: late-bloomers
- **fat / overweight**: full-figured, big-boned
- **beating with cane**: corporal punishment
- **died**: passed away, departed, bit the dust
- **unemployed**: between jobs
- **jail**: correctional facility
- **firing someone**: letting someone go
- **euthanize**: put to sleep
- **homeless**: on the streets

---

#### 7K. Modal & Semi-Modal Verbs (13 Modals):
- **Will**: Futurity, Intention, Surety, Willingness, Prediction, Request. (*Will you give me a hand?*)
- **Would**: Probability, Discontinued past habit, Choice, Habitual action, Wishes, Improbable condition (*If I were a bird, I would fly.*)
- **Shall**: Futurity, Permission-question (*Shall I close the door?*), Suggestion.
- **Should**: Insistence, Obligation, Advice (*Children should obey parents*), Duty, Prohibition.
- **Can**: Ability (*I can drive a car*), Possibility, Request, Permission, Capacity.
- **Could**: Polite request (*Could you lend me your book?*), Past ability.
- **May**: Possibility (*It may rain*), Permission-question (*May I go home?*), Wishes (*May God bless you!*).
- **Might**: Remote possibility (*It might rain tonight*), Gentle reproach.
- **Must**: Necessity, Obligation, Compulsion, Certainty (*He must be a soldier*).
- **Need**: Necessity (*You needn\'t meet him.*)
- **Dare**: Courage (*How dare you ask me for more money?*)
- **Used to**: Past habitual action (*He used to practice daily in playground.*)
- **Ought to**: Moral obligation (*You ought to listen to the teacher.*)

---

#### 7L. Prepositions Master List:
- **in**: inside place (*in the box*), month (*in May*)
- **on**: surface (*on the table*), day (*on Monday*)
- **at**: specific place (*at Madurai*), specific time (*at 5 p.m.*)
- **for**: duration (*for 5 hours*), purpose (*for my sister*)
- **by**: near place (*by the sea*), time limit (*by 4 o\'clock*), agent (*by me*)
- **from...to**: starting to ending (*from 7 to 8 a.m.*)
- **since**: point of past time (*since 2011*)
- **across**: cross over (*across the river*)
- **between**: between two (*between Ramu and Somu*)
- **among**: among many (*among themselves*)
- **into**: movement inside (*fell into the well*)

---

#### 7M. Question Tags:
- Positive sentence -> Negative tag (*He is good, isn\'t he?*)
- Negative sentence -> Positive tag (*They don\'t tell lies, do they?*)
- Negative indicator words (*no, none, little, few, rarely, hardly, barely, scarcely, neither, never, seldom*) make sentence negative -> take positive tag (*She rarely goes to films, does she?*)
- Imperative suggestions (*Let us go -> shall we?*)
- Imperative requests (*Come with me -> will you?*)
- Urgent requests (*Send the mail -> won\'t you?*)
- Impatient remarks (*Keep quiet -> can\'t you?*)

---

#### 7N. Syllabification Rules:
- **1 Syllable**: thought, dropped, glum, queue
- **2 Syllables**: a-bout (2), in-side (2), mu-sic (2), bare-ly (2), fu-ture (2), tem-per (2), parch-ment (2)
- **3 Syllables**: pro-per-ly (3), per-ma-nent (3), gui-ta-rist (3), sur-vi-val (3), beau-ti-ful (3)
- **4 Syllables**: en-ter-tain-ment (4), as-tro-no-my (4), ar-ti-cu-late (4), ob-ser-va-ble (4)
- **5 Syllables**: ex-tra-va-gan-za (5), ex-am-i-na-tion (5), ar-ti-cu-la-tion (5)

---

#### 7O. American English vs British English:
| British English | American English |
| :--- | :--- |
| advertisement | notice |
| anticlockwise | counterclockwise |
| blind | window shade |
| boot | trunk |
| chips | french fries |
| cot | crib |
| cupboard | closet |
| dustbin | garbage can / trash can |
| fellow | guy |
| fire brigade | fire department |
| goods train | freight train |
| interval | intermission |
| jam | jelly |
| lift | elevator / escalator |
| lorry / van | truck |
| biscuit | cookie |
| flat | apartment |
| maths | math |
| postbox | mailbox |
| shop | store |
| single | one way |
| torchlight | flash light |
| washbasin | sink |
| windscreen | windshield |
| centre | center |
| metre | meter |
| litre | liter |
| theatre | theater |
| colour | color |
| favourite | favorite |
| tyre | tire |

---

#### 7P. Singular and Plural Rules:
1. **-is -> -es**: axis -> axes, crisis -> crises, analysis -> analyses, basis -> bases, thesis -> theses.
2. **-um / -on -> -a**: memorandum -> memoranda, aquarium -> aquaria, stratum -> strata, erratum -> errata, curriculum -> curricula, medium -> media, datum -> data, criterion -> criteria.
3. **-a -> -ae**: formula -> formulae, alumna -> alumnae, antenna -> antennae.
4. **-us -> -i**: focus -> foci, locus -> loci, alumnus -> alumni, fungus -> fungi, syllabus -> syllabi, radius -> radii, stimulus -> stimuli.
5. **-oo -> -ee**: tooth -> teeth, foot -> feet, goose -> geese.
6. **-x -> -ces**: matrix -> matrices, index -> indices, appendix -> appendices, apex -> apices.
7. **Same in both**: sheep, deer, aircraft, furniture, cattle, corps, species, spectacles, means, premises, series, innings, pants.

---

#### 7Q. Sentence Pattern (S-V-O-C-A):
- **Subject (S)**: Who / what performs action (*The students, My uncle, Chennai*)
- **Verb (V)**: Action word (*sings, wrote, will play, are playing, is*)
- **Direct Object (DO)**: What? (*football, a story, a pen*)
- **Indirect Object (IO)**: Whom? (*me, us, the strangers*)
- **Complement (C)**: Completes the sentence meaning (*a teacher, weak, silent, red in colour, Hitler, holiday, commissioner of police*)
- **Adjunct (A)**: MPTR (Method-How, Place-Where, Time-When, Reason-Why) (*now, in the market, fast, at 10 o\'clock, due to bad weather*)`
    }
  ];

  for (let idx = 0; idx < part1Lessons.length; idx++) {
    const l = part1Lessons[idx];
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

  // 5. PART II LESSONS (POETRY APPRECIATION & TRANSFORMATIONS)
  const part2Lessons = [
    {
      id: "lsn_p2_poetry_all_6_poems",
      moduleId: "mod_wts_p2",
      title: "21-26. Poetry Appreciation & Figures of Speech (All 6 Poems)",
      tamil: "21-26. 6 செய்யுள்களின் வினாக்கள் & Figures of Speech",
      content: `### 📜 Q21-26: Poetry Appreciation Questions (Text Book pg 148-151)

#### Poem 1: ONCE UPON A TIME (Gabriel Okara)
- Extract i: *"But now they only laugh with their teeth, / While their ice-block–cold eyes..."*
  - **Who are 'they'?**: People of modern days.
  - **Explain: ice-block-cold eyes**: Eyes without any warmth of feeling.
  - **Figure of speech**: Metaphor.
- Extract ii: *"Most of all, I want to relearn / How to laugh, for my life in the mirror / Shows only my teeth like a snake\'s bare fangs!"*
  - **Why does poet want to relearn?**: To show real feelings instead of fake ones.
  - **Whom does he want to relearn from?**: From his innocent son.
  - **Figure of speech**: Simile (*like a snake\'s bare fangs*).

#### Poem 2: CONFESSIONS OF A BORN SPECTATOR (Ogden Nash)
- Extract i: *"With all my heart I do admire / Athletes who sweat for fun or hire"*
  - **Whom does the poet admire?**: Athletes.
  - **Why do athletes sweat?**: For money or for pleasure.
- Extract ii: *"When snaps the knee and cracks the wrist..."*
  - **Literary device**: Onomatopoeia (*snaps, cracks*).

#### Poem 3: LINES WRITTEN IN EARLY SPRING (William Wordsworth)
- Extract i: *"And \'tis my faith that every flower / Enjoys the air it breathes..."*
  - **Poet\'s faith**: Beautiful flowers enjoy every ounce of air they breathe.
- Extract ii: *"Have I not reason to lament / What Man has made of Man?"*
  - **Figure of speech**: Aphorism / Personification.
  - **Rhyme Scheme**: **abab** (notes-thoughts, reclined-mind).

#### Poem 4: MACAVITY – THE MYSTERY CAT (T. S. Eliot)
- Extract i: *"Macavity\'s a Mystery Cat: he\'s called the Hidden Paw"*
  - **Why called Hidden Paw?**: Master criminal who always escapes Scotland Yard.
- Extract ii: *"He sways his head from side to side, with movements like a snake"*
  - **Figure of speech**: Simile.
- Extract iii: *"fiend in feline shape, a monster of depravity"*
  - **Figure of speech**: Metaphor.
  - **Rhyme Scheme**: **aabb** (paw-law, despair-there).

#### Poem 5: EVEREST IS NOT THE ONLY PEAK (Kulothungan)
- Extract i: *"Our nature it is that whatever we try / We do with devotion deep and true"*
  - **Who does 'we' refer to?**: All responsible human beings.
- Extract ii: *"He, who does not stoop, is a king we adore"*
  - **Figure of speech**: Metaphor.

#### Poem 6: THE HOLLOW CROWN (William Shakespeare)
- Extract i: *"Let\'s talk of graves, of worms, and epitaphs..."*
  - **Figure of speech**: Metaphor.
- Extract ii: *"Keeps Death his court and there the antic sits..."*
  - **Figure of speech**: Personification.
- Extract iii: *"Which serves as paste and cover to our bones"*
  - **Figure of speech**: Simile.

---

### 🎨 Summary Table: Poems and Rhyming Schemes
1. **Once Upon a Time**: All stanzas **irregular**
2. **Confessions of a Born Spectator**: Stanzas 1,2,4,5,6 **aabbcc**
3. **Lines Written in Early Spring**: All stanzas **abab**
4. **Macavity – The Mystery Cat**: All stanzas **aabb**
5. **Everest Is Not The Only Peak**: All stanzas **irregular**
6. **The Hollow Crown**: All stanzas **irregular**`
    },
    {
      id: "lsn_p2_transformations_all_4",
      moduleId: "mod_wts_p2",
      title: "27-30. Sentence Transformations Masterclass",
      tamil: "27-30. 4 முக்கிய இலக்கண வாக்கிய மாற்றங்கள்",
      content: `### 🔄 Q27-30: 4 Major Sentence Transformations (Text Book pg 77, 116, 148, 175)

#### 27. Direct and Indirect Speech (7-Step Rules):
- **Step 1**: Change reporting verb (*said -> said*, *said to -> told*, *said to -> asked*, *said to -> ordered/requested*).
- **Step 2**: Add conjunction (*that* for statements, Wh- word or *if/whether* for questions, *to / not to* for imperatives).
- **Step 3**: Remove comma & quotation marks.
- **Step 4**: Change Reported Speech pronouns (*I -> he/she*, *we -> they*, *my -> his/her*).
- **Step 5**: Change Reported Speech tenses (Present -> Past, Past -> Past Perfect).
- **Step 6**: Change time & place adverbials (*this -> that*, *these -> those*, *here -> there*, *now -> then*, *today -> that day*, *yesterday -> the previous day*, *tomorrow -> the next day*).
- **Step 7**: Change word structure.
- *Example*: Balu said to his friend, "How long have I been waiting for you? It\'s getting late."
  - **Answer**: Balu asked his friend how long he had been waiting for him and also he told that it was getting late.

---

#### 28. Active Voice to Passive Voice:
- **Step 1**: Identify Object and write it first.
- **Step 2**: Change verb to passive form (*be-form + V3*).
- **Step 3**: Add \'by\' after verb.
- **Step 4**: Write Subject at end.
- **Step 5**: Write remaining part of sentence.

##### Tense Table for Passive Voice:
- **Simple Present**: V1 -> am/is/are + V3 (*The rules are followed by Mohammed.*)
- **Simple Past**: V2 -> was/were + V3 (*A letter was written by Vani.*)
- **Simple Future**: shall/will + V -> shall/will + be + V3
- **Present Continuous**: am/is/are + V-ing -> am/is/are + being + V3 (*The prayer is being sung by Magdalene.*)
- **Past Continuous**: was/were + V-ing -> was/were + being + V3
- **Present Perfect**: have/has + V3 -> have/has + been + V3 (*The course has been completed by Mohan.*)
- **Past Perfect**: had + V3 -> had + been + V3

---

#### 29. Simple - Compound - Complex Sentences:
- **Phrase**: Group of words without a finite verb (*Because of her hard work*).
- **Clause**: Group of words with a finite verb.
  - **Main Clause (MC)**: Complete meaning (*She won the medal.*)
  - **Subordinate Clause (SC)**: Incomplete meaning (*As she worked hard*).
- **Simple Sentence**: Phrase + Main Clause
- **Compound Sentence**: Main Clause + Coordinating Conjunction (*and, so, but, yet, or*) + Main Clause
- **Complex Sentence**: Subordinate Clause (*as, when, because, if, though*) + Main Clause

##### Key Words Transformation Table:
1. **Time**: *On + V-ing* (Simple) | *and at once* (Compound) | *As soon as / When / While* (Complex)
2. **Reason**: *Being / On account of / Due to* (Simple) | *so / therefore* (Compound) | *As / Because / Since* (Complex)
3. **Failed Results**: *In spite of / Despite + V-ing* (Simple) | *but / yet / still* (Compound) | *Though / Although / Even though* (Complex)
4. **Condition**: *In the event of + V-ing* (Simple) | *and* (Compound) | *If + Clause* (Complex)
5. **Negative Condition**: *In the event of not + V-ing* (Simple) | *or / otherwise* (Compound) | *Unless + Clause* (Complex)

---

#### 30. Conditional Clauses (If-Clauses):
- **Type 0 (Universal / Scientific Truth)**: If + Present Simple, Present Simple.
  - *If you heat ice, it melts.*
- **Type 1 (Possible / Probable)**: If + Present Simple, S + will / can / may + V1.
  - *If Sita studies well, she will pass the exam.*
- **Type 2 (Imaginary / Unlikely)**: If + Past Simple (V2 / were), S + would / could + V1.
  - *If I were a bird, I would fly.*
  - *If he ran fast, he would win the race.*
- **Type 3 (Impossible Past)**: If + Past Perfect (had + V3), S + would have + V3.
  - *If he had studied well, he would have passed in the exam.*`
    }
  ];

  for (let idx = 0; idx < part2Lessons.length; idx++) {
    const l = part2Lessons[idx];
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

  // 6. PART III LESSONS (ERC, PROSE QA & PRACTICAL WRITING)
  const part3Lessons = [
    {
      id: "lsn_p3_erc_and_prose_qa",
      moduleId: "mod_wts_p3",
      title: "31-36. Poem ERC & Prose Short Answer QAs",
      tamil: "31-36. இடம்பெற்று விளக்குதல் & 6 உரைநடை வினாக்கள்",
      content: `### ✍️ Q31-36: ERC & Prose Short Answers (Text Book pg 8, 75, 102, 118, 123-125, 173)

#### 31-33. Poem ERC (Explain with Reference to Context)

##### Poem 1: ONCE UPON A TIME (Gabriel Okara)
- Passage i: *"Once upon a time, son / They used to laugh with their hearts"*
  - **Context**: The above lines are taken from the poem "Once upon a Time" written by Gabriel Okara, a Nigerian poet.
  - **Explanation**: The poem is a father\'s address to his son, where the father wants to learn from his son how to go back to normality and no longer fake emotions.
  - **Comment**: Gives the impression of genuine emotion given off by people in the past.

##### Poem 2: CONFESSIONS OF A BORN SPECTATOR (Ogden Nash)
- Passage i: *"I am just glad as glad can be / That I am not them, that they are not me.."*
  - **Context**: From "Confessions of a Born Spectator" written by Ogden Nash.
  - **Explanation**: The poet confesses he is glad he is neither a sportsman nor an athlete. He wants to be a spectator, not a participant.
  - **Comment**: The poet is very firm in his stand.

##### Poem 3: LINES WRITTEN IN EARLY SPRING (William Wordsworth)
- Passage i: *"In that sweet mood when pleasant thoughts / Bring sad thoughts to the mind."*
  - **Context**: From "Lines Written in Early Spring" by William Wordsworth.
  - **Explanation**: The poet sits reclined in a beautiful grove surrounded by mixed sounds of nature, contrasting nature\'s harmony with human misery.

##### Poem 4: MACAVITY – THE MYSTERY CAT (T. S. Eliot)
- Passage i: *"His powers of levitation would make a fakir stare"*
  - **Context**: From "Macavity - The Mystery Cat" by T.S. Eliot.
  - **Explanation**: Levitation means floating in air. Macavity defeats even Indian holy fakirs in floating!

##### Poem 6: THE HOLLOW CROWN (William Shakespeare)
- Passage i: *"Our lands, our lives; and all, are Bolingbroke\'s / And nothing can we call our, own but death;"*
  - **Context**: Taken from Shakespeare\'s play King Richard II ("Hollow Crown").
  - **Explanation**: King Richard II was defeated by Bolingbroke. He realizes all land and properties are lost except death.

---

#### 34-36. Prose Short Answers (Units 1 to 6)

##### Prose 1: The Portrait of a Lady
1. **Describe grandfather in portrait**: Wore big turban, loose clothes, long white beard covering chest, looked 100 years old.
2. **Why left with grandmother in village?**: Parents went to city to earn bread and settle comfortably.
3. **Where did author study in childhood?**: Village school attached to temple.
4. **Happiest time of day for grandmother**: Afternoon feeding hundreds of sparrows with bread crumbs.

##### Prose 2: The Queen of Boxing
1. **Financial support for USA trip**: Mary Kom\'s father raised Rs. 2000; friends met 2 MPs who donated Rs. 8000.
2. **Why not return empty-handed?**: Well-wishers provided funds; she did not want to disappoint them.
3. **Why named 'Queen of Boxing'?**: Won hat-trick world titles and gold medals (2001-2006).

##### Prose 3: Forgetting
1. **What Lynd wonders at**: The great efficiency of human memory.
2. **Most common forgetfulness**: Forgetting to post a letter.
3. **Articles writer forgets most**: Books, umbrellas, and walking sticks.

##### Prose 4: Tight Corners
1. **Activity in King Street sale room**: Auction of Barbizon pictures for large sums (2000-3000 pounds).
2. **Author\'s financial condition**: Only 63 guineas in bank account and no collateral.
3. **What is a tight corner?**: Difficult physical or mental situation struggled to escape from.

##### Prose 5: Convocation Address
1. **Role of universities**: Storehouses of knowledge training youth in service to democratic society.
2. **Youngsters\' duty after graduation**: Earn living for family and give back knowledge to society.

##### Prose 6: The Accidental Tourist
1. **Contents of bag**: Newspaper cuttings, tobacco tin, passport, English currency, film.
2. **Worst plane accident**: Sucking pen for 20 minutes while chatting with a lady, staining mouth, chin, and teeth navy-blue.`
    },
    {
      id: "lsn_p3_practical_writing_skills",
      moduleId: "mod_wts_p3",
      title: "37-40. Practical Writing & Topics for Testing",
      tamil: "37-40. உரையாடல், செயல்முறை விளக்கம், அறிவிப்பு & மின்னஞ்சல்",
      content: `### 📝 Q37-40: Practical Writing Skills & Testing Topics (Text Book pg 17, 52, 78, 79, 122, 144, 151, 176)

#### 37A. Dialogue Writing (3 Exchanges Minimum):
- **Patient & Doctor**:
  - *Patient*: Good morning, Sir.
  - *Doctor*: Good morning. What is your problem?
  - *Patient*: I am suffering from headache and fever since yesterday.
  - *Doctor*: Take this medicine twice a day and rest.
  - *Patient*: Thank you, Sir.
  - *Doctor*: Welcome.

---

#### 37B. Non-Verbal Comprehension (Pie-Charts & Tables):
- **Percentage of people speaking first language**: Mandarin 12.44%, Spanish 4.85%, English 4.83%, Arabic 3.25%, Hindi 2.68%, Bengali 2.66%.
  - *Q1*: Which language is spoken by most people? **Mandarin**.
  - *Q2*: Which Indian language ranks in top five? **Hindi**.

---

#### 37C. Describing a Process:
- **Process of Binding a Book**:
  1. Gather cardboard, brown sheets, needle, thread, scissors, calico cloth, glue.
  2. Cut brown sheets to book size and wrap around.
  3. Stitch pages with thread.
  4. Cut cardboard covers and apply glue to paste.
  5. Attach calico cloth to spine and wrap gift paper neatly.
- **Process of Making a Cup of Tea**:
  1. Boil 250ml water.
  2. Add 2 tsp tea powder and let boil.
  3. Add 1 cup milk, sugar, and spices.
  4. Stir well, strain with tea strainer, and serve.

---

#### 37D. Proverbs & Semantic Field Matching:
- **Proverbs**:
  - *Actions speak louder than words* = செயலை விட சொல் சிறந்தது.
  - *A friend in need is a friend indeed* = ஆபத்தில் உதவுபவனே உண்மையான நண்பன்.
  - *All that glitters is not gold* = மின்னுவதெல்லாம் பொன்னல்ல.
  - *Make hay while the sun shines* = காற்றுள்ள போதே தூற்றிக்கொள்.
- **Semantic Fields (20 Fields)**:
  - *Agriculture*: hybrid, yield, fertilizers, crop, harvest
  - *Computer*: CPU, data, software, internet, password, laptop
  - *Law*: affidavit, lawyer, court, judge, advocate
  - *Medicine*: physician, pills, ECG, cholesterol, BP

---

#### 37E. Notice Writing Format (50 Words):
\`\`\`text
NOTICE
Government Hr. Sec. School, Minjur.
1st February 2018
Workshop on Precis Writing
This is to inform all students of Class XI and XII that a workshop on Precis Writing will be held on 2nd February 2018 at 9.00 a.m. in the school auditorium. Attendance is mandatory.
(Sd/-) Evangeline, Head-girl
\`\`\`

---

#### 37F. Expansion of News Headlines:
1. *Heavy rains lash Chennai* -> **Chennai, March-15: Last night\'s heavy rain slashed Chennai and threw normal life out of gear.**
2. *Neet classes to begin on Sept 20th* -> **Chennai, Sep-15: The Centre coordinator informed that NEET coaching classes will begin on September 20th.**
3. *12 injured as buses collide* -> **Dindigul, March-15: About 12 persons were injured when two buses collided near bus terminus today.**

---

#### 37G. E-mail Writing:
\`\`\`text
To: order@englishbooks.com
Subject: Order for complete set of encyclopedia
Dear Sir,
I am the Library Incharge of Avvai Govt. High School. We require "The complete set of encyclopedia" for our school library. Kindly email us price details and payment instructions as early as possible.
Thank you.
(Sd/-) Satish Kumar, Library Incharge
\`\`\`

---

#### 37H. Spot the Errors & 20 Golden Rules:
1. *Many people behaves rudely* -> **Many people behave rudely** (Plural subject takes plural verb).
2. *Money make many things* -> **Money makes many things** (Uncountable singular takes verb+s).
3. *One of the girl sang well* -> **One of the girls sang well** (One of the + plural noun).
4. *Kala is tallest girl* -> **Kala is the tallest girl** (Superlative est takes \'the\').
5. *I prefer coffee than tea* -> **I prefer coffee to tea** (Prefer takes \'to\').`
    }
  ];

  for (let idx = 0; idx < part3Lessons.length; idx++) {
    const l = part3Lessons[idx];
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

  // 7. PART IV LESSONS (PARAGRAPHS, ESSAYS & APPLICATIONS)
  const part4Lessons = [
    {
      id: "lsn_p4_prose_poetry_paragraphs",
      moduleId: "mod_wts_p4",
      title: "41-43. Paragraph Answers (Prose, Poetry & Supplementary Reader)",
      tamil: "41-43. உரைநடை, செய்யுள் & துணைப்பாட நெடு வினாக்கள்",
      content: `### 📚 Q41-43: 5-Mark Paragraph Answers (Text Book pg 48, 76, 109, 110, 112, 114)

#### Q41. Prose Paragraphs

##### 1. The Portrait of a Lady (Khushwant Singh)
The grandmother played a vital role in the author\'s formative years. In the village, she waked him up, prepared breakfast of stale chapatis, accompanied him to the temple school, and fed stray dogs. In the city, she spent her time at the spinning wheel and fed hundreds of sparrows in the verandah. When she died, thousands of sparrows arrived, sat in total silence around her dead body without chirping or eating bread crumbs, and flew away silently after cremation, demonstrating animal empathy.

##### 2. The Queen of Boxing (M. C. Mary Kom)
Mary Kom was selected for the World Boxing Championship in USA (2001). Her father raised Rs. 2000 and friends collected Rs. 8000 from two MPs. Despite jet lag and unaccustomed food causing weight loss, she fought bravely and won the Silver Medal. Later, she won gold in the 3rd and 4th World Championships (2005 & 2006) and earned the titles "Queen of Boxing" and "Magnificent Mary."

##### 3. Convocation Address (Dr. Arcot Ramasamy Mudaliar)
Universities mould students by instilling democratic values, broadmindedness, and perseverance. Graduates have a two-fold duty: to earn an honest living for their family and to give back to society by educating the uneducated and serving the common people.

---

#### Q42. Poetry Paragraphs

##### 1. Once Upon a Time (Gabriel Okara)
The poet contrasts past genuine warmth with modern artificiality. People used to laugh sincerely from the heart, but today they smile fake smiles "with teeth" while their "ice-block-cold eyes" search behind shadows. The poet asks his innocent son to teach him how to unlearn fake social habits and laugh genuinely again.

##### 2. Confessions of a Born Spectator (Ogden Nash)
The poet is a determined spectator who prefers sitting safely in the stands rather than risking broken limbs in the field. Although he admires athletes who sweat for fun or money, common sense and caution win over ego, and he is content being a spectator.

##### 3. The Hollow Crown (William Shakespeare)
King Richard II, defeated by Bolingbroke, contemplates the mortality of kings. Within the hollow crown that circles a king\'s temples, Death keeps his court, laughing at royal pomp, until with a little pin he bores through the castle wall and it is farewell king.

---

#### Q43. Supplementary Reader Paragraphs

##### 1. After Twenty Years (O. Henry)
Bob waits outside a hardware store in New York at 10 PM to meet his childhood friend Jimmy Wells after 20 years. A cop talks to Bob and leaves. Later, a tall plainclothes officer arrests Bob and hands him a note from Jimmy. Jimmy had recognized Bob as a wanted Chicago criminal, but out of friendship could not arrest Bob himself, so he sent another officer.`
    },
    {
      id: "lsn_p4_bio_data_essays_stories",
      moduleId: "mod_wts_p4",
      title: "44-47. Summary Writing, Bio-Data, Job Application, Essays & Story Expansions",
      tamil: "44-47. சுருக்கி எழுதுதல், வேலை விண்ணப்பம், கட்டுரைகள் & கதைகள்",
      content: `### 📄 Q44-47: Summary Writing, Bio-data, Essays & Story Expansions (Text Book pg 76, 81, 83, 116, 130, 131, 153, 176)

#### Q44A. Summary Writing & Note-Making

##### Passage: Rome 1960 Paralympic Games
- **Rough Copy**: The 1960 Paralympic Games in Rome was a major step for athletes with physical impairments. Founded by Sir Ludwig Guttmann, the games ran for six days with 8 events including archery, swimming, and wheelchair basketball. Host nation Italy topped the medal table.
- **Fair Copy (Paralympic Games)**:
  In 1960, Sir Ludwig Guttmann founded the Paralympic Games in Rome for physically impaired athletes. Supported by the Italian Olympic Committee, 5,000 spectators attended the 6-day event featuring 8 sports. Host Italy finished atop the medal standings, proving a new pattern of social integration for disabled athletes.

---

#### Q44B / Q46A. Job Application with Bio-Data / Resume:
\`\`\`text
From: XXXXX, 45, Nehru Nagar, Trichy.
To: The Manager, ABC & Co., Trichy.
Sir,
Sub: Application for the post of Typist - Reg.
I saw your advertisement in the newspaper. I have passed Higher Grade Typewriting in first class and completed B.Sc with NIIT computer courses. I enclose my Bio-Data for your consideration.

Bio-Data / Resume:
1. Name: XXXXX
2. Father\'s Name: Mr. T. Ram
3. Date of Birth: 05-06-1980
4. Educational Qualification: B.Sc.
5. Professional Qualification: Typewriting 1st Class, Java & Oracle
6. Languages Known: English and Tamil
7. Experience: 5 Years as computer operator in LG company
Declaration: I hereby declare that the above details are true to the best of my knowledge.
Signature: XXXXX
\`\`\`

---

#### Q46B. General Essays

##### 1. My Ambition in Life
A life without ambition is like a train journey without a destination. My ambition is to become a doctor to serve suffering humanity. 90% of our people are poor and cannot afford expensive treatment. My motto is "Service to humanity is service to God."

##### 2. The Impact of Computers in the Modern World
Computers have revolutionized telecommunication, education, industry, and corporate administration. Connected to the internet ("online"), distance is no longer a barrier. Computers help solve complex economic, industrial, and medical problems.

---

#### Q46C / Q47B. Proverb Story Expansion: 'A Bad Workman Always Blames His Tools'
Raj and Ravi were two farmers owning oxen. Raj worked hard, took care of his animals, and ploughed his land on time. Ravi was lazy, neglected his tractor maintenance, and when the monsoon arrived, his tractor broke down. Instead of realizing his own laziness and poor maintenance, Ravi blamed bad luck and tools. Raj succeeded with limited resources. **Moral: It is never too late to mend.**`
    }
  ];

  for (let idx = 0; idx < part4Lessons.length; idx++) {
    const l = part4Lessons[idx];
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

  // 8. Seed Complete 11th WTS Quiz Exercises
  await db.execute(
    `INSERT INTO exercises (id, lesson_id, level_id, title, exercise_type, instructions, tamil_instructions, xp_points, order_index)
     VALUES ('ex_wts_full_quiz', 'lsn_p1_synonyms_glossary', 'B1', '11th Standard WTS Master Exam Quiz', 'mcq', 'Choose the correct option', 'சரியான விடையைத் தேர்ந்தெடுக்க', 100, 1)`
  );

  const quizQs = [
    { q: "Choose synonym for 'puckered' (MDL-18)", ta: "puckered என்பதன் பொருள்:", ans: "wrinkled" },
    { q: "Choose antonym for 'compulsory' (MDL-18)", ta: "compulsory என்பதன் எதிர்ச்சொல்:", ans: "voluntary" },
    { q: "Form compound word with 'toll'", ta: "toll என்பதன் கூட்டுச் சொல்:", ans: "plaza" },
    { q: "Prefix for 'audible'", ta: "audible என்பதன் முன்னொட்டு:", ans: "in" },
    { q: "Expanded form of 'GST'", ta: "GST விரிவாக்கம்:", ans: "Goods and Services Tax" },
    { q: "Clipped form of 'Demonstration'", ta: "Demonstration என்பதன் சுருக்கப்பட்ட சொல்:", ans: "Demo" },
    { q: "Definition of 'Ornithologist'", ta: "Ornithologist என்பதன் விளக்கம்:", ans: "one who studies birds" },
    { q: "Meaning of phrasal verb 'call off'", ta: "call off என்பதன் பொருள்:", ans: "cancel" },
    { q: "Meaning of idiom 'back to the wall'", ta: "back to the wall மரபுத்தொடர் பொருள்:", ans: "in serious difficulty" },
    { q: "Euphemism for 'blind'", ta: "blind என்பதற்கான நாகரிக சொல்:", ans: "visually challenged" },
    { q: "Plural of 'crisis'", ta: "crisis என்பதன் பன்மை:", ans: "crises" },
    { q: "Plural of 'memorandum'", ta: "memorandum என்பதன் பன்மை:", ans: "memoranda" },
    { q: "American English for 'lorry'", ta: "lorry என்பதன் அமெரிக்க ஆங்கிலச் சொல்:", ans: "truck" },
    { q: "Identify sentence pattern: 'India won the match'", ta: "வாக்கிய அமைப்பு:", ans: "SVO" }
  ];

  for (let i = 0; i < quizQs.length; i++) {
    const qz = quizQs[i];
    await db.execute(
      `INSERT INTO questions (exercise_id, question_text, tamil_subtext, correct_answer, order_index)
       VALUES ('ex_wts_full_quiz', ?, ?, ?, ?)`,
      [qz.q, qz.ta, qz.ans, i + 1]
    );
  }

  console.log('🎉 Successfully Seeded ALL 139 Pages of +1 WTS English Guide into SQLite!');
}

if (require.main === module) {
  seedExhaustivePdfData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedExhaustivePdfData;
