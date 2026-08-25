const express = require('express');
const router = express.Router();
const battleController = require('../controllers/battleController');
const { optionalAuth } = require('../middleware/auth');

router.get('/topics', optionalAuth, battleController.getBattleTopics);
router.get('/questions', optionalAuth, battleController.getBattleQuestions);

module.exports = router;
