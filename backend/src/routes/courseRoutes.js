const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { optionalAuth } = require('../middleware/auth');

router.get('/categories', courseController.getCategories);
router.get('/levels', courseController.getLevels);
router.get('/', optionalAuth, courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);

module.exports = router;
