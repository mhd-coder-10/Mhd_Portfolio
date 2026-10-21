const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require('../controllers/project.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected admin write routes
router.post('/', verifyAdmin, createProject);
router.put('/reorder', verifyAdmin, reorderProjects);
router.put('/:id', verifyAdmin, updateProject);
router.delete('/:id', verifyAdmin, deleteProject);

module.exports = router;
