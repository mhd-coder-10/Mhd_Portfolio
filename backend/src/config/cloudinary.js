const cloudinary = require('cloudinary').v2;
const env = require('./env');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a memory buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - { folder, resource_type, format, public_id }
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();

    // Resolve final folder: ensure it is always inside rootFolder (e.g. MHD_PORTFOLIO/images)
    let finalFolder = rootFolder;
    if (options.folder) {
      finalFolder = options.folder.startsWith(rootFolder)
        ? options.folder
        : `${rootFolder}/${options.folder.replace(/^\/+/, '')}`;
    }

    const uploadOptions = {
      resource_type: options.resource_type || 'auto',
      ...options,
      folder: finalFolder, // Crucial: folder must be after ...options so options.folder never overrides it!
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary given its URL or public_id
 * @param {string} urlOrPublicId
 * @returns {Promise<boolean>}
 */
const deleteFromCloudinary = async (urlOrPublicId) => {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') {
    return false;
  }

  // If local /uploads/ or /assets/, ignore
  if (!urlOrPublicId.includes('cloudinary.com') && (urlOrPublicId.startsWith('/') || !urlOrPublicId.includes('/'))) {
    return false;
  }

  try {
    const rootFolder = (env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO').trim();
    let publicId = urlOrPublicId;
    let resourceType = 'image';

    if (urlOrPublicId.includes('cloudinary.com')) {
      // Find our root folder in URL (e.g. MHD_PORTFOLIO/images/abc.jpg)
      const folderIndex = urlOrPublicId.indexOf(rootFolder);
      if (folderIndex !== -1) {
        const afterFolder = urlOrPublicId.substring(folderIndex).split('?')[0];
        const lastDot = afterFolder.lastIndexOf('.');
        publicId = lastDot !== -1 ? afterFolder.substring(0, lastDot) : afterFolder;
      } else {
        // Fallback for any other Cloudinary URLs
        const parsed = new URL(urlOrPublicId);
        const pathParts = parsed.pathname.split('/');
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex === -1) return false;
        let parts = pathParts.slice(uploadIndex + 1);
        if (parts[0] && /^v\d+$/.test(parts[0])) parts = parts.slice(1);
        const full = parts.join('/');
        const dot = full.lastIndexOf('.');
        publicId = dot !== -1 ? full.substring(0, dot) : full;
      }

      if (urlOrPublicId.includes('/raw/')) {
        resourceType = 'raw';
      } else if (urlOrPublicId.includes('/video/')) {
        resourceType = 'video';
      } else {
        resourceType = 'image';
      }
    }

    console.log(`[Cloudinary] Deleting file: publicId=${publicId}, resourceType=${resourceType}`);

    // Try deleting with detected resourceType
    let res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
    console.log(`[Cloudinary] Delete attempt 1 (${resourceType}):`, res.result);

    // If not found and wasn't tried as image, try image
    if (res.result !== 'ok' && resourceType !== 'image') {
      res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
      console.log(`[Cloudinary] Delete attempt 2 (image):`, res.result);
    }

    // If still not found, try raw
    if (res.result !== 'ok' && resourceType !== 'raw') {
      res = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true });
      console.log(`[Cloudinary] Delete attempt 3 (raw):`, res.result);
    }

    return res.result === 'ok';
  } catch (error) {
    console.error('[Cloudinary] Failed to delete file:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
