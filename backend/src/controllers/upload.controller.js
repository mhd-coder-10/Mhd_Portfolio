const Settings = require('../models/settings.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Handle Image / Document Upload to Cloudinary
 * POST /api/v1/upload/image
 */
const uploadImageFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or invalid file format.',
      });
    }

    // If an old/previous URL was passed, delete the previous file from Cloudinary
    const previousUrl = req.body.previousUrl || req.body.oldUrl;
    if (previousUrl) {
      await deleteFromCloudinary(previousUrl);
    }

    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    const folder = isPdf ? 'documents' : 'images';

    const result = await uploadToCloudinary(req.file.buffer, {
      folder,
      resource_type: 'auto',
    });

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary.',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        filename: req.file.originalname,
        originalName: req.file.originalname,
        format: result.format,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Resume Upload to Cloudinary
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

    // Automatically retrieve settings and delete any previous resume from Cloudinary
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (settings.resume?.url) {
      await deleteFromCloudinary(settings.resume.url);
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'resumes',
      resource_type: 'auto',
    });

    const sizeInKb = `${Math.round(req.file.size / 1024)} KB`;

    // Automatically update Settings.resume with new Cloudinary URL
    settings.resume = {
      url: result.secure_url,
      fileName: req.file.originalname,
      fileSize: sizeInKb,
      isDownloadActive: true,
    };
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and activated successfully on Cloudinary.',
      data: settings.resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle explicit deletion of uploaded file from Cloudinary
 * DELETE /api/v1/upload
 */
const deleteFile = async (req, res, next) => {
  try {
    const { url, public_id } = req.body;
    const target = url || public_id;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'URL or public_id is required.',
      });
    }

    const deleted = await deleteFromCloudinary(target);
    return res.status(200).json({
      success: true,
      message: deleted ? 'File deleted successfully from Cloudinary.' : 'File deleted or already absent.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImageFile,
  uploadResumeFile,
  deleteFile,
};
