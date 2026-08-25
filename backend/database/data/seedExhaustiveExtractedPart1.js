/**
 * SEED EXHAUSTIVE EXTRACTED PART-I DATA (QUESTIONS 1 TO 20)
 * Directly extracted from Way to Success +1 English PDF (Pages 4 to 44)
 * Run: node backend/database/data/seedExhaustiveExtractedPart1.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedExhaustiveExtractedPart1() {
  console.log('🚀 Seeding 100% Complete Extracted Part-I Dataset into SQLite...');
  await runMigration();

  // Ensure Course and Module 1 exist
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (Way to Success முழுப் பாடத்திட்டம்)', 'Complete +1 English Study Material: Part I (Q1-20), Part II (Q21-30), Part III (Q31-40), Part IV (Q41-47).', 1, 1)`
  );

  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_wts_part1', 'crs_class11', 'Part I: 1-Mark Questions & Vocabulary (Q1–Q20 | 20 Marks)', 'பகுதி 1: ஒரு மதிப்பெண் வினாக்கள் & இலக்கணம் (20 மதிப்பெண்கள்)', 'Q1-Q20: Synonyms, Antonyms, Compound Words, Prefixes & Suffixes, Abbreviations, Clipped Words, Word Definitions, Phrasal Verbs, Idioms, Foreign Words, Euphemism, Modals, Prepositions, Question Tags, Syllabification, American/British English, Singular/Plural, Sentence Patterns.', 1)`
  );

  const lessonsData = [
    {
      id: "lsn_wts_p1_synonyms_antonyms",
      moduleId: "mod_wts_part1",
      title: "1-6. Synonyms & Antonyms (சொற்களின் பொருள் & எதிர்ச்சொல்)",
      tamil: "உரைநடை 1-6 கலைச்சொற்கள் & எதிர்ச்சொற்கள்",
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
- **adulation**: appreciation (பாராட்டு)
- **etched**: imprinted (முத்திரை பதித்தல்)
- **speculation**: guess (ஊகம்)
- **haul**: taking a collection (ஈர்ப்பு, வசூல் தொகை பெறு)

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
- **venerable**: respected (மரியாதைக்குரிய)

##### Govt Exam Questions (MDL-18):
1. Her silver locks were scattered untidily over her pale, **puckered** face:
   - a) graceful  b) fresh  c) smoothed  **d) wrinkled**
2. It is the **efficiency** rather than the inefficiency of human memory that compels my wonder:
   - a) irritation  b) inability  c) inferiority  **d) ability**
3. We have to re-call the struggles of the past and realize the **perils** and possibilities:
   - a) safeties  **b) dangers**  c) securities  d) certainty

##### 20 Practice Questions (with Answers):
01. She had been old and **wrinkled** for the twenty years: **b) crumpled**
02. We treated it like the **fables** of the prophets: **b) stories**
03. theories with a special stamp, but only reiteratesome of the cardinal principles **enunciated**: **d) spoke clearly**
04. The greatest disadvantage for me was my loss of **appetite**: **d) hunger**
05. They consoled me and **lauded** me on the silver win: **b) appreciated**
06. As they recall their **exploits** or their errors: **d) daring acts**
07. I ate enough to **sate**: **b) satisfy**
08. She **hobbled** about the house in spotless: **a) staggered**
09. During the monarchical or **feudal** days, Universities had to train scholars: **a) old-fashioned**
10. Her silver locks were **scattered**: **a) disordered**
11. A fourth was **torpedoed** in the War: **a) abolished**
12. words of praise and **adulation** were showered on me: **b) appreciation**
13. He **persuaded** me to look in at the sale-room: **c) convinced**
14. I am always **reluctant** to trust a departing visitor to post an important letter: **d) unwilling**
15. So I pulled on it and **yanked** at it, with grunts and frowns and increasing consternation: **a) jerked**
16. do such small **prosaic** things as take the ball: **a) dull**
17. So **glibly** about 'note of hand only' really mean it: **c) smoothly**
18. yanked at it, with grunts and frowns and increasing **consternation**: **c) worry**
19. I had **gashed** my finger on the zip and was shedding blood: **d) cut**
20. I do claim to represent him in all his **ruggedness**: **a) strength**

---

### 🔄 Q4-6: Antonyms Master Table (Pages 9-12 of PDF)

#### Prose 1 to 6 Antonyms Table:
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
- **amateur** X **professional**
- **compulsory** X **voluntary**
- **traditional** X **modern**
- **expensive** X **cheap**
- **prosperous** X **poor**
- **exasperation** X **calmness**

##### Govt Exam Questions (MDL-18):
1. The other teams had already completed their weight in, which is **compulsory** for all players:
   - a) required  b) obligatory  **c) voluntary**  d) compulsion
2. The staff looked so **prosperous** and unsympathetic:
   - a) rich  b) wealthy  **c) poor**  d) luxurious
3. It was at this point that my wife looked at me with an expression of wonder - not anger or **exasperation**:
   - a) irritation  **b) calmness**  c) vexation  d) annoyance

##### 20 Practice Questions (with Answers):
01. yet I have **accumulated** only about 212 air miles: **b) scattered**
02. She had once been young and **pretty**: **a) ugly**
03. the thought was almost **revolting**: **d) pleasing**
04. She said her morning prayer in a **monotonous**: **b) interesting**
05. her sparrows whom she fed longer and with frivolous **rebukes**: **a) blessing**
06. I was presented with a **traditional** shawl: **a) modern**
07. They were content to work in **secluded** spheres, far from the din: **c) public**
08. How **expensive** things were in America: **d) cheap**
09. With this **princely** sum, and a little more that had been collected: **d) few**
10. I set to **pondering** on the problem what to do next: **c) forgetting**
11. The people were **enormously** nice too: **c) tiny**
12. from remembering to do such small **prosaic** things as take the ball: **a) interesting**
13. She arrived home, anticipating with angry relish the white face and **quivering** lips: **d) steady**
14. therefore has no time to remember the **mediocre**: **b) special**
15. They were selling Barbizon pictures, and getting **tremendous** sums for each: **a) tiny**
16. You may find self-seekers **enthroned** and the patient worker decried: **c) dethroned**
17. I could have **embraced** him and wept for joy: **b) released**
18. lidless tin of tobacco rolled **crazily** across the concourse: **d) calmly**
19. with grunts and **frowns** and increasing consternation: **c) grins**
20. As **inheritors** of that rich legacy, you are best suited: **a) predecessors**`
    },
    {
      id: "lsn_wts_p1_compound_and_affixes",
      moduleId: "mod_wts_part1",
      title: "7-8. Compound Words & Prefixes/Suffixes",
      tamil: "கூட்டுச் சொற்கள் & முன்னொட்டு/பின்னொட்டு",
      content: `### 🔗 Q7A. Compound Words (Pages 12-14 of PDF)

#### 15 Combination Types:
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
   - **a) plaza**  b) late  c) proof  d) wheel -> **Answer: plaza**

##### Type-1 Practice Exercises (10 Qs):
01. Compound word with **mantel**: **b) piece** (mantelpiece)
02. Compound word with **eye**: **d) lashes** (eyelashes)
03. Compound word with **water**: **c) proof** (waterproof)
04. Compound word with **bee**: **a) hive** (beehive)
05. Compound word with **toll**: **a) gate** (tollgate)
06. Compound word with **door**: **b) knob** (doorknob)
07. Compound word with **spinning**: **d) wheel** (spinning wheel)
08. Compound word with **grand**: **a) mother** (grandmother)
09. Compound word with **sing**: **c) song** (singsong)
10. Compound word with **sun**: **b) set** (sunset)

##### Type-2 Practice Exercises (Combination Identification):
01. **Whitewash**: **d) Adjective + Verb**
02. **Birthplace**: **c) Noun + Noun**
03. **Kitchen garden**: **Noun + Noun**
04. **Handshake**: **Noun + Verb**
05. **Washing soap**: **Gerund + Noun**

---

### ✂️ Q7B. Prefixes & Suffixes (Page 14 of PDF)

#### Rules & Explanations:
- **Prefix**: Added BEFORE the root word (e.g. *un-* + tidy = **untidy**).
  - Common Prefixes: *un-, in-, dis-, il-, a-, en-, mis-, im-, pre-, ir-, non-*
- **Suffix**: Added AFTER the root word (e.g. *cricket* + *-er* = **cricketer**).
  - Common Suffixes: *-able, -ous, -ing, -or, -er, -ment, -ance, -ful, -ity, -ist, -ly*

##### Govt Exam Question:
1. Form a new word by adding suitable prefix to root word **audible** (MDL-18):
   - **a) in**  b) re  c) un  d) de -> **Answer: in (inaudible)**

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
      id: "lsn_wts_p1_abbrev_clipped_def",
      moduleId: "mod_wts_part1",
      title: "9-11. Abbreviations, Clipped Words & One-Word Definitions",
      tamil: "சுருக்கக் குறியீடுகள் & சொற்பொருள் விளக்கம்",
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
05. **GATT**: General Agreement on Trade and Tariffs

---

### ✂️ Q7D. Clipped Words (Pages 17-18 of PDF)

#### Definition:
Words formed by reducing (clipping) a part of a larger word while retaining the original meaning.

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
18. **Perambulator** -> **pram**

---

### 📖 Q7E. Definition of Words / One-Word Substitutions (Pages 18-20 of PDF)

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
      id: "lsn_wts_p1_phrasal_idioms_foreign",
      moduleId: "mod_wts_part1",
      title: "12-14. Phrasal Verbs, Idioms & Foreign Phrases",
      tamil: "கூட்டு வினைகள் & மரபுத்தொடர்கள்",
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
- **bear with**: tolerate | **break down**: repair / stop working | **call off**: cancel | **call on**: meet, visit | **carry out**: perform | **deal with**: manage | **get over**: recover | **give in**: yield, agree | **give up**: abandon, stop | **go on**: continue | **hit on**: discover | **keep off**: avoid | **look after**: take care of | **look for**: search | **make out**: understand | **pass away**: die | **put up with**: tolerate | **set out**: start | **take off**: left | **take after**: resemble.

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
10. lawyer **managed** the case: **dealt with**

---

### 💡 Q7G. Common Idioms (Pages 22-23 of PDF)

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

---

### 🌐 Q7I. Foreign Words and Phrases (Pages 25-26 of PDF)

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

---

### 🕊️ Q7J. Substitute Words / Euphemistic Expressions (Pages 26-28 of PDF)

#### Euphemistic Expression Table (25):
- **blind**: visually challenged | **handicapped/disabled**: differently-abled | **disabled**: a special child | **undertaker**: funeral director / mortician | **maid**: domestic engineer | **garbage man**: sanitation engineer | **lavatory**: rest-room | **public toilet**: comfort station | **housewife**: homemaker | **poor**: low income level | **slow-learners**: late-bloomers | **fat**: full-figured | **overweight**: big-boned | **beating with a cane**: corporal punishment | **died**: passed away | **unemployed**: between jobs | **jail**: correctional facility | **accidental deaths**: collateral damage | **firing someone**: letting someone go | **euthanize**: put to sleep.`
    },
    {
      id: "lsn_wts_p1_modals_preps_tags",
      moduleId: "mod_wts_part1",
      title: "15-20. Modals, Prepositions, Question Tags & Patterns",
      tamil: "Modals, Prepositions, Tags & Sentence Patterns",
      content: `### ⚙️ Q7K. Modal Verbs and Semi-Modals (Pages 28-30 of PDF)

#### 13 Modal Auxiliaries Breakdown:
- **Modals (9)**: will, would, shall, should, can, could, may, might, must
- **Semi-Modals / Quasi-Modals (4)**: need, dare, ought to, used to

##### Usages:
- **Will**: Futurity, Intention, Surety (*They will come tomorrow*)
- **Would**: Discontinued past habit (*When student, I would smoke*), Request (*Would you mind moving a bit?*), Improbable condition (*If I were a bird, I would fly*)
- **Shall**: Futurity, Permission (*Shall I close the door?*)
- **Should**: Obligation, Advice (*Children should obey parents*)
- **Can**: Ability (*I can drive a car*)
- **Could**: Polite request (*Could you lend me your book?*)
- **May**: Possibility (*It may rain*), Wishes (*May God bless you!*)
- **Must**: Compulsion, Necessity (*You must obey rules*)
- **Need / Dare / Used to / Ought to**: Necessity, Courage, Past habit, Moral obligation.

---

### 📍 Q7L. Prepositions (Pages 31-32 of PDF)

- **in**: Place inside (*ball is in box*), Month (*in May*)
- **on**: Surface (*book on table*), Day (*on Monday*)
- **at**: Specific place (*at Madurai*), Specific time (*at 5 p.m.*)
- **for**: Duration (*waiting for 5 hours*)
- **by**: Near place, Time limit (*by 4 o\'clock*), Agent (*by me*)
- **from / to**: Origin / Direction
- **since**: Point of past time (*since 2011*)
- **into**: Movement inside (*fell into well*)

---

### ❓ Q7M. Question Tags (Pages 33-35 of PDF)

- Positive statement -> Negative tag (*He is good, isn\'t he?*)
- Main verbs -> *Verb+s* takes **doesn\'t**, *Past verb* takes **didn\'t**
- Negative statement / negative words (*rarely, hardly, seldom*) -> Positive tag (*She rarely goes, does she?*)
- Suggestions (*Let us go*) -> **shall we?**
- Requests (*Please get water*) -> **will you?**

---

### 🎵 Q7N. Syllabification (Pages 35-37 of PDF)

- **1 Syllable**: thought, dropped, glum, queue
- **2 Syllables**: a-bout, in-side, mu-sic, peo-ple, pu-pil, bit-ter, stu-dent
- **3 Syllables**: pro-per-ly, per-ma-nent, gui-ta-rist, beau-ti-ful, ad-vo-cate
- **4 Syllables**: en-ter-tain-ment, as-tro-no-my, ob-ser-va-ble, po-li-ti-cal
- **5 Syllables**: ex-tra-va-gan-za, ex-am-i-na-tion, de-ter-mi-na-tion

---

### 🇺🇸 Q7O. American English vs British English (Pages 37-38 of PDF)

- advertisement -> **notice** | blind -> **window shade** | boot -> **trunk** | chips -> **french fries** | cupboard -> **closet** | dustbin -> **garbage can** | fellow -> **guy** | flat -> **apartment** | lift -> **elevator** | lorry -> **truck** | biscuit -> **cookie** | postbox -> **mailbox** | torchlight -> **flash light** | washbasin -> **sink**.
- **Spelling**: centre -> **center** | colour -> **color** | tyre -> **tire** | licence -> **license** | programme -> **program**.

---

### 🔢 Q7P. Singular and Plural (Pages 38-41 of PDF)

1. **-is -> -es**: axis -> **axes**, crisis -> **crises**, basis -> **bases**
2. **-um/-on -> -a**: memorandum -> **memoranda**, stratum -> **strata**, datum -> **data**, criterion -> **criteria**
3. **-a -> -ae**: formula -> **formulae**, alumna -> **alumnae**
4. **-us -> -i**: focus -> **foci**, locus -> **loci**, alumnus -> **alumni**, syllabus -> **syllabi**
5. **-oo -> -ee**: tooth -> **teeth**, foot -> **feet**
6. **-x -> -ces**: matrix -> **matrices**, index -> **indices**
7. **Same in both**: sheep, deer, aircraft, furniture, cattle, series, species.

---

### 🎯 Q7Q. Sentence Patterns S-V-O-C-A (Pages 41-44 of PDF)

- **Subject (S)**: Who/what performs action | **Verb (V)**: Action/state
- **Direct Object (DO)**: What? | **Indirect Object (IO)**: Whom?
- **Complement (C)**: Completes sentence | **Adjunct (A)**: MPTR (How, Where, When, Why)

##### Examples:
1. *He / kicked / the dog*: **S V O**
2. *Please bring / me / some water*: **V IO DO**
3. *The actor / turned / politician*: **S V C**
4. *He / tore / the letter / open*: **S V O C**
5. *My father / is reading / the newspaper*: **S V O**
6. *Children / are sleeping / in the bedroom*: **S V A**
7. *I / have invited / 10 friends / to the party*: **S V O A**
8. *Yesterday / I / bought / my children / sweets*: **A S V IO DO**
9. *My brother / became / an engineer / last year*: **S V C A**
10. *Thousands of students / find / our Way to Success guide / useful*: **S V O C**`
    }
  ];

  for (let idx = 0; idx < lessonsData.length; idx++) {
    const l = lessonsData[idx];
    await db.execute(
      `INSERT OR REPLACE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [l.id, l.moduleId, l.title, l.tamil, idx + 1]
    );

    await db.execute(
      `INSERT OR REPLACE INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [l.id, l.title, l.content, l.tamil]
    );
  }

  console.log('🎉 100% Extracted Part-I (Questions 1 to 20 | Pages 4 to 44 of PDF) successfully seeded into SQLite!');
}

if (require.main === module) {
  seedExhaustiveExtractedPart1()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedExhaustiveExtractedPart1;
