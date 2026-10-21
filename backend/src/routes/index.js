const express = require('express');
const router = express.Router();

const contactRoutes = require('./contact.routes');
const healthRoutes = require('./health.routes');
const adminAuthRoutes = require('./admin.auth.routes');
const messageRoutes = require('./message.routes');
const publicRoutes = require('./public.routes');
const profileRoutes = require('./profile.routes');
const experienceRoutes = require('./experience.routes');
const skillRoutes = require('./skill.routes');
const projectRoutes = require('./project.routes');
const educationRoutes = require('./education.routes');
const certificationRoutes = require('./certification.routes');
const socialLinkRoutes = require('./socialLink.routes');
const contactSettingsRoutes = require('./contactSettings.routes');
const settingsRoutes = require('./settings.routes');
const uploadRoutes = require('./upload.routes');

// Admin Auth & Messages
router.use('/v1/admin/auth', adminAuthRoutes);
router.use('/v1/admin/messages', messageRoutes);

// Public Unified Data Endpoint
router.use('/v1/public', publicRoutes);

// Module REST APIs
router.use('/v1/profile', profileRoutes);
router.use('/v1/experiences', experienceRoutes);
router.use('/v1/skills', skillRoutes);
router.use('/v1/projects', projectRoutes);
router.use('/v1/education', educationRoutes);
router.use('/v1/certifications', certificationRoutes);
router.use('/v1/social-links', socialLinkRoutes);
router.use('/v1/contact-settings', contactSettingsRoutes);
router.use('/v1/settings', settingsRoutes);
router.use('/v1/upload', uploadRoutes);

// Existing Contact form & Health Check
router.use('/v1/contact', contactRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

module.exports = router;
