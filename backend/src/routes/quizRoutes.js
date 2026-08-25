const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/auth');

router.get('/daily', quizController.getDailyQuiz);
router.post('/attempt', authenticateToken, quizController.submitQuizAttempt);
router.get('/history', authenticateToken, quizController.getQuizHistory);

module.exports = router;
