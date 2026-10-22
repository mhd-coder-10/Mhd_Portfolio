const Settings = require('../models/settings.model');
const env = require('../config/env');
const { cloudinary, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Handle Image / Document Upload to Cloudinary
 * All files are saved strictly in root folder MHD_PORTFOLIO (no subfolders)
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
      console.log(`[Upload Image] Replacing previous file: ${previousUrl}`);
      await deleteFromCloudinary(previousUrl);
    }

    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: rootFolder,
      resource_type: isPdf ? 'image' : 'auto',
      ...(isPdf ? { format: 'pdf' } : {}),
      invalidate: true,
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
 * All files are saved strictly in root folder MHD_PORTFOLIO (no subfolders, no local disk writes)
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

    // Retrieve settings to find existing resume URL
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();

    // Delete existing resume from request or settings
    const previousUrl = req.body.previousUrl || req.body.oldUrl;
    if (previousUrl) {
      console.log(`[Upload Resume] Deleting previous resume from request: ${previousUrl}`);
      await deleteFromCloudinary(previousUrl);
    }
    if (settings.resume?.url && settings.resume.url !== previousUrl) {
      console.log(`[Upload Resume] Deleting previous resume from settings: ${settings.resume.url}`);
      await deleteFromCloudinary(settings.resume.url);
    }

    // Destroy existing MHD_PORTFOLIO/resume in Cloudinary to guarantee clean overwrite
    try {
      await cloudinary.uploader.destroy(`${rootFolder}/resume`, { resource_type: 'image', invalidate: true });
      await cloudinary.uploader.destroy(`${rootFolder}/resume`, { resource_type: 'raw', invalidate: true });
    } catch (cleanErr) {
      console.warn('[Upload Resume] Previous resume cleanup notice:', cleanErr.message);
    }

    // Upload directly to root folder MHD_PORTFOLIO with public_id 'resume'
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: rootFolder,
      resource_type: 'image',
      format: 'pdf',
      public_id: 'resume',
      overwrite: true,
      invalidate: true,
    });

    const sizeInKb = `${Math.round(req.file.size / 1024)} KB`;

    // Automatically update Settings.resume with new Cloudinary URL (ONLY in Cloudinary, no local disk saves)
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

    console.log(`[Delete Endpoint] Explicitly deleting file: ${target}`);
    const deleted = await deleteFromCloudinary(target);
    return res.status(200).json({
      success: true,
      message: deleted ? 'File deleted successfully from Cloudinary.' : 'File deleted or already absent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle explicit deletion of resume from Cloudinary and Settings
 * DELETE /api/v1/upload/resume
 */
const deleteResumeFile = async (req, res, next) => {
  try {
    console.log('[Delete Resume] Processing resume removal request');
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();

    // 1. Delete resume from Cloudinary root folder
    try {
      console.log(`[Delete Resume] Deleting ${rootFolder}/resume from Cloudinary`);
      await cloudinary.uploader.destroy(`${rootFolder}/resume`, { resource_type: 'image', invalidate: true });
      await cloudinary.uploader.destroy(`${rootFolder}/resume`, { resource_type: 'raw', invalidate: true });
      const targetUrl = req.body?.url || settings.resume?.url;
      if (targetUrl) {
        await deleteFromCloudinary(targetUrl);
      }
    } catch (cErr) {
      console.warn('[Delete Resume] Cloudinary cleanup notice:', cErr.message);
    }

    // 2. Clear resume fields in Settings model
    settings.resume = {
      url: '',
      fileName: '',
      fileSize: '',
      isDownloadActive: false,
    };
    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Resume removed successfully from database and Cloudinary storage.',
      data: settings.resume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImageFile,
  uploadResumeFile,
  deleteFile,
  deleteResumeFile,
};
