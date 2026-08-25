const config = require('../config/env');

/**
 * AI Service Provider Abstraction
 * Handles Gemini, OpenAI, and high-fidelity built-in English Coach Engine.
 */
class AIService {
  constructor() {
    this.provider = config.ai.provider;
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model;
  }

  /**
   * Correct an English sentence (Sentence Doctor)
   */
  async correctSentence(userSentence, userLevel = 'A1') {
    if (this.apiKey && this.provider === 'gemini') {
      try {
        return await this.geminiCorrect(userSentence, userLevel);
      } catch (err) {
        console.warn('[AIService] Gemini API fallback triggered:', err.message);
      }
    }
    // Fallback: Intelligent Grammar & Rule Engine
    return this.ruleBasedSentenceDoctor(userSentence, userLevel);
  }

  /**
   * Conversational Chat with AI Tutor or Scenario Persona
   */
  async chat({ message, history = [], persona = 'Suresh', role = 'Friendly English Tutor', scenario = 'General Chat', level = 'A1', enableTamil = true }) {
    if (this.apiKey && this.provider === 'gemini') {
      try {
        const geminiRes = await this.geminiChat({ message, history, persona, role, scenario, level, enableTamil });
        if (geminiRes && geminiRes.reply) return geminiRes;
      } catch (err) {
        console.warn('[AIService] Gemini Chat fallback triggered:', err.message);
      }
    }
    return this.ruleBasedChat({ message, history, persona, role, scenario, level, enableTamil });
  }

  /**
   * Evaluate a student's writing submission
   */
  async evaluateWriting({ promptTitle, studentText, minWords = 30, level = 'A1' }) {
    if (this.apiKey && this.provider === 'gemini') {
      try {
        return await this.geminiEvaluateWriting({ promptTitle, studentText, level });
      } catch (err) {
        console.warn('[AIService] Gemini Writing Eval fallback triggered:', err.message);
      }
    }
    return this.ruleBasedWritingEvaluation({ promptTitle, studentText, minWords, level });
  }

