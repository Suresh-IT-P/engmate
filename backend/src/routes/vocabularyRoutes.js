const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/word-of-the-day', vocabularyController.getWordOfTheDay);
router.get('/review-queue', authenticateToken, vocabularyController.getReviewQueue);
router.post('/:id/review', authenticateToken, vocabularyController.submitWordReview);
router.get('/', optionalAuth, vocabularyController.getVocabulary);

module.exports = router;
