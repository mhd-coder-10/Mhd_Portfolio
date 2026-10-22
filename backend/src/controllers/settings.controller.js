const Settings = require('../models/settings.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Get website settings
 * GET /api/v1/settings
 */
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    } else if (settings.seo?.canonicalUrl && settings.seo.canonicalUrl.includes('mominmahmmadbhai.dev')) {
      settings.seo.canonicalUrl = '';
      await settings.save();
    }
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update general settings
 * PUT /api/v1/settings
 */
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Website settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update SEO settings
 * PUT /api/v1/settings/seo
 */
const updateSeo = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.seo = { ...settings.seo.toObject(), ...req.body };
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'SEO settings updated successfully.',
      data: settings.seo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Resume settings
 * PUT /api/v1/settings/resume
 */
const updateResume = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // If new resume URL is provided and differs from old one, delete old from Cloudinary
    if (
      req.body.url &&
      settings.resume?.url &&
      settings.resume.url !== req.body.url
    ) {
      await deleteFromCloudinary(settings.resume.url);
    }

    settings.resume = { ...settings.resume.toObject(), ...req.body };
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume settings updated successfully.',
      data: settings.resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Navigation links
 * PUT /api/v1/settings/navigation
 */
const updateNavigation = async (req, res, next) => {
  try {
    const { navigationLinks } = req.body;
    if (!Array.isArray(navigationLinks)) {
      return res.status(400).json({
        success: false,
        message: 'navigationLinks must be an array.',
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.navigationLinks = navigationLinks;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Navigation links updated successfully.',
      data: settings.navigationLinks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateSeo,
  updateResume,
  updateNavigation,
};
