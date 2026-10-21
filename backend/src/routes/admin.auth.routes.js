const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, getDashboardStats } = require('../controllers/admin.auth.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

router.post('/login', login);
router.get('/me', verifyAdmin, getMe);
router.post('/change-password', verifyAdmin, changePassword);
router.get('/stats', verifyAdmin, getDashboardStats);

module.exports = router;
