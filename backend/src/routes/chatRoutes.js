const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, requireAuth, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

router.get('/rooms', optionalAuth, chatController.getChatRooms);
router.get('/rooms/:roomId/messages', optionalAuth, chatController.getRoomMessages);
// Everything below reads or writes one person's private data.
router.get('/rooms/:roomId/detail', requireAuth, chatController.getDirectRoomDetail);
router.get('/rooms/:roomId/calls', requireAuth, chatController.getRoomCalls);

router.post('/rooms/direct', requireAuth, chatController.getOrCreateDirectRoom);
router.post('/rooms/:roomId/messages', requireAuth, chatController.sendMessage);
router.post('/rooms', requireAuth, requireAdmin, chatController.createChatRoom);

module.exports = router;
