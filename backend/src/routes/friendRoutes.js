const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { requireAuth } = require('../middleware/auth');

// Friend search exposes other people's profiles; it must know who is asking.
router.use(requireAuth);

router.get('/search', friendController.searchUsers);
router.post('/request', friendController.sendFriendRequest);
router.get('/', friendController.getFriends);
router.put('/respond', friendController.respondFriendRequest);
router.delete('/:friendId', friendController.removeFriend);

module.exports = router;
