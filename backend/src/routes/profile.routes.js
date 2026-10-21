const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateHero,
  updateAbout,
} = require('../controllers/profile.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public route to view profile
router.get('/', getProfile);

// Protected routes to update profile
router.put('/', verifyAdmin, updateProfile);
router.put('/hero', verifyAdmin, updateHero);
router.put('/about', verifyAdmin, updateAbout);

module.exports = router;
