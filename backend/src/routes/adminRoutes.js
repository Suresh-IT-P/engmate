const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { requireTeacherOrAdmin, requireAdmin } = require('../middleware/adminAuth');

router.use(authenticateToken);
router.use(requireTeacherOrAdmin);

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', requireAdmin, adminController.updateUserStatus);
router.post('/import', adminController.importContent);
router.post('/vocabulary', adminController.createVocabulary);
router.delete('/vocabulary/:id', adminController.deleteVocabulary);

module.exports = router;
