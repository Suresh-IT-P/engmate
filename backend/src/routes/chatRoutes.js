const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

router.get('/rooms', optionalAuth, chatController.getChatRooms);
router.get('/rooms/:roomId/messages', optionalAuth, chatController.getRoomMessages);
router.get('/rooms/:roomId/detail', authenticateToken, chatController.getDirectRoomDetail);
router.get('/rooms/:roomId/calls', authenticateToken, chatController.getRoomCalls);

router.post('/rooms/direct', authenticateToken, chatController.getOrCreateDirectRoom);
router.post('/rooms/:roomId/messages', authenticateToken, chatController.sendMessage);
router.post('/rooms', authenticateToken, requireAdmin, chatController.createChatRoom);

module.exports = router;
