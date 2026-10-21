const { Education, Language } = require('../models/education.model');

/**
 * Get all education & language records
 * GET /api/v1/education
 */
const getEducation = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const [education, languages] = await Promise.all([
      Education.find(filter).sort({ displayOrder: 1, createdAt: -1 }),
      Language.find().sort({ displayOrder: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        education,
        languages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create education record
 * POST /api/v1/education
 */
const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Education record added.',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update education record
 * PUT /api/v1/education/:id
 */
const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Education record updated.',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete education record
 * DELETE /api/v1/education/:id
 */
const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Education record deleted.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Replace/Update languages list
 * PUT /api/v1/education/languages
 */
const updateLanguages = async (req, res, next) => {
  try {
    const { languages } = req.body;
    if (!Array.isArray(languages)) {
      return res.status(400).json({
        success: false,
        message: 'Languages must be an array of objects.',
      });
    }

    await Language.deleteMany({});
    const createdLanguages = await Language.insertMany(languages);

    return res.status(200).json({
      success: true,
      message: 'Languages updated successfully.',
      data: createdLanguages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  updateLanguages,
};
