const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/search', friendController.searchUsers);
router.post('/request', friendController.sendFriendRequest);
router.get('/', friendController.getFriends);
router.put('/respond', friendController.respondFriendRequest);
router.delete('/:friendId', friendController.removeFriend);

module.exports = router;
