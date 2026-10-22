const Profile = require('../models/profile.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Get Profile
 * GET /api/v1/profile
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Profile
 * PUT /api/v1/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      // If profileImage is being changed or cleared, remove previous image from Cloudinary
      if (
        req.body.profileImage !== undefined &&
        profile.profileImage &&
        profile.profileImage !== req.body.profileImage
      ) {
        await deleteFromCloudinary(profile.profileImage);
      }
      Object.assign(profile, req.body);
    }
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Hero section settings
 * PUT /api/v1/profile/hero
 */
const updateHero = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }
    profile.hero = { ...profile.hero.toObject(), ...req.body };
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Hero section updated successfully.',
      data: profile.hero,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update About section settings
 * PUT /api/v1/profile/about
 */
const updateAbout = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }
    profile.about = { ...profile.about.toObject(), ...req.body };
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'About section updated successfully.',
      data: profile.about,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateHero,
  updateAbout,
};
