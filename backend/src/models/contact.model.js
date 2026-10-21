const mongoose = require('mongoose');

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address'],
      maxlength: [100, 'Email cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [25, 'Phone number cannot exceed 25 characters'],
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          const cleaned = v.replace(/[\s\-\(\)]/g, '');
          if (!/^\+?[0-9]{10,15}$/.test(cleaned) || /^(\+)?([0-9])\2{7,}$/.test(cleaned)) {
            return false;
          }
          if (
            /^[6-9]\d{9}$/.test(cleaned) ||
            /^0[6-9]\d{9}$/.test(cleaned) ||
            /^91[6-9]\d{9}$/.test(cleaned) ||
            /^\+91[6-9]\d{9}$/.test(cleaned)
          ) {
            return true;
          }
          if (cleaned.startsWith('+91') || (cleaned.startsWith('91') && cleaned.length > 10)) {
            return false;
          }
          return /^\+[1-9]\d{9,14}$/.test(cleaned);
        },
        message: 'Please provide a valid mobile or phone number',
      },
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters long'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
