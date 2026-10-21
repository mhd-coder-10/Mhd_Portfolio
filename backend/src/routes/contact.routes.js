const express = require('express');
const router = express.Router();
const { submitContact, getContactStatus } = require('../controllers/contact.controller');
const { validateContact } = require('../middleware/validateContact');
const { contactRateLimiter } = require('../middleware/rateLimiter');

// POST /api/v1/contact or /api/contact
router.post('/', contactRateLimiter, validateContact, submitContact);

// GET /api/v1/contact/status
router.get('/status', getContactStatus);

module.exports = router;
