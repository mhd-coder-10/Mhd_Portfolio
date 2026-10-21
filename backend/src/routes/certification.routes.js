const express = require('express');
const router = express.Router();
const {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certification.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read route
router.get('/', getCertifications);

// Protected admin write routes
router.post('/', verifyAdmin, createCertification);
router.put('/:id', verifyAdmin, updateCertification);
router.delete('/:id', verifyAdmin, deleteCertification);

module.exports = router;
