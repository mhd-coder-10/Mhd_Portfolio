const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
});

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    score: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
    details: {
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

const Language = mongoose.model('Language', languageSchema);
const Education = mongoose.model('Education', educationSchema);

module.exports = {
  Education,
  Language,
};
