const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, progressController.getDashboardStats);
router.get('/analytics', authenticateToken, progressController.getSkillAnalytics);
router.get('/mistakes', authenticateToken, progressController.getMistakes);
router.post('/mistakes/:id/reviewed', authenticateToken, progressController.markMistakeReviewed);
router.get('/leaderboard', optionalAuth, progressController.getLeaderboard);

module.exports = router;
