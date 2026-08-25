const express = require('express');
const router = express.Router();
const grammarController = require('../controllers/grammarController');

router.get('/', grammarController.getGrammarTopics);
router.get('/:id', grammarController.getGrammarTopicById);

module.exports = router;
