const express = require('express');
const router = express.Router();
const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  updateLanguages,
} = require('../controllers/education.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read routes
router.get('/', getEducation);

// Protected admin write routes
router.post('/', verifyAdmin, createEducation);
router.put('/languages', verifyAdmin, updateLanguages);
router.put('/:id', verifyAdmin, updateEducation);
router.delete('/:id', verifyAdmin, deleteEducation);

module.exports = router;
