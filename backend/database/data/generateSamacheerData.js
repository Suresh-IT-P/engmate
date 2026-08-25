const fs = require('fs');
const path = require('path');

// Load existing data
const dataDir = path.resolve(__dirname);
const coursesPath = path.join(dataDir, 'courses.json');
const modulesPath = path.join(dataDir, 'modules.json');
const lessonsPath = path.join(dataDir, 'lessons.json');
const lessonContentPath = path.join(dataDir, 'lesson_content.json');
const exercisesPath = path.join(dataDir, 'exercises.json');

const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
const lessonContent = JSON.parse(fs.readFileSync(lessonContentPath, 'utf8'));
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Samacheer Kalvi Curriculum Data for Classes 6 to 12
const samacheerCourses = [
  {
    id: "course_samacheer_class_6",
    title: "Class 6: Samacheer Kalvi English",
    tamil_title: "6-ஆம் வகுப்பு: சமச்சீர் கல்வி ஆங்கிலம்",
    description: "Complete Class 6 English textbook units: Sea Turtles, When the Trees Walked, The Crocodile, and basic grammar with Tamil explanations.",
    tamil_description: "6-ஆம் வகுப்பு உரைநடை, செய்யுள், துணைப்பாடம் மற்றும் இலக்கணப் பயிற்சிகள்.",
    level_id: "A1",
    category_id: "tn_board",
    total_xp: 800,
    estimated_hours: 15,
    order_index: 6
  },
  {
    id: "course_samacheer_class_7",
    title: "Class 7: Samacheer Kalvi English",
    tamil_title: "7-ஆம் வகுப்பு: சமச்சீர் கல்வி ஆங்கிலம்",
    description: "Class 7 English textbook units: Eidgah by Premchand, The Listeners, Wind on Haunted Hill by Ruskin Bond, and Tenses.",
    tamil_description: "7-ஆம் வகுப்பு பாடங்கள், செய்யுள் நயம், கதைப் பகுதி மற்றும் முக்கிய இலக்கணப் பயிற்சிகள்.",
    level_id: "A1",
    category_id: "tn_board",
    total_xp: 900,
    estimated_hours: 18,
    order_index: 7
  },
  {
    id: "course_samacheer_class_8",
    title: "Class 8: Samacheer Kalvi English",
    tamil_title: "8-ஆம் வகுப்பு: சமச்சீர் கல்வி ஆங்கிலம்",
    description: "Class 8 English textbook: The Nose-Jewel by C. Rajagopalachari, Special Hero, Hobby Turns Career, Active/Passive Voice.",
    tamil_description: "8-ஆம் வகுப்பு பாடங்கள், மூக்குத்தி சிறுகதை, மற்றும் இலக்கண வினா-விடைகள்.",
    level_id: "A2",
    category_id: "tn_board",
    total_xp: 1000,
    estimated_hours: 20,
    order_index: 8
  },
  {
    id: "course_samacheer_class_9",
    title: "Class 9: Samacheer Kalvi English",
    tamil_title: "9-ஆம் வகுப்பு: சமச்சீர் கல்வி ஆங்கிலம்",
    description: "Class 9 English: Learning the Game (Sachin Tendulkar), Stopping by Woods (Robert Frost), A Poison Tree, If-Clauses.",
    tamil_description: "9-ஆம் வகுப்பு பாடங்கள், சச்சின் டெண்டுல்கர் வாழ்க்கை வரலாறு, மற்றும் கூடுதல் வினாக்கள்.",
    level_id: "A2",
    category_id: "tn_board",
    total_xp: 1100,
    estimated_hours: 22,
    order_index: 9
  },
  {
    id: "course_samacheer_class_10",
    title: "Class 10 (SSLC): Samacheer Kalvi English Master",
    tamil_title: "10-ஆம் வகுப்பு (SSLC): சமச்சீர் ஆங்கிலம் முழுப் பாடத்திட்டம்",
    description: "Full SSLC 10th English Textbook: Units 1-7 (His First Flight, Life, Empowered Women, Tech Bloomers, The Last Lesson, The Dying Detective) + Book Back & Additional Questions + Complete Board Exam Grammar.",
    tamil_description: "10-ஆம் வகுப்பு பொதுத்தேர்வுக்கான அனைத்து 7 அலகுகள், செய்யுள்கள், துணைப்பாடங்கள் மற்றும் அரசு பொதுத்தேர்வு வினா-விடை வங்கி.",
    level_id: "B1",
    category_id: "tn_board",
    total_xp: 1500,
    estimated_hours: 30,
    order_index: 10
  },
  {
    id: "course_samacheer_class_11",
    title: "Class 11 (HSC): Samacheer Kalvi English",
    tamil_title: "11-ஆம் வகுப்பு (+1): சமச்சீர் கல்வி ஆங்கிலம்",
    description: "Class 11 English: The Portrait of a Lady (Khushwant Singh), Once Upon a Time (Gabriel Okara), The Queen of Boxing (Mary Kom), Advanced Concord & Inversion.",
    tamil_description: "11-ஆம் வகுப்பு உரைநடை, கவிதைகள், மற்றும் உயர்தர இலக்கணப் பயிற்சிகள்.",
    level_id: "B1",
    category_id: "tn_board",
    total_xp: 1300,
    estimated_hours: 25,
    order_index: 11
  },
  {
    id: "course_samacheer_class_12",
    title: "Class 12 (HSC): Samacheer Board English Ace",
    tamil_title: "12-ஆம் வகுப்பு (+2): அரசு பொதுத்தேர்வு ஆங்கிலம்",
    description: "Complete Class 12 English Board Exam Curriculum: Two Gentlemen of Verona, The Castle, A Nice Cup of Tea, Our Casuarina Tree, God Sees the Truth but Waits + Sentence Transformation & Error Spotting.",
    tamil_description: "12-ஆம் வகுப்பு பொதுத்தேர்வு உரைநடை, செய்யுள், கதைப்பகுதி மற்றும் பிழை திருத்தம் வினா-விடை வங்கி.",
    level_id: "B2",
    category_id: "tn_board",
    total_xp: 1600,
    estimated_hours: 35,
    order_index: 12
  }
];

