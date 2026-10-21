const Settings = require('../models/settings.model');

/**
 * Handle Image Upload
 * POST /api/v1/upload/image
 */
const uploadImageFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or invalid file format (only images and PDFs allowed).',
      });
    }

    const fileUrl = `/uploads/images/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Resume Upload
 * POST /api/v1/upload/resume
 */
const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume PDF file uploaded.',
      });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const sizeInKb = `${Math.round(req.file.size / 1024)} KB`;

    // Automatically update Settings.resume
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.resume = {
      url: fileUrl,
      fileName: req.file.originalname,
      fileSize: sizeInKb,
      isDownloadActive: true,
    };
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and activated successfully.',
      data: settings.resume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImageFile,
  uploadResumeFile,
};
