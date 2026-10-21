const SocialLink = require('../models/socialLink.model');

/**
 * Get all social links
 * GET /api/v1/social-links
 */
const getSocialLinks = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const links = await SocialLink.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create social link
 * POST /api/v1/social-links
 */
const createSocialLink = async (req, res, next) => {
  try {
    const link = await SocialLink.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Social link added successfully.',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update social link
 * PUT /api/v1/social-links/:id
 */
const updateSocialLink = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Social link updated successfully.',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete social link
 * DELETE /api/v1/social-links/:id
 */
const deleteSocialLink = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Social link deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder social links
 * PUT /api/v1/social-links/reorder
 */
const reorderSocialLinks = async (req, res, next) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: orders must be an array of { id, displayOrder }',
      });
    }

    const updates = orders.map((item) =>
      SocialLink.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: 'Social links reordered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
};
