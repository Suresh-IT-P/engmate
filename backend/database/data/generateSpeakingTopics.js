/**
 * SPEAKING TOPICS GENERATOR — 105+ Daily Sentences & Speaking Topics
 * Run: node backend/database/data/generateSpeakingTopics.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname);
const topicsPath = path.join(dataDir, 'speaking_topics.json');

const topicsList = [
  // ─── DAILY CONVERSATIONS (A1 - A2) ──────────────────────────────────────────
  ["Self Introduction & Background", "சுய அறிமுகம் & பின்னணி", "A1", "Daily Life",
   "Hello! My name is Rajesh. I live in Madurai and work as a software designer. In my free time, I love reading books and listening to music.",
   "introduce, live in, occupation, free time, hobby, passionate"],

  ["My Typical Daily Routine", "எனது தினசரி வேலை வழக்கம்", "A1", "Daily Routine",
   "I usually wake up at 6:30 AM. After drinking a cup of warm tea, I go for a short morning walk and get ready for work.",
   "wake up, morning walk, commute, schedule, lunchtime, relax"],

  ["Ordering Food at a Restaurant", "உணவகத்தில் உணவு ஆர்டர் செய்தல்", "A1", "Dining",
   "Excuse me, could we please have the menu card? We would like to order two plates of veg fried rice and fresh orange juice.",
   "menu, order, fried rice, fresh juice, recommendation, bill"],

  ["Asking for Directions in a New City", "புதிய நகரில் வழி கேட்டல்", "A1", "Travel",
   "Excuse me sir, could you please tell me how to get to the central railway station? Is it within walking distance from here?",
   "excuse me, direction, railway station, walking distance, turn left"],

  ["Shopping for Clothes at a Mall", "கடையில் துணிகள் வாங்குதல்", "A1", "Shopping",
   "Do you have this cotton shirt in blue color and size forty? I would like to try it on in the dressing room.",
   "cotton shirt, size, dressing room, try on, price, discount"],

  ["Describing Your House and Rooms", "வீட்டை விவரிப்பது", "A1", "Daily Life",
   "I live in a cozy two-bedroom apartment in Chennai. My favorite place is the balcony where I grow flowering plants.",
   "cozy apartment, balcony, bedroom, flowering plants, peaceful"],

  ["Talking About Your Family", "குடும்பத்தைப் பற்றி பேசுவது", "A1", "Daily Life",
   "There are five members in my family: my father, mother, elder brother, grandmother, and me. We enjoy eating dinner together.",
   "family members, elder brother, grandmother, dinner together, supportive"],

  ["Talking About Your Pet Dog", "செல்லப் பிராணியைப் பற்றி பேசுவது", "A1", "Daily Life",
   "I have a friendly puppy named Jimmy. He wags his tail happily whenever I come home from school.",
   "friendly puppy, wags tail, happily, play, loyalty, care"],

  ["Making Tea at Home", "தேநீர் தயாரித்தல்", "A1", "Daily Life",
   "To make delicious Indian tea, I boil water with ginger and cardamom, then add tea leaves, milk, and sugar.",
   "delicious tea, boil water, ginger, cardamom, tea leaves, milk"],

  ["Visiting a Doctor for Fever", "மருத்துவரிடம் சிகிச்சை பெறுதல்", "A2", "Health",
   "Good morning doctor. I have had a headache and body fever since yesterday night. Could you please check my temperature?",
   "doctor, headache, body fever, temperature, prescription, medicine"],

  ["Opening a New Bank Account", "வங்கி கணக்கு தொடங்குதல்", "A2", "Banking",
   "Hello, I would like to open a savings bank account. What documents do I need to submit along with the application form?",
   "savings account, application form, documents, identity proof, deposit"],

  ["Reporting a Lost Wallet to Police", "காணாமல் போன பணப்பையை தெரிவித்தல்", "A2", "Emergency",
   "Officer, I lost my leather wallet near the bus terminal. It contained my driving license, identity card, and cash.",
   "police officer, lost wallet, bus terminal, driving license, cash"],

  ["Talking About Your Favorite Movie", "விருப்பமான திரைப்படத்தைப் பற்றி பேசுவது", "A2", "Entertainment",
   "My favorite film is an inspiring sports drama. The music score and emotional climax made a deep impression on me.",
   "favorite film, inspiring, sports drama, music score, climax, emotional"],

  ["Planning a Weekend Beach Trip", "வார இறுதி கடற்கரை பயணம்", "A2", "Travel",
   "My friends and I are planning a weekend trip to Pondicherry beach. We will leave early Saturday morning by car.",
   "weekend trip, Pondicherry beach, early morning, road trip, excited"],

  ["Booking a Taxi Over the Phone", "தொலைபேசியில் டாக்ஸி பதிவு செய்தல்", "A2", "Travel",
   "Hello, I need to book an air-conditioned cab to Chennai International Airport tomorrow morning at 5 AM.",
   "book cab, airport, pickup location, baggage, scheduled timing"],

  ["Talking About Weekend Activities", "வார இறுதி செயல்பாடுகள்", "A1", "Daily Life",
   "On weekends, I usually wash my clothes, clean my bedroom, and spend the evening watching cricket matches with my family.",
   "weekend, clean bedroom, wash clothes, cricket match, family time"],

  ["Discussing Daily Weather", "தினசரி வானிலை விவாதம்", "A1", "Environment",
   "It has been raining continuously since morning. The weather is cool and breezy, perfect for sipping hot tea.",
   "raining continuously, cool weather, breezy, hot tea, monsoon"],

  ["Buying Fresh Vegetables at the Market", "காய்கறி வாங்குதல்", "A1", "Shopping",
   "How much are fresh tomatoes per kilo today? Please pack two kilos of onions and one kilo of green chillies.",
   "fresh tomatoes, per kilo, onions, green chillies, vegetable market"],

  ["Describing Your Favorite Season", "பிடித்த பருவக்காலம்", "A1", "Environment",
   "I love winter season because the air is crisp and cool. It is very comfortable to travel and play outdoor games.",
   "winter season, crisp air, cool weather, comfortable, outdoor games"],

  ["Talking About School Days Memory", "பள்ளிப்பருவ நினைவுகள்", "A2", "Memories",
   "I fondly remember my primary school days when we played marbles during lunch break and shared lunchboxes with friends.",
   "fondly remember, primary school, lunch break, shared lunchbox, friends"],

  // ─── SAMACHEER KALVI SCHOOL TEXTBOOK SYLLABUS TOPICS (A1 - B2) ───────────────
  ["Class 6: Sea Turtles Protection", "கடல் ஆமைகள் பாதுகாப்பு", "A1", "Samacheer Kalvi",
   "Female sea turtles travel thousands of miles to return to the exact beach where they were born to lay their eggs.",
   "sea turtles, female, miles, nesting beach, lay eggs, marine life"],

  ["Class 6: When Trees Walked Nature Love", "மரங்கள் பற்றிய பாடம்", "A1", "Samacheer Kalvi",
   "Grandfather planted tree saplings near the riverbed because he believed trees provide shade, rain, and shelter for all.",
   "grandfather, saplings, riverbed, shade, rain, shelter, nature"],

  ["Class 6: Owlie the Baby Owl", "ஆந்தை பற்றிய பாடம்", "A1", "Samacheer Kalvi",
   "Payal brought a tiny injured baby owl home in a carton box and named her Owlie. She fed her meat bits gently.",
   "baby owl, injured, carton box, Owlie, meat bits, care"],

  ["Class 7: Eidgah Selfless Hamid", "ஈத்கா கதை பாடம்", "A1", "Samacheer Kalvi",
   "Four-year-old Hamid bought a pair of iron tongs for his grandmother so she would not burn her hands while cooking roti.",
   "Hamid, iron tongs, grandmother, burn hands, selflessness, sacrifice"],

  ["Class 7: Wind on Haunted Hill Bravery", "பேய் மலை காற்று", "A2", "Samacheer Kalvi",
   "Usha bravely ran through the howling storm and dark ruins on Haunted Hill to reach her home safely.",
   "Usha, howling storm, dark ruins, Haunted Hill, bravery, safe"],

  ["Class 7: The Computer Swallowed Grandma", "கணினி பற்றிய கவிதை பாடம்", "A2", "Samacheer Kalvi",
   "In this humorous poem, the speaker jokes that a computer swallowed his grandmother when she pressed the control key.",
   "humorous poem, computer, swallowed, grandmother, control key, joke"],

  ["Class 8: The Nose Jewel Moral Values", "மூக்குத்தி பாடம்", "A2", "Samacheer Kalvi",
   "Greed for another person\'s stolen nose-jewel filled Ramayya\'s household with fear, guilt, and endless worry.",
   "greed, stolen, nose-jewel, Ramayya, fear, guilt, honesty"],

  ["Class 8: Special Hero Father Love", "சிறப்பு கதாநாயகன் தந்தை", "A2", "Samacheer Kalvi",
   "The poet describes his father as a special hero who held his hand safely and showered unconditional love upon him.",
   "father, special hero, unconditional love, guidance, safe, hero"],

  ["Class 9: Sachin Tendulkar Learning Game", "சச்சின் விளையாட்டு பாடம்", "B1", "Samacheer Kalvi",
   "Sachin Tendulkar spent hours practicing cricket at Shivaji Park under his dedicated mentor coach Ramakant Achrekar.",
   "Sachin Tendulkar, Shivaji Park, cricket practice, mentor, Achrekar, dedication"],

  ["Class 9: Old Man River Flood Rescue", "வெள்ள மீட்பு பாடம்", "B1", "Samacheer Kalvi",
   "During the sudden river flood, Amy and Jim stayed calm, prepared emergency water supplies, and signaled for help.",
   "river flood, Amy, Jim, emergency supplies, signal for help, teamwork"],

  ["Class 10: His First Flight Courage", "முதல் பறப்பு பாடம்", "B1", "Samacheer Kalvi",
   "The young seagull was terrified to dive off the cliff, but his mother enticed him with fish until he soared naturally.",
   "young seagull, cliff, terrified, mother, fish, soaring, courage"],

  ["Class 10: The Night the Ghost Got In", "இரவில் பேய் பாடம்", "B1", "Samacheer Kalvi",
   "In James Thurber\'s funny story, misunderstanding footsteps in the hallway created chaos among family members and police.",
   "footsteps, hallway, misunderstanding, chaos, police, humor"],

  ["Class 10: The Dying Detective Mystery", "இறக்கும் துப்பறிவாளர் பாடம்", "B1", "Samacheer Kalvi",
   "Sherlock Holmes feigned a fatal tropical illness to trap Culverton Smith into confessing his crime in front of Watson.",
   "Sherlock Holmes, fatal illness, tropical disease, Culverton Smith, confession, Watson"],

  ["Class 11: Two Gentlemen of Verona Nobility", "வெரோனா பிரபுக்கள் பாடம்", "B2", "Samacheer Kalvi",
   "Nicola and Jacopo worked tirelessly polishing shoes and selling fruits to pay for their sister Lucia\'s medical treatment.",
   "Nicola, Jacopo, Lucia, polishing shoes, medical treatment, noble sacrifice"],

  ["Class 11: The Portrait of a Lady", "பாட்டியின் சித்திரம் பாடம்", "B2", "Samacheer Kalvi",
   "Khushwant Singh depicts his grandmother as a deeply pious woman who spent her days feeding sparrows and chanting prayers.",
   "Khushwant Singh, grandmother, pious, sparrows, chanting prayers, quiet dignity"],

  ["Class 12: Two Gentlemen Dignity of Labour", "உழைப்பின் மாண்பு பாடம்", "B2", "Samacheer Kalvi",
   "The young brothers showed that no honest work is low when performed with love, responsibility, and unwavering dignity.",
   "young brothers, honest work, responsibility, dignity of labour, devotion"],

  // ─── JOB INTERVIEWS & CAREER PREPARATION (B1 - B2) ──────────────────────────
  ["Why Should We Hire You?", "நாங்கள் உங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்?", "B1", "Job Interview",
   "You should hire me because I bring strong technical skills, a proven problem-solving mindset, and a strong work ethic.",
   "hire me, technical skills, problem-solving, work ethic, value addition"],

  ["What Are Your Greatest Strengths?", "உங்கள் சிறந்த பலங்கள் என்ன?", "B1", "Job Interview",
   "My primary strength is adaptability. I quickly master new software tools and maintain composure during tight project deadlines.",
   "primary strength, adaptability, software tools, composure, tight deadlines"],

  ["What Is Your Biggest Weakness?", "உங்கள் பெரிய பலவீனம் என்ன?", "B1", "Job Interview",
   "Sometimes I hesitate to delegate tasks because I want everything perfect, but I am actively practicing teamwork.",
   "weakness, delegate tasks, perfectionist, teamwork, continuous improvement"],

  ["Where Do You See Yourself in 5 Years?", "5 ஆண்டுகளில் உங்கள் வளர்ச்சி", "B1", "Job Interview",
   "In five years, I see myself advancing to a senior technical lead role, driving key projects and mentoring junior developers.",
   "5 years, technical lead, driving projects, mentoring, career growth"],

  ["Why Do You Want to Work Here?", "ஏன் இந்த நிறுவனம்?", "B1", "Job Interview",
   "I admire your company\'s commitment to innovation and user-centric design, and I want to contribute to your global vision.",
   "admire, innovation, user-centric design, contribution, global vision"],

  ["Describing a Challenging Project", "சவாலான திட்டத்தை விவரிப்பது", "B2", "Job Interview",
   "When faced with a strict launch deadline, I re-prioritized critical module features and delivered the application on schedule.",
   "strict deadline, re-prioritized, critical features, on schedule, leadership"],

  ["How Do You Handle Workplace Conflict?", "வேலையில் மோதல்களை கையாளுதல்", "B2", "Job Interview",
   "I resolve disagreements by actively listening to all viewpoints, focusing on objective facts, and working toward win-win solutions.",
   "disagreements, active listening, viewpoints, objective facts, win-win"],

  ["Handling Difficult Customers", "சவாலான வாடிக்கையாளர்களை கையாளுதல்", "B2", "Job Interview",
   "I handle angry customers by remaining calm, empathizing with their frustration, and delivering a prompt, effective resolution.",
   "angry customers, remaining calm, empathize, frustration, prompt resolution"],

  ["Describing Your Teamwork Experience", "குழுப்பணி அனுபவம்", "B1", "Job Interview",
   "In my previous project, I collaborated closely with cross-functional teams to ensure seamless software integration.",
   "collaborate, cross-functional team, seamless integration, project success"],

  ["Salary Negotiation Strategy", "சம்பள பேச்சுவார்த்தை", "B2", "Job Interview",
   "Based on my industry research and technical qualifications, I am looking for a competitive package aligned with company standards.",
   "industry research, technical qualifications, competitive package, negotiation"],

  // ─── FLUENCY & PUBLIC SPEAKING DEBATES (B2 - C1) ────────────────────────────
  ["Impact of AI on Future Jobs", "எதிர்கால வேலைகளில் AI தாக்கம்", "B2", "Debate & Tech",
   "Artificial intelligence will automate repetitive tasks, allowing professionals to focus on creative and strategic endeavors.",
   "artificial intelligence, automate, repetitive tasks, creative, strategic"],

  ["Online Education vs Classroom Learning", "ஆன்லைன் கல்வி vs வகுப்பறை", "B2", "Debate & Education",
   "Online platforms provide convenient flexible learning, whereas physical classrooms offer invaluable peer collaboration and discipline.",
   "online platform, flexible learning, physical classroom, peer collaboration, discipline"],

  ["Is Work-Life Balance Achievable?", "வேலை-வாழ்க்கை சமநிலை சாத்தியமா?", "B2", "Career & Health",
   "Achieving work-life balance requires establishing clear professional boundaries and prioritizing mental health alongside career goals.",
   "work-life balance, boundaries, mental health, career goals, wellness"],

  ["Importance of Renewable Energy", "புதுப்பிக்கத்தக்க ஆற்றல் முக்கியத்துவம்", "B2", "Environment",
   "Transitioning to solar and wind energy is imperative to reduce reliance on fossil fuels and mitigate global climate change.",
   "solar energy, wind power, fossil fuels, global climate change, sustainability"],

  ["Role of Social Media in Society", "சமூக ஊடகங்களின் பங்கு", "B2", "Society & Tech",
   "Social media empowers global communication, but excessive screen time can exacerbate feelings of isolation among teenagers.",
   "empowers communication, excessive screen time, isolation, teenagers, digital wellness"],

  ["Financial Literacy for Young Adults", "நிதி மேலாண்மை அறிவு", "B2", "Finance",
   "Understanding compound interest, budgeting, and prudent investments early in life builds financial independence and security.",
   "compound interest, budgeting, prudent investments, financial independence"],

  ["Importance of Physical Fitness", "உடற்பயிற்சியின் முக்கியத்துவம்", "A2", "Health",
   "Exercising for thirty minutes daily boosts cardiovascular health, sharpens mental focus, and elevates overall mood.",
   "exercising daily, cardiovascular health, mental focus, mood, wellness"],

  ["Benefits of Reading Books Daily", "தினமும் புத்தகம் படிப்பதன் பயன்கள்", "A2", "Habits",
   "Reading books broadens our vocabulary, enhances critical thinking, and introduces us to diverse cultures and ideas.",
   "broadens vocabulary, critical thinking, diverse cultures, imagination, focus"],

  ["Preserving Local Native Languages", "தாய்மொழியை பாதுகாத்தல்", "B2", "Culture",
   "Protecting native regional languages preserves rich oral traditions, cultural heritage, and indigenous wisdom for future generations.",
   "native language, oral traditions, cultural heritage, indigenous wisdom"],

  ["The Power of Time Management", "நேர மேலாண்மையின் சக்தி", "B2", "Productivity",
   "Effective time management involves prioritizing urgent tasks, avoiding procrastination, and maintaining focus on long-term goals.",
   "time management, prioritizing, procrastination, focus, long-term goals"]
];

// Generate 105 total items by procedural variation
const finalTopics = [];
let index = 1;

for (const [title, tamilTitle, level, cat, sample, vocab] of topicsList) {
  finalTopics.push({
    id: `spk_topic_${index}`,
    title,
    tamil_title: tamilTitle,
    level_id: level,
    category: cat,
    prompt_text: `Practice speaking aloud: "${sample}"`,
    tamil_prompt: `வாக்கியத்தை உரக்கச் சொல்லிப் பழகுங்கள்: "${sample}"`,
    sample_sentence: sample,
    key_vocabulary: vocab,
    order_index: index
  });
  index++;
}

// Procedural variations to hit 105+
const variations = [
  ["Greetings & Morning Routine", "காலை வணக்கம் & பழக்கம்", "A1", "Daily Life", "Good morning everyone! I hope you all have a wonderful and productive day ahead.", "good morning, productive day, cheerful, energy"],
  ["Asking for Bill at Restaurant", "உணவகத்தில் பில் கேட்டல்", "A1", "Dining", "Could we please get the check? We will pay using digital UPI payment.", "check, bill, digital payment, UPI, service"],
  ["Booking a Train Ticket", "ரயில் டிக்கெட் பதிவு செய்தல்", "A2", "Travel", "I would like to reserve a sleeper berth ticket for tomorrow night\'s express train.", "reserve, sleeper berth, express train, ticket booking"],
  ["Describing Best Friend", "உயிர்த்தோழனை விவரிப்பது", "A1", "Daily Life", "My best friend is kind, trustworthy, and always supports me during difficult times.", "best friend, trustworthy, supportive, kind, friendship"],
  ["Talking About Solar Power", "சூரிய மின்சக்தி பற்றி பேசுவது", "B1", "Environment", "Installing solar panels on rooftops generates clean electricity and cuts monthly power bills.", "solar panels, rooftop, clean electricity, power bills"],
  ["Discussing Favorite Sports", "பிடித்த விளையாட்டு விவாதம்", "A1", "Sports", "I love playing badminton every evening because it keeps me active and agile.", "badminton, evening, active, agile, sportsmanship"],
  ["How to Stay Focused While Studying", "படிப்பில் கவனம் செலுத்துவது எப்படி", "A2", "Study", "Studying in a quiet room without mobile notifications helps me retain concepts better.", "quiet room, notifications, retain concepts, focus, study"],
  ["Importance of Tree Plantation", "மரம் நடுதலின் முக்கியத்துவம்", "A1", "Environment", "Planting native shade trees reduces city heat and provides fresh oxygen for everyone.", "native trees, shade, city heat, oxygen, environment"],
  ["Describing Your Favorite Teacher", "பிடித்த ஆசிரியரை விவரிப்பது", "A1", "School", "My favorite teacher explains difficult math problems with simple examples and patience.", "favorite teacher, math problems, simple examples, patience"],
  ["Overcoming Fear of Public Speaking", "பொதுப்பேச்சு பயத்தை வெல்வது", "B2", "Speaking", "Practicing in front of a mirror and breathing deeply helps overcome stage fright.", "mirror practice, deep breathing, stage fright, public speaking"],
  ["Discussing Healthy Food Habits", "ஆரோக்கிய உணவு பழக்கங்கள்", "A1", "Health", "Eating fresh fruits, leafy vegetables, and drinking plenty of water keeps us disease-free.", "fresh fruits, leafy greens, water, healthy diet, immunity"],
  ["Talking About Mobile Applications", "மொபைல் செயலிகள் பற்றி பேசுவது", "A2", "Tech", "Language learning mobile apps enable us to practice English anytime from home.", "mobile apps, language learning, practice English, convenience"],
  ["Expressing Gratitude to Parents", "பெற்றோருக்கு நன்றி தெரிவித்தல்", "A2", "Values", "I am forever grateful to my parents for their unconditional support and sacrifices.", "grateful, parents, unconditional support, sacrifices, respect"],
  ["Describing a Historical Place Visit", "வரலாற்று இடத்தை விவரிப்பது", "B1", "Travel", "Visiting Tanjore Big Temple filled me with awe at ancient Tamil architecture.", "Tanjore Big Temple, Tanjavur, ancient architecture, heritage"],
  ["Importance of Punctuality", "நேர தவறாமையின் முக்கியத்துவம்", "A2", "Values", "Punctuality shows respect for other people\'s time and builds professional trust.", "punctuality, respect time, professional trust, habit"],
  ["Talking About Internet Advantages", "இணையத்தின் நன்மைகள்", "A2", "Tech", "The internet connects us with global information, online courses, and instant news.", "internet, global information, online courses, news"],
  ["Describing Your Hometown", "சொந்த ஊரை விவரிப்பது", "A1", "Daily Life", "My hometown is famous for its serene temples, lush greenery, and warm hospitality.", "hometown, serene temples, greenery, hospitality"],
  ["How to Prepare for Exams", "தேர்வுக்கு எப்படி தயாராவது", "A2", "Study", "Creating a realistic timetable and solving previous year question papers guarantees success.", "timetable, previous papers, exam success, strategy"],
  ["Discussing Environmental Pollution", "சுற்றுச்சூழல் மாசு விவாதம்", "B1", "Environment", "Plastic waste pollutes our rivers and soil; we must adopt eco-friendly alternatives.", "plastic waste, rivers, eco-friendly, pollution, green"],
  ["Talking About Your Dream Destination", "கனவுப் பயணம் பேசுவது", "A2", "Travel", "My dream destination is Switzerland to witness snow-capped Alps mountains and serene lakes.", "dream destination, Switzerland, snow mountains, lakes"],
  ["Importance of Kindness", "இரக்க குணத்தின் முக்கியத்துவம்", "A1", "Values", "A small act of kindness like helping an elderly person cross the road brightens their day.", "kindness, helping elderly, cross road, compassion"],
  ["Describing Your Laptop/Computer", "கணினியை விவரிப்பது", "A1", "Tech", "I use my laptop for attending online classes, coding projects, and watching documentary films.", "laptop, online classes, coding, documentaries"],
  ["Talking About Festival Sweets", "திருவிழா பலகாரங்கள்", "A1", "Food", "During Diwali, we prepare delicious Rava Ladoo and Gulab Jamun to share with neighbors.", "Diwali, rava ladoo, gulab jamun, festival sweets"],
  ["How to Build Self-Confidence", "சுயநம்பிக்கை வளர்ப்பது எப்படி", "B1", "Mindset", "Setting small achievable goals and celebrating daily progress builds lasting self-confidence.", "small goals, celebrate progress, self-confidence"],
  ["Describing a Rainy Day", "மழைநாளை விவரிப்பது", "A1", "Nature", "Rainy days are lovely; the earth smells sweet and children enjoy floating paper boats.", "rainy day, sweet earth smell, paper boats, monsoon"],
  ["Talking About Music Genres", "இசை பற்றி பேசுவது", "A2", "Music", "Listening to soft instrumental violin music helps me unwind after a long working day.", "instrumental music, violin, unwind, relaxation"],
  ["Discussing Road Safety Rules", "சாலை பாதுகாப்பு விதிகள்", "A2", "Safety", "Always wearing a helmet while riding a two-wheeler protects us from serious head injuries.", "helmet, two-wheeler, road safety, protection"],
  ["Describing Your Morning Routine", "காலை பழக்கம்", "A1", "Daily Life", "Every morning, I drink warm water, do 10 minutes of yoga, and read the morning newspaper.", "warm water, yoga, morning paper, health routine"],
  ["Talking About Library Reading", "நூலக வாசிப்பு", "A2", "School", "Our school library has thousands of storybooks, encyclopedias, and science magazines.", "school library, storybooks, encyclopedias, magazines"],
  ["How to Save Electricity at Home", "மின்சாரம் சேமிப்பது எப்படி", "A2", "Environment", "Switching off fans and lights when leaving a room reduces unnecessary electricity waste.", "switch off lights, save electricity, energy conservation"],
  ["Describing Your Favorite Dish Recipe", "உணவு செய்முறை விவரிப்பு", "B1", "Food", "To make Vegetable Biryani, I saute spices, basmati rice, and chopped vegetables in ghee.", "vegetable biryani, basmati rice, spices, ghee recipe"],
  ["Talking About Social Service", "சமூக சேவை பற்றி பேசுவது", "B1", "Values", "Volunteering at local blood donation camps teaches us empathy and community responsibility.", "volunteering, blood donation, empathy, community"],
  ["Discussing Climate Action", "காலநிலை நடவடிக்கை விவாதம்", "B2", "Environment", "Global governments must act urgently to limit global warming and protect vulnerable species.", "global warming, climate action, protect species"],
  ["Describing Your Dream Job", "கனவு வேலை விவரிப்பு", "B1", "Career", "My dream job is becoming an astrophysicist to research stars, galaxies, and space mysteries.", "astrophysicist, stars, galaxies, space research"],
  ["Importance of Recycling Waste", "கழிவுகளை மறுசுழற்சி செய்தல்", "A2", "Environment", "Segregating wet kitchen waste from dry plastic allows effective recycling and composting.", "segregate waste, kitchen waste, recycling, compost"],
  ["Talking About Traditional Tamil Culture", "தமிழ் பாரம்பரியம்", "B1", "Culture", "Tamil culture emphasizes hospitality, classical Bharatanatyam dance, Thirukkural wisdom, and rich literature.", "Tamil culture, hospitality, Bharatanatyam, Thirukkural"],
  ["Describing a Train Journey", "ரயில் பயணம் விவரிப்பது", "A2", "Travel", "Watching green paddy fields and palm trees pass by the train window is a peaceful experience.", "green paddy fields, train window, peaceful journey"],
  ["Discussing Teamwork in Projects", "குழுப்பணி விவாதம்", "B1", "Work", "Effective teamwork relies on open communication, mutual respect, and sharing responsibilities.", "teamwork, open communication, mutual respect"],
  ["Talking About Health Habits", "ஆரோக்கிய பழக்கம்", "A1", "Health", "Sleeping eight hours every night restores brain energy and keeps our immune system strong.", "eight hours sleep, brain energy, immune system"],
  ["How to Express Gratitude Daily", "தினமும் நன்றி உணர்வு", "A2", "Mindset", "Writing three positive things in a gratitude journal before sleep fills our mind with peace.", "gratitude journal, positive thoughts, peace of mind"],

  // Extra procedural entries to reach 105 total topics
  ["Describing a National Park Visit", "தேசிய பூங்கா பயணம்", "B1", "Nature", "Visiting Mudumalai National Park allowed us to spot wild elephants, deer, and colorful birds.", "Mudumalai, national park, wild elephants, wildlife"],
  ["Talking About Future Space Missions", "எதிர்கால விண்வெளி பயணம்", "B2", "Science", "Space exploration missions to Mars help scientists study planetary history and origin of life.", "space exploration, Mars mission, planetary science"],
  ["Discussing Moral Values in Stories", "கதைகளில் நீதி கருத்துக்கள்", "A2", "Literature", "Aesop fables and Panchatantra stories teach valuable moral lessons about honesty and wisdom.", "Aesop fables, Panchatantra, moral lessons, wisdom"],
  ["Describing Your Morning Coffee", "காலை காபி விவரிப்பு", "A1", "Food", "Filter coffee with frothy hot milk is a cherished morning ritual in South Indian households.", "filter coffee, frothy milk, morning ritual, South India"],
  ["Talking About Solar System Planets", "சூரிய குடும்பக் கோள்கள்", "A2", "Science", "Earth is the third planet from the sun and the only known world supporting liquid water and life.", "Earth, third planet, liquid water, solar system"],
  ["How to Learn English Quickly", "விரைவாக ஆங்கிலம் கற்பது எப்படி", "A2", "Learning", "Speaking aloud for 10 minutes every day and watching English news accelerates fluency.", "speaking aloud, 10 minutes daily, English news, fluency"],
  ["Describing Your Favorite Fruit", "பிடித்த பழம் விவரிப்பு", "A1", "Food", "Mango is known as the king of fruits; its sweet yellow pulp is delicious in summer.", "mango, king of fruits, sweet pulp, summer fruit"],
  ["Discussing Disaster Management", "பேரிடர் மேலாண்மை", "B2", "Safety", "Early cyclone warnings and timely evacuation save thousands of coastal lives during storms.", "cyclone warning, evacuation, coastal safety, storm"],
  ["Talking About Digital Payments", "டிஜிட்டல் பணப்பரிவர்த்தனை", "A2", "Tech", "Scanning QR codes for Instant UPI payments makes daily transactions fast and cashless.", "QR code, UPI payment, fast transaction, cashless"],
  ["Describing a Famous Monument", "பிரபல நினைவுச்சின்னம் விவரிப்பு", "B1", "History", "The Taj Mahal in Agra is a stunning white marble mausoleum built by Emperor Shah Jahan.", "Taj Mahal, Agra, white marble, Shah Jahan, monument"],
  ["Discussing Stress Management", "மன அழுத்த மேலாண்மை", "B2", "Health", "Deep breathing exercises, walking in nature, and listening to music alleviate mental stress.", "deep breathing, nature walk, music therapy, stress relief"],
  ["Talking About Traditional Festivals", "பாரம்பரிய திருவிழாக்கள்", "A1", "Culture", "Diwali, Pongal, and Christmas bring families together in joy, feast, and celebration.", "Diwali, Pongal, Christmas, family joy, celebration"],
  ["Describing Your School Classroom", "பள்ளி வகுப்பறை விவரிப்பு", "A1", "School", "Our classroom is bright and spacious with a smart board, bookshelves, and colorful charts.", "bright classroom, smart board, bookshelves, charts"],
  ["How to Maintain Cleanliness", "தூய்மையை பராமரிப்பது எப்படி", "A1", "Health", "Washing hands thoroughly with soap before meals prevents stomach infections and diseases.", "wash hands, soap, hygiene, stomach infection"],
  ["Talking About Solar Energy Benefits", "சூரிய மின்சக்தி பயன்கள்", "A2", "Environment", "Solar rooftop panels generate free electricity and reduce carbon pollution.", "solar rooftop, free electricity, carbon pollution"],
  ["Describing Your Favorite Sports Star", "பிடித்த விளையாட்டு வீரர்", "A2", "Sports", "Neeraj Chopra brought pride to India by winning a historic Olympic Gold Medal in javelin throw.", "Neeraj Chopra, Olympic Gold, javelin throw, pride"],
  ["Discussing Healthy Cooking Habits", "ஆரோக்கிய சமையல்", "A2", "Food", "Steaming and boiling vegetables retains their vital vitamins and minerals better than deep frying.", "steaming, boiling vegetables, vitamins, healthy cooking"],
  ["Talking About Online Shopping Convenience", "ஆன்லைன் வர்த்தகம்", "A2", "Shopping", "Online shopping apps allow us to compare prices and receive delivery at our doorstep.", "online shopping, compare prices, doorstep delivery"],
  ["Describing Your Favorite Book", "பிடித்த புத்தகம் விவரிப்பு", "B1", "Literature", "Wings of Fire by Dr. APJ Abdul Kalam inspires youth to dream big and work with dedication.", "Wings of Fire, Abdul Kalam, inspire youth, dream big"],
  ["How to Improve Pronunciation", "உச்சரிப்பை மேம்படுத்துவது எப்படி", "A2", "Learning", "Listening to native English audio speakers and repeating sentences aloud improves pronunciation.", "listening native audio, repeating aloud, pronunciation"]
];

for (const [title, tamilTitle, level, cat, sample, vocab] of variations) {
  finalTopics.push({
    id: `spk_topic_${index}`,
    title,
    tamil_title: tamilTitle,
    level_id: level,
    category: cat,
    prompt_text: `Practice speaking aloud: "${sample}"`,
    tamil_prompt: `வாக்கியத்தை உரக்கச் சொல்லிப் பழகுங்கள்: "${sample}"`,
    sample_sentence: sample,
    key_vocabulary: vocab,
    order_index: index
  });
  index++;
}

fs.writeFileSync(topicsPath, JSON.stringify(finalTopics, null, 2), 'utf8');
console.log(`✅ Generated ${finalTopics.length} speaking topics in ${topicsPath}`);
