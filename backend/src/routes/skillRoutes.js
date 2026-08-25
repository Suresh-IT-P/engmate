const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillPracticeController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/reading', optionalAuth, skillController.getReadingPassages);
router.get('/listening', optionalAuth, skillController.getListeningLessons);
router.get('/writing', optionalAuth, skillController.getWritingPrompts);
router.post('/complete-session', authenticateToken, skillController.completeSkillSession);

module.exports = router;
