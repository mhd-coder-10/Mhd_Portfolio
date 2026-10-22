const fs = require('fs');
const path = require('path');
const Settings = require('../models/settings.model');
const env = require('../config/env');
const { cloudinary, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

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
      console.log(`[Upload Image] Replacing previous file: ${previousUrl}`);
      await deleteFromCloudinary(previousUrl);
    }

    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    const folder = isPdf ? 'documents' : 'images';
    const resourceType = isPdf ? 'raw' : 'image';

    const result = await uploadToCloudinary(req.file.buffer, {
      folder,
      resource_type: resourceType,
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

    // Retrieve settings to find existing resume URL
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

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

    // Clean all previous files in Cloudinary folder MHD_PORTFOLIO/resumes to guarantee clean 1-file replacement
    try {
      const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();
      const resumeFolder = `${rootFolder}/resumes`;
      console.log(`[Upload Resume] Auto-purging previous files in folder: ${resumeFolder}`);
      await cloudinary.api.delete_resources_by_prefix(resumeFolder, { resource_type: 'raw' });
      await cloudinary.api.delete_resources_by_prefix(resumeFolder, { resource_type: 'image' });
    } catch (cleanErr) {
      console.warn('[Upload Resume] Previous resume prefix cleanup notice:', cleanErr.message);
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'resumes',
      resource_type: 'image',
      format: 'pdf',
      public_id: 'resume',
      overwrite: true,
    });

    const sizeInKb = `${Math.round(req.file.size / 1024)} KB`;

    // Sync local asset file so public downloads never fail
    try {
      const publicResumeDir = path.resolve(__dirname, '../../../frontend/public/assets/resume');
      if (fs.existsSync(publicResumeDir)) {
        fs.writeFileSync(path.join(publicResumeDir, 'Momin-Mahmmadbhai-Resume.pdf'), req.file.buffer);
      }
    } catch (e) {
      console.warn('[Resume Upload] Local sync notice:', e.message);
    }

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

module.exports = {
  uploadImageFile,
  uploadResumeFile,
  deleteFile,
};
