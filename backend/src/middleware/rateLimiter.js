const rateLimit = require('express-rate-limit');

// Rate limiter for contact form: maximum 5 submissions per 15 minutes per IP
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent from this IP address. Please try again after 15 minutes.',
  },
});

module.exports = {
  contactRateLimiter,
};
