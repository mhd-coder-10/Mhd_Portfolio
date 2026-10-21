const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema(
  {
    // WhatsApp direct integration
    whatsapp: {
      rawPhone: { type: String, default: '9316515672' },
      countryCode: { type: String, default: '91' },
      displayPhone: { type: String, default: '+91 93165 15672' },
      prefilledMessage: {
        type: String,
        default: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
      },
      buttonText: { type: String, default: 'Chat on WhatsApp' },
      isActive: { type: Boolean, default: true },
    },
    // Telegram direct integration
    telegram: {
      username: { type: String, default: 'Mohammad_041' },
      displayLabel: { type: String, default: '@Mohammad_041' },
      profileUrl: { type: String, default: 'https://telegram.me/Mohammad_041' },
      prefilledMessage: {
        type: String,
        default: 'Hello Mohammad, I visited your portfolio and would like to discuss a project or professional opportunity.',
      },
      buttonText: { type: String, default: 'Chat on Telegram' },
      isActive: { type: Boolean, default: true },
    },
    // Direct Contact Info
    publicEmail: { type: String, default: 'mhd.developer10@gmail.com' },
    contactEmail: { type: String, default: 'mhd.developer10@gmail.com' },
    phone: { type: String, default: '9316515672' },
    formattedPhone: { type: String, default: '+91 93165 15672' },
    location: { type: String, default: 'Sidhpur, Patan, Gujarat, India' },
    contactSectionTitle: { type: String, default: 'Get In Touch' },
    contactSectionDescription: {
      type: String,
      default: 'Have a role, client project, or technical opportunity? Send a message directly to my inbox or connect instantly via WhatsApp or Telegram.',
    },
  },
  {
    timestamps: true,
  }
);

const ContactSettings = mongoose.model('ContactSettings', contactSettingsSchema);

module.exports = ContactSettings;
