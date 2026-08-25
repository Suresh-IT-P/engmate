/**
 * EXHAUSTIVE SEEDER FOR PART-I (QUESTIONS 1 TO 20 | PAGES 4 TO 44 OF PDF)
 * Captures all Synonyms, Antonyms, 17 Grammar Topics, Govt Exam Questions & Practice Exercises
 * Run: node backend/database/data/seedPart1Exhaustive.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedPart1Exhaustive() {
  console.log('🚀 Seeding Exhaustive Part-I (Questions 1 to 20) PDF Dataset into SQLite...');
  await runMigration();

  // Ensure Module 1 exists
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (Way to Success முழுப் பாடத்திட்டம்)', 'Exclusive +1 English Study Material', 1, 1)`
  );

  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_wts_p1', 'crs_class11', 'Part I: 1-Mark Questions & Grammar (Q1–Q20 | 20 Marks)', 'பகுதி 1: ஒரு மதிப்பெண் வினாக்கள் & இலக்கணம் (20 மதிப்பெண்கள்)', 'Complete Pages 4 to 44 of PDF Guide: Synonyms, Antonyms, Compound Words, Prefixes & Suffixes, Abbreviations, Clipped Words, Word Definitions, Phrasal Verbs, Idioms, Foreign Words, Euphemisms, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns.', 1)`
  );

  // 17 Detailed Part-I Lessons
  const part1Lessons = [
    {
      id: "lsn_p1_1_synonyms_prose_1_to_6",
      moduleId: "mod_wts_p1",
      title: "Q1–Q3. Synonyms Glossary (Prose Units 1 to 6)",
      tamil: "உரைநடை 1-6 கலைச்சொற்கள் & பொருள்",
      content: `### 📖 Q1-3: Synonyms & Textbook Glossary (Pages 5-8 of PDF)

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
1. Her silver locks were scattered untidily over her pale, **puckered** face:
   - a) graceful  b) fresh  c) smoothed  **d) wrinkled**
2. It is the **efficiency** rather than the inefficiency of human memory that compels my wonder:
   - a) irritation  b) inability  c) inferiority  **d) ability**
3. We have to re-call the struggles of the past and realize the **perils** and possibilities:
   - a) safeties  **b) dangers**  c) securities  d) certainty

##### 20 Practice Questions (with Answers):
01. She had been old and **wrinkled** for the twenty years: **crumpled**
02. We treated it like the **fables** of the prophets: **stories**
03. theories with a special stamp, but only reiteratesome of the cardinal principles **enunciated**: **spoke clearly**
04. The greatest disadvantage for me was my loss of **appetite**: **hunger**
05. They consoled me and **lauded** me on the silver win: **appreciated**
06. As they recall their **exploits** or their errors: **daring acts**
07. I ate enough to **sate**: **satisfy**
08. She **hobbled** about the house in spotless: **staggered**
09. During the monarchical or **feudal** days, Universities had to train scholars: **old-fashioned**
10. Her silver locks were **scattered**: **disordered**
11. A fourth was **torpedoed** in the War: **abolished**
12. words of praise and **adulation** were showered on me: **appreciation**
13. He **persuaded** me to look in at the sale-room: **convinced**
14. I am always **reluctant** to trust a departing visitor to post an important letter: **unwilling**
15. So I pulled on it and **yanked** at it, with grunts and frowns and increasing consternation: **jerked**
16. do such small **prosaic** things as take the ball: **dull**
17. So **glibly** about 'note of hand only' really mean it: **smoothly**
18. yanked at it, with grunts and frowns and increasing **consternation**: **worry**
19. I had **gashed** my finger on the zip and was shedding blood: **cut**
20. I do claim to represent him in all his **ruggedness**: **strength**

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
      id: "lsn_p1_2_antonyms_prose_1_to_6",
      moduleId: "mod_wts_p1",
      title: "Q4–Q6. Antonyms Master List (Prose Units 1 to 6)",
      tamil: "4-6. எதிர்ச்சொற்கள் (உரைநடை 1 முதல் 6)",
      content: `### 🔄 Q4-6: Antonyms Master Table (Pages 9-12 of PDF)

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
- **plastered** (ஈரமான) X **dried** (காய்ந்த)
- **attached** (இணைக்கப்பட்ட) X **detached** (பிரித்தெடுக்கப்பட்ட)
- **taught** (சொல்லித்தந்த) X **learnt** (கற்றுக்கொண்டுவிட்ட)
- **creating** (உருவாக்குதல்) X **destroying** (அழித்தல்)
- **shooed** (விரட்டப்பட்ட) X **pulled** (இழுக்கப்பட்ட)
- **upset** (விரக்தி) X **happy** (மகிழ்ச்சி)
- **physical** (உடல் தன்மை) X **mental** (மனத்தன்மை)
- **mild** (லேசான) X **severe** (கடுமையான)
- **omitted** (விடுபட்ட) X **included, agreed, accepted** (சேர்க்கப்பட்ட)

##### Govt Exam Questions (MDL-18):
1. The other teams had already completed their weight in, which is **compulsory** for all players:
   - a) required  b) obligatory  **c) voluntary**  d) compulsion
2. The staff looked so **prosperous** and unsympathetic:
   - a) rich  b) wealthy  **c) poor**  d) luxurious
3. It was at this point that my wife looked at me with an expression of wonder - not anger or **exasperation**:
   - a) irritation  **b) calmness**  c) vexation  d) annoyance

##### 20 Practice Questions (with Answers):
01. yet I have **accumulated** only about 212 air miles: **scattered**
02. She had once been young and **pretty**: **ugly**
03. the thought was almost **revolting**: **pleasing**
04. She said her morning prayer in a **monotonous**: **interesting**
05. her sparrows whom she fed longer and with frivolous **rebukes**: **blessing**
06. I was presented with a **traditional** shawl: **modern**
07. They were content to work in **secluded** spheres, far from the din: **public**
08. How **expensive** things were in America: **cheap**
09. With this **princely** sum, and a little more that had been collected: **few**
10. I set to **pondering** on the problem what to do next: **forgetting**
11. The people were **enormously** nice too: **tiny**
12. from remembering to do such small **prosaic** things as take the ball: **interesting**
13. She arrived home, anticipating with angry relish the white face and **quivering** lips: **steady**
14. therefore has no time to remember the **mediocre**: **special**
15. They were selling Barbizon pictures, and getting **tremendous** sums for each: **tiny**
16. You may find self-seekers **enthroned** and the patient worker decried: **dethroned**
17. I could have **embraced** him and wept for joy: **released**
18. lidless tin of tobacco rolled **crazily** across the concourse: **calmly**
19. with grunts and **frowns** and increasing consternation: **grins**
20. As **inheritors** of that rich legacy, you are best suited: **predecessors**`
    },
    {
      id: "lsn_p1_3_compound_words_full",
      moduleId: "mod_wts_p1",
      title: "Q7A. Compound Words Combinations & Exercises",
      tamil: "7A. கூட்டுச் சொற்கள் 15 வகைகள் & பயிற்சிகள்",
      content: `### 🔗 Q7A. Compound Words (Pages 12-14 of PDF)

#### 15 Combination Types Table:
1. **Noun + Noun**: shop-owner, dream-world, bed-time, rabbit-hole, chessmen, cork-screw, sun-dial, wonder land, postman, motorcycle, honey bee, craftsman
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

##### Govt Exam Question:
1. Choose the word from options given to form a compound word with **toll** (MDL-18):
   - a) plaza  b) late  c) proof  d) wheel -> **Answer: plaza (toll plaza)**

##### Type-1 Practice Exercises (10 Qs):
01. Compound word with **mantel**: **piece** (mantelpiece)
02. Compound word with **eye**: **lashes** (eyelashes)
03. Compound word with **water**: **proof** (waterproof)
04. Compound word with **bee**: **hive** (beehive)
05. Compound word with **toll**: **gate** (tollgate)
06. Compound word with **door**: **knob** (doorknob)
07. Compound word with **spinning**: **wheel** (spinning wheel)
08. Compound word with **grand**: **mother** (grandmother)
09. Compound word with **sing**: **song** (singsong)
10. Compound word with **sun**: **set** (sunset)

##### Type-2 Practice Exercises (Combination Identification):
01. **Whitewash**: Adjective + Verb
02. **Birthplace**: Noun + Noun
03. **Kitchen garden**: Noun + Noun
04. **Handshake**: Noun + Verb
05. **Washing soap**: Gerund + Noun`
    },
    {
      id: "lsn_p1_4_prefixes_and_suffixes",
      moduleId: "mod_wts_p1",
      title: "Q7B. Prefixes and Suffixes Master Class",
      tamil: "7B. முன்னொட்டு மற்றும் பின்னொட்டு",
      content: `### ✂️ Q7B. Prefixes & Suffixes (Page 14 of PDF)

#### Rules & Explanations:
- **Prefix**: Added BEFORE the root word (e.g. *un-* + tidy = **untidy**).
  - Common Prefixes: *un-, in-, dis-, il-, a-, en-, mis-, im-, pre-, ir-, non-*
- **Suffix**: Added AFTER the root word (e.g. *cricket* + *-er* = **cricketer**).
  - Common Suffixes: *-able, -ous, -ing, -or, -er, -ment, -ance, -ful, -ity, -ist, -ly*

##### Govt Exam Question:
1. Form a new word by adding suitable prefix to root word **audible** (MDL-18):
   - a) in  b) re  c) un  d) de -> **Answer: in (inaudible)**

##### 10 Practice Questions (with Answers):
01. Prefix for **honest**: **dis** (dishonest)
02. Prefix for **fortunate**: **un** (unfortunate)
03. Prefix for **respect**: **dis** (disrespect)
04. Prefix for **legitimate**: **il** (illegitimate)
05. Prefix for **beatable**: **un** (unbeatable)
06. Prefix for **agree**: **dis** (disagree)
07. Prefix for **active**: **in** (inactive)
08. Prefix for **finite**: **in** (infinite)
09. Prefix for **obedient**: **dis** (disobedient)
10. Prefix for **necessary**: **un** (unnecessary)`
    },
    {
      id: "lsn_p1_5_abbrev_acronyms_full",
      moduleId: "mod_wts_p1",
      title: "Q7C. Abbreviations & Acronyms List & Practice",
      tamil: "7C. சுருக்கக் குறியீடுகள் 28 + Acronyms 5",
      content: `### 🔤 Q7C. Abbreviations & Acronyms (Pages 15-17 of PDF)

#### Book Back Abbreviations (28):
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

##### Govt Exam Question:
1. Expanded form of **GST** (MDL-18): **Goods and Services Tax**

##### Type-2 Acronyms (Word Coined from Initial Letters):
01. **AIBA**: Association Internationale de Boxe Amateur
02. **OPAC**: Online Public Access Catalogue
03. **LAN**: Local Area Network
04. **SALT**: Strategic Arms Limitation Treaty
05. **GATT**: General Agreement on Trade and Tariffs`
    },
    {
      id: "lsn_p1_6_clipped_words_full",
      moduleId: "mod_wts_p1",
      title: "Q7D. Clipped Words List & 18 Exercises",
      tamil: "7D. சுருக்கப்பட்ட சொற்கள் (18 பயிற்சிகள்)",
      content: `### ✂️ Q7D. Clipped Words (Pages 17-18 of PDF)

#### Definition:
Words formed by reducing (clipping) a part of a larger word while retaining the original meaning.
- *Advertisement* -> **ad**
- *Bicycle* -> **cycle**

##### Govt Exam Question:
01. Clipped form of **Demonstration** (MDL-18): **Demo**

##### 18 Practice Exercises (with Answers):
01. **Chimpanzee** -> **chimp**
02. **Photograph** -> **photo**
03. **Microphone** -> **mic / mike**
04. **Cafeteria** -> **cafe**
05. **Gasoline** -> **gas**
06. **Helicopter** -> **copter**
07. **Telephone** -> **phone**
08. **University** -> **varsity**
09. **Memorandum** -> **memo**
10. **Influenza** -> **flu**
11. **Hippopotamus** -> **hippo**
12. **Bridegroom** -> **groom**
13. **Fanatic** -> **fan**
14. **Refrigerator** -> **fridge**
15. **Aeroplane** -> **plane**
16. **Examination** -> **exam**
17. **Demarcate** -> **mark**
18. **Perambulator** -> **pram**`
    },
    {
      id: "lsn_p1_7_word_definitions_full",
      moduleId: "mod_wts_p1",
      title: "Q7E. Definition of Words (22 Book Back + 10 Specialists)",
      tamil: "7E. கலைச்சொல் விளக்கம் (32 சொற்கள்)",
      content: `### 📖 Q7E. Definition of Words / One-Word Substitutions (Pages 18-20 of PDF)

#### Book Back 22 Words & Meanings:
1. **patriotism**: love of country and willingness to sacrifice for it
2. **nationalism**: doctrine that your country\'s interests are superior
3. **egocentrism**: concern for your own interests and welfare
4. **feminism**: doctrine advocating equal rights for women
5. **criticism**: serious examination and judgment of something
6. **amateurism**: participating in sports as a hobby rather than for money
7. **barbarism**: brutal barbarous, savage act
8. **idealism**: belief that the best possible concepts should be pursued
9. **heroism**: exceptional courage when facing danger
10. **absenteeism**: habitual failure to be present at work
11. **bibliophile**: great lover of books
12. **thespian**: one who acts in several roles
13. **polyglot**: one fluent in multiple languages
14. **ambidextrous**: one able to use both hands effectively at same time
15. **philanthropist**: one who donates a huge sum of money to set up public library/welfare
16. **misanthrope**: one who wants to be aloof / hates mankind
17. **teetotaller**: one who always refuses alcohol
18. **nonagenarian**: those who are active, cheerful at old age (90-99 years)
19. **globetrotter**: one who wishes travelling all over the world
20. **optimist**: one who believes that everything turns out for the best in the end
21. **Cardiologist**: one who treats heart diseases
22. **Pugilist**: boxer

##### Govt Exam Question:
01. Right definition for **Pathologist** (MDL-18): **one who studies diseases**

##### 10 Specialists Practice Questions (with Answers):
01. **Psychologist**: one who studies human mind and behavior
02. **Ornithologist**: one who studies birds
03. **Entomologist**: one who studies insects
04. **Archaeologist**: one who studies artefacts and physical remains
05. **Sociologist**: one who studies functioning of human society
06. **Geologist**: one who studies matter that constitutes the earth
07. **Linguist**: one who studies language and structure
08. **Seismologist**: one who studies earthquakes
09. **Herpetologist**: one who studies reptiles and amphibians
10. **Meteorologist**: one who studies weather and climate`
    },
    {
      id: "lsn_p1_8_phrasal_verbs_full",
      moduleId: "mod_wts_p1",
      title: "Q7F. Phrasal Verbs Master List & Exercises",
      tamil: "7F. கூட்டு வினைகள் (Phrasal Verbs)",
      content: `### 🗣️ Q7F. Phrasal Verbs (Pages 20-22 of PDF)

#### Textbook Phrasal Verbs (TB-112):
- **stand up**: maintain, withstand (*Your statement will not stand up as proof in court*)
- **stand for**: support, willing to accept (*My father always stands for truth*)
- **stand by**: ready to do / help (*I will standby you*)
- **look into**: examine (*The officer looked into the matter*)
- **look at**: see (*Look at the map on the wall*)
- **look through**: glance, skim (*Looking through cookery books*)
- **run over**: hit someone with vehicle (*The lorry ran over the motorist*)
- **run away**: escape (*The thief ran away*)
- **run into**: reach / meet (*Flood damages could run into millions*)
- **put on**: wear (*I put on my new shirt*)
- **put up**: start / build (*Brutus put up a war*)
- **put off**: postpone (*They put off the match*)

#### Other Important Phrasal Verbs:
- **bear with**: tolerate (*She can\'t bear with your misbehaviour*)
- **break down**: repair / stop working (*The bus broke down near market*)
- **call off**: cancel (*Manager will call off the meeting*)
- **call on**: meet, visit (*My friend called on me last evening*)
- **carry out**: perform (*She carry out her duties*)
- **deal with**: manage (*Lawyer dealt with the case*)
- **get over**: recover (*Asma got over her grief*)
- **give in**: yield, agree (*I will not give in to pressure*)
- **give up**: abandon, stop (*He should give up smoking*)
- **go on**: continue (*Telephone went on ringing*)
- **hit on**: discover (*He hit on a brilliant idea*)
- **keep off**: avoid (*Keep off the grass*)
- **look after**: take care of (*Mother looks after the baby*)
- **look for**: search (*Look for information on internet*)
- **make out**: understand (*I cannot make out your speech*)
- **pass away**: die (*Old man passed away last night*)
- **put up with**: tolerate (*I can\'t put up with your laziness*)
- **set out**: start (*They set out on a journey*)
- **take off**: left (*Flight took off as scheduled*)
- **take after**: resemble (*He takes after his mother*)

##### 10 Practice Exercises (with Answers):
01. The Sports meet was **cancelled**: **called off**
02. Our workers **perform** their jobs well: **carry out**
03. The champion **yielded** to strength: **gave in**
04. The plane **left** as scheduled: **took off**
05. I shall **search** information: **look for**
06. He **renounced** his wealth: **gave up**
07. You must **keep** money for future: **lay by**
08. continue to **resist**: **stand out**
09. meeting was **postponed**: **put off**
10. lawyer **managed** the case: **dealt with**`
    },
    {
      id: "lsn_p1_9_common_idioms_full",
      moduleId: "mod_wts_p1",
      title: "Q7G. Common Idioms Master List & 19 Meanings",
      tamil: "7G. மரபுத்தொடர்கள் (Idioms 19 சொற்கள்)",
      content: `### 💡 Q7G. Common Idioms (Pages 22-23 of PDF)

#### Book Back Idioms & Meanings (19):
01. **throw in the towel**: to give up
02. **in our corner**: on your side in an argument or dispute
03. **on the ropes**: state of near collapse or defeat
04. **below the belt**: unfair or unsporting behavior
05. **square off**: prepare for a conflict
06. **alarm bells ringing**: sign of something going wrong
07. **back to the wall**: in serious difficulty
08. **grasp / clutch at straws**: try any method to overcome a crisis
09. **saved by the bell**: help at the last moment rescuing one from difficult situation
10. **hang out dry**: abandoning one who is in difficulty
11. **right up one\'s alley**: to be the type of thing you enjoy doing
12. **drive one up the wall**: to annoy or irritate someone
13. **hit the road**: to leave; depart; begin journey
14. **take (one) for a ride**: to trick, cheat, or lie to someone
15. **in panic mode**: state of fear and anxiety
16. **tight corners**: in a difficult situation
17. **shot his bolt**: to exhaust one\'s effort
18. **in a nice pickle**: in a troublesome or difficult situation
19. **have cold feet**: feel nervousness and anxiety

##### Govt Exam Question:
01. Meaning of idiom **Back to the wall** (MDL-18): **In serious difficulty**

##### 5 Practice Questions (with Answers):
01. **throw in the towel**: to give up
02. **in our corner**: on your side in an argument or dispute
03. **on the ropes**: state of near collapse or defeat
04. **below the belt**: unfair or unsporting behavior
05. **square off**: prepare for a conflict`
    },
    {
      id: "lsn_p1_10_confusables_full",
      moduleId: "mod_wts_p1",
      title: "Q7H. Confusable Words List & Practice",
      tamil: "7H. மயங்கும் சொற்கள் (Confusables)",
      content: `### ⚖️ Q7H. Confusables (Pages 23-25 of PDF)

#### Confusable Pairs List:
- **believe** (நம்பு) vs **hope** (எதிர்பார்ப்பு)
- **listen** (கவனித்துக் கேள்) vs **hear** (ஒலியைக் கேள்)
- **get** (பெறு) vs **receive** (கடிதம்/ஆவணம் பெற்றுக்கொள்)
- **prepare** (தயார்செய்) vs **provide** (வழங்கு, வசதியளி)
- **awarded** (விருது வழங்குதல்) vs **presented** (பரிசு வழங்குதல்)
- **buy** (வாங்கு-ஆவணம் தேவபடாதது) vs **purchase** (ஆவணத்தோடு வாங்குவது)
- **shook** (குலுக்கு) vs **spatter** (தெறி, சிதறு)
- **see** (பார்) vs **look** (கவனி) vs **watch** (கவனித்துப் பார்-டிவி, சினிமா)
- **break** (உடை, முறி) vs **pluck** (பிடுங்கு)
- **house** (வீடு-கட்டிடம்) vs **home** (வீடு-குடும்பம்)
- **respond** (பதிலளி-துலங்கல்) vs **answer** (பதிலளி-விடை)
- **rob** (கொள்ளையடி) vs **steal** (திருடு)
- **make** (தயார்செய்-பொருள்) vs **do** (செய்-வேலை)
- **beautiful** (அழகு-பெண்) vs **handsome** (அழகு-ஆண்)
- **refuse** (இல்லை என மறுத்துவிடு) vs **deny** (கருத்தினை ஏற்காது மறுத்துவிடு)
- **know** (தெரிந்துகொள்) vs **learn** (கற்றுக்கொள்)
- **read** (வாசி) vs **study** (படி)
- **wound** (காயம்படு) vs **injure** (அடிபடு)
- **tall** (ஆள் அல்லது பொருளின் உயரம்) vs **high** (மிக உயரமான)
- **remember** (நினைவில்கொள்) vs **remind** (நினைவூட்டு)
- **invent** (கண்டுபிடி-புதியபொருள்) vs **discover** (கண்டுபிடி-உண்மையை)

##### 5 Practice Exercises (with Answers):
1. Kannan has **completed** his homework.
2. During Holi festival my cousin **spattered** the colour powder on me.
3. The people of Cherrapunji **save** rain water.
4. She **faced** the situation with a positive frame of mind.
5. He likes to **watch** his favourite TV serial.`
    },
    {
      id: "lsn_p1_11_foreign_words_full",
      moduleId: "mod_wts_p1",
      title: "Q7I. Foreign Words and Phrases List & 10 Practice Qs",
      tamil: "7I. பிறமொழிச் சொற்கள் (Foreign Words)",
      content: `### 🌐 Q7I. Foreign Words and Phrases (Pages 25-26 of PDF)

#### Book Back Foreign Words (24):
1. **viva voce**: a spoken examination
2. **bonafide**: genuine
3. **sine die**: without a date being fixed, indefinitely
4. **resume**: a summary
5. **in toto**: totally
6. **rapport**: a close relationship
7. **liaison**: coordination of activities
8. **bon voyage**: saying goodbye
9. **postmortem**: after death
10. **en route**: on the way
11. **via**: by way of
12. **erratum**: error
13. **de facto**: in fact
14. **ex gratia**: given as a favour though there is no legal obligation
15. **ad hoc**: for a particular purpose
16. **prima facie**: at first sight
17. **in camera**: secret session
18. **via media**: middle course
19. **par excellence**: better or more than all others of the same kind
20. **persona grata**: a person, especially a diplomat, acceptable to certain others
21. **adieu**: goodbye
22. **en masse**: as a group
23. **en famille**: as a family
24. **bons mots**: witty remarks

##### Govt Exam Question:
01. Talking business at dinner is a **faux pas** in France (MDL-18): **social blunder**

##### 10 Practice Questions (with Answers):
01. wished **bon voyage**: **saying goodbye**
02. resigned **en masse**: **as a group**
03. went **en famille**: **as a family**
04. urbane **bons mots**: **witty remarks**
05. accepted **in toto**: **totally**
06. **liaison** officer: **coordination of activities**
07. paid **ex gratia**: **moral obligation**
08. reached **en route**: **on the way**
09. decision on **ad hoc** basis: **for a particular purpose**
10. take a **viva voce** examination: **a spoken examination**`
    },
    {
      id: "lsn_p1_12_euphemisms_full",
      moduleId: "mod_wts_p1",
      title: "Q7J. Euphemistic Expressions (25 Words & 10 Qs)",
      tamil: "7J. நாகரிகச் சொற்கள் (Euphemisms)",
      content: `### 🕊️ Q7J. Substitute Words / Euphemistic Expressions (Pages 26-28 of PDF)

#### Euphemistic Expression Table (25):
- **blind**: visually challenged
- **handicapped / disabled**: differently-abled
- **disabled / learning challenged**: a special child
- **undertaker**: funeral director / mortician
- **maid**: domestic engineer
- **garbage man**: sanitation engineer
- **lavatory**: rest-room
- **public toilet**: comfort station
- **housewife**: homemaker
- **poor**: low income level, working class, economically disadvantaged
- **slow-learners**: late-bloomers
- **fat**: full-figured
- **overweight**: big-boned, portly
- **beating with a cane**: corporal punishment
- **died**: passed away, departed, bit the dust, kicked the bucket
- **unemployed**: between jobs
- **jail**: correctional facility
- **genocide / killing**: ethnic cleansing
- **prison camp**: relocation center
- **accidental deaths**: collateral damage
- **firing someone**: letting someone go
- **euthanize**: put to sleep
- **homeless**: on the streets
- **vomited**: blow chunks
- **unqualified**: partially proficient

##### 10 Practice Exercises (with Answers):
01. My mother is a **housewife**: **home maker**
02. The **lavatory** is in the ground floor: **rest room**
03. The **undertaker** was called: **mortician / funeral director**
04. distribution of clothes for those who are **very poor**: **in the low income level**
05. prove to be **slow-learners**: **late-bloomers**
06. dress is made for that **fat** woman: **full figured**
07. don\'t permit **beating children with a cane**: **corporal punishment**
08. school is for the **blind**: **visually challenged**
09. Stella is **pregnant** now: **in the family way**
10. Prem went to **jail**: **correctional facility**`
    },
    {
      id: "lsn_p1_13_modals_masterclass_full",
      moduleId: "mod_wts_p1",
      title: "Q7K. Modal Verbs & Semi-Modals (13 Modals + 27 Qs)",
      tamil: "7K. Modal Verbs (13 துணை வினைகள்)",
      content: `### ⚙️ Q7K. Modal Verbs and Semi-Modals (Pages 28-30 of PDF)

#### 13 Modal Auxiliaries Breakdown:
- **Modals (9)**: will, would, shall, should, can, could, may, might, must
- **Semi-Modals / Quasi-Modals (4)**: need, dare, ought to, used to

##### Detailed Usages & Examples:
1. **Will**: Futurity (*They will come tomorrow*), Intention, Surety, Willingness, Prediction, Request (*Will you give me a hand?*).
2. **Would**: Probability, Discontinued past habit (*When student, I would smoke*), Willingness, Choice (*I would rather die than marry her*), Regular/habitual action, Request (*Would you mind moving a bit?*), Improbable condition (*If I were a bird, I would fly*).
3. **Shall**: Futurity (*We shall meet tomorrow*), Permission-question (*Shall I close the door?*), Suggestion, Intention.
4. **Should**: Insistence, Obligation (*Children should obey parents*), Advice, Duty, Responsibility, Prohibition, Expectation (*Should it rain, exam will be cancelled*).
5. **Can**: Ability (*I can drive a car*), Ability in questions (*Can you play piano?*), Possibility, Request, Permission, Capacity.
6. **Could**: Polite request (*Could you lend me your book?*), Likelihood, Past ability (*I could do it easily*).
7. **May**: Possibility (*It may rain*), Permission-question (*May I go home now?*), Wishes (*May God bless you!*).
8. **Might**: Permission-request (*Might I borrow calculator?*), Remote possibility (*It might rain tonight*), Gentle reproach.
9. **Must**: Necessity (*You must recite this poem*), Obligation, Compulsion, Certainty (*He must be a soldier*), Conclusion.
10. **Need**: Necessity (*Do we need to attend? / You needn\'t meet him.*)
11. **Dare**: Courage (*How dare you ask me for more money?*)
12. **Used to**: Past habitual action (*He used to practice daily in playground.*)
13. **Ought to**: Moral obligation (*You ought to convey this message.*)

##### Level-1 Check Your Understanding (with Answers):
1. Eve-teasers **must** be severely punished.
2. A good teacher **can** make even boring lessons interesting.
3. In the army soldiers **should/must** obey their officers.
4. One **should** always keep his promises.
5. All citizens **must** obey the rules of the land.
6. People who live in glass houses **should** not throw stones.
7. No man **can** call back yesterday.
8. One never knows what the future **will/may** bring.
9. Law makers **should** not be law-breakers.
10. My grandfather **used to** play football in his college days.

##### Practice Questions (pg 30):
1. We are not completely sure but Kishore **may** come back.
2. When Koushik was a child, he **used to** play in the street.
3. **Could** I have some more juice, please?
4. I **can\'t** believe my eyes.
5. Dinesh **must** be the richest person in the village.
6. Imran **would** have studied more for the final exam.
7. My house **needs** decorating.
8. I **would** rather request you to check my exercise.
9. **May** I use your mobile phone?
10. In schools, students **must** wear uniforms.`
    },
    {
      id: "lsn_p1_14_prepositions_masterclass_full",
      moduleId: "mod_wts_p1",
      title: "Q7L. Prepositions Master List & 20 Exercises",
      tamil: "7L. முன்இடைச்சொற்கள் (Prepositions)",
      content: `### 📍 Q7L. Prepositions (Pages 31-32 of PDF)

#### Primary & Secondary Prepositions List:
- **in**: Place inside (*ball is in the box*), Month (*visit me in May*)
- **on**: Surface (*book is on the table*), Day (*on Monday*)
- **at**: Specific place (*at Madurai*), Specific time (*at 5 p.m.*)
- **for**: Duration (*waiting for 5 hours*), Purpose (*for my sister*)
- **by**: Near place (*lived by the sea*), Time limit (*by 4 o\'clock*), Agent (*written by me*)
- **from**: Origin (*from Tanjore*), Time range (*from 7 to 8 a.m.*)
- **to**: Direction (*went to Vellore*), Time range (*4 to 5 p.m.*)
- **since**: Point of past time (*living here since 2011*)
- **about**: Regarding (*about Ravi*)
- **above**: Over (*above all of us*)
- **across**: Cross over (*across the river*)
- **after**: Following (*after your meal*)
- **along**: Parallel (*along railway track*)
- **among**: Among many (*among themselves*)
- **before**: Prior to (*before the bell*)
- **behind**: Back of (*behind his mother*)
- **below**: Lower position (*given below*)
- **between**: Between two (*between Ramu and Somu*)
- **down**: Lower direction (*down from the tree*)
- **in front of**: Facing (*in front of me*)
- **into**: Movement inside (*fell into the well*)
- **near**: Nearby (*near our school*)
- **of**: Possessive (*school of fine arts*)
- **off**: Disconnect (*switched off light*)
- **over**: Flying above (*over the tree*)
- **through**: Pass inside (*through narrow street*)
- **under**: Below surface (*under the table*)
- **up**: Higher position (*up the hill*)
- **upon**: On top (*fell upon me*)
- **with**: Together (*with my daddy*)
- **beside**: By the side of (*beside the tent*)

##### Book Back Exercise Answers (pg 32):
01. In case **of** difficulty, you should refer **to** a dictionary and then respond **to** the question.
02. clothes that he has put **on** are impressive. He is going **to** his hometown.
03. nearest hospital **to** this place is **at** a distance of 20 km.
04. reach it either **by** car or **by** a bicycle.
05. protection **to** people... move head and arms **up**.
06. see **through** the window... breathe **over** a curved pipe.
07. discussed problem **among** themselves... not arrive **to** conclusion.
08. went **to** their class teacher... discussed **with** her.
09. wreck **of** RMS Titanic lies **at** a depth of 12,500 feet.
10. lies **on** two main pieces... third **of** a mile apart.

##### 10 Practice Exercises (with Answers):
01. The boy was waiting **for** his mother.
02. The cat is **on** the wall.
03. My friend is afraid **of** dogs.
04. Gandhiji died **for** India.
05. Ramani hails **from** a good family.
06. Sarala hid **behind** the door.
07. woodcutter was going into forest **with** his axe.
08. Silambarasan is good **at** dancing.
09. Ranjan travels **by** a car.
10. Savitha has been reading **for** five hours.`
    },
    {
      id: "lsn_p1_15_question_tags_full",
      moduleId: "mod_wts_p1",
      title: "Q7M. Question Tags Masterclass & Rules",
      tamil: "7M. வினா இணைப்புகள் (Question Tags)",
      content: `### ❓ Q7M. Question Tags (Pages 33-35 of PDF)

#### Rules & Method:
1. **Positive statement -> Negative tag**:
   - *He is good* -> **isn\'t he?**
   - *They are good* -> **aren\'t they?**
   - *He has money* -> **hasn\'t he?**
   - *She is a teacher* -> **isn\'t she?**
   - *I am good* -> **aren\'t I?** (Special Rule: *I am* takes *aren\'t I?*)

2. **Main Verbs Breakdown**:
   - Verb (present) -> **don\'t** (*They come late, don\'t they?*)
   - Verb+s/es -> **doesn\'t** (*He goes late, doesn\'t he?*)
   - Verb (past) -> **didn\'t** (*She went late, didn\'t she?*)

3. **Negative Statement -> Positive Tag**:
   - Sentences containing negative words (*no, none, little, few, rarely, hardly, barely, scarcely, neither, never, seldom*) are treated as negative -> take **positive tag**!
   - *She rarely goes to films* -> **does she?**
   - *I seldom talk with him* -> **do I?**
   - *Very few boys go to temples* -> **do they?**
   - *He hardly helps his wife* -> **does he?**
   - *There is little water* -> **is there?**

4. **Commands and Requests**:
   - Suggestions (*Let us go / Let us move*) -> **shall we?**
   - Simple Requests (*Come with me / Please get me water*) -> **will you?**
   - Urgent Requests (*Send the mail / Call police*) -> **won\'t you?**
   - Impatient Remarks (*Keep quiet / Listen to me*) -> **can\'t you?**

##### Govt Exam Questions (MDL-18):
a. Cities are increasingly becoming urbanised: **aren\'t they?**
b. They experiment with ways to improve air quality: **don\'t they?**

##### Book Back Questions (pg 34-35):
01. You are a student, **aren\'t you?**
02. Aji is not a lawyer, **is she?**
03. Lawrence saw the snake sliding into the hole, **didn\'t he?**
04. Jordi attends the class regularly, **doesn\'t he?**
05. The aim should be to reduce congestion, **shouldn\'t it?**
06. There is an urgent need to provide clean energy, **isn\'t there?**
07. Automation will play a key role, **won\'t they?**
08. It changes the way people commute, **doesn\'t it?**
09. AVs could drive people to destinations, **couldn\'t they?**
10. Shared AVs will run at higher rates, **won\'t they?**`
    },
    {
      id: "lsn_p1_16_syllabification_full",
      moduleId: "mod_wts_p1",
      title: "Q7N. Syllabification Rules & Practice",
      tamil: "7N. அசைபிரித்தல் (Syllabification)",
      content: `### 🎵 Q7N. Syllabification (Pages 35-37 of PDF)

#### 6 Phonetic Rules for Syllabification:
1. Every syllable MUST contain a **vowel sound** (a, e, i, o, u, y).
   - *per-ma-nent* (3 syllables)
2. Two vowels together making diphthong sound count as 1 syllable.
   - *en-ter-tain-ment* (4 syllables)
3. Silent \'e\' at end does NOT count as a syllable.
   - *pre-pare* (2 syllables: pre-pare)
4. Suffixes *-ly, -ness, -ment, -ion* after silent \'e\' do not count extra syllable.
   - *bare-ly* (2 syllables: bare-ly)
5. Suffix *-ed* at end does NOT add a syllable unless preceded by \'t\' or \'d\'.
   - *dropped* (1 syllable) | *at-ten-ded* (3 syllables)
6. Endings like *-ble, -cle, -dle, -fle, -gle, -kle, -tle, -ple* count as 1 syllable.
   - *vi-si-ble* (3 syllables)

#### Syllabification Master List:
- **1 Syllable**: thought, dropped, glum, queue, whole
- **2 Syllables**: a-bout (2), in-side (2), mu-sic (2), ma-dam (2), peo-ple (2), pu-pil (2), sur-plus (2), fu-ture (2), tem-per (2), parch-ment (2), Eng-lish (2), mas-ter (2), bit-ter (2), stu-dent (2), tea-cher (2)
- **3 Syllables**: pro-per-ly (3), per-ma-nent (3), gui-ta-rist (3), sur-vi-val (3), in-ter-nal (3), di-min-ish (3), fa-nat-ic (3), re-mem-ber (3), beau-ti-ful (3), ad-vo-cate (3), sym-pa-thise (3), ob-ser-va-ble (3), mo-nu-ment (3)
- **4 Syllables**: en-ter-tain-ment (4), as-tro-no-my (4), ob-ser-va-ble (4), ar-ti-cu-late (4), en-vir-on-ment (4), po-li-ti-cal (4), in-vi-ta-tion (4), com-for-ta-ble (4), mag-na-ni-mous (4)
- **5 Syllables**: ex-tra-va-gan-za (5), ex-am-i-na-tion (5), de-ter-mi-na-tion (5), art-i-cu-la-tion (5)`
    },
    {
      id: "lsn_p1_17_american_english_plural_patterns",
      moduleId: "mod_wts_p1",
      title: "Q7O–Q7Q. American English, Singular/Plural & Sentence Patterns",
      tamil: "7O–7Q. அமெரிக்க ஆங்கிலம், பன்மை & வாக்கிய அமைப்புகள்",
      content: `### 🇺🇸 Q7O, 7P, 7Q. American English, Plural & Sentence Patterns (Pages 37-44 of PDF)

#### 7O. American English vs British English (30 Words):
- advertisement -> **notice**
- anticlockwise -> **counterclockwise**
- blind -> **window shade**
- boot -> **trunk**
- chips -> **french fries**
- cot -> **crib**
- cupboard -> **closet**
- dustbin -> **garbage can / trash can**
- fellow -> **guy**
- fire brigade -> **fire department**
- goods train -> **freight train**
- interval -> **intermission**
- jam -> **jelly**
- lift -> **elevator / escalator**
- lorry / van -> **truck**
- biscuit -> **cookie**
- flat -> **apartment**
- maths -> **math**
- postbox -> **mailbox**
- shop -> **store**
- torchlight -> **flash light**
- washbasin -> **sink**
- windscreen -> **windshield**

##### Spelling Differences (20):
- centre -> **center** | metre -> **meter** | litre -> **liter**
- theatre -> **theater** | colour -> **color** | favourite -> **favorite**
- tyre -> **tire** | licence -> **license** | programme -> **program**
- practise (v) -> **practice (v)** | jewellery -> **jewelry** | organise -> **organize**

---

#### 7P. Singular and Plural (10 Rules & Exceptions):
1. **-is -> -es**: axis -> **axes**, crisis -> **crises**, analysis -> **analyses**, basis -> **bases**, thesis -> **theses**
2. **-um / -on -> -a**: memorandum -> **memoranda**, aquarium -> **aquaria**, stratum -> **strata**, erratum -> **errata**, curriculum -> **curricula**, medium -> **media**, datum -> **data**, criterion -> **criteria**
3. **-a -> -ae**: formula -> **formulae**, alumna -> **alumnae**, antenna -> **antennae**
4. **-us -> -i**: focus -> **foci**, locus -> **loci**, alumnus -> **alumni**, fungus -> **fungi**, syllabus -> **syllabi**, radius -> **radii**, stimulus -> **stimuli**
5. **-oo -> -ee**: tooth -> **teeth**, foot -> **feet**, goose -> **geese**
6. **-x -> -ces**: matrix -> **matrices**, index -> **indices**, appendix -> **appendices**, apex -> **apices**
7. **Same in both**: sheep, deer, aircraft, furniture, cattle, corps, species, spectacles, means, premises, series, innings, pants.

---

#### 7Q. Sentence Pattern Breakdown (S-V-O-C-A):
- **Subject (S)**: Who / what performs action (*The students, My uncle*)
- **Verb (V)**: Action or state (*plays, wrote, will play, is*)
- **Direct Object (DO)**: What? (*football, a story, a pen*)
- **Indirect Object (IO)**: Whom? (*me, us, him*)
- **Complement (C)**: Completes the sentence (*a teacher, weak, silent, red in colour, Hitler, holiday*)
- **Adjunct (A)**: MPTR (Method-How, Place-Where, Time-When, Reason-Why) (*now, in the market, fast, at 10 o\'clock, due to bad weather*)

##### 20 Sentence Pattern Examples:
1. *He / kicked / the dog*: **S V O**
2. *Please bring / me / some water*: **V IO DO**
3. *The actor / turned / politician*: **S V C**
4. *He / tore / the letter / open*: **S V O C**
5. *The patient / is lying / unconscious*: **S V C**
6. *My father / is reading / the news paper*: **S V O**
7. *Children / are sleeping / in the bedroom*: **S V A**
8. *I / have invited / 10 friends / to the party*: **S V O A**
9. *Yesterday / I / bought / my children / sweets*: **A S V IO DO**
10. *My brother / became / an engineer / last year*: **S V C A**
11. *The old woman / offered / the stranger / some food*: **S V IO DO**
12. *Our teacher / told / us / a story / yesterday*: **S V IO DO A**
13. *The teacher / gave / the students / the important questions*: **S V IO DO**
14. *All people / consider / Shakespeare / the greatest dramatist / in literature*: **S V O C A**
15. *The sudden heavy flood / left / thousands of villagers / homeless / last week*: **S V O C A**
16. *Maths / drives / the students / mad*: **S V O C**
17. *We / painted / the car / red*: **S V O C**
18. *I / want / my coffee / hot*: **S V O C**
19. *The district collector / advised / the students / to study well*: **S V O A**
20. *Thousands of students / find / our Way to Success guide / useful*: **S V O C**`
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

  console.log('✅ Exhaustive Part-I (Questions 1 to 20 | Pages 4 to 44 of PDF) successfully seeded into SQLite!');
}

if (require.main === module) {
  seedPart1Exhaustive()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedPart1Exhaustive;
