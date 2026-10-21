const Skill = require('../models/skill.model');

/**
 * Get all skills
 * GET /api/v1/skills
 */
const getSkills = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const skills = await Skill.find(filter).sort({ categoryOrder: 1, displayOrder: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get skills grouped by categories (for public website)
 * GET /api/v1/skills/categories
 */
const getSkillCategories = async (req, res, next) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ categoryOrder: 1, displayOrder: 1 });

    // Group by category preserving icon & order
    const categoriesMap = new Map();
    skills.forEach((skill) => {
      if (!categoriesMap.has(skill.category)) {
        categoriesMap.set(skill.category, {
          title: skill.category,
          icon: skill.categoryIcon || 'Layout',
          skills: [],
        });
      }
      categoriesMap.get(skill.category).skills.push({
        name: skill.name,
        level: skill.level,
        desc: skill.desc,
      });
    });

    const categories = Array.from(categoriesMap.values());

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create skill
 * POST /api/v1/skills
 */
const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Skill added successfully.',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update skill
 * PUT /api/v1/skills/:id
 */
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete skill
 * DELETE /api/v1/skills/:id
 */
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder skills
 * PUT /api/v1/skills/reorder
 */
const reorderSkills = async (req, res, next) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: orders must be an array of { id, displayOrder }',
      });
    }

    const updates = orders.map((item) =>
      Skill.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: 'Skills reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category (renames category & updates icon across all its skills)
 * PUT /api/v1/skills/categories/update
 */
const updateCategory = async (req, res, next) => {
  try {
    const { oldCategoryName, newCategoryName, categoryIcon, categoryOrder } = req.body;
    if (!oldCategoryName || !newCategoryName) {
      return res.status(400).json({
        success: false,
        message: 'Both old and new category names are required.',
      });
    }

    const updateFields = {
      category: newCategoryName.trim(),
    };
    if (categoryIcon) updateFields.categoryIcon = categoryIcon;
    if (categoryOrder !== undefined) updateFields.categoryOrder = categoryOrder;

    const result = await Skill.updateMany(
      { category: oldCategoryName },
      { $set: updateFields }
    );

    return res.status(200).json({
      success: true,
      message: `Category updated successfully across ${result.modifiedCount} skills.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category (removes all skills belonging to this category)
 * DELETE /api/v1/skills/categories/delete
 */
const deleteCategory = async (req, res, next) => {
  try {
    const rawCategory = req.query.categoryName || req.body?.categoryName || req.params.name;
    const categoryName = rawCategory ? String(rawCategory).trim() : '';

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    // Escape special regex characters in categoryName
    const escaped = categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const result = await Skill.deleteMany({
      category: { $regex: new RegExp(`^${escaped}$`, 'i') },
    });

    return res.status(200).json({
      success: true,
      message: `Category "${categoryName}" and ${result.deletedCount} skills deleted successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillCategories,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  updateCategory,
  deleteCategory,
};
