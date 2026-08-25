const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.post('/chat', authenticateToken, aiController.chat);
router.post('/correct-sentence', optionalAuth, aiController.correctSentence);
router.post('/evaluate-writing', authenticateToken, aiController.evaluateWriting);
router.get('/scenarios', optionalAuth, aiController.getScenarios);
router.get('/history/:id', authenticateToken, aiController.getConversationHistory);

module.exports = router;
