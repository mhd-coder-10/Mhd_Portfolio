const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const Project = require('../models/project.model');
const Experience = require('../models/experience.model');
const Skill = require('../models/skill.model');
const Certification = require('../models/certification.model');
const SocialLink = require('../models/socialLink.model');
const Contact = require('../models/contact.model');
const env = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Admin Login
 * POST /api/v1/admin/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Admin Profile
 * GET /api/v1/admin/auth/me
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

/**
 * Change Admin Password
 * POST /api/v1/admin/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Dashboard Summary Statistics
 * GET /api/v1/admin/dashboard/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalExperiences,
      totalSkills,
      totalCertifications,
      totalSocialLinks,
      totalMessages,
      unreadMessages,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Certification.countDocuments(),
      SocialLink.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalExperiences,
        totalSkills,
        totalCertifications,
        totalSocialLinks,
        totalMessages,
        unreadMessages,
      },
      recentMessages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  changePassword,
  getDashboardStats,
};
