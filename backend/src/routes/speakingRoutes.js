const express = require('express');
const router = express.Router();
const speakingController = require('../controllers/speakingController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/topics', optionalAuth, speakingController.getSpeakingTopics);
router.post('/evaluate', authenticateToken, speakingController.evaluateSpeaking);

module.exports = router;
