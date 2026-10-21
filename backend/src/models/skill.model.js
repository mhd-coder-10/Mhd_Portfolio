const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Frontend Development',
    },
    categoryIcon: {
      type: String,
      default: 'Layout',
    },
    level: {
      type: String,
      default: 'Proficient',
      trim: true,
    },
    desc: {
      type: String,
      default: '',
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    categoryOrder: {
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

skillSchema.index({ category: 1, displayOrder: 1 });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
