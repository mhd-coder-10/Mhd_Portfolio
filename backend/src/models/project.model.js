const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    overview: {
      type: String,
      default: '',
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    contributions: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'MERN Stack',
      trim: true,
    },
    status: {
      type: String,
      default: 'Production System',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    hasDemo: {
      type: Boolean,
      default: false,
    },
    demoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    hasGithub: {
      type: Boolean,
      default: false,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    availabilityNote: {
      type: String,
      default: 'Code repository and architecture demo available upon professional inquiry.',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ displayOrder: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
