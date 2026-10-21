const express = require('express');
const router = express.Router();
const {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} = require('../controllers/socialLink.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read route
router.get('/', getSocialLinks);

// Protected admin write routes
router.post('/', verifyAdmin, createSocialLink);
router.put('/reorder', verifyAdmin, reorderSocialLinks);
router.put('/:id', verifyAdmin, updateSocialLink);
router.delete('/:id', verifyAdmin, deleteSocialLink);

module.exports = router;