// Append courses if not already present
for (const sc of samacheerCourses) {
  const idx = courses.findIndex(c => c.id === sc.id);
  if (idx >= 0) {
    courses[idx] = sc;
  } else {
    courses.push(sc);
  }
}

// Samacheer Modules Definition
const samacheerModules = [
  // Class 6 Modules
  {
    id: "mod_sam_6_prose_poetry",
    course_id: "course_samacheer_class_6",
    title: "Class 6: Prose & Nature Poetry",
    tamil_title: "அலகு 1 & 2: உரைநடை மற்றும் செய்யுள்",
    description: "Sea Turtles and When the Trees Walked with bilingual vocabulary.",
    order_index: 1
  },
  {
    id: "mod_sam_6_grammar",
    course_id: "course_samacheer_class_6",
    title: "Class 6: Fundamental Grammar Drills",
    tamil_title: "அடிப்படை இலக்கணப் பயிற்சிகள்",
    description: "Types of Sentences, Nouns, Pronouns, and Simple Verbs.",
    order_index: 2
  },

  // Class 7 Modules
  {
    id: "mod_sam_7_stories",
    course_id: "course_samacheer_class_7",
    title: "Class 7: Classic Stories & Poetry",
    tamil_title: "அலகு 1: கதைகள் மற்றும் செய்யுள்",
    description: "Premchand's Eidgah, The Listeners, and Ruskin Bond's Wind on Haunted Hill.",
    order_index: 1
  },
  {
    id: "mod_sam_7_grammar",
    course_id: "course_samacheer_class_7",
    title: "Class 7: Tenses & Modals Practice",
    tamil_title: "காலங்கள் மற்றும் துணை வினைச்சொற்கள்",
    description: "Present, Past, Future, and Modal Auxiliaries.",
    order_index: 2
  },

  // Class 8 Modules
  {
    id: "mod_sam_8_units",
    course_id: "course_samacheer_class_8",
    title: "Class 8: Literature & Moral Values",
    tamil_title: "அலகு 1 & 2: இலக்கியம் மற்றும் நற்பண்புகள்",
    description: "The Nose-Jewel by Rajaji and Special Hero with full Tamil summary.",
    order_index: 1
  },
  {
    id: "mod_sam_8_grammar",
    course_id: "course_samacheer_class_8",
    title: "Class 8: Voices & Comparison",
    tamil_title: "செய்வினை, செயப்பாட்டு வினை & ஒப்பீடுகள்",
    description: "Active/Passive Voice, Degrees of Comparison, and Conjunctions.",
    order_index: 2
  },

  // Class 9 Modules
  {
    id: "mod_sam_9_sports_nature",
    course_id: "course_samacheer_class_9",
    title: "Class 9: Inspiration & Classic Poetry",
    tamil_title: "உந்துதல் தரும் பாடங்கள் & கவிதைகள்",
    description: "Learning the Game (Sachin Tendulkar) & Stopping by Woods on a Snowy Evening.",
    order_index: 1
  },
  {
    id: "mod_sam_9_grammar",
    course_id: "course_samacheer_class_9",
    title: "Class 9: Clauses & Conditionals",
    tamil_title: "வாக்கியத் தொடர்கள் & நிபந்தனை வாக்கியங்கள்",
    description: "If-Clauses (Types 1, 2, 3), Phrases & Clauses, and Prepositional Verbs.",
    order_index: 2
  },

  // Class 10 (SSLC) Modules
  {
    id: "mod_sam_10_unit_1",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 1: His First Flight & Life",
    tamil_title: "அலகு 1: முதல் பறத்தல் & வாழ்க்கை கவிதை",
    description: "Prose: His First Flight (Liam O'Flaherty) | Poem: Life (Henry Van Dyke) | Supplementary: The Tempest.",
    order_index: 1
  },
  {
    id: "mod_sam_10_unit_2",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 2: The Night the Ghost Got In & Zigzag",
    tamil_title: "அலகு 2: பேய் வந்த இரவு & ஜிக்ஜாக்",
    description: "Prose: The Night the Ghost Got In | Poem: The Grumble Family | Supplementary: Zigzag.",
    order_index: 2
  },
  {
    id: "mod_sam_10_unit_3",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 3: Empowered Women Navigating The World",
    tamil_title: "அலகு 3: சாதனைப் பெண்கள் & பெண்ணியம்",
    description: "Prose: INSV Tarini All-Women Crew | Poem: I am Every Woman | Supplementary: Story of Mulan.",
    order_index: 3
  },
  {
    id: "mod_sam_10_unit_4",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 4: The Attic & Machines",
    tamil_title: "அலகு 4: பரண் நினைவுகள் & எந்திரங்கள்",
    description: "Prose: The Attic (Satyajit Ray) | Poem: The Ant and the Cricket | Supplementary: The Aged Mother.",
    order_index: 4
  },
  {
    id: "mod_sam_10_unit_5",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 5: Tech Bloomers & Modern World",
    tamil_title: "அலகு 5: தொழில்நுட்ப மலர்கள் & எதிர்காலம்",
    description: "Prose: Tech Bloomers (Assistive Tech) | Poem: The Secret of the Machines (Rudyard Kipling).",
    order_index: 5
  },
  {
    id: "mod_sam_10_unit_6",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 6: The Last Lesson & Peace",
    tamil_title: "அலகு 6: இறுதிப் பாடம் & உலக அமைதி",
    description: "Prose: The Last Lesson (Alphonse Daudet) | Poem: No Men Are Foreign (James Kirkup).",
    order_index: 6
  },
  {
    id: "mod_sam_10_unit_7",
    course_id: "course_samacheer_class_10",
    title: "SSLC Unit 7: The Dying Detective & Mystery",
    tamil_title: "அலகு 7: துப்பறியும் நிபுணர் ஷெர்லாக் ஹோம்ஸ்",
    description: "Prose: The Dying Detective (Arthur Conan Doyle) | Poem: The House on Elm Street | Supplementary: A Dilemma.",
    order_index: 7
  },
  {
    id: "mod_sam_10_grammar_mastery",
    course_id: "course_samacheer_class_10",
    title: "SSLC Board Exam Master Grammar (100% Score)",
    tamil_title: "10-ஆம் வகுப்பு அரசு பொதுத்தேர்வு இலக்கண வங்கி",
    description: "Active/Passive, Direct/Indirect Speech, Question Tags, Simple/Compound/Complex, Articles & Prepositions.",
    order_index: 8
  },

  // Class 11 Modules
  {
    id: "mod_sam_11_units",
    course_id: "course_samacheer_class_11",
    title: "Class 11: The Portrait of a Lady & Boxing Queen",
    tamil_title: "11-ஆம் வகுப்பு இலக்கியப் பாடங்கள்",
    description: "Khushwant Singh's Portrait of a Lady and Mary Kom's autobiography with vocabulary.",
    order_index: 1
  },
  {
    id: "mod_sam_11_grammar",
    course_id: "course_samacheer_class_11",
    title: "Class 11: Higher Grammar & Concord",
    tamil_title: "11-ஆம் வகுப்பு உயர்நிலை இலக்கணம்",
    description: "Subject-Verb Concord, Inversion of Sentences, and Phrasal Verbs.",
    order_index: 2
  },

  // Class 12 (HSC) Modules
  {
    id: "mod_sam_12_units",
    course_id: "course_samacheer_class_12",
    title: "Class 12: Two Gentlemen of Verona & Our Casuarina Tree",
    tamil_title: "12-ஆம் வகுப்பு பொதுத்தேர்வு பாடங்கள்",
    description: "A.J. Cronin's Two Gentlemen of Verona, George Orwell's A Nice Cup of Tea, and Toru Dutt's Poetry.",
    order_index: 1
  },
  {
    id: "mod_sam_12_grammar",
    course_id: "course_samacheer_class_12",
    title: "Class 12: Board Exam Grammar & Error Spotting",
    tamil_title: "12-ஆம் வகுப்பு பிழை திருத்தம் & வாக்கிய மாற்றம்",
    description: "Error Spotting rules, Sentence Transformation (Simple/Compound/Complex), and Idioms & Phrases.",
    order_index: 2
  }
];

