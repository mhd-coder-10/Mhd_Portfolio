const express = require('express');
const router = express.Router();
const {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} = require('../controllers/experience.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read routes
router.get('/', getExperiences);
router.get('/:id', getExperienceById);

// Protected admin write routes
router.post('/', verifyAdmin, createExperience);
router.put('/reorder', verifyAdmin, reorderExperiences);
router.put('/:id', verifyAdmin, updateExperience);
router.delete('/:id', verifyAdmin, deleteExperience);

module.exports = router;
