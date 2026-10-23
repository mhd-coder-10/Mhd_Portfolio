const mongoose = require('mongoose');

const projectCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

projectCategorySchema.index({ displayOrder: 1, name: 1 });

const ProjectCategory = mongoose.model('ProjectCategory', projectCategorySchema);

module.exports = ProjectCategory;