for (const sm of samacheerModules) {
  const idx = modules.findIndex(m => m.id === sm.id);
  if (idx >= 0) {
    modules[idx] = sm;
  } else {
    modules.push(sm);
  }
}

// Samacheer Lessons with in-depth Textbook details
const samacheerLessons = [
  // Class 10 SSLC Unit 1
  {
    id: "les_sam_10_his_first_flight",
    module_id: "mod_sam_10_unit_1",
    title: "Unit 1 Prose: His First Flight (Liam O'Flaherty)",
    tamil_title: "அலகு 1 உரைநடை: முதல் பறத்தல் (லியாம் ஓ'பிளஹர்ட்டி)",
    description: "The inspiring story of a young seagull overcoming fear of flight with the encouragement of his mother.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 1
  },
  {
    id: "les_sam_10_life_poem",
    module_id: "mod_sam_10_unit_1",
    title: "Unit 1 Poem: Life (Henry Van Dyke)",
    tamil_title: "அலகு 1 கவிதை: வாழ்க்கை (ஹென்றி வான் டைக்)",
    description: "A philosophical sonnet celebrating living life with a courageous and forward-looking heart.",
    xp_reward: 100,
    estimated_minutes: 15,
    order_index: 2
  },
  {
    id: "les_sam_10_tempest_supp",
    module_id: "mod_sam_10_unit_1",
    title: "Unit 1 Supplementary: The Tempest (William Shakespeare)",
    tamil_title: "அலகு 1 துணைப்பாடம்: புயல் (வில்லியம் ஷேக்ஸ்பியர்)",
    description: "Prospero, Miranda, Ariel, and the magical reconciliation on the enchanted island.",
    xp_reward: 110,
    estimated_minutes: 20,
    order_index: 3
  },

  // Class 10 SSLC Unit 2
  {
    id: "les_sam_10_ghost_got_in",
    module_id: "mod_sam_10_unit_2",
    title: "Unit 2 Prose: The Night the Ghost Got In (James Thurber)",
    tamil_title: "அலகு 2 உரைநடை: பேய் வந்த இரவு (ஜேம்ஸ் தர்பர்)",
    description: "A hilarious comedy of errors when family members mistake noises for a ghost and call police.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 1
  },
  {
    id: "les_sam_10_zigzag_supp",
    module_id: "mod_sam_10_unit_2",
    title: "Unit 2 Supplementary: Zigzag (Asha Nehemiah)",
    tamil_title: "அலகு 2 துணைப்பாடம்: ஜிக்ஜாக் (ஆஷா நெகேமியா)",
    description: "Dr. Krishnan's family and the amusing antics of Zigzag the multilingual pet bird.",
    xp_reward: 110,
    estimated_minutes: 18,
    order_index: 2
  },

  // Class 10 SSLC Unit 3
  {
    id: "les_sam_10_empowered_women",
    module_id: "mod_sam_10_unit_3",
    title: "Unit 3 Prose: Empowered Women Navigating The World",
    tamil_title: "அலகு 3 உரைநடை: சாதனைப் பெண்கள் - ஐ.என்.எஸ்.வி தாரிணி",
    description: "The historic journey of 6 Indian Navy women officers circumnavigating the globe on INSV Tarini.",
    xp_reward: 130,
    estimated_minutes: 22,
    order_index: 1
  },
  {
    id: "les_sam_10_every_woman_poem",
    module_id: "mod_sam_10_unit_3",
    title: "Unit 3 Poem: I am Every Woman (Rakhi Nariani Shirke)",
    tamil_title: "அலகு 3 கவிதை: நான் அனைத்துப் பெண்கள் (ராக்கி நாரியானி ஷிர்கே)",
    description: "A powerful poem praising modern woman's resilience, courage, and unconditional strength.",
    xp_reward: 100,
    estimated_minutes: 15,
    order_index: 2
  },

  // Class 10 SSLC Unit 4 & 5
  {
    id: "les_sam_10_the_attic",
    module_id: "mod_sam_10_unit_4",
    title: "Unit 4 Prose: The Attic (Satyajit Ray)",
    tamil_title: "அலகு 4 உரைநடை: பரண் (சத்யஜித் ரே)",
    description: "Aditya and the narrator revisit their ancestral home in Bramhapur to right an old childhood wrong.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 1
  },
  {
    id: "les_sam_10_tech_bloomers",
    module_id: "mod_sam_10_unit_5",
    title: "Unit 5 Prose: Tech Bloomers (Assistive Technology)",
    tamil_title: "அலகு 5 உரைநடை: தொழில்நுட்ப மலர்கள் (உதவித் தொழில்நுட்பம்)",
    description: "How cutting-edge assistive technology empowers persons with disabilities to achieve independence.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 1
  },

  // Class 10 SSLC Unit 6 & 7
  {
    id: "les_sam_10_last_lesson",
    module_id: "mod_sam_10_unit_6",
    title: "Unit 6 Prose: The Last Lesson (Alphonse Daudet)",
    tamil_title: "அலகு 6 உரைநடை: கடைசிப் பாடம் (அல்போன்ஸ் டாடெட்)",
    description: "Franz's unforgettable final French lesson with M. Hamel in Alsace, teaching the value of one's mother tongue.",
    xp_reward: 130,
    estimated_minutes: 22,
    order_index: 1
  },
  {
    id: "les_sam_10_dying_detective",
    module_id: "mod_sam_10_unit_7",
    title: "Unit 7 Prose: The Dying Detective (Arthur Conan Doyle)",
    tamil_title: "அலகு 7 உரைநடை: இறக்கும் தருவாயில் துப்பறியும் நிபுணர்",
    description: "Sherlock Holmes fakes a fatal illness to trap Culverton Smith into a confession for murder.",
    xp_reward: 140,
    estimated_minutes: 25,
    order_index: 1
  },

  // Class 10 Board Exam Grammar Master Lessons
  {
    id: "les_sam_10_gram_voice",
    module_id: "mod_sam_10_grammar_mastery",
    title: "SSLC Grammar: Active & Passive Voice Transformations",
    tamil_title: "செய்வினை மற்றும் செயப்பாட்டு வினை மாற்றங்கள்",
    description: "Formulas, rules, and board exam model questions for transforming Active to Passive voice.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 1
  },
  {
    id: "les_sam_10_gram_reported",
    module_id: "mod_sam_10_grammar_mastery",
    title: "SSLC Grammar: Direct and Indirect Speech",
    tamil_title: "நேர்கூற்று மற்றும் அயற்கூற்று விதிகள்",
    description: "Reporting statements, questions, imperatives, and exclamations with tense shifting rules.",
    xp_reward: 130,
    estimated_minutes: 22,
    order_index: 2
  },
  {
    id: "les_sam_10_gram_sentences",
    module_id: "mod_sam_10_grammar_mastery",
    title: "SSLC Grammar: Simple, Compound, and Complex Sentences",
    tamil_title: "எளிய, கூட்டு மற்றும் கலவை வாக்கியங்கள்",
    description: "Master clause identification, coordinating conjunctions, and subordinating linkers for full marks.",
    xp_reward: 140,
    estimated_minutes: 25,
    order_index: 3
  },
  {
    id: "les_sam_10_gram_tags_preps",
    module_id: "mod_sam_10_grammar_mastery",
    title: "SSLC Grammar: Question Tags & Prepositional Phrases",
    tamil_title: "வினாக்குறிப்புகள் & முன்னிடைச் சொற்கள்",
    description: "Rules for positive/negative question tags, exception rules (I am -> aren't I), and prepositions.",
    xp_reward: 110,
    estimated_minutes: 18,
    order_index: 4
  },

  // Class 12 Board Exam Lessons
  {
    id: "les_sam_12_verona",
    module_id: "mod_sam_12_units",
    title: "Class 12 Prose: Two Gentlemen of Verona (A.J. Cronin)",
    tamil_title: "12-ஆம் வகுப்பு உரைநடை: வெரோனாவின் இரு பண்பாளர்கள்",
    description: "Nicola and Jacopo's selfless sacrifice and devotion to cure their sister Lucia of tuberculosis.",
    xp_reward: 140,
    estimated_minutes: 25,
    order_index: 1
  },
  {
    id: "les_sam_12_casuarina",
    module_id: "mod_sam_12_units",
    title: "Class 12 Poem: Our Casuarina Tree (Toru Dutt)",
    tamil_title: "12-ஆம் வகுப்பு கவிதை: சவுக்கு மரம் (தோரு தத்)",
    description: "An ode immortalizing the Casuarina tree associated with happy childhood memories and lost siblings.",
    xp_reward: 120,
    estimated_minutes: 20,
    order_index: 2
  },
  {
    id: "les_sam_12_error_spotting",
    module_id: "mod_sam_12_grammar",
    title: "Class 12 Grammar: Board Exam Error Spotting Golden Rules",
    tamil_title: "12-ஆம் வகுப்பு அரசு தேர்வு பிழை திருத்தம் 20 பொன்விதிகள்",
    description: "Concord, articles, prepositions, degrees, and common singular/plural traps tested in 12th board exam.",
    xp_reward: 150,
    estimated_minutes: 25,
    order_index: 1
  }
];

