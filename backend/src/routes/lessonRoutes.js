const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/:id', optionalAuth, lessonController.getLessonById);
router.post('/:id/complete', authenticateToken, lessonController.completeLesson);

module.exports = router;
