const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    skillsCovered: {
      type: [String],
      default: [],
    },
    certificateImage: {
      type: String,
      default: '',
    },
    certificateUrl: {
      type: String,
      default: '',
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
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

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;
