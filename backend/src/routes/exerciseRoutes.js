const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, exerciseController.getExercises);
router.get('/practice/custom', optionalAuth, exerciseController.getCustomPracticeSet);
router.get('/:id', optionalAuth, exerciseController.getExerciseById);
router.post('/:id/submit', authenticateToken, exerciseController.submitExercise);

module.exports = router;
