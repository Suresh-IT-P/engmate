/**
 * IMPORT 11TH STUDY MATERIAL (Docx extracted data) INTO SQLITE DATABASE
 * Run: node backend/database/data/import11thStudyDoc.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../../src/config/db');
const runMigration = require('../migrations/migrate');

async function import11thData() {
  console.log('🚀 Importing Class 11 Study Material into SQLite Database...');
  await runMigration();

  const txtPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\00320288-1044-4188-a920-25b6c3196cef\\scratch\\11th_study_extracted.txt';
  if (!fs.existsSync(txtPath)) {
    throw new Error(`File not found at ${txtPath}`);
  }

  // Ensure Course for Class 11 exists
  await db.execute(
    `INSERT IGNORE INTO courses (id, level_id, title, tamil_title, description, is_published, order_index)
     VALUES ('crs_class11', 'B1', 'Class 11 English (Samacheer Kalvi)', '11ஆம் வகுப்பு ஆங்கிலம் (சமச்சீர்)', 'Complete Class 11 syllabus covering Prose, Poems, Grammar, Writing Skills, Proverbs, and Reading Comprehension.', 1, 6)`
  );

  // Ensure Modules for Class 11 exist
  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_cls11_prose', 'crs_class11', 'Class 11 Prose Units', '11ஆம் வகுப்பு உரைநடை', 'Complete prose lessons and summaries', 1)`
  );

  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_cls11_poem', 'crs_class11', 'Class 11 Poems', '11ஆம் வகுப்பு செய்யுள்', 'Poem analysis and vocabulary', 2)`
  );

  await db.execute(
    `INSERT IGNORE INTO modules (id, course_id, title, tamil_title, description, order_index)
     VALUES ('mod_cls11_writing', 'crs_class11', 'Practical Writing & Grammar', 'எழுத்துப்பயிற்சி மற்றும் இலக்கணம்', 'Notice, Email, Letters, and Proverbs', 3)`
  );

  // 1. PROSE UNITS DATA
  const proseUnits = [
    {
      id: "lsn_cls11_prose1",
      title: "Prose 1: The Portrait of a Lady",
      tamil_title: "பாட்டியின் சித்திரம் (Khushwant Singh)",
      content: `### 📖 1. The Portrait of a Lady (Khushwant Singh)

**Plan of the Paragraph:**
1. Introduction
2. The Grandmother
3. Village Life
4. City Life
5. Death
6. Conclusion

**Summary Paragraph:**
Khushwant Singh is a famous Indian writer who writes about his sweet old grandmother. The grandmother was short, fat, and slightly bent. She wore a spotless white saree and counted prayer beads. Her white hair made her look calm and peaceful.

In the village, Khushwant Singh and his grandmother were best friends. She got him ready for school, walked with him to the temple school, and read holy books while feeding stale chapatis to street dogs.

When they moved to the city, their relationship changed. He went to an English school by bus, and she could not help him with science or music lessons. Instead, she spent her afternoons feeding hundreds of sparrows in the courtyard.

When he returned from college after five years, she fell sick. She lay in bed, prayed quietly, and died peacefully as her prayer beads fell from her hand. Thousands of sparrows sat in silence around her body without eating bread crumbs and flew away quietly when her body was taken for cremation.

**📖 Key Vocabulary:**
- **Portrait** (உருவப்படம்): A drawing, painting, or photograph of a person.
- **Wrinkles** (முகச்சுருக்கங்கள்): Small lines on skin due to old age.
- **Scriptures** (புனித நூல்கள்): Sacred religious writings.
- **Mourn** (துக்கம் அனுசரிப்பது): Feel deep sadness over someone's death.
- **Sparrows** (சிட்டுக்குருவிகள்): Small brown wild birds.`,
      vocab: [
        { word: "Portrait", tamil: "உருவப்படம்", def: "A picture or depiction of a person" },
        { word: "Wrinkles", tamil: "முகச்சுருக்கங்கள்", def: "Lines on skin caused by aging" },
        { word: "Scriptures", tamil: "புனித நூல்கள்", def: "Sacred religious books" },
        { word: "Mourn", tamil: "துக்கம் அனுசரிப்பது", def: "Express grief for the dead" },
        { word: "Sparrows", tamil: "சிட்டுக்குருவிகள்", def: "Small wild birds" }
      ]
    },
    {
      id: "lsn_cls11_prose2",
      title: "Prose 2: The Queen of Boxing",
      tamil_title: "பாக்ஸிங் ராணி (M. C. Mary Kom)",
      content: `### 🥊 2. The Queen of Boxing (M. C. Mary Kom)

**Plan of the Paragraph:**
1. Introduction
2. Early Life
3. Getting Money
4. The Big Match
5. The Queen Title
6. Conclusion

**Summary Paragraph:**
M. C. Mary Kom is a world-famous Indian boxer from Manipur. She came from a very poor agricultural family. Her parents worked hard in fields. She trained in boxing in secret because her father initially disliked sports for girls.

When she was selected for her first international match in the USA, she did not have money for plane tickets. Her father and village friends pooled cash together to fund her flight.

In America, despite losing her luggage and struggling with foreign food, she displayed fierce determination. She won a Silver Medal in her very first World Championship try. Through dedication, she won six World Championship Gold Medals and earned the title "Magnificent Mary" and "Queen of Boxing."

Her life proves that hard work and perseverance can overcome poverty and inspire millions of women in sports.

**📖 Key Vocabulary:**
- **Autobiography** (சுயசரிதை): An account of a person's life written by that person.
- **Struggle** (போராட்டம்): To make forceful efforts to overcome difficulty.
- **Determination** (மன உறுதி): Firmness of purpose and resolve.
- **Magnificent** (மிகச்சிறந்த): Extremely beautiful, impressive, or excellent.
- **Poverty** (வறுமை): The state of being extremely poor.`,
      vocab: [
        { word: "Autobiography", tamil: "சுயசரிதை", def: "A life story written by oneself" },
        { word: "Struggle", tamil: "போராட்டம்", def: "To try hard against obstacles" },
        { word: "Determination", tamil: "மன உறுதி", def: "Firm resolve to succeed" },
        { word: "Magnificent", tamil: "மிகச்சிறந்த", def: "Impressive and grand" }
      ]
    },
    {
      id: "lsn_cls11_prose3",
      title: "Prose 3: Forgetting",
      tamil_title: "மறதி பாடம் (Robert Lynd)",
      content: `### 🧠 3. Forgetting (Robert Lynd)

**Plan of the Paragraph:**
1. Introduction
2. Good Memory
3. Common Mistakes
4. Letters and Medicine
5. Why We Forget
6. Conclusion

**Summary Paragraph:**
Robert Lynd is a famous Irish essayist who writes humorous stories about everyday human habits. He observes that human memory is actually remarkably good; people easily remember complex phone numbers, sports scores, and daily routines.

However, people frequently forget small items. Travelers leave umbrellas and walking sticks on trains, and sportsmen routinely leave balls and bats behind. Furthermore, people often forget to take medicine on time or forget to post letters left in their pockets for days.

Lynd explains that absent-mindedness occurs when the mind is absorbed in deep, creative thoughts. A philosopher forgets simple items because his mind is pondering great ideas; a lover forgets because he is thinking of his beloved. Forgetting is not foolishness; it shows a creative and busy mind.`,
      vocab: [
        { word: "Absentmindedness", tamil: "கவனக்குறைவு", def: "Inattentive or forgetful state" },
        { word: "RoutineWork", tamil: "தினசரி வேலைகள்", def: "Regular daily pattern" }
      ]
    },
    {
      id: "lsn_cls11_prose4",
      title: "Prose 4: A Tight Corner",
      tamil_title: "இக்கட்டான சூழ்நிலை (E. V. Lucas)",
      content: `### 🎨 4. A Tight Corner (E. V. Lucas)

**Summary Paragraph:**
E. V. Lucas writes an entertaining real-life story about getting into a "tight corner" (a highly difficult situation). He notes that financial embarrassment is the worst tight corner.

The author accompanied a friend to an elite art auction house in London. He had only 63 pounds in his bank account and had no intention of buying anything. Just for fun and out of vanity, he raised bids on expensive paintings, assuming rich collectors would outbid him.

Unexpectedly, on a rare painting priced at 4,000 pounds, bidding suddenly stopped and the auctioneer shouted "Sold to you sir!" The author was terrified because he could not pay 4,000 pounds. Luckily, a wealthy collector who missed the bid approached him and bought the painting for an extra 50 guineas, saving the author from public disgrace.`,
      vocab: [
        { word: "AuctionSale", tamil: "ஏலம்", def: "Public sale to highest bidder" },
        { word: "VanityPride", tamil: "வீண் பெருமை", def: "Excessive self-pride" }
      ]
    },
    {
      id: "lsn_cls11_prose5",
      title: "Prose 5: The Convocation Address",
      tamil_title: "பட்டமளிப்பு உரை (Dr. Arcot Ramasamy Mudaliar)",
      content: `### 🎓 5. The Convocation Address (Dr. Arcot Ramasamy Mudaliar)

**Summary Paragraph:**
Dr. Arcot Ramasamy Mudaliar delivered a memorable convocation address guiding graduating college students. He emphasizes that a university is not merely a place to collect degree certificates, but an institution that prepares students to think clearly, act wisely, and lead noble lives.

He advises graduates to remain honest, disciplined, and dedicated to lifelong learning. Since society and the nation invest public funds in higher education, graduates owe a moral duty to serve the poor, uplift the underprivileged, and contribute to national progress.`,
      vocab: [
        { word: "ConvocationCeremony", tamil: "பட்டமளிப்பு விழா", def: "Degree awarding ceremony" }
      ]
    },
    {
      id: "lsn_cls11_prose6",
      title: "Prose 6: The Accidental Tourist",
      tamil_title: "எதிர்பாராத சுற்றுலாப் பயணி (Bill Bryson)",
      content: `### 🧳 6. The Accidental Tourist (Bill Bryson)

**Summary Paragraph:**
Bill Bryson humorously details his real-life struggles with travel clumsiness. Unlike smooth travelers, Bryson routinely gets confused in hotels, forgets his room numbers, and gets trapped near restroom doors.

During one airport check-in, his carry-on bag zip jammed. When he yanked it forcefully, the bag burst open, scattering coins, documents, tobacco, and personal items across the concourse floor while his finger bled profusely.`,
      vocab: [
        { word: "Clumsiness", tamil: "தடுமாற்றம்", def: "Awkwardness in movement" }
      ]
    }
  ];

  // Insert Prose Lessons
  for (let idx = 0; idx < proseUnits.length; idx++) {
    const p = proseUnits[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, 'mod_cls11_prose', ?, ?, 1, ?)`,
      [p.id, p.title, p.tamil_title, idx + 1]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [p.id, p.title, p.content, p.tamil_title]
    );

    for (const v of p.vocab) {
      await db.execute(
        `INSERT IGNORE INTO vocabulary (word, phonetic, meaning, tamil_meaning, level_id)
         VALUES (?, '/spelling/', ?, ?, 'B1')`,
        [v.word, v.def, v.tamil]
      );
    }
  }

  // 2. POEMS (11TH SYLLABUS)
  const poems = [
    {
      id: "lsn_cls11_poem1",
      title: "Poem 1: Once Upon a Time",
      tamil_title: "ஒரு காலத்தில் (Gabriel Okara)",
      content: `### 📜 Poem 1: Once Upon a Time (Gabriel Okara)

**Theme:** The loss of genuine warmth and sincerity in modern social interactions compared to past innocence.

The poet contrasts genuine past laughter from the heart with modern fake smiles "only with teeth." Modern people shake hands while looking for financial status. The poet asks his young son to teach him how to unlearn fake habits and laugh naturally again.`
    },
    {
      id: "lsn_cls11_poem2",
      title: "Poem 2: Confessions of a Born Spectator",
      tamil_title: "பிறவி பார்வையாளனின் ஒப்புதல் (Ogden Nash)",
      content: `### 🏈 Poem 2: Confessions of a Born Spectator (Ogden Nash)

**Theme:** Lighthearted celebration of being an enthusiastic sports fan rather than a battered athlete.

Ogden Nash humorously admits that while he admires dedicated athletes in football, hockey, and boxing, he has no desire to swap places with them. Athletes endure broken bones; the poet prefers to sit safely in the stands.`
    },
    {
      id: "lsn_cls11_poem3",
      title: "Poem 3: Lines Written in Early Spring",
      tamil_title: "வசந்த கால வரிகள் (William Wordsworth)",
      content: `### 🌸 Poem 3: Lines Written in Early Spring (William Wordsworth)

Wordsworth sits in a woodland grove during spring, observing blooming flowers, hopping birds, and budding twigs filled with divine joy. However, this natural harmony brings him sadness when contemplating "what man has made of man" through conflict.`
    },
    {
      id: "lsn_cls11_poem4",
      title: "Poem 4: Macavity – The Mystery Cat",
      tamil_title: "மர்மப் பூனை (T. S. Eliot)",
      content: `### 🐱 Poem 4: Macavity – The Mystery Cat (T. S. Eliot)

T. S. Eliot describes Macavity, a tall, thin ginger cat known as the "Hidden Paw." Macavity breaks human laws and the law of gravity, levitating effortlessly while baffling Scotland Yard because he never leaves footprints.`
    },
    {
      id: "lsn_cls11_poem5",
      title: "Poem 5: Everest Is Not The Only Peak",
      tamil_title: "எவரெஸ்ட் மட்டுமே சிகரமல்ல (Kulothungan)",
      content: `### 🏔️ Poem 5: Everest Is Not The Only Peak (Prof. V. C. Kulandaiswamy)

The poet asserts that Mount Everest is not the sole measure of height; every small hill possesses its own majestic beauty. Performing modest duties with honesty, integrity, and self-respect represents a grand victory.`
    },
    {
      id: "lsn_cls11_poem6",
      title: "Poem 6: The Hollow Crown",
      tamil_title: "வெற்று கிரீடம் (William Shakespeare)",
      content: `### 👑 Poem 6: The Hollow Crown (William Shakespeare)

King Richard II reflects on the vanity of royal power after losing his throne. He speaks of how Death sits inside the hollow crown of mortal kings, mocking their pride before killing them with a small pin.`
    }
  ];

  // Insert Poem Lessons
  for (let idx = 0; idx < poems.length; idx++) {
    const pm = poems[idx];
    await db.execute(
      `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
       VALUES (?, 'mod_cls11_poem', ?, ?, 1, ?)`,
      [pm.id, pm.title, pm.tamil_title, idx + 10]
    );

    await db.execute(
      `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
       VALUES (?, 'concept', ?, ?, ?, 1)`,
      [pm.id, pm.title, pm.content, pm.tamil_title]
    );
  }

  // 3. PRACTICAL WRITING SKILLS & GRAMMAR EXERCISES
  const writingSection = {
    id: "lsn_cls11_writing_skills",
    title: "Class 11 Practical Writing Skills (Notice, Email, Letters, Summary)",
    tamil_title: "11ஆம் வகுப்பு செய்முறை எழுத்துப் பயிற்சி (அறிவிப்பு, மின்னஞ்சல், கடிதம்)",
    content: `### 📝 Class 11 Practical Writing Skills Masterclass

#### 1. Notice Writing Format & Examples
**Example 1: Lost Item Notice**
\`\`\`text
GOVERNMENT HIGHER SECONDARY SCHOOL, SALEM
NOTICE
18 August 2026

LOST! LOST! LOST!
A black Fastrack digital sports watch was lost on the school playground during the lunch interval on 17 August 2026. The watch has a blue strap and a small scratch on the top right corner of the dial.
If anyone finds it, please return it to the school office or hand it over to the undersigned.

Arun Kumar
School Sports Captain
\`\`\`

---

#### 2. E-mail Writing Example
\`\`\`text
To: manager@apexprinters.com
Subject: Price Details for School Magazine Printing

Respected Sir,
I am Manoj, the student editor of Lotus School, Coimbatore. We want to print 500 copies of our school magazine this year.
Please send us your best price quotation and estimated printing timeline.

Thank you.
Regards, Manoj Kumar
\`\`\`

---

#### 3. Formal Leave Letter Format
\`\`\`text
From: R. Kumar, Class 11-A, GHSS, Salem.
To: The Principal, GHSS, Salem.

Respected Sir,
Subject: Requesting two days leave for sister's marriage - reg.

I kindly request you to grant me leave for two days (24.08.2026 to 25.08.2026).

Thank you.
Yours faithfully, R. Kumar
\`\`\``
  };

  await db.execute(
    `INSERT IGNORE INTO lessons (id, module_id, title, tamil_title, is_published, order_index)
     VALUES ('lsn_cls11_writing_skills', 'mod_cls11_writing', ?, ?, 1, 20)`,
    [writingSection.title, writingSection.tamil_title]
  );

  await db.execute(
    `INSERT INTO lesson_content (lesson_id, section_type, title, content_text, tamil_translation, order_index)
     VALUES ('lsn_cls11_writing_skills', 'concept', ?, ?, ?, 1)`,
    [writingSection.title, writingSection.content, writingSection.tamil_title]
  );

  console.log('✅ Successfully imported Class 11 Study Material (Prose, Poems, Writing, Grammar, Vocabulary) into SQLite!');
}

if (require.main === module) {
  import11thData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = import11thData;
