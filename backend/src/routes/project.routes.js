const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getProjectCategories,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} = require('../controllers/project.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Project Category routes (Must precede /:id)
router.get('/categories', getProjectCategories);
router.post('/categories', verifyAdmin, createProjectCategory);
router.put('/categories/:id', verifyAdmin, updateProjectCategory);
router.delete('/categories/:id', verifyAdmin, deleteProjectCategory);

// Public read routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected admin write routes
router.post('/', verifyAdmin, createProject);
router.put('/reorder', verifyAdmin, reorderProjects);
router.put('/:id', verifyAdmin, updateProject);
router.delete('/:id', verifyAdmin, deleteProject);

module.exports = router;
