const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillCategories,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  updateCategory,
  deleteCategory,
} = require('../controllers/skill.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read routes
router.get('/', getSkills);
router.get('/categories', getSkillCategories);

// Protected admin write routes
router.post('/', verifyAdmin, createSkill);
router.put('/reorder', verifyAdmin, reorderSkills);
router.put('/categories/update', verifyAdmin, updateCategory);
router.delete('/categories/delete', verifyAdmin, deleteCategory);
router.put('/:id', verifyAdmin, updateSkill);
router.delete('/:id', verifyAdmin, deleteSkill);

module.exports = router;
