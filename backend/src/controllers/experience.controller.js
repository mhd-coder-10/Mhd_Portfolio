const Experience = require('../models/experience.model');

/**
 * Get all experiences
 * GET /api/v1/experiences
 */
const getExperiences = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const experiences = await Experience.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single experience
 * GET /api/v1/experiences/:id
 */
const getExperienceById = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create experience
 * POST /api/v1/experiences
 */
const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Experience added successfully.',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update experience
 * PUT /api/v1/experiences/:id
 */
const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Experience updated successfully.',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete experience
 * DELETE /api/v1/experiences/:id
 */
const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Experience deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder experiences
 * PUT /api/v1/experiences/reorder
 */
const reorderExperiences = async (req, res, next) => {
  try {
    const { orders } = req.body; // array of { id, displayOrder }
    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: orders must be an array of { id, displayOrder }',
      });
    }

    const updates = orders.map((item) =>
      Experience.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: 'Experiences reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
};
