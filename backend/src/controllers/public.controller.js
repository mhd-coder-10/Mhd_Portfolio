const Profile = require('../models/profile.model');
const Experience = require('../models/experience.model');
const Skill = require('../models/skill.model');
const Project = require('../models/project.model');
const { Education, Language } = require('../models/education.model');
const Certification = require('../models/certification.model');
const SocialLink = require('../models/socialLink.model');
const ContactSettings = require('../models/contactSettings.model');
const Settings = require('../models/settings.model');

/**
 * Get Complete Unified Public Portfolio Data
 * GET /api/v1/public/portfolio
 * Hydrates the entire public frontend in a single lightning-fast request
 */
const getPublicPortfolio = async (req, res, next) => {
  try {
    const [
      profile,
      experiences,
      rawSkills,
      projects,
      education,
      languages,
      certifications,
      socialLinks,
      contactSettings,
      settings,
    ] = await Promise.all([
      Profile.findOne(),
      Experience.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }),
      Skill.find({ isActive: true }).sort({ categoryOrder: 1, displayOrder: 1 }),
      Project.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }),
      Education.find({ isActive: true }).sort({ displayOrder: 1 }),
      Language.find().sort({ displayOrder: 1 }),
      Certification.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }),
      SocialLink.find({ isActive: true }).sort({ displayOrder: 1 }),
      ContactSettings.findOne(),
      Settings.findOne(),
    ]);

    // Group skills by category for frontend component compatibility
    const categoriesMap = new Map();
    rawSkills.forEach((skill) => {
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
    const skillCategories = Array.from(categoriesMap.values());

    return res.status(200).json({
      success: true,
      data: {
        profile,
        experiences,
        skills: rawSkills,
        skillCategories,
        projects,
        education,
        certification: certifications[0] || null,
        certifications,
        socialLinks,
        contactSettings,
        settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPortfolio,
};
