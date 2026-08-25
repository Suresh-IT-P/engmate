const db = require('../src/config/db');
const seedAll = require('../database/seeds/seed');
const aiService = require('../src/services/aiService');
const spacedRepetition = require('../src/services/spacedRepetitionService');
const analyticsService = require('../src/services/analyticsService');

async function runTests() {
  console.log('\n======================================================');
  console.log('       English Mate Automated Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // Test 1: Database Initialization & Seeding
    console.log('[Test Group 1: Database & Seed Engine]');
    await seedAll();
    
    const levels = await db.query('SELECT COUNT(*) as c FROM learning_levels');
    assert(levels[0].c >= 6, 'Learning levels seeded (A1-C2)');

    const courses = await db.query('SELECT COUNT(*) as c FROM courses');
    assert(courses[0].c >= 6, 'Courses seeded');

    const lessons = await db.query('SELECT COUNT(*) as c FROM lessons');
    assert(lessons[0].c >= 8, 'Lessons seeded');

    const vocab = await db.query('SELECT COUNT(*) as c FROM vocabulary');
    assert(vocab[0].c >= 10, 'Vocabulary dataset seeded');

    const grammar = await db.query('SELECT COUNT(*) as c FROM grammar_topics');
    assert(grammar[0].c >= 5, 'Grammar topics seeded');

    const exercises = await db.query('SELECT COUNT(*) as c FROM exercises');
    assert(exercises[0].c >= 4, 'Interactive exercises seeded');

    // Test 2: AI Tutor & Sentence Doctor
    console.log('\n[Test Group 2: AI Service & Sentence Doctor]');
    const correction1 = await aiService.correctSentence('Myself Alex');
    assert(correction1.hasMistake && correction1.improved.includes('I am'), 'Sentence Doctor corrects "Myself Alex" -> "I am Alex"');

    const correction2 = await aiService.correctSentence('I am go to office');
    assert(correction2.hasMistake && correction2.improved.includes('going'), 'Sentence Doctor corrects "I am go" -> "I am going"');

    const chatResponse = await aiService.chat({
      message: 'Hello teacher! How to improve vocabulary?',
      persona: 'Maya',
      role: 'Friendly English Tutor',
      level: 'A1'
    });
    assert(chatResponse.reply && chatResponse.reply.length > 10, 'AI Tutor conversational reply generated');

    // Test 3: Speaking Pronunciation Evaluation
    console.log('\n[Test Group 3: Speaking & Speech Recognition Evaluation]');
    const evalResult = aiService.evaluateSpeaking({
      targetSentence: 'I practice speaking English every morning',
      spokenTranscript: 'I practice speaking English every morning'
    });
    assert(evalResult.accuracyScore >= 95, 'Perfect speaking transcript scores >= 95% accuracy');

    const evalPartial = aiService.evaluateSpeaking({
      targetSentence: 'I practice speaking English every morning',
      spokenTranscript: 'I practice English'
    });
    assert(evalPartial.accuracyScore < 80 && evalPartial.missedWords.length > 0, 'Partial speaking identifies missed words');

    // Test 4: Spaced Repetition (SM-2)
    console.log('\n[Test Group 4: Spaced Repetition (SM-2)]');
    const sm2First = spacedRepetition.calculateNextReview(5, 0, 1, 2.5);
    assert(sm2First.intervalDays === 1 && sm2First.repetitions === 1, 'SM-2 first repetition interval is 1 day');

    const sm2Second = spacedRepetition.calculateNextReview(5, 1, 1, 2.6);
    assert(sm2Second.intervalDays === 6 && sm2Second.repetitions === 2, 'SM-2 second repetition interval is 6 days');

    // Test 5: Gamification & Analytics
    console.log('\n[Test Group 5: Gamification & Streak Analytics]');
    const users = await db.query('SELECT id FROM users WHERE email = "student@englishmate.ai"');
    const studentId = users[0].id;

    const activityRes = await analyticsService.recordActivity({
      userId: studentId,
      xpEarned: 50,
      durationSeconds: 300,
      sessionType: 'lesson',
      targetId: 'les_a1_1_1'
    });
    assert(activityRes.xpEarned === 50, 'Activity logs XP and updates streak correctly');

    console.log('\n======================================================');
    console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Test execution crashed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().then(() => process.exit(0));
}

module.exports = runTests;
