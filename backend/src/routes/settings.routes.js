const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateSeo,
  updateResume,
  updateNavigation,
} = require('../controllers/settings.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read route
router.get('/', getSettings);

// Protected admin write routes
router.put('/', verifyAdmin, updateSettings);
router.put('/seo', verifyAdmin, updateSeo);
router.put('/resume', verifyAdmin, updateResume);
router.put('/navigation', verifyAdmin, updateNavigation);

module.exports = router;
