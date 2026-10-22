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

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Public endpoint to download or view the current resume
 * GET /api/v1/public/resume/download
 */
const downloadResume = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    const resumeUrl = settings?.resume?.url;
    const isDownloadActive = settings?.resume?.isDownloadActive !== false;
    const fileName = settings?.resume?.fileName || 'Momin-Mahmmadbhai-Resume.pdf';

    if (!resumeUrl || !isDownloadActive) {
      return res.status(404).json({ success: false, message: 'Resume file is not available yet.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    if (resumeUrl.startsWith('http')) {
      const client = resumeUrl.startsWith('https') ? https : http;
      client.get(resumeUrl, (streamRes) => {
        if (streamRes.statusCode === 200) {
          streamRes.pipe(res);
        } else {
          return res.status(404).json({ success: false, message: 'Resume file is not available yet.' });
        }
      }).on('error', () => {
        return res.status(404).json({ success: false, message: 'Resume file is not available yet.' });
      });
    } else {
      return res.status(404).json({ success: false, message: 'Resume file is not available yet.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Public endpoint to safely view documents/certificates without CORS or Cloudinary direct restrictions
 * GET /api/v1/public/document/view?url=...
 */
const viewDocument = async (req, res, next) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) {
      return res.status(400).send('File URL is required');
    }

    const isPdf = fileUrl.toLowerCase().includes('.pdf');
    if (isPdf) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
    }

    if (fileUrl.startsWith('http')) {
      const client = fileUrl.startsWith('https') ? https : http;
      client.get(fileUrl, (streamRes) => {
        if (streamRes.statusCode === 200) {
          if (streamRes.headers['content-type'] && !isPdf) {
            res.setHeader('Content-Type', streamRes.headers['content-type']);
          }
          streamRes.pipe(res);
        } else {
          res.redirect(fileUrl);
        }
      }).on('error', () => {
        res.redirect(fileUrl);
      });
    } else {
      const localPath = path.resolve(__dirname, '../../..', fileUrl.replace(/^\/+/, ''));
      if (fs.existsSync(localPath)) {
        fs.createReadStream(localPath).pipe(res);
      } else {
        res.status(404).send('Document not found');
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPortfolio,
  downloadResume,
  viewDocument,
};
