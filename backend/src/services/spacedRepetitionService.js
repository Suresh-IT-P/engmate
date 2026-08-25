/**
 * Spaced Repetition System (SuperMemo SM-2 Algorithm)
 */
class SpacedRepetitionService {
  /**
   * Calculate next review interval and ease factor
   * @param {number} quality - 0 to 5 (0: complete blackout, 3: pass with difficulty, 5: perfect recall)
   * @param {number} repetitions - previous consecutive correct reviews
   * @param {number} previousInterval - in days
   * @param {number} previousEaseFactor - default 2.5
   */
  calculateNextReview(quality, repetitions = 0, previousInterval = 1, previousEaseFactor = 2.5) {
    let nextRepetitions = repetitions;
    let nextInterval = previousInterval;
    let nextEaseFactor = previousEaseFactor;

    // Quality must be between 0 and 5
    quality = Math.max(0, Math.min(5, quality));

    if (quality >= 3) {
      // Correct recall
      if (nextRepetitions === 0) {
        nextInterval = 1;
      } else if (nextRepetitions === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(previousInterval * previousEaseFactor);
      }
      nextRepetitions++;
    } else {
      // Failed recall - reset streak
      nextRepetitions = 0;
      nextInterval = 1;
    }

    // Update Ease Factor (EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
    nextEaseFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (nextEaseFactor < 1.3) {
      nextEaseFactor = 1.3;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);

    let status = 'learning';
    if (nextRepetitions >= 4 && nextInterval >= 21) {
      status = 'mastered';
    } else if (nextRepetitions >= 1) {
      status = 'reviewing';
    }

    return {
      repetitions: nextRepetitions,
      intervalDays: nextInterval,
      easeFactor: parseFloat(nextEaseFactor.toFixed(2)),
      nextReviewDate: nextDate.toISOString().slice(0, 19).replace('T', ' '),
      status
    };
  }
}

module.exports = new SpacedRepetitionService();
