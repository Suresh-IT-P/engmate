const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, bookmarkController.getBookmarks);
router.post('/', authenticateToken, bookmarkController.addBookmark);
router.delete('/:id', authenticateToken, bookmarkController.removeBookmark);

module.exports = router;
