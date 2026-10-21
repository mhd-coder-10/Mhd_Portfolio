const Project = require('../models/project.model');

/**
 * Get all projects
 * GET /api/v1/projects
 */
const getProjects = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };

    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { tagline: { $regex: req.query.search, $options: 'i' } },
        { technologies: { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }

    const projects = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project
 * GET /api/v1/projects/:id
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create project
 * POST /api/v1/projects
 */
const createProject = async (req, res, next) => {
  try {
    // Generate slug from name if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    const project = await Project.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 * PUT /api/v1/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * DELETE /api/v1/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder projects
 * PUT /api/v1/projects/reorder
 */
const reorderProjects = async (req, res, next) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: orders must be an array of { id, displayOrder }',
      });
    }

    const updates = orders.map((item) =>
      Project.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: 'Projects reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
