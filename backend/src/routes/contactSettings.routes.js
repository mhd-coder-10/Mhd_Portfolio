const express = require('express');
const router = express.Router();
const {
  getContactSettings,
  updateContactSettings,
} = require('../controllers/contactSettings.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read route
router.get('/', getContactSettings);

// Protected admin write route
router.put('/', verifyAdmin, updateContactSettings);

module.exports = router;
