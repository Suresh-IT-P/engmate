/**
 * EXHAUSTIVE SEEDER FOR PART-II (QUESTIONS 21 TO 30 | PAGES 45 TO 62 OF PDF)
 * Captures all 6 Poems Appreciation QAs, Figures of Speech, Rhyme Schemes,
 * Direct/Indirect Speech, Active/Passive Voice, Simple/Compound/Complex & Conditional Clauses.
 * Run: node backend/database/data/seedPart2Exhaustive.js
 */

const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function seedPart2Exhaustive() {
  console.log('🚀 Seeding Exhaustive Part-II (Questions 21 to 30 | Pages 45 to 62) into SQLite...');
  await runMigration();

  // Ensure Module 2 exists
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi & Way to Success 2019)', '11ஆம் வகுப்பு ஆங்கிலம் (Way to Success முழுப் பாடத்திட்டம்)', 'Exclusive +1 English Study Material', 1, 1)`
  );

  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_wts_p2', 'crs_class11', 'Part II: Poetry Appreciation & Transformations (Q21–Q30 | 14 Marks)', 'பகுதி 2: செய்யுள் வினாக்கள் & வாக்கிய மாற்றம் (14 மதிப்பெண்கள்)', 'Pages 45 to 62 of PDF: Q21-Q26 Poem Appreciation & Figures of Speech for all 6 Poems. Q27-Q30 Transformation of Sentences (Direct/Indirect, Active/Passive, Simple/Compound/Complex, If-Clauses).', 2)`
  );

  // 10 Detailed Part-II Lessons
  const part2Lessons = [
    {
      id: "lsn_p2_poem1_once_upon_a_time",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 1: Once Upon a Time (Gabriel Okara)",
      tamil: "செய்யுள் 1: ஒரு காலத்தில் (கேப்ரியல் ஓகாரா)",
      content: `### 📜 Poem 1: ONCE UPON A TIME (Gabriel Okara) (Pages 46, 51, 52 of PDF)

#### Appreciation Questions & Answers:

##### Extract i:
*"But now they only laugh with their teeth,*
*While their ice-block –cold eyes..."*

- **a) Who are 'they'?**
  - **Answer**: They are people of modern days.
- **b) Explain: ice-block-cold eyes.**
  - **Answer**: The expression 'ice-block-cold eyes' refers to eyes without any warmth of feeling.
- **c) Identify the figure of speech used here.**
  - **Answer**: Metaphor.

##### Extract ii:
*"Most of all, I want to relearn*
*How to laugh, for my life in the mirror*
*Shows only my teeth like a snake\'s bare fangs!"*

- **a) Why does the poet want to relearn how to laugh?**
  - **Answer**: The poet wants to show his real feelings. Hence he wants to relearn how to laugh.
- **b) Whom does the poet want to relearn from?**
  - **Answer**: The poet wants to relearn from his innocent son.
- **c) Mention the figure of speech used here.**
  - **Answer**: Simile (*like a snake\'s bare fangs*).

---

#### Figures of Speech Summary (Poem 1):
1. *'Once upon a time' in 1st and last lines*: **Repetition**
2. *Like dresses - home face (Line 21)*: **Simile**
3. *'..conforming smile like a fixed portrait smile.' (Line 24)*: **Simile**
4. *When I was like you. I want (Line 35)*: **Simile**
5. *once upon a time when I was like you. (Line 43)*: **Simile**
6. *'Ice-block-cold eyes' (Line 5)*: **Metaphor**
7. *'feel at home!' 'come again' (Line 13)*: **Sarcasm**

- **Rhyming Scheme**: All stanzas **irregular**.`
    },
    {
      id: "lsn_p2_poem2_born_spectator",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 2: Confessions of a Born Spectator (Ogden Nash)",
      tamil: "செய்யுள் 2: பிறப்பிலேயே பார்வையாளனின் வாக்குமூலம்",
      content: `### 📜 Poem 2: CONFESSIONS OF A BORN SPECTATOR (Ogden Nash) (Pages 46, 47, 51, 52)

#### Appreciation Questions & Answers:

##### Extract a:
*"With all my heart I do admire*
*Athletes who sweat for fun or hire"*

- **1. Whom does the poet admire?**
  - **Answer**: The poet admires athletes.
- **2. For what reason do the athletes sweat?**
  - **Answer**: The athletes sweat for money or for pleasure.

##### Extract b:
*"Well, ego it might be pleased enough*
*But zealous athletes play so rough....."*

- **1. What pleases the ego?**
  - **Answer**: Taking the place of a winning athlete pleases the ego.
- **2. Why are the athletes often rough during play?**
  - **Answer**: The athletes are often rough during play because everyone wants to win.

##### Extract c:
*"When officialdom demands*
*Is there a doctor in the stands?"*

- **1. Why are doctors called from stands by the sponsors?**
  - **Answer**: Whenever an athlete is injured, a doctor is sent for by the officials.
- **2. Why does the poet make such an observation?**
  - **Answer**: The poet is moved by the injuries of the athletes. But umpires and referees don\'t have such an emotional feeling.

##### Extract d:
*"When snaps the knee and cracks the wrist......"*

- **Identify and explain the use of the literary device in this line.**
  - **Answer**: **Onomatopoeia** is the literary device used in this line. When athletes run for the medal they get injured. The sounds coming out of their body parts such as 'snaps' and 'cracks' are mentioned here.

---

#### Figures of Speech Summary (Poem 2):
1. *When snaps the knee and cracks the wrist...*: **Onomatopoeia**
2. *For this most modest physiques...: most-modest*: **Alliteration**
3. *They do not ever in their dealings...: they-their, do-dealings*: **Alliteration**

- **Rhyming Scheme**: Stanzas 1, 2, 4, 5, 6: **aabbcc**.`
    },
    {
      id: "lsn_p2_poem3_early_spring",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 3: Lines Written in Early Spring (Wordsworth)",
      tamil: "செய்யுள் 3: வசந்த கால தொடக்கத்தில் எழுதிய வரிகள்",
      content: `### 📜 Poem 3: LINES WRITTEN IN EARLY SPRING (William Wordsworth) (Pages 47, 51, 52)

#### Appreciation Questions & Answers:

##### Extract i:
*"And \'tis my faith that every flower*
*Enjoys the air it breathes…"*

- **a) What is the poet\'s faith?**
  - **Answer**: The poet\'s faith is that the beautiful flowers enjoy every ounce of the air they breathe.
- **b) What trait of Nature do we see here?**
  - **Answer**: We see the beautiful work of nature through this poem.

##### Extract ii:
*"And I must think, do all I can,*
*That there was pleasure there…"*

- **a) What did the poet notice about the twigs?**
  - **Answer**: The poet noticed that the twigs expand to catch the breezy air.
- **b) What was the poet\'s thought about them?**
  - **Answer**: The poet thinks that the twigs or newborn branches enjoy the breeze and there is pleasure hidden there.

##### Extract iii:
*"If this belief from heaven be sent,*
*If such be Nature\'s holy plan."*

- **a) What does 'heaven' refer to?**
  - **Answer**: Heaven refers to the place of God.
- **b) Why does the poet call it 'holy'?**
  - **Answer**: Nature is God\'s work from heaven. So the poet calls it 'holy'.

---

#### Figures of Speech & Rhyme Scheme (Poem 3):
1. *To her works did Nature link*: **Personification**
2. *The human soul that throughme ran…*: **Personification**
3. *And \'tis my faith that every flower Enjoys the air it breathes*: **Personification**
4. *What Man has made of Man?*: **Aphorism**

##### Rhyming Words & Scheme (**abab**):
- Stanza 1: **abab** (notes – thoughts; reclined – mind)
- Stanza 2: **abab** (link – think; ran – man)
- Stanza 3: **abab** (bower – flower; wreaths – breathes)
- Stanza 4: **abab** (play\'d – made; measure – pleasure)
- Stanza 5: **abab** (fan – can; air – there)
- Stanza 6: **abab** (sent – lament; plan – man)`
    },
    {
      id: "lsn_p2_poem4_macavity_cat",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 4: Macavity – The Mystery Cat (T.S. Eliot)",
      tamil: "செய்யுள் 4: மெகாவிட்டி – மர்மப் பூனை (டி.எஸ். எலியட்)",
      content: `### 📜 Poem 4: MACAVITY – THE MYSTERY CAT (T. S. Eliot) (Pages 48, 49, 51, 52)

#### Appreciation Questions & Answers:

##### Extract i:
*"Macavity\'s a Mystery Cat: he\'s called the Hidden Paw"*
- **a) Does the poet talk about a real cat?**
  - **Answer**: No, the poet talks about a fictional or imaginary cat.
- **b) Why is he called the Hidden Paw?**
  - **Answer**: He is the master criminal who always escapes. Scotland Yard cannot catch him. Hence he is called Hidden Paw.

##### Extract ii:
*"He\'s the bafflement of Scotland Yard, the Flying Squad\'s despair: For when they reach the scene of crime – Macavity\'s not there!"*
- **a) What is 'Scotland Yard'?**
  - **Answer**: Scotland Yard is the headquarters of London Metropolitan Police Service.
- **b) Why does the flying squad feel disappointed?**
  - **Answer**: The flying squad rushes to the scene of crime every time, but Macavity could not be found there.

##### Extract iii:
*"He sways his head from side to side, with movements like a snake; And when you think he\'s half asleep, he\'s always wide awake..."*
- **a) Explain the comparison made here.**
  - **Answer**: The movements of Macavity\'s head are compared to those of a snake.
- **b) What does he pretend to do?**
  - **Answer**: He pretends as if he were half asleep.

##### Extract iv:
*"For he\'s a fiend in feline shape, a monster of depravity."*
- **a) How is the cat described in these lines?**
  - **Answer**: The cat is described like a devil in the shape of a cat, a monster of depravity.
- **b) Explain the phrase 'monster of depravity'.**
  - **Answer**: It means the giant of moral corruption.

##### Extract v:
*"And his footprints are not found in any file of Scotland Yard\'s."*
- **a) What seems to be a challenge for Scotland Yard?**
  - **Answer**: Macavity never leaves any footprints at the crime spot.
- **b) Why do they need his footprints?**
  - **Answer**: They need his footprints in order to arrest him.

##### Extract vi:
*"It must have been Macavity! but he\'s a mile away."*
- **a) What is Macavity blamed for?**
  - **Answer**: Missing of a Treaty file from the foreign office or loss of Admiralty plans.
- **b) Where is he?**
  - **Answer**: He is a mile away from the crime spot.

##### Extract vii:
*"There never was a Cat of such deceitfulness and suavity."*
- **a) Which cat is being talked of here?**
  - **Answer**: Macavity, the mysterious cat.
- **b) How is he different from the rest?**
  - **Answer**: By qualities such as depravity, looting, deceitfulness, and suavity.

---

#### Figures of Speech & Alliterations (Poem 4):
1. *...with movements like a snake*: **Simile**
2. *They say he cheats at cards*: **Personification**
3. *Line 1: Macavity\'s, mystery*: **Alliteration**
4. *Line 3: Scotland, squad*: **Alliteration**
5. *Line 6: broken, breaks*: **Alliteration**
6. *Line 12: his, head, highly*: **Alliteration**

- **Rhyme Scheme**: **aabb** (paw-law, despair-there, Macavity-gravity, stare-there, denied-uncombed, snake-awake, Macavity-depravity, square-there, cards-yards, rifled-stifled, repair-there, say-away, thumbs-sums, Macavity-Suavity, spare-there, time-crime).`
    },
    {
      id: "lsn_p2_poem5_everest_peak",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 5: Everest Is Not The Only Peak (Kulothungan)",
      tamil: "செய்யுள் 5: எவரெஸ்ட் மட்டுமே சிகரம் அல்ல",
      content: `### 📜 Poem 5: EVEREST IS NOT THE ONLY PEAK (Kulothungan) (Pages 49, 51, 52)

#### Appreciation Questions & Answers:

##### Extract 1:
*"Our nature it is that whatever we try / We do with devotion deep and true"*
- **i. Who does 'we' refer to?**
  - **Answer**: "We" refers to all people who shoulder responsibilities.
- **ii. How should we carry out our duties?**
  - **Answer**: We should carry out our duties with deep and true devotion; we must be sincere in our work.

##### Extract 2:
*"Defeat we repel, courage our fort"*
- **i. How do we react to our defeat?**
  - **Answer**: We repel defeat that we hate. We drive away defeat.
- **ii. Which is considered as our strong hold?**
  - **Answer**: "Fort" means strong hold. "Courage" is our fort, our strong hold.

##### Extract 3:
*"We are proud of the position, we / Hold humble as we are"*
- **i. What is the speaker proud of?**
  - **Answer**: The speaker is proud of their position.
- **ii. How is the speaker both humble and proud?**
  - **Answer**: The position of the speaker may be humble, but he is proud of the position.
- **iii. Pick out the alliteration in these lines.**
  - **Answer**: **Proud-position**; **hold – humble** are the words in alliteration.

##### Extract 4:
*"He, who does not stoop, is a king we adore / We bow before competence and merit"*
- **i. Who is adored as a king?**
  - **Answer**: A person who does not stoop or surrender is adored as a king.
- **ii. What is the figure of speech used in this line?**
  - **Answer**: **Metaphor** (*He who does not stoop is a king*).

##### Extract 5:
*"Honour is the property, common to all / In dignity and pride, no need to be poor."*
- **i. Who are considered rich?**
  - **Answer**: Persons who have honour, dignity and pride are considered rich.
- **ii. What is their asset?**
  - **Answer**: Honour is their asset.

- **Rhyming Scheme**: All stanzas **irregular**.`
    },
    {
      id: "lsn_p2_poem6_hollow_crown",
      moduleId: "mod_wts_p2",
      title: "Q21-26. Poem 6: The Hollow Crown (William Shakespeare)",
      tamil: "செய்யுள் 6: பாழடைந்த கிரீடம் (வில்லியம் ஷேக்ஸ்பியர்)",
      content: `### 📜 Poem 6: THE HOLLOW CROWN (William Shakespeare) (Pages 50, 51, 52)

#### Appreciation Questions & Answers:

##### Extract i:
*"And yet ..... ground?"*
- **a) What is the only thing we bequeath to our descendants?**
  - **Answer**: We bequeath only our deposed bodies to our descendants.
- **b) What does 'deposed' mean?**
  - **Answer**: Deposed means removed from office or power.
- **c) Are all deposed kings slain by the deposer?**
  - **Answer**: No, not all deposed kings are slain by the deposers, only a few.

##### Extract ii:
*"And nothing.... earth"*
- **a) What are the vanquished men left with?**
  - **Answer**: They are left with nothing.
- **b) What does the 'small model' refer to here?**
  - **Answer**: The "small model" refers to the human body.

##### Extract iii:
*"That rounds .... pomp"*
- **a) What mocks the ruler\'s power and pomp?**
  - **Answer**: Death mocks the king\'s power and pomp.
- **b) What hides within the crown and laughs at the grandeur?**
  - **Answer**: Death hides within the crown and laughs at the grandeur of the king.

##### Extract iv:
*"Let\'s talk.... epitaphs"*
- **a) What do the three words 'graves, worms and epitaphs' refer to?**
  - **Answer**: The words refer to our death.

##### Extract v:
*"Our lands .... Bolingbroke\'s"*
- **a) Who is Bolingbroke? Is he friend or foe?**
  - **Answer**: Bolingbroke is King Richard\'s cousin, but due to political reasons he becomes an enemy.

##### Extract vi:
*"To monarchize ....... looks"*
- **a) What does a monarch\'s crown symbolize?**
  - **Answer**: A monarch\'s crown symbolizes the King\'s power and authority over the whole country.
- **b) What does the crown of rulers stand for?**
  - **Answer**: High power and authority, but Shakespeare says death sits within the hollow crown.

##### Extract vii:
*"With solemn...... duty"*
- **a) What are the various functions and objects given up by a defeated king?**
  - **Answer**: The deposed king throws away respect, form, and ceremonious duty.
- **b) Bring out King Richard\'s feelings when he was defeated.**
  - **Answer**: Despair and a sense of resignation.

---

#### 10 Figures of Speech for Poem 6:
1. *"Let\'s talk of graves, of worms, and epitaphs..."*: **Metaphor**
2. *"And yet not so - for what can we bequeath..."*: **Interrogation**
3. *"Which serves as paste and cover to our bones"*: **Simile**
4. *"Keeps Death his court and there the antic sits..."*: **Personification**
5. *"Scoffing his state and grinning at his pomp..."*: **Personification**
6. *"Bores through his castle wall, and farewell king!"*: **Personification**
7. *"How can you say to me, I am a king?"*: **Rhetorical Question**
8. *"Our lands, our lives, and all, are ..... lands-lives"*: **Alliteration**
9. *"And tell sad stories of the death of kings: sad-stories"*: **Alliteration**
10. *"Comes at the last, and with a little pin..... last-little"*: **Alliteration**`
    },
    {
      id: "lsn_p2_27_direct_indirect_speech",
      moduleId: "mod_wts_p2",
      title: "Q27. Direct and Indirect Speech (Reporting Dialogues)",
      tamil: "27. நேர்க்கூற்று மற்றும் அயற்கூற்று (7 விதிகள்)",
      content: `### 💬 Q27. Direct & Indirect Speech (Pages 52-55 of PDF)

#### 7 Transformation Rules:
- **Rule 1: Reporting Verb Change**:
  - Statement: *say -> say*, *says -> says*, *said to -> told*
  - Question: *said / said to -> asked*
  - Imperative: *said / said to -> ordered / asked / requested / advised / warned / suggested*
  - Exclamatory: *said / said to -> exclaimed / exclaimed joyfully / exclaimed sorrowfully*
- **Rule 2: Conjunction Addition**:
  - Statement: **that**
  - Question (Wh-): **same Wh- word** | Question (Yes/No): **if / whether**
  - Imperative: **to** | Imperative Negative (Don\'t): **not to**
  - Exclamatory: **that**
- **Rule 3**: Remove comma and quotation marks (*"..."*).
- **Rule 4: Pronouns Change**: I -> he/she, we -> they, my -> his/her, your -> my/his/her.
- **Rule 5: Tense Change**: Present Simple -> Past Simple, Past Simple -> Past Perfect, Present Perfect -> Past Perfect.
- **Rule 6: Time & Place Adverbials Change Table (16 Pairs)**:
  - *this* -> **that**
  - *these* -> **those**
  - *here* -> **there**
  - *thus* -> **so**
  - *now* -> **then**
  - *ago* -> **before**
  - *today* -> **that day**
  - *tonight* -> **that night**
  - *yesterday* -> **the previous day / day before**
  - *last week* -> **the previous week**
  - *last month* -> **the previous month**
  - *last year* -> **the previous year**
  - *tomorrow* -> **the next day / following day**
  - *next week* -> **the week after**
  - *next month* -> **the month after**
  - *next year* -> **the year after**
- **Rule 7**: Structure change to statement order.

##### Step-by-Step Question 1 Example (pg 53):
*Balu said to his friend, "How long have I been waiting for you? It\'s getting late."*
- **Answer**: Balu asked his friend how long he had been waiting for him and also he told that it was getting late.

##### Govt Exam Question (MDL-18):
*Taj: Where are you going now?*
*Harsha: I am going to the library. Are you coming with me?*
- **Answer**: Taj asked Harsha where she was going then and Harsha replied that she was going to the library and also Harsha asked Taj whether she was coming with her.

##### Practice Questions (pg 54-55):
1. *I said, "I want a pen."* -> **I said that I wanted a pen.**
2. *The teacher asked Devi why she had not done her homework.* -> **The teacher said to Devi, "Why haven\'t you done your homework?"**
3. *He asked me, "Where are you going?"* -> **He asked me where I was going.**
4. *Sanjay told Chawla that everyone fights his own battles.* -> **Sanjay said to Chawla, "Everyone fights his own battles."**
5. *The teacher asked, "Have you done your homework?"* -> **The teacher asked the students whether / if they had done their homework.**`
    },
    {
      id: "lsn_p2_28_active_passive_voice",
      moduleId: "mod_wts_p2",
      title: "Q28. Active Voice and Passive Voice Masterclass",
      tamil: "28. செய்வினை மற்றும் செயப்பாட்டு வினை (5 விதிகள்)",
      content: `### 🔁 Q28. Active Voice & Passive Voice (Pages 55-57 of PDF)

#### 5 Execution Steps:
- **Step 1**: Find out Object and write it first.
- **Step 2**: Change the verb into passive form (*be-form verb + V3 past participle*).
- **Step 3**: Add **by** after the verb.
- **Step 4**: Write the Subject in place of Adjunct.
- **Step 5**: Write remaining part of sentence.

#### Table of Passive Verb Forms (All 8 Tenses):
1. **Simple Present**: V1 / V1+s -> **am / is / are + V3**
   - *Active*: RamakilledRavana -> *Passive*: **Ravanawas killed by Rama.**
2. **Simple Past**: V2 -> **was / were + V3**
3. **Simple Future**: shall / will + V -> **shall / will + be + V3**
4. **Present Continuous**: am/is/are + V-ing -> **am / is / are + being + V3**
   - *Active*: Iam writinga letter -> *Passive*: **A letteris being writtenby me.**
5. **Past Continuous**: was/were + V-ing -> **was / were + being + V3**
6. **Future Continuous**: **NO PASSIVE**
7. **Present Perfect**: have/has + V3 -> **have / has + been + V3**
8. **Past Perfect**: had + V3 -> **had + been + V3**
   - *Active*: Wehad writtenthe exam -> *Passive*: **The examhad been writtenby us.**
9. **Future Perfect**: shall/will + have + V3 -> **shall/will + have + been + V3**
10. **Continuous Perfect Tenses (Present/Past/Future)**: **NO PASSIVE**

##### Govt Exam Question (MDL-18):
*Vani wrote a letter to the editor. She posted it yesterday.*
- **Answer**: A letter was written by Vani to the editor and it was posted by her yesterday.

##### Practice Questions Type-1 (pg 57):
1. *Mohammed follows the rules.* -> **The rules are followed by Mohammed.**
2. *Mohan has completed the course.* -> **The course has been completed by Mohan.**
3. *Magdalene is singing the prayer.* -> **The prayer is being sung by Magdalene.**
4. *Who wrote this complaint?* -> **By whom was this complaint written?**
5. *May God bless you with happiness!* -> **May you be blessed with happiness by God.**

##### Practice Questions Type-2 (Make Sentences):
1. *Tagore/ award/ Nobel prize* -> **Tagore was awarded the Nobel Prize.**
2. *IIM Ahmedabad / establish /1961* -> **IIM Ahemadabad was established in 1961.**
3. *Chattisgarh/ form / 2000* -> **Chattisgarh was formed in 2000.**
4. *First passenger train /inaugurated /India /1853* -> **The first passenger train was inaugurated in India in 1853.**
5. *Indian Airlines /set up / 1953* -> **The Indian airlines was set up in 1953.**`
    },
    {
      id: "lsn_p2_29_simple_compound_complex",
      moduleId: "mod_wts_p2",
      title: "Q29. Simple, Compound & Complex Sentences",
      tamil: "29. தனி, கூட்டு மற்றும் கலப்பு வாக்கியங்கள்",
      content: `### 🔀 Q29. Simple, Compound & Complex Sentences (Pages 58-60 of PDF)

#### Definitions & Formulas:
- **Phrase**: Group of words without a finite verb (*Because of her hard work*).
- **Main Clause (MC)**: Group of words with finite verb having complete meaning (*She won the medal.*).
- **Subordinate Clause (SC)**: Group of words with finite verb having incomplete meaning (*As she worked hard*).

##### Structure Formulas:
- **Simple Sentence**: **Phrase + Main Clause**
- **Compound Sentence**: **Main Clause + Coordinating Conjunction (and so, but, or) + Main Clause**
- **Complex Sentence**: **Subordinate Clause + Main Clause**

---

#### Key Words Transformation Table (10 Base Patterns):
1. **Time**:
   - *Simple*: On + verb+ing / After + verb+ing
   - *Compound*: and / and at once / and immediately / and then
   - *Complex*: As soon as, When, While, After
2. **Reason**:
   - *Simple*: Being..., As a result of, On account of, Because of, Due to, Owing to
   - *Compound*: so, and so, therefore
   - *Complex*: As, Because, Since
3. **Too...to**:
   - *Simple*: too...to...
   - *Compound*: very...and so... can/could not
   - *Complex*: so...that...can/could not
4. **Failed Results**:
   - *Simple*: In spite of / Despite + v+ing / Despite + Possessive Adjective
   - *Compound*: but / yet / still
   - *Complex*: Though / Although / Even though
5. **Condition**:
   - *Simple*: In the event of / In case of + Possessive Adj + V+ing
   - *Compound*: and
   - *Complex*: If...can/will/could/would
6. **Negative Condition**:
   - *Simple*: In the event of not / In case of not + Possessive Adj + V+ing
   - *Compound*: or / or else / otherwise
   - *Complex*: Unless...can/can not

---

#### 10 Transformation Practice Questions (pg 60):
01. *Dinesh and Prabhu wanted to meet Varsha at the bus stop. They went to the bus stop.* (into compound)
    - **Ans**: Dinesh and Prabhu wanted to meet Varsha at the bus stop and so they went there.
02. *Varsha reached the railway station. She was waiting for them there.* (into compound)
    - **Ans**: Varsha reached the railway station and she was waiting for them there.
03. *While she waited at the train station, Varsha realized that the train was late.* (into simple)
    - **Ans**: Waiting at the train station, Varsha realized that the train was late.
04. *Dinesh and Prabhu left the bus stop. Varsha rang them.* (into complex)
    - **Ans**: When Dinesh and Prabhu left the bus stop, Varsha rang them.
05. *The trio met at the station. Varsha left for Madurai.* (into complex)
    - **Ans**: As soon as the trio met at the station, Varsha left for Madurai.
06. *Some people were playing nearby. They chose a better place.* (into complex)
    - **Ans**: Some people who were playing nearby chose a better place.
07. *They took out the fishing rods. Suddenly there was a loud splash.* (into complex)
    - **Ans**: When they took out the fishing rods, there was a loud splash.
08. *Suddenly there was a loud splash. They also heard a loud scream.* (into compound)
    - **Ans**: There was a loud splash and immediately they heard a loud scream.
09. *Both Ajay and Tijo looked up. They saw something moving in the water.* (into compound)
    - **Ans**: Both Ajay and Tijo looked up and they saw something moving in the water.
10. *Then they saw a hand waving. Someone had fallen in the water.* (into compound)
    - **Ans**: They saw a hand waving and someone had fallen in the water.`
    },
    {
      id: "lsn_p2_30_conditional_clauses_full",
      moduleId: "mod_wts_p2",
      title: "Q30. Conditional Clauses (If-Clauses 4 Types & 10 Qs)",
      tamil: "30. நிபந்தனை வாக்கியங்கள் (If-Clauses 4 வகைகள்)",
      content: `### ⚡ Q30. Conditional Clauses (If-Clauses) (Pages 60-62 of PDF)

#### 4 Conditional Types Master Table:
| Type | Name / Meaning | Condition Part | Result Part |
| :--- | :--- | :--- | :--- |
| **Type 0** | Universal truths, Scientific facts | **If + S + V1 / V+s / Passive Verb** | **S + V1 / V+s** |
| **Type I** | Possible and probable (இயலும்) | **If + S + V1 / V+s** | **S + will / won\'t / shall / can / may + V1** |
| **Type II** | Imaginary / Possible but not probable | **If + S + V2 / were** | **S + would / could + V1** |
| **Type III** | Impossible / Something already happened | **If + S + had + V3 / had been + Adj** | **S + would have + V3 / would have been + Adj** |

##### Key Execution Rules:
1. *Type 0 Zero Condition*: Heat ice. It melts -> **If you heat ice, it melts.**
2. *Type 1 Possible*: The bus breaks down. I won\'t be able to attend class -> **If the bus breaks down, I won\'t be able to attend the class.**
3. *Type 2 Imaginary*: He doesn\'t run fast. He doesn\'t win race -> **If he ran fast, he would win the race.**
4. *Type 3 Impossible Past*: He studied well. He passed in the exam -> **If he hadn\'t studied well, he wouldn\'t have passed in the exam.** | He didn\'t study well. He did not pass -> **If he had studied well, he would have passed in the exam.**

##### 10 Form a Single Sentence Using 'If' Clause (pg 62):
01. *Plant trees. Get rain.* -> **If you plant trees, you will get rain.**
02. *Ram does not work hard. Ram does not prosper.* -> **If Ram worked hard, he would prosper.**
03. *You are not careful. You cut your finger.* -> **If you were careful, you would not cut your finger.**
04. *You did not tell the truth. You were penalised.* -> **If you had told the truth, you would not have been penalised.**
05. *Hussain was quick. Hussain reached the airport.* -> **If Hussain had not been quick, he would not have reached the airport.**
06. *Shreya sang sweetly. Shreya was given a prize.* -> **If Shreya had not sung sweetly, she would not have been given a prize.**
07. *Mohan studies well. Mohan wins the prize.* -> **If Mohan studies well, he will win the prize.**
08. *Stop smoking. You catch cancer.* -> **If you don\'t stop smoking, you will catch cancer.**
09. *I am not a fish. I don\'t live in water.* -> **If I were a fish, I would live in water.**
10. *Raju did not study well. He did not pass.* -> **If Raju had studied well, he would have passed.**`
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

  console.log('✅ Exhaustive Part-II (Questions 21 to 30 | Pages 45 to 62 of PDF) successfully seeded into SQLite!');
}

if (require.main === module) {
  seedPart2Exhaustive()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedPart2Exhaustive;
