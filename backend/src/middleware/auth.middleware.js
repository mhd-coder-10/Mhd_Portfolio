const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/admin.model');

const verifyAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-admin-token']) {
      token = req.headers['x-admin-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Verify admin exists in database
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'The admin user associated with this token no longer exists.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Authorization failed.',
    });
  }
};

module.exports = {
  verifyAdmin,
};
