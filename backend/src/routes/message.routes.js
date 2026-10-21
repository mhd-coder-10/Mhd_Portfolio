const express = require('express');
const router = express.Router();
const {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/message.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// All message management routes are strictly protected
router.use(verifyAdmin);

router.get('/', getMessages);
router.put('/:id/status', updateMessageStatus);
router.delete('/:id', deleteMessage);

module.exports = router;
