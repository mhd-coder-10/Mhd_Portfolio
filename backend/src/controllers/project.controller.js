const Project = require('../models/project.model');
const ProjectCategory = require('../models/projectCategory.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

const defaultProjectCategories = [
  'Real-Time & AI Platform',
  'Full-Stack & AI',
  'MERN Stack',
  'Backend & APIs',
  'Frontend Application',
];

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
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // If main image is being changed or cleared, remove old image from Cloudinary
    if (req.body.image !== undefined && existing.image && existing.image !== req.body.image) {
      await deleteFromCloudinary(existing.image);
    }

    // If galleryImages are modified, remove deleted images from Cloudinary
    if (Array.isArray(req.body.galleryImages) && Array.isArray(existing.galleryImages)) {
      for (const oldImg of existing.galleryImages) {
        if (!req.body.galleryImages.includes(oldImg)) {
          await deleteFromCloudinary(oldImg);
        }
      }
    }

    Object.assign(existing, req.body);
    await existing.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: existing,
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
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Clean up project image from Cloudinary
    if (project.image) {
      await deleteFromCloudinary(project.image);
    }

    // Clean up gallery images from Cloudinary
    if (Array.isArray(project.galleryImages)) {
      for (const img of project.galleryImages) {
        await deleteFromCloudinary(img);
      }
    }

    await project.deleteOne();

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

/**
 * Get all project categories
 * Automatically seeds default categories or existing project categories if none exist
 * GET /api/v1/projects/categories
 */
const getProjectCategories = async (req, res, next) => {
  try {
    let categories = await ProjectCategory.find().sort({ displayOrder: 1, createdAt: 1 });

    // If no categories exist, initialize defaults + any categories from existing projects
    if (categories.length === 0) {
      const distinctProjectCats = await Project.distinct('category');
      const allToSeed = Array.from(new Set([...defaultProjectCategories, ...distinctProjectCats].filter(Boolean)));

      const seedDocs = allToSeed.map((cat, idx) => ({
        name: cat,
        description: '',
        displayOrder: idx + 1,
        isActive: true,
      }));

      await ProjectCategory.insertMany(seedDocs);
      categories = await ProjectCategory.find().sort({ displayOrder: 1, createdAt: 1 });
    }

    // Attach project count & project names list to each category
    const projects = await Project.find({}, 'name category');
    const countMap = {};
    const nameMap = {};
    projects.forEach((item) => {
      if (item.category) {
        countMap[item.category] = (countMap[item.category] || 0) + 1;
        if (!nameMap[item.category]) nameMap[item.category] = [];
        nameMap[item.category].push(item.name);
      }
    });

    const enriched = categories.map((cat) => ({
      ...cat.toObject(),
      projectCount: countMap[cat.name] || 0,
      projectNames: nameMap[cat.name] || [],
    }));

    return res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new project category
 * POST /api/v1/projects/categories
 */
const createProjectCategory = async (req, res, next) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const trimmed = name.trim();
    const existing = await ProjectCategory.findOne({ name: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category "${trimmed}" already exists.`,
      });
    }

    const category = await ProjectCategory.create({
      name: trimmed,
      description: description?.trim() || '',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      isActive: isActive !== false,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project category
 * Renames category across all existing projects if name changes
 * PUT /api/v1/projects/categories/:id
 */
const updateProjectCategory = async (req, res, next) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const oldName = category.name;
    const { name, description, displayOrder, isActive } = req.body;

    if (name && name.trim()) {
      const trimmed = name.trim();
      if (trimmed !== oldName) {
        const conflict = await ProjectCategory.findOne({
          _id: { $ne: category._id },
          name: { $regex: new RegExp(`^${trimmed}$`, 'i') },
        });
        if (conflict) {
          return res.status(400).json({
            success: false,
            message: `Category "${trimmed}" already exists.`,
          });
        }
        category.name = trimmed;

        // Automatically sync all projects using oldName to newName
        await Project.updateMany({ category: oldName }, { category: trimmed });
      }
    }

    if (description !== undefined) category.description = description.trim();
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project category
 * DELETE /api/v1/projects/categories/:id
 */
const deleteProjectCategory = async (req, res, next) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const catName = category.name;
    await category.deleteOne();

    // Reassign any projects using this category to remaining active category or General
    const fallback = (await ProjectCategory.findOne({ isActive: true }))?.name || 'General';
    await Project.updateMany({ category: catName }, { category: fallback });

    return res.status(200).json({
      success: true,
      message: `Category "${catName}" deleted. Linked projects were reassigned to "${fallback}".`,
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
  getProjectCategories,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
};
