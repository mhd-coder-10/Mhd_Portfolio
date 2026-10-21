const ContactSettings = require('../models/contactSettings.model');

/**
 * Get contact settings (WhatsApp, Telegram, Phone, Email)
 * GET /api/v1/contact-settings
 */
const getContactSettings = async (req, res, next) => {
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update contact settings
 * PUT /api/v1/contact-settings
 */
const updateContactSettings = async (req, res, next) => {
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = new ContactSettings(req.body);
    } else {
      // Merge updates
      if (req.body.whatsapp) {
        settings.whatsapp = { ...settings.whatsapp.toObject(), ...req.body.whatsapp };
      }
      if (req.body.telegram) {
        settings.telegram = { ...settings.telegram.toObject(), ...req.body.telegram };
      }
      if (req.body.publicEmail) settings.publicEmail = req.body.publicEmail;
      if (req.body.contactEmail) settings.contactEmail = req.body.contactEmail;
      if (req.body.phone) settings.phone = req.body.phone;
      if (req.body.formattedPhone) settings.formattedPhone = req.body.formattedPhone;
      if (req.body.location) settings.location = req.body.location;
      if (req.body.contactSectionTitle) settings.contactSectionTitle = req.body.contactSectionTitle;
      if (req.body.contactSectionDescription) settings.contactSectionDescription = req.body.contactSectionDescription;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Contact and messaging settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactSettings,
  updateContactSettings,
};
