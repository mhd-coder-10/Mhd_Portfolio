/**
 * Comprehensive Contact Form Validation Middleware
 * Enforces strict input validation for name, email, phone/mobile, subject, and message.
 */

// RFC 5322 compliant email regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Valid name characters: Latin alphabets, spaces, hyphens, periods, apostrophes
const nameRegex = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s.'-]{2,60}$/;

/**
 * Validates mobile / WhatsApp phone numbers:
 * Supports 10-digit Indian numbers (with or without +91 / 0) and international E.164 numbers (10-15 digits).
 */
const validatePhoneNumber = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') return true; // Optional field
  const trimmed = rawPhone.trim();
  if (trimmed === '') return true;

  // Clean common formatting characters (spaces, dashes, parens)
  const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');

  // Reject strings with less than 10 digits or more than 15 digits
  if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
    return false;
  }

  // Reject bogus sequences like "0000000000" or "1111111111"
  if (/^(\+)?([0-9])\2{7,}$/.test(cleaned)) {
    return false;
  }

  // Indian standard mobile number: exactly 10 digits starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with leading 0: 0 + 10 digits starting with 6-9
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with 91 prefix: 91 + 10 digits starting with 6-9
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with +91 prefix: +91 + 10 digits starting with 6-9
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // If it starts with +91 or 91 but didn't match the strict 10-digit Indian pattern above,
  // it is NOT a valid number (do not let it pass as generic international)
  if (cleaned.startsWith('+91') || (cleaned.startsWith('91') && cleaned.length > 10)) {
    return false;
  }

  // Non-Indian international format: starts with '+' and country code other than 91, with 10-15 digits
  if (/^\+[1-9]\d{9,14}$/.test(cleaned)) {
    return true;
  }

  return false;
};

const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

const validateContact = (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  const errors = {};

  // 1. Name Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Full name is required.';
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (trimmedName.length > 60) {
      errors.name = 'Name cannot exceed 60 characters.';
    } else if (/\d/.test(trimmedName)) {
      errors.name = 'Name cannot contain numbers.';
    } else if (!nameRegex.test(trimmedName) || !/[a-zA-Z]/.test(trimmedName)) {
      errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }
  }

  // 2. Email Validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email address is required.';
  } else {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 100) {
      errors.email = 'Email address cannot exceed 100 characters.';
    } else if (!trimmedEmail.includes('@')) {
      errors.email = "Email address must contain an '@' sign.";
    } else if (!emailRegex.test(trimmedEmail) || trimmedEmail.includes('..')) {
      errors.email = 'Please provide a valid email address (e.g., yourname@company.com).';
    }
  }

  // 3. Mobile / WhatsApp Phone Validation (Optional, but if entered must be valid)
  if (phone && typeof phone === 'string' && phone.trim().length > 0) {
    const trimmedPhone = phone.trim();
    if (/[^\d+\s\-()]/.test(trimmedPhone)) {
      errors.phone = 'Phone number can only contain digits, +, spaces, and dashes.';
    } else {
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      const hasPlus = trimmedPhone.startsWith('+');

      if (!hasPlus) {
        if (digitsOnly.length < 10) {
          errors.phone = `Mobile number must be 10 digits (currently ${digitsOnly.length}/10).`;
        } else if (digitsOnly.length === 10 && !/^[6-9]/.test(digitsOnly)) {
          errors.phone = 'Indian mobile number must start with 6, 7, 8, or 9.';
        }
      } else if (trimmedPhone.startsWith('+91')) {
        const indianDigits = digitsOnly.slice(2);
        if (indianDigits.length < 10) {
          errors.phone = `Mobile number must be 10 digits after +91 (currently ${indianDigits.length}/10).`;
        } else if (!/^[6-9]/.test(indianDigits)) {
          errors.phone = 'Mobile number must start with 6, 7, 8, or 9.';
        }
      } else {
        if (digitsOnly.length < 10) {
          errors.phone = `International phone number must have at least 10 digits (currently ${digitsOnly.length}).`;
        }
      }

      if (!errors.phone && !validatePhoneNumber(trimmedPhone)) {
        errors.phone = 'Please enter a valid 10-digit mobile number (e.g., 93165 15672 or +91 93165 15672).';
      }
    }
  }

  // 4. Subject Validation
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    errors.subject = 'Subject is required.';
  } else {
    const trimmedSubject = subject.trim();
    if (trimmedSubject.length < 3) {
      errors.subject = 'Subject must be at least 3 characters.';
    } else if (trimmedSubject.length > 120) {
      errors.subject = 'Subject cannot exceed 120 characters.';
    }
  }

  // 5. Message Validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.message = 'Message content is required.';
  } else {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    } else if (trimmedMessage.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters.';
    }
  }

  // Check if any errors occurred
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors,
    });
  }

  // Clean, sanitized values
  req.body.name = sanitizeText(name);
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone ? phone.trim().replace(/[^\d+\s\-()]/g, '') : '';
  req.body.subject = sanitizeText(subject);
  req.body.message = sanitizeText(message);

  next();
};

module.exports = {
  validateContact,
  validatePhoneNumber,
};

