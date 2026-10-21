const Certification = require('../models/certification.model');

/**
 * Get all certifications
 * GET /api/v1/certifications
 */
const getCertifications = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const certifications = await Certification.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create certification
 * POST /api/v1/certifications
 */
const createCertification = async (req, res, next) => {
  try {
    const certification = await Certification.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Certification added successfully.',
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update certification
 * PUT /api/v1/certifications/:id
 */
const updateCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Certification updated successfully.',
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete certification
 * DELETE /api/v1/certifications/:id
 */
const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Certification deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
};