for (const sl of samacheerLessons) {
  const idx = lessons.findIndex(l => l.id === sl.id);
  if (idx >= 0) {
    lessons[idx] = sl;
  } else {
    lessons.push(sl);
  }
}

// In-depth Lesson Content Sections with textbook passages, summaries, glossaries, and bilingual translations
const samacheerLessonContents = [
  // 1. His First Flight
  {
    lesson_id: "les_sam_10_his_first_flight",
    section_type: "textbook_passage",
    title: "Textbook Summary & Author Introduction",
    tamil_title: "பாடச் சுருக்கம் மற்றும் ஆசிரியர் அறிமுகம்",
    content: `**Author:** Liam O'Flaherty (1896–1984), a renowned Irish novelist and short-story writer.

**Plot Overview:**
The young seagull was alone on his ledge. His two brothers and his little sister had already learned to fly away the day before. But he was afraid to fly with them. Whenever he took a little run forward to the brink of the ledge and attempted to flap his wings, he became terrified. The great expanse of sea stretched down beneath, and it seemed a long way down — miles down.

His parents called to him shrilly, scolding him, and threatening to let him starve on his ledge unless he flew away. But for the life of him he could not move. 

Finally, his mother devised a clever plan. She picked up a piece of fish and flew across to him. Maddened by hunger, the young seagull dived at the fish. As he fell outward into space, a monstrous terror seized him, but in the next moment he felt his wings spread outwards. The wind rushed against his breast feathers. He was no longer falling headlong. He was soaring gradually downwards and outwards. He had made his first flight!`,
    tamil_content: `**ஆசிரியர்:** லியாம் ஓ'பிளஹர்ட்டி (1896–1984) - அயர்லாந்து நாட்டின் புகழ்பெற்ற எழுத்தாளர்.

**பாடச் சுருக்கம்:**
கடற்பாறை விளிம்பில் ஒரு இளைய கடற்பறவை தனியாக இருந்தது. அதன் உடன்பிறப்புகள் பறக்கக் கற்றுக்கொண்ட போதிலும், இப்பறவை கடலின் ஆழத்தைக் கண்டு பயந்து பறக்கத் தயங்கியது. பெற்றோர்கள் உணவு தராமல் பட்டினி போடுவதாக எச்சரித்தும் அச்சத்தால் நகரவில்லை. 

இறுதியாக அதன் தாய் பறவை ஒரு தந்திரம் செய்தது. மீன் துண்டை அலகில் வைத்துக்கொண்டு அதன் அருகே பறந்து வந்து சற்று தள்ளி நின்றது. பசியின் தீவிரத்தால் மீனைப் பிடிக்க கடற்பறவை குதித்தது. அந்த நொடியில் அதன் இறக்கைகள் விரிந்து தானாகவே காற்றில் மிதக்கத் தொடங்கின. பயம் நீங்கி, தனது முதல் வெற்றிகரமான பறத்தலை அது சாதித்தது!`,
    order_index: 1
  },
  {
    lesson_id: "les_sam_10_his_first_flight",
    section_type: "glossary",
    title: "Key Glossary & Vocabulary",
    tamil_title: "சொற்களஞ்சியம் & பொருள்",
    content: `• **Ledge:** A narrow horizontal shelf projecting from a wall or cliff.
• **Shrilly:** Producing a high-pitched and piercing voice or sound.
• **Herring:** A valuable soft-finned edible fish.
• **Devour:** Eat food or prey hungrily or quickly.
• **Cackle:** Make a harsh, sharp noise resembling a bird's cry.
• **Muster:** Collect or assemble a number of things or courage.
• **Monstrous:** Exceptionally large, frightening, or cruel.`,
    tamil_content: `• **Ledge:** பாறை விளிம்பு
• **Shrilly:** கீச்சிடும் கூரிய குரல்
• **Herring:** ஒரு வகை கடல் மீன்
• **Devour:** பசியுடன் விழுங்கு
• **Cackle:** பறவையின் கூச்சல் ஒலி
• **Muster:** தைரியத்தை ஒன்றுதிரட்டுதல்
• **Monstrous:** மிகப்பெரிய / அச்சுறுத்தும்`,
    order_index: 2
  },

  // 2. Poem: Life
  {
    lesson_id: "les_sam_10_life_poem",
    section_type: "textbook_passage",
    title: "Poem Text & Stanza Breakdown",
    tamil_title: "கவிதை வரிகள் & விளக்கம்",
    content: `*Let me but live my life from year to year,*
*With forward face and unreluctant soul;*
*Not hurrying to, nor turning from the goal;*
*Not mourning for the things that disappear*
*In the dim past, nor holding back in fear*
*From what the future veils; but with a whole*
*And happy heart, that pays its toll*
*To Youth and Age, and travels on with cheer.*

**Poet:** Henry Van Dyke (1852–1933), an American author, educator, and clergyman.

**Theme:** The poem is a sonnet expressing optimism, resilience, and living in the present with continuous courage.`,
    tamil_content: `**ஹென்றி வான் டைக்** எழுதிய 'வாழ்க்கை' என்ற இக்கவிதை, கடந்த கால இழப்புகளுக்கு வருந்தாமல், எதிர்காலத்தைப் பற்றிய பயமின்றி, நிகழ்காலத்தில் மகிழ்ச்சியுடனும் துணிச்சலுடனும் முன்னேறி வாழ வேண்டும் என்று போதிக்கிறது.`,
    order_index: 1
  },

  // 3. Empowered Women Navigating The World
  {
    lesson_id: "les_sam_10_empowered_women",
    section_type: "textbook_passage",
    title: "INSV Tarini Expedition Highlights",
    tamil_title: "ஐ.என்.எஸ்.வி தாரிணி வரலாற்றுப் பயணம்",
    content: `**Navika Sagar Parikrama** was a project wherein an all-women crew of the Indian Navy circumnavigated the globe entirely on a 55-foot sailing vessel named **INSV Tarini**.

**Key Crew Members:**
1. Lt. Commander Vartika Joshi (Skipper)
2. Lt. Commander Pratibha Jamwal
3. Lt. Commander P. Swathi
4. Lt. S. Vijaya Devi
5. Lt. B. Aishwarya
6. Lt. Payal Gupta

**Expedition Facts:**
• **Distance Covered:** Over 21,600 nautical miles.
• **Duration:** 254 days across the Pacific, Atlantic, and Indian Oceans.
• **Significance:** Promoted indigenous Make-in-India technology and empowered women's leadership globally.`,
    tamil_content: `இந்திய கடற்படையைச் சேர்ந்த 6 துணிச்சல் மிக்க பெண் அதிகாரிகள் 'ஐ.என்.எஸ்.வி தாரிணி' என்ற பாய்மரக் கப்பலில் உலகம் முழுவதும் 21,600 கடல் மைல்கள் பயணித்து சாதனை படைத்த வரலாற்று நிகழ்வு இப்பாடமாகும். மேக்-இன்-இந்தியா திட்டத்தின் கீழ் உள்நாட்டிலேயே உருவாக்கப்பட்ட இக்கப்பலில் அவர்கள் கடுமையான கடல் புயல்களைக் கடந்து வெற்றிகரமாக கரை திரும்பினர்.`,
    order_index: 1
  },

  // 4. SSLC Master Grammar: Active & Passive Voice
  {
    lesson_id: "les_sam_10_gram_voice",
    section_type: "grammar_rule",
    title: "Active and Passive Voice Rules & Formulas",
    tamil_title: "செய்வினை & செயப்பாட்டு வினை விதிகள்",
    content: `### Golden Rules for Transformation:
1. **Identify the Subject (S), Verb (V), and Object (O)**.
2. **Move the Object to the Subject position**.
3. **Change the Verb to suitable 'Be' verb + Past Participle (V3)**.
4. **Add the preposition 'by' before the original Subject**.

### Tense Transformation Table:
• **Simple Present:** *S + V1 + O* ➔ *O + am/is/are + V3 + by + S*
  - Active: *"She writes a letter."*
  - Passive: *"A letter is written by her."*

• **Simple Past:** *S + V2 + O* ➔ *O + was/were + V3 + by + S*
  - Active: *"Alexander Graham Bell invented the telephone."*
  - Passive: *"The telephone was invented by Alexander Graham Bell."*

• **Present Continuous:** *S + am/is/are + V(-ing) + O* ➔ *O + am/is/are + being + V3 + by + S*
  - Active: *"The students are decorating the hall."*
  - Passive: *"The hall is being decorated by the students."*

• **Modal Verbs:** *S + can/must/should + V1 + O* ➔ *O + can/must/should + be + V3 + by + S*
  - Active: *"You must complete the assignment."*
  - Passive: *"The assignment must be completed by you."*`,
    tamil_content: `செய்பவரை முதன்மைப்படுத்துவது **செய்வினை (Active Voice)**; செய்யப்பட்ட செயலை அல்லது பொருளை முதன்மைப்படுத்துவது **செயப்பாட்டு வினை (Passive Voice)**.
சூத்திரம்: பொருள் (Object) + Be வினைச்சொல் + வினைச்சொல்லின் 3-ஆம் வடிவம் (V3) + by + எழுவாய் (Subject).`,
    order_index: 1
  }
];

