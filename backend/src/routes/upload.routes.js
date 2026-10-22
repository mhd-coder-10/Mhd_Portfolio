const express = require('express');
const router = express.Router();
const { uploadImageFile, uploadResumeFile, deleteFile, deleteResumeFile } = require('../controllers/upload.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');
const { uploadImage, uploadResume } = require('../middleware/upload.middleware');

// Protected admin upload routes
router.post('/image', verifyAdmin, uploadImage.single('image'), uploadImageFile);
router.post('/resume', verifyAdmin, uploadResume.single('resume'), uploadResumeFile);
router.delete('/resume', verifyAdmin, deleteResumeFile);
router.delete('/', verifyAdmin, deleteFile);

module.exports = router;
