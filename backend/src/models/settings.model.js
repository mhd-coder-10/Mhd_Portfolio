const mongoose = require('mongoose');

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const approachSchema = new mongoose.Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
});

const workflowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Terminal' },
  accent: { type: String, default: 'var(--accent-cyan)' },
  displayOrder: { type: Number, default: 0 },
});

const settingsSchema = new mongoose.Schema(
  {
    // SEO Settings
    seo: {
      siteTitle: {
        type: String,
        default: 'Momin Mahmmadbhai | Full-Stack Developer (MERN)',
      },
      metaDescription: {
        type: String,
        default: 'Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications, secure REST APIs, MongoDB database architecture, and verified business solutions.',
      },
      keywords: {
        type: String,
        default: 'Momin Mahmmadbhai, MERN Stack Developer, Full Stack Developer, React.js, Node.js, Express.js, MongoDB, REST APIs, Web Developer India',
      },
      ogTitle: {
        type: String,
        default: 'Momin Mahmmadbhai | Full-Stack Developer (MERN)',
      },
      ogDescription: {
        type: String,
        default: 'Portfolio of Momin Mahmmadbhai, a Full-Stack MERN Developer specializing in scalable web applications, secure REST APIs, and database architecture.',
      },
      ogImage: {
        type: String,
        default: '/favicon.svg',
      },
      canonicalUrl: {
        type: String,
        default: '',
      },
    },
    // Resume Settings
    resume: {
      url: {
        type: String,
        default: '',
      },
      fileName: {
        type: String,
        default: '',
      },
      fileSize: {
        type: String,
        default: '',
      },
      isDownloadActive: {
        type: Boolean,
        default: false,
      },
    },
    // Navigation Links
    navigationLinks: [navItemSchema],
    // Footer Settings
    footer: {
      description: {
        type: String,
        default: 'Full-Stack MERN Developer specialized in scalable web architectures, secure RESTful APIs, and rigorous QA verification.',
      },
      statusText: {
        type: String,
        default: 'Full-Stack Services Active & Available',
      },
      copyrightText: {
        type: String,
        default: 'All rights reserved.',
      },
    },
    // Engineering Approach & Workflow
    approachSteps: [approachSchema],
    workflowSteps: [workflowSchema],
    isInitialSeeded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