for (const slc of samacheerLessonContents) {
  const existingIdx = lessonContent.findIndex(lc => lc.lesson_id === slc.lesson_id && lc.title === slc.title);
  if (existingIdx >= 0) {
    lessonContent[existingIdx] = slc;
  } else {
    lessonContent.push(slc);
  }
}

// Samacheer Kalvi Interactive Exercises (Book Back & Additional Exam Questions)
const samacheerExercises = [
  {
    id: "ex_sam_10_flight_mcq",
    lesson_id: "les_sam_10_his_first_flight",
    title: "Class 10 Unit 1: His First Flight - Book Back & Additional Questions",
    tamil_title: "10-ஆம் வகுப்பு அலகு 1 வினா-விடைப் பயிற்சி",
    exercise_type: "mcq",
    difficulty: "medium",
    total_xp: 80,
    questions: [
      {
        id: "q_sam_10_1",
        question_text: "Why did the young seagull fail to fly with his brothers and sister?",
        tamil_subtext: "இளைய கடற்பறவை ஏன் தன் சகோதரர்களுடன் பறக்கத் தவறியது?",
        options: [
          "He was afraid that his wings would not support him",
          "He was injured and could not move",
          "He did not want to leave the ledge",
          "He was sleeping on the cliff"
        ],
        correct_answer: "He was afraid that his wings would not support him",
        explanation: "The young seagull felt certain that his wings would never support him over the vast sea.",
        tamil_explanation: "தன் இறக்கைகள் தன்னைத் தாங்காது என்ற அச்சமே அது பறக்கத் தயங்கியதற்கு காரணம்."
      },
      {
        id: "q_sam_10_2",
        question_text: "What did the young seagull's mother do to compel him to fly?",
        tamil_subtext: "கடற்பறவையை பறக்க வைக்க தாய் பறவை என்ன செய்தது?",
        options: [
          "She brought a piece of fish and stopped just out of his reach",
          "She pushed him forcefully off the ledge",
          "She flew away and abandoned him",
          "She called other seagulls to attack him"
        ],
        correct_answer: "She brought a piece of fish and stopped just out of his reach",
        explanation: "Maddened by hunger, the young bird dived at the fish and instinctively spread his wings.",
        tamil_explanation: "மீன் துண்டைக் காட்டி எட்டாத தூரத்தில் நின்று பசியின் தூண்டுதலால் குதிக்க வைத்தது."
      },
      {
        id: "q_sam_10_3",
        question_text: "What is the synonym of the word 'devour'?",
        tamil_subtext: "'Devour' என்ற சொல்லின் ஒத்த சொல் என்ன?",
        options: ["Eat hungrily", "Spit out", "Store carefully", "Cook slowly"],
        correct_answer: "Eat hungrily",
        explanation: "'Devour' means to eat food or prey hungrily and quickly.",
        tamil_explanation: "'Devour' என்றால் பசியோடு வேகமாக விழுங்குதல் என்று பொருள்."
      }
    ]
  },
  {
    id: "ex_sam_10_voice_practice",
    lesson_id: "les_sam_10_gram_voice",
    title: "SSLC Board Exam: Active & Passive Voice Transformation Drills",
    tamil_title: "10-ஆம் வகுப்பு பொதுத்தேர்வு செய்வினை / செயப்பாட்டு வினை பயிற்சி",
    exercise_type: "mcq",
    difficulty: "medium",
    total_xp: 90,
    questions: [
      {
        id: "q_sam_v_1",
        question_text: "Change into Passive Voice: 'The manager will sign the contract tomorrow.'",
        tamil_subtext: "செயப்பாட்டு வினையாக மாற்றுக.",
        options: [
          "The contract will be signed by the manager tomorrow.",
          "The contract was signed by the manager tomorrow.",
          "The contract will have signed by the manager.",
          "The manager is signing the contract tomorrow."
        ],
        correct_answer: "The contract will be signed by the manager tomorrow.",
        explanation: "Future Simple passive formula: Subject + will + be + V3 + by + Object.",
        tamil_explanation: "எதிர்கால செய்வினை Passive ஆக மாறும்போது 'will be + V3' வரும்."
      },
      {
        id: "q_sam_v_2",
        question_text: "Change into Active Voice: 'A melodious song was sung by the choir.'",
        tamil_subtext: "செய்வினையாக மாற்றுக.",
        options: [
          "The choir sang a melodious song.",
          "The choir sings a melodious song.",
          "The choir had sung a melodious song.",
          "The choir is singing a melodious song."
        ],
        correct_answer: "The choir sang a melodious song.",
        explanation: "Past Simple active formula: Subject + V2 (sang) + Object.",
        tamil_explanation: "கடந்த கால செயப்பாட்டு வினையின் Active வடிவம்: 'The choir sang a melodious song'."
      }
    ]
  },
  {
    id: "ex_sam_10_scramble_puzzles",
    lesson_id: "les_sam_10_gram_sentences",
    title: "SSLC Exam: Scrambled Sentence Puzzle Arena",
    tamil_title: "10-ஆம் வகுப்பு வாக்கிய ஒழுங்கமைப்பு புதிர்கள்",
    exercise_type: "sentence_order",
    difficulty: "medium",
    total_xp: 80,
    questions: [
      {
        id: "q_sam_scram_1",
        question_text: "practice / makes / English / speaking / fluent",
        tamil_subtext: "சொற்களை சரியான வரிசையில் அமைத்து வாக்கியத்தை உருவாக்குக.",
        correct_answer: "practice makes English speaking fluent",
        explanation: "Subject (practice) + Verb (makes) + Object phrase (English speaking fluent).",
        tamil_explanation: "தொடர் பயிற்சி ஆங்கிலப் பேச்சை சரளமாக்குகிறது."
      },
      {
        id: "q_sam_scram_2",
        question_text: "never / give / up / your / dreams / on",
        tamil_subtext: "சொற்களை ஒழுங்குபடுத்துக.",
        correct_answer: "never give up on your dreams",
        explanation: "Imperative advice: Never give up on your dreams.",
        tamil_explanation: "உங்கள் கனவுகளை ஒருபோதும் கைவிடாதீர்கள்."
      }
    ]
  }
];

for (const se of samacheerExercises) {
  const idx = exercises.findIndex(e => e.id === se.id);
  if (idx >= 0) {
    exercises[idx] = se;
  } else {
    exercises.push(se);
  }
}

// Write updated JSON files
fs.writeFileSync(coursesPath, JSON.stringify(courses, null, 2), 'utf8');
fs.writeFileSync(modulesPath, JSON.stringify(modules, null, 2), 'utf8');
fs.writeFileSync(lessonsPath, JSON.stringify(lessons, null, 2), 'utf8');
fs.writeFileSync(lessonContentPath, JSON.stringify(lessonContent, null, 2), 'utf8');
fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf8');

console.log(`✅ Successfully compiled Samacheer Kalvi Textbook Curriculum!`);
console.log(`• Courses: ${courses.length}`);
console.log(`• Modules: ${modules.length}`);
console.log(`• Lessons: ${lessons.length}`);
console.log(`• Lesson Contents: ${lessonContent.length}`);
console.log(`• Exercises: ${exercises.length}`);