  /**
   * Evaluate pronunciation & speaking accuracy from speech-to-text transcript
   */
  evaluateSpeaking({ targetSentence, spokenTranscript }) {
    const cleanTarget = (targetSentence || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const cleanSpoken = (spokenTranscript || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    if (!cleanSpoken) {
      return {
        accuracyScore: 0,
        fluencyScore: 0,
        pronunciationScore: 0,
        feedback: "We couldn't hear any speech. Please try speaking clearly into your microphone.",
        tamilFeedback: "குரல் கேட்கவில்லை. மைக்ரோஃபோனில் தெளிவாகப் பேசிப் பார்க்கவும்.",
        matchedWords: [],
        missedWords: cleanTarget.split(' ')
      };
    }

    const targetWords = cleanTarget.split(/\s+/);
    const spokenWords = cleanSpoken.split(/\s+/);

    let matchCount = 0;
    const matched = [];
    const missed = [];

    targetWords.forEach(w => {
      if (spokenWords.includes(w)) {
        matchCount++;
        matched.push(w);
      } else {
        missed.push(w);
      }
    });

    const accuracy = Math.min(100, Math.round((matchCount / Math.max(1, targetWords.length)) * 100));
    const fluency = Math.min(100, Math.round(Math.max(50, accuracy * 0.9 + (spokenWords.length >= targetWords.length ? 10 : 0))));
    const pronunciation = Math.round((accuracy * 0.6) + (fluency * 0.4));

    let feedback = "Good effort! Practice saying the sentence one more time for better rhythm.";
    let tamilFeedback = "நல்ல முயற்சி! இன்னும் தெளிவான உச்சரிப்பிற்கு மீண்டும் ஒருமுறை கூறிப் பாருங்கள்.";

    if (accuracy >= 90) {
      feedback = "Outstanding pronunciation and clear rhythm! Near-native clarity.";
      tamilFeedback = "அருமையான உச்சரிப்பு மற்றும் தடையற்ற சரளம்! மிகச் சிறப்பு.";
    } else if (accuracy >= 70) {
      feedback = `Great job! Focus on pronouncing these words clearly: ${missed.slice(0, 3).join(', ')}`;
      tamilFeedback = `நன்றாகப் பேசினீர்கள்! குறிப்பாக "${missed.slice(0, 3).join(', ')}" சொற்களைக் கவனியுங்கள்.`;
    }

    return {
      accuracyScore: accuracy,
      fluencyScore: fluency,
      pronunciationScore: pronunciation,
      feedback,
      tamilFeedback,
      matchedWords: matched,
      missedWords: missed
    };
  }

  // -------------------------------------------------------------
  // RULE-BASED ENGLISH DOCTOR & NLP ENGINE (OFFLINE ZERO-FAIL)
  // -------------------------------------------------------------
  ruleBasedSentenceDoctor(sentence, level = 'A1') {
    const raw = (sentence || '').trim();
    let improved = raw;
    let explanation = "Your sentence is clear and grammatically correct!";
    let tamilExplanation = "உங்கள் வாக்கியம் சரியாகவும் தெளிவாகவும் உள்ளது!";
    let rule = "Standard English Grammar";
    let hasMistake = false;

    const lower = raw.toLowerCase();

    // Rule 1: 'Myself [Name]'
    if (/^myself\s+([a-z]+)/i.test(raw)) {
      improved = raw.replace(/^myself\s+/i, 'I am ');
      explanation = "Avoid using 'Myself' for introduction in formal English. Use 'I am' or 'My name is'.";
      tamilExplanation = "சுய அறிமுகத்தின் போது 'Myself' என தொடங்குவது தவறு. 'I am' அல்லது 'My name is' என்று கூறவும்.";
      rule = "Proper Self-Introduction";
      hasMistake = true;
    }
    // Rule 2: 'I am go / come / do'
    else if (/i\s+am\s+(go|come|eat|work|study|play|do)\b/i.test(lower)) {
      improved = raw.replace(/\bam\s+(go|come|eat|work|study|play|do)\b/gi, (match, v) => {
        return `am ${v === 'come' ? 'coming' : v + 'ing'}`;
      });
      explanation = "Use 'am + verb-ing' for Present Continuous actions happening now, or 'I + base verb' for daily habits.";
      tamilExplanation = "தொடர் நிகழ்காலத்திற்கு 'am + வினைச்சொல்(-ing)' பயன்படுத்த வேண்டும் (எ.கா: I am going).";
      rule = "Present Continuous vs Simple Present";
      hasMistake = true;
    }
    // Rule 3: 'He/She/It don't'
    else if (/\b(he|she|it)\s+don'?t\b/i.test(lower)) {
      improved = raw.replace(/\b(he|she|it)\s+don'?t\b/gi, '$1 does not');
      explanation = "For third-person singular (He, She, It), use 'does not / doesn't', not 'don't'.";
      tamilExplanation = "He, She, It வரும்போது 'does not' மட்டுமே பயன்படுத்த வேண்டும்.";
      rule = "Subject-Verb Agreement";
      hasMistake = true;
    }
    // Rule 4: 'did not went / saw / did'
    else if (/\bdid\s+not\s+(went|saw|bought|ate|came)\b/i.test(lower)) {
      const verbMap = { went: 'go', saw: 'see', bought: 'buy', ate: 'eat', came: 'come' };
      improved = raw.replace(/\bdid\s+not\s+(went|saw|bought|ate|came)\b/gi, (m, v) => `did not ${verbMap[v] || v}`);
      explanation = "After 'did' or 'did not', always use the base form of the verb (V1), not the past tense form.";
      tamilExplanation = "'did not' பயன்படுத்திய பிறகு வினைச்சொல்லின் அடிப்படை வடிவம் (V1) மட்டுமே வர வேண்டும்.";
      rule = "Past Tense Auxiliary Rules";
      hasMistake = true;
    }
    // Rule 5: 'passed out of college'
    else if (/passed\s+out\s+from\s+college/i.test(lower)) {
      improved = raw.replace(/passed\s+out\s+from\s+college/gi, 'graduated from college');
      explanation = "'Passed out' in British/American English means to faint or lose consciousness. Use 'graduated from college'.";
      tamilExplanation = "'Passed out' என்றால் மயக்கமடைதல் எனப் பொருள். படிப்பை முடித்ததைக் குறிக்க 'graduated from college' என கூறவும்.";
      rule = "Colloquial & Idiomatic English";
      hasMistake = true;
    }
    // Rule 6: capitalization and ending punctuation
    else if (raw.length > 0 && (!/^[A-Z]/.test(raw) || !/[.!?]$/.test(raw))) {
      improved = raw.charAt(0).toUpperCase() + raw.slice(1);
      if (!/[.!?]$/.test(improved)) improved += '.';
      explanation = "Always capitalize the first letter and finish with a full stop or question mark.";
      tamilExplanation = "வாக்கியத்தின் முதல் எழுத்தை பெரிய எழுத்தாகவும் (Capital letter), இறுதியில் நிறுத்தற்குறியையும் வைக்கவும்.";
      rule = "Punctuation & Capitalization";
      hasMistake = true;
    }

    return {
      hasMistake,
      original: raw,
      improved,
      explanation,
      tamilExplanation,
      grammarRule: rule
    };
  }

  ruleBasedChat({ message, history = [], persona = 'Maya', role = 'Friendly English Tutor', scenario = 'General Chat', level = 'A1', enableTamil = true }) {
    const raw = (message || '').trim();
    const lower = raw.toLowerCase();
    let reply = "";
    let tamilTranslation = "";
    let suggestedReplies = [];
    const turnIndex = history.length;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // -------------------------------------------------------------
    // SCENARIO 1: JOB INTERVIEW SIMULATION
    // -------------------------------------------------------------
    if (scenario.toLowerCase().includes('interview')) {
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('morning') || turnIndex <= 1) {
        const intros = [
          {
            en: "Good morning! Thank you for joining us today. To begin with, could you please introduce yourself and tell me about your background?",
            ta: "காலை வணக்கம்! இன்று எங்களுடன் இணைந்ததற்கு நன்றி. முதலில், உங்களை அறிமுகப்படுத்தி உங்கள் கல்வி மற்றும் வேலை அனுபவத்தைப் பற்றிக் கூறுங்கள்.",
            chips: ["My name is...", "I have graduated in...", "I have 2 years experience in..."]
          },
          {
            en: "Welcome! We are excited to speak with you. Could you give a brief summary of your education and what motivates you?",
            ta: "நல்வரவு! உங்களுடன் பேசுவதில் மகிழ்ச்சி. உங்கள் கல்வி மற்றும் உங்களை ஊக்குவிக்கும் விஷயங்களைச் சுருக்கமாகக் கூறுங்கள்.",
            chips: ["I recently completed my studies in...", "My passion is...", "I specialize in..."]
          }
        ];
        const chosen = pick(intros);
        reply = chosen.en;
        tamilTranslation = chosen.ta;
        suggestedReplies = chosen.chips;
      } else if (lower.includes('strength') || lower.includes('weakness') || lower.includes('good at')) {
        reply = "That's great self-awareness. How do you handle high-pressure deadlines or difficult teammates during a critical project?";
        tamilTranslation = "மிகச் சிறப்பான சுய புரிதல். பணிகளில் கடுமையான காலக்கெடு அல்லது சவாலான சூழலை எவ்வாறு கையாளுவீர்கள்?";
        suggestedReplies = ["I prioritize tasks with a checklist", "I communicate openly with team members", "I stay calm and focus on solutions"];
      } else if (lower.includes('project') || lower.includes('experience') || lower.includes('work') || lower.includes('developed')) {
        reply = "That sounds like a meaningful project! What was the biggest technical or logistical obstacle you faced while building it, and how did you overcome it?";
        tamilTranslation = "சிறப்பான திட்டம்! அதை உருவாக்கும் போது நீங்கள் சந்தித்த மிகப்பெரிய சவால் என்ன, அதை எவ்வாறு சமாளித்தீர்கள்?";
        suggestedReplies = ["The biggest challenge was...", "We resolved it by...", "I learned how to..."];
      } else if (lower.includes('salary') || lower.includes('package') || lower.includes('expect')) {
        reply = "We offer competitive industry standards based on candidate skills. What are your expectations, and when would you be available to join us?";
        tamilTranslation = "திறமைக்கேற்ற சிறப்பான ஊதியம் வழங்குகிறோம். உங்கள் எதிர்பார்ப்பு என்ன மற்றும் எப்போது பணியில் சேர முடியும்?";
        suggestedReplies = ["I am open to negotiable salary", "As per company standards", "I can join immediately"];
      } else if (lower.includes('why') || lower.includes('company') || lower.includes('join')) {
        reply = "That is very inspiring. We value proactive learners. Do you have any questions for me about our team culture or future roadmap?";
        tamilTranslation = "மிகவும் ஊக்கமளிக்கிறது. எங்கள் குழு அல்லது வளர்ச்சித் திட்டம் குறித்து நீங்கள் ஏதேனும் கேட்க விரும்புகிறீர்களா?";
        suggestedReplies = ["What are the growth opportunities?", "What does a typical day look like?", "Can you tell me about the team?"];
      } else {
        const interviewFollowUps = [
          {
            en: `Excellent point regarding "${raw.length > 30 ? raw.slice(0, 30) + '...' : raw}". Can you give a specific example of how you applied this in a real-world scenario?`,
            ta: "அருமையான விளக்கம். இதை நிஜ வாழ்க்கையில் அல்லது பணியிடத்தில் எவ்வாறு செயல்படுத்தினீர்கள் என்பதற்கு ஓர் உதாரணம் கூற முடியுமா?",
            chips: ["For example, last month I...", "In my previous project...", "Once when faced with..."]
          },
          {
            en: "Very clearly explained. Where do you see yourself professionally in the next 3 to 5 years?",
            ta: "மிகத் தெளிவாக விளக்கினீர்கள். அடுத்த 3 முதல் 5 ஆண்டுகளில் உங்களை எந்த நிலையில் பார்க்க விரும்புகிறீர்கள்?",
            chips: ["I see myself as a Senior Specialist", "Leading a creative team", "Mastering new technologies"]
          },
          {
            en: "Thank you for sharing that. What is one new skill you have recently learned on your own?",
            ta: "பகிர்ந்தமைக்கு நன்றி. சமீபத்தில் நீங்களாகவே கற்றுக்கொண்ட ஒரு புதிய திறன் என்ன?",
            chips: ["I recently learned...", "I have been improving my English", "I learned modern web tools"]
          }
        ];
        const chosen = pick(interviewFollowUps);
        reply = chosen.en;
        tamilTranslation = chosen.ta;
        suggestedReplies = chosen.chips;
      }
    }
    // -------------------------------------------------------------
    // SCENARIO 2: CAFE & RESTAURANT ORDERING
    // -------------------------------------------------------------
    else if (scenario.toLowerCase().includes('cafe') || scenario.toLowerCase().includes('restaurant') || scenario.toLowerCase().includes('travel')) {
      if (lower.includes('menu') || lower.includes('what do you have') || lower.includes('special')) {
        reply = "Welcome to Green Valley Cafe! Today we have freshly brewed cappuccino, espresso, cold brew, and warm blueberry muffins. What can I get started for you?";
        tamilTranslation = "கிரீன் வேலி கஃபேக்கு நல்வரவு! இன்று கேப்புசினோ, எஸ்பிரெஸ்ஸோ, கோல்ட் ப்ரூ மற்றும் மஃபின்கள் உள்ளன. உங்களுக்கு என்ன கொண்டு வரட்டும்?";
        suggestedReplies = ["I'd like a cappuccino, please", "Can I get an iced latte?", "What desserts do you recommend?"];
      } else if (lower.includes('cappuccino') || lower.includes('latte') || lower.includes('coffee') || lower.includes('tea')) {
        reply = "Wonderful choice! Would you prefer whole milk, oat milk, or almond milk? And would you like any extra sugar or vanilla syrup?";
        tamilTranslation = "அருமையான தேர்வு! எந்த வகை பால் விரும்புகிறீர்கள் (பசும்பால், ஓட்ஸ் பால், பாதாம் பால்)? மற்றும் இனிப்பு சேர்க்க வேண்டுமா?";
        suggestedReplies = ["Regular milk with less sugar", "Oat milk, please", "No sugar, thanks"];
      } else if (lower.includes('bill') || lower.includes('check') || lower.includes('pay') || lower.includes('cost') || lower.includes('price')) {
        reply = "Here is your bill: That will be ₹180 total. Would you like to pay by cash, card, or UPI QR code scan?";
        tamilTranslation = "இதோ உங்கள் ரசீது: மொத்தம் ₹180. பணம், அட்டை அல்லது UPI மூலம் செலுத்த விரும்புகிறீர்களா?";
        suggestedReplies = ["I'll pay via UPI QR code", "Here is my credit card", "Keep the change, thank you"];
      } else {
        reply = "Got it! Your order is being freshly prepared and will be served at your table in 3 minutes. Is there anything else you'd like while you wait?";
        tamilTranslation = "உங்கள் ஆர்டர் தயாராகிறது, 3 நிமிடங்களில் உங்கள் மேசைக்கு வரும். காத்திருக்கும் நேரத்தில் வேறு ஏதேனும் தேவையா?";
        suggestedReplies = ["A glass of cold water, please", "Could I get the Wi-Fi password?", "That's all, thank you!"];
      }
    }
    // -------------------------------------------------------------
    // SCENARIO 3: GRAMMAR DOCTOR & SPECIFIC CONCEPTS
    // -------------------------------------------------------------
    else if (scenario.toLowerCase().includes('doctor') || lower.includes('correct this') || lower.includes('is this correct')) {
      if (doctor.hasMistake) {
        reply = `Here is how to make your sentence natural and correct:\n\n• **Correct Form:** "${doctor.improved}"\n• **Rule:** ${doctor.grammarRule}\n• **Explanation:** ${doctor.explanation}`;
        tamilTranslation = `இலக்கண திருத்தம்:\n• சரியான வடிவம்: "${doctor.improved}"\n• தமிழில் விளக்கம்: ${doctor.tamilExplanation}`;
        suggestedReplies = ["Give me another example", "Why is this rule used?", "Test me with a quiz question"];
      } else {
        reply = `Great news! "${raw}" is grammatically correct and natural. To expand it, you could add details like when, where, or why it happened.`;
        tamilTranslation = `சிறப்பு! உங்கள் வாக்கியம் சரியாகவும் நேர்த்தியாகவும் உள்ளது. இன்னும் அதிக விவரங்களைச் சேர்த்து வாக்கியத்தை நீட்டிக்கலாம்.`;
        suggestedReplies = ["How can I make it more formal?", "Give me a synonym for this", "Check another sentence"];
      }
    }
    // -------------------------------------------------------------
    // SCENARIO 4: GENERAL AI TUTOR (MAYA) — MULTI-TOPIC CONVERSATION
    // -------------------------------------------------------------
    else {
      // Greetings
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('vanakkam') || lower.includes('hey')) {
        const greetings = [
          {
            en: "வணக்கம்! Hello! I'm Suresh, your AI English Coach. What would you like to explore today? We can practice daily conversation, learn new words, or master tricky grammar rules!",
            ta: "வணக்கம்! நான் சுரேஷ், உங்கள் ஆங்கில ஆசிரியர். இன்று அன்றாட உரையாடலா, புதிய சொற்களா அல்லது இலக்கணமா, எதைப் பயிலலாம்?",
            chips: ["Teach me 3 new words", "Explain Present Perfect tense", "Let's practice daily talk", "Correct my sentences"]
          },
          {
            en: "Hello there! Wonderful to see you practicing today. How has your day been so far?",
            ta: "வணக்கம்! இன்று பயிற்சி செய்ய வந்ததில் மகிழ்ச்சி. இன்றைய நாள் உங்களுக்கு எவ்வாறு சென்றது?",
            chips: ["My day was very productive", "I was busy with work/studies", "It was good, thank you!"]
          }
        ];
        const chosen = pick(greetings);
        reply = chosen.en;
        tamilTranslation = chosen.ta;
        suggestedReplies = chosen.chips;
      }
      // Grammar Explanations & Tenses
      else if (lower.includes('present continuous') || lower.includes('continuous tense')) {
        reply = "The **Present Continuous Tense** is used for actions happening right now at this exact moment.\n\n• **Formula:** Subject + am/is/are + verb(-ing)\n• **Example:** *'I am learning English right now.'*\n• **Common Mistake:** Saying *'I am go'* instead of *'I am going'*.\n\nCan you try creating a sentence about what you are doing right now?";
        tamilTranslation = "தொடர் நிகழ்காலம் (Present Continuous) என்பது தற்போது நடந்துகொண்டிருக்கும் செயல்களைக் குறிக்கும்.\nசூத்திரம்: Subject + am/is/are + verb(-ing)\nஎ.கா: I am learning English (நான் இப்போது ஆங்கிலம் படித்துக்கொண்டிருக்கிறேன்).";
        suggestedReplies = ["I am reading your message", "I am practicing speaking", "Explain Simple Past tense next"];
      }
      else if (lower.includes('past tense') || lower.includes('simple past') || lower.includes('did not')) {
        reply = "The **Simple Past Tense** is used for completed actions in the past.\n\n• **Formula:** Subject + V2 (Past form)\n• **Example:** *'I visited Chennai yesterday.'*\n• **Golden Rule:** With 'did' or 'did not', ALWAYS use the base verb (V1): *'I did not go'* (NOT *'did not went'*).\n\nWhat did you do yesterday?";
        tamilTranslation = "கடந்த காலம் (Simple Past) என்பது முடிந்துபோன செயல்களைக் குறிக்கும்.\nமுக்கிய விதி: 'did not' பயன்படுத்தினால் வினைச்சொல்லின் அடிப்படை வடிவம் (V1) மட்டுமே வர வேண்டும் (எ.கா: I did not go).";
        suggestedReplies = ["Yesterday I studied English", "I met my friends yesterday", "I went to work yesterday"];
      }
      else if (lower.includes('future tense') || lower.includes('will') || lower.includes('going to')) {
        reply = "For talking about the future, you can use:\n1. **'Will + base verb'** for instant decisions or predictions (*'I will help you'*).\n2. **'Be going to + base verb'** for planned intentions (*'I am going to travel next week'*).\n\nWhat are your plans for this weekend?";
        tamilTranslation = "எதிர்காலத்தைக் குறிக்க 'will' அல்லது 'going to' பயன்படுத்தலாம்.\nதிட்டமிடப்பட்ட செயல்களுக்கு 'going to' சிறந்தது (எ.கா: I am going to buy a book).";
        suggestedReplies = ["This weekend I will relax", "I am going to watch a movie", "I will practice English"];
      }
      // Vocabulary & Idioms
      else if (lower.includes('vocabulary') || lower.includes('words') || lower.includes('new word') || lower.includes('meaning')) {
        const vocabBank = [
          {
            word: "Articulate",
            phonetic: "/ɑːˈtɪk.jə.lət/",
            meaning: "Able to express ideas clearly and fluently in speech.",
            tamil: "கருத்துக்களை தெளிவாகவும் சரளமாகவும் வெளிப்படுத்தும் திறன்.",
            example: "She gave an articulate presentation in the meeting."
          },
          {
            word: "Diligent",
            phonetic: "/ˈdɪl.ɪ.dʒənt/",
            meaning: "Showing hard work, care, and steady effort.",
            tamil: "கடின உழைப்பும் விடாமுயற்சியும் கொண்ட.",
            example: "He is a diligent student who practices English daily."
          },
          {
            word: "Versatile",
            phonetic: "/ˈvɜː.sə.taɪl/",
            meaning: "Able to adapt or be used for many different activities.",
            tamil: "பல்வேறு பணிகளுக்கு ஏற்ப தகவமைத்துக் கொள்ளும் திறன்.",
            example: "She is a versatile professional who handles design and coding."
          }
        ];
        const v = pick(vocabBank);
        reply = `Here is a powerful word to elevate your English:\n\n✨ **${v.word}** (${v.phonetic})\n• **Meaning:** ${v.meaning}\n• **Tamil:** ${v.tamil}\n• **Example:** *"${v.example}"*\n\nCan you try writing a sentence using the word **${v.word}**?`;
        tamilTranslation = `இன்றைய புதிய சொல்: **${v.word}**\nபொருள்: ${v.tamil}\nஉதாரணம்: "${v.example}"`;
        suggestedReplies = [`Sentence with ${v.word}`, "Give me another word", "Explain idiom of the day"];
      }
      else if (lower.includes('idiom') || lower.includes('phrase')) {
        const idioms = [
          {
            idiom: "Break the ice",
            meaning: "To make people feel more relaxed in a new or awkward situation.",
            tamil: "புதிய நபர்களிடையே தயக்கத்தை உடைத்து உரையாடலைத் தொடங்குதல்.",
            example: "He told a friendly joke to break the ice."
          },
          {
            idiom: "Piece of cake",
            meaning: "Something very easy to do.",
            tamil: "மிகவும் எளிதான காரியம் (அல்வா சாப்பிடுவது போல).",
            example: "With daily practice, English grammar will become a piece of cake!"
          },
          {
            idiom: "Once in a blue moon",
            meaning: "Happening very rarely.",
            tamil: "மிக அரிதாக நடக்கும் செயல்.",
            example: "He visits his hometown once in a blue moon."
          }
        ];
        const idm = pick(idioms);
        reply = `Here is a common English idiom:\n\n🌟 **"${idm.idiom}"**\n• **Meaning:** ${idm.meaning}\n• **Tamil:** ${idm.tamil}\n• **Example:** *"${idm.example}"*\n\nTry using **"${idm.idiom}"** in your own sentence!`;
        tamilTranslation = `முக்கிய ஆங்கில மரபுத்தொடர் (Idiom): **"${idm.idiom}"**\nபொருள்: ${idm.tamil}`;
        suggestedReplies = [`I can use ${idm.idiom}`, "Give me another idiom", "Test my English level"];
      }
      // Sentence formation practice (e.g. "Sentence with versatile")
      else if (lower.includes('sentence with') || lower.startsWith('sentence')) {
        const targetWord = raw.replace(/sentence\s+(with|for)?\s*/i, '').trim();
        reply = `Awesome! Let's build a sentence with **"${targetWord || 'this word'}"**.\n\n• **Example Pattern:** *"She proved to be a ${targetWord || 'valuable'} asset to our team by adapting quickly."*\n• **Your Turn:** Try typing your own sentence using **"${targetWord || 'it'}"**!`;
        tamilTranslation = `அருமை! "${targetWord}" என்ற சொல்லைப் பயன்படுத்தி உங்கள் சொந்த வாக்கியத்தை எழுதிப் பாருங்கள்.`;
        suggestedReplies = [
          `I am ${targetWord || 'learning'} every day`,
          `This tool is very ${targetWord || 'useful'}`,
          "Give me another example",
          "Ask me a question"
        ];
      }
      // Interactive Questions & Conversation Prompts
      else if (lower.includes('ask me') || lower.includes('another question') || lower.includes('question')) {
        const questionBank = [
          {
            en: "Here is a thought-provoking question: **If you could learn any new language or skill instantly overnight, what would it be and why?**",
            ta: "இதோ உங்களுக்கான கேள்வி: ஒரே இரவில் ஏதேனும் ஒரு புதிய மொழி அல்லது திறமையைக் கற்றுக்கொள்ள முடிந்தால், எதைத் தேர்ந்தெடுப்பீர்கள் மற்றும் ஏன்?",
            chips: ["I would learn German/French", "I would learn AI & coding", "I would master public speaking"]
          },
          {
            en: "Let's talk about travel! **What is your dream holiday destination, and who would you love to travel with?**",
            ta: "பயணம் பற்றிப் பேசலாம்! நீங்கள் செல்ல விரும்பும் கனவு சுற்றுலா இடம் எது மற்றும் யாருடன் செல்ல விரும்புவீர்கள்?",
            chips: ["I want to visit Switzerland", "I want to explore Singapore", "I love hill stations like Ooty"]
          },
          {
            en: "Daily Routine question: **What is the first thing you usually do when you wake up in the morning?**",
            ta: "அன்றாடப் பழக்கம்: காலையில் எழுந்தவுடன் நீங்கள் வழக்கமாகச் செய்யும் முதல் வேலை என்ன?",
            chips: ["I drink a glass of water", "I do morning exercise", "I check my study schedule"]
          },
          {
            en: "Career & Ambition: **What kind of work environment makes you feel most motivated and energized?**",
            ta: "பணிச்சூழல்: எந்த வகையான சூழல் உங்களுக்கு அதிக ஊக்கத்தையும் ஆற்றலையும் தருகிறது?",
            chips: ["A creative & supportive team", "Working independently on challenges", "A fast-paced learning environment"]
          }
        ];
        const q = questionBank[(turnIndex + raw.length) % questionBank.length];
        reply = q.en;
        tamilTranslation = q.ta;
        suggestedReplies = q.chips;
      }
      // Interactive Challenges & Quizzes
      else if (lower.includes('challenge') || lower.includes('quiz') || lower.includes('test me')) {
        const challenges = [
          {
            en: "🎯 **Quick Grammar Challenge!**\n\nChoose the correct option:\n*'Neither of the students _____ (was / were) absent yesterday.'*\n\nWhich one is correct?",
            ta: "🎯 இலக்கண சவால்: 'was' அல்லது 'were' இதில் எது சரியானது?",
            chips: ["was (Singular)", "were (Plural)", "Explain the rule"]
          },
          {
            en: "🎯 **Vocabulary Challenge!**\n\nWhat is the opposite (antonym) of **'Generous'**?\nA) Selfish\nB) Kind\nC) Humble",
            ta: "🎯 சொல்லகராதி சவால்: 'Generous' (தாராள குணம்) என்பதன் எதிர்ச்சொல் என்ன?",
            chips: ["A) Selfish", "B) Kind", "C) Humble"]
          },
          {
            en: "🎯 **Error Spotting Challenge!**\n\nCan you spot the mistake here?\n*'She don't like watching horror movies.'*",
            ta: "🎯 பிழை கண்டுபிடி சவால்: இந்த வாக்கியத்தில் உள்ள தவறு என்ன?",
            chips: ["'She doesn't like' is correct", "'don't' is correct", "Explain Subject-Verb Agreement"]
          }
        ];
        const ch = challenges[(turnIndex + raw.length) % challenges.length];
        reply = ch.en;
        tamilTranslation = ch.ta;
        suggestedReplies = ch.chips;
      }
      // Hobbies & Daily Routine
      else if (lower.includes('hobby') || lower.includes('free time') || lower.includes('music') || lower.includes('sports') || lower.includes('cricket')) {
        reply = "Hobbies are a fantastic way to practice English! Talking about activities you enjoy makes speaking natural and comfortable. What kind of music, sports, or books do you enjoy most in your free time?";
        tamilTranslation = "விருப்பமான பொழுதுபோக்குகளைப் பற்றிப் பேசுவது சரளமாகப் பேச உதவும். உங்களுக்குப் பிடித்த இசை, விளையாட்டு அல்லது புத்தகங்கள் எவை?";
        suggestedReplies = ["I love playing cricket", "I enjoy listening to music", "I like watching technology videos"];
      }
      // Travel & Cities
      else if (lower.includes('chennai') || lower.includes('madurai') || lower.includes('coimbatore') || lower.includes('travel') || lower.includes('city')) {
        reply = "Tamil Nadu has such rich culture and wonderful cities! If an international tourist were visiting your city for the first time, which 2 places would you recommend they visit and why?";
        tamilTranslation = "உங்கள் ஊருக்கு ஒரு வெளிநாட்டு சுற்றுலாப் பயணி வந்தால், எந்த 2 இடங்களைப் பார்க்க பரிந்துரைப்பீர்கள்?";
        suggestedReplies = ["I would recommend visiting...", "Famous places here are...", "The food here is delicious"];
      }
      // Questions from user (How are you, Who are you, etc.)
      else if (lower.includes('how are you') || lower.includes('how r u')) {
        reply = "I'm feeling energetic and excited to help you practice English! How are you doing today, and how is your English practice coming along?";
        tamilTranslation = "நான் மிகவும் நன்றாக இருக்கிறேன்! உங்களுக்கு உதவ தயாராக உள்ளேன். உங்கள் பயிற்சி எவ்வாறு செல்கிறது?";
        suggestedReplies = ["I am doing great!", "I want to improve my speaking", "Can we do a short quiz?"];
      }
      else if (lower.includes('who are you') || lower.includes('your name')) {
        reply = "I am **Suresh**, your interactive AI English Coach at English Mate! I am designed to help Tamil speakers master English grammar, fluency, vocabulary, and pronunciation with zero hesitation.";
        tamilTranslation = "நான் சுரேஷ், உங்கள் ஆங்கில ஆசிரியர். இலக்கணம், உச்சரிப்பு மற்றும் சரளமாகப் பேச உங்களுக்குப் பயிற்சி அளிக்கிறேன்.";
        suggestedReplies = ["Let's start learning!", "Teach me something useful", "How do I become fluent fast?"];
      }
      // General dynamic contextual response (Rotating never-repeat engine)
      else {
        const dynamicFollowUps = [
          {
            en: `That is a great perspective on "${raw}". What inspired you to think about that?`,
            ta: "மிக அருமையான சிந்தனை! இதைப்பற்றி யோசிக்க உங்களை தூண்டியது எது?",
            chips: ["Because from my experience...", "It is important for my goals", "Ask me a question"]
          },
          {
            en: `I appreciate you sharing: "${raw}". How does this connect to your daily studies or career aspirations?`,
            ta: "பகிர்ந்தமைக்கு நன்றி. இது உங்கள் படிப்பு அல்லது எதிர்கால இலக்குகளுடன் எவ்வாறு தொடர்புடையது?",
            chips: ["It helps my daily communication", "It is key for my job interviews", "Give me a vocabulary challenge"]
          },
          {
            en: `Clear and well-expressed! What is another topic you would like to master in English today?`,
            ta: "தெளிவாகக் கூறினீர்கள்! இன்று ஆங்கிலத்தில் வேறு எந்த தலைப்பைப் பற்றிப் பேசலாம்?",
            chips: ["Let's practice interview talk", "Teach me idioms", "Ask me another question", "Explain grammar tenses"]
          },
          {
            en: `You are expressing your thoughts with great confidence. Would you like to try a fast quiz or practice conversational speaking?`,
            ta: "நம்பிக்கையோடு பேசுகிறீர்கள்! விரைவு வினாடி வினாவா அல்லது உரையாடல் பயிற்சியா, எதைச் செய்யலாம்?",
            chips: ["Let's try a quiz", "Let's do conversation", "Tell me an idiom"]
          }
        ];
        const chosen = dynamicFollowUps[(turnIndex + raw.length) % dynamicFollowUps.length];
        reply = chosen.en;
        tamilTranslation = chosen.ta;
        suggestedReplies = chosen.chips;
      }
    }

    return {
      reply,
      tamilTranslation: enableTamil ? tamilTranslation : undefined,
      suggestedReplies
    };
  }

  ruleBasedWritingEvaluation({ promptTitle, studentText, minWords = 30, level = 'A1' }) {
    const words = (studentText || '').trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    let grammarScore = 80;
    let vocabularyScore = 75;
    let clarityScore = 85;

    const feedback = [];
    const suggestions = [];

    if (wordCount < minWords) {
      feedback.push(`Your submission is ${wordCount} words. Aim for at least ${minWords} words to thoroughly express your ideas.`);
      grammarScore -= 10;
      clarityScore -= 10;
    } else {
      feedback.push(`Good word count (${wordCount} words). Your main points are structured well.`);
    }

    // Check sentence doctor patterns
    const sentences = studentText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let errorCount = 0;

    sentences.forEach(s => {
      const doc = this.ruleBasedSentenceDoctor(s, level);
      if (doc.hasMistake) {
        errorCount++;
        suggestions.push(`Consider revising: "${s.trim()}" -> "${doc.improved}" (${doc.explanation})`);
      }
    });

    if (errorCount > 0) {
      grammarScore = Math.max(50, grammarScore - (errorCount * 8));
    }

    const overallScore = Math.round((grammarScore * 0.4) + (vocabularyScore * 0.3) + (clarityScore * 0.3));

    return {
      overallScore,
      scores: {
        grammar: grammarScore,
        vocabulary: vocabularyScore,
        clarity: clarityScore
      },
      wordCount,
      feedback: feedback.join(' '),
      suggestions: suggestions.slice(0, 3),
      tamilSummary: overallScore >= 75
        ? "சிறப்பான எழுத்துப் பயிற்சி! உங்கள் கருத்துக்கள் மிகத் தெளிவாக உள்ளன."
        : "நல்ல முயற்சி! மேலே குறிப்பிட்டுள்ள இலக்கண திருத்தங்களைக் கவனித்து மீண்டும் எழுதவும்."
    };
  }

  // -------------------------------------------------------------
  // GEMINI API INTEGRATION (REAL-TIME MULTI-TURN AI COACH)
  // -------------------------------------------------------------
  getGeminiApiKey() {
    return process.env.GEMINI_API_KEY || process.env.AI_API_KEY || config.ai.apiKey || '';
  }

  getGeminiModel() {
    return process.env.AI_MODEL || config.ai.model || 'gemini-1.5-flash';
  }

  async geminiCorrect(userSentence, userLevel) {
    const apiKey = this.getGeminiApiKey();
    const model = this.getGeminiModel();
    if (!apiKey) return this.ruleBasedSentenceDoctor(userSentence, userLevel);

    const prompt = `You are an expert English Teacher for Tamil speakers. Correct this student sentence: "${userSentence}". Student level: ${userLevel}.
Return ONLY a valid JSON object with format:
{"hasMistake": boolean, "original": "${userSentence}", "improved": "corrected sentence", "explanation": "clear English explanation", "tamilExplanation": "Tamil explanation", "grammarRule": "Rule name"}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  async geminiChat({ message, history = [], persona = 'Maya', role = 'Friendly English Tutor', scenario = 'General Chat', level = 'A1', enableTamil = true }) {
    const apiKey = this.getGeminiApiKey();
    const model = this.getGeminiModel();
    if (!apiKey) return this.ruleBasedChat({ message, history, persona, role, scenario, level, enableTamil });

    const systemInstructionText = `You are ${persona}, an enthusiastic and supportive AI English Coach for Tamil speakers in this scenario: "${scenario}".
Student proficiency level: ${level}.
Guidelines:
1. Always respond warmly, engagingly, and naturally in conversational English.
2. Ask thoughtful follow-up questions to encourage the student to practice speaking and thinking in English.
3. ${enableTamil ? 'Include a natural Tamil translation for your reply so the student can understand nuances.' : ''}
4. Provide 3 or 4 relevant, natural suggested English replies the student could choose next.
5. Return ONLY a valid JSON object in this exact schema:
{
  "reply": "English response text",
  "tamilTranslation": "Tamil translation of the response",
  "suggestedReplies": ["short phrase 1", "short phrase 2", "short phrase 3"]
}`;

    // Build multi-turn conversation contents
    const contents = [];
    const recentHistory = (history || []).slice(-8);

    for (const h of recentHistory) {
      if (h.content) {
        contents.push({
          role: h.sender === 'assistant' || h.sender === 'model' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await res.json();
    if (data.error) {
      console.warn('[AIService] Gemini API error:', data.error.message);
      return this.ruleBasedChat({ message, history, persona, role, scenario, level, enableTamil });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        reply: parsed.reply || text,
        tamilTranslation: enableTamil ? parsed.tamilTranslation : undefined,
        suggestedReplies: Array.isArray(parsed.suggestedReplies) ? parsed.suggestedReplies : ["Tell me more", "Can you explain in detail?", "Ask me a question"]
      };
    } catch (e) {
      return {
        reply: text || "That's wonderful! Tell me more about what you're thinking.",
        tamilTranslation: enableTamil ? "அருமை! நீங்கள் என்ன நினைக்கிறீர்கள் என்பதைப் பற்றி மேலும் கூறுங்கள்." : undefined,
        suggestedReplies: ["Tell me more", "Can you give an example?", "Ask me a question"]
      };
    }
  }
}

module.exports = new AIService();
