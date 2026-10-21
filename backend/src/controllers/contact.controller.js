const Contact = require('../models/contact.model');
const { sendContactNotification } = require('../services/email.service');
const { sendTelegramNotification } = require('../services/telegram.service');

/**
 * Handle new contact form submission
 * POST /api/v1/contact
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Save contact message in MongoDB Atlas
    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    const notificationPayload = {
      name,
      email,
      phone,
      subject,
      message,
      createdAt: newContact.createdAt,
    };

    // 2. Dispatch Email notification asynchronously
    sendContactNotification(notificationPayload).catch((err) => {
      console.warn('[Email Warning] Background email dispatch error:', err.message);
    });

    // 3. Dispatch Instant Telegram notification asynchronously
    sendTelegramNotification(notificationPayload).catch((err) => {
      console.warn('[Telegram Warning] Background Telegram dispatch error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received successfully. I will get back to you shortly.',
      data: {
        id: newContact._id,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    next(error);
  }
};

/**
 * Health/status of contact collection (returns count if requested)
 * GET /api/v1/contact/status
 */
const getContactStatus = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments();
    return res.status(200).json({
      success: true,
      data: {
        totalReceived: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactStatus,
};
