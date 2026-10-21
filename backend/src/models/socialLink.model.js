const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    username: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'Link',
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

socialLinkSchema.index({ displayOrder: 1 });

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);

module.exports = SocialLink;
