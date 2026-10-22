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
    const rootFolder = env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO';
    const targetFolder = options.folder ? `${rootFolder}/${options.folder}` : rootFolder;

    const uploadOptions = {
      folder: targetFolder,
      resource_type: options.resource_type || 'auto',
      ...options,
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

  // If it's a local /uploads/ URL, ignore
  if (!urlOrPublicId.includes('cloudinary.com') && urlOrPublicId.startsWith('/')) {
    return false;
  }

  try {
    let publicId = urlOrPublicId;
    let resourceType = 'image';

    if (urlOrPublicId.includes('cloudinary.com')) {
      const parsed = new URL(urlOrPublicId);
      const pathParts = parsed.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex === -1) return false;

      resourceType = pathParts[uploadIndex - 1] || 'image';
      let parts = pathParts.slice(uploadIndex + 1);

      // Strip version (e.g. v1792645060)
      if (parts[0] && /^v\d+$/.test(parts[0])) {
        parts = parts.slice(1);
      }

      const fullPathWithExt = parts.join('/');
      const lastDotIndex = fullPathWithExt.lastIndexOf('.');
      publicId = lastDotIndex !== -1 ? fullPathWithExt.substring(0, lastDotIndex) : fullPathWithExt;

      let res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
      if (res.result !== 'ok' && resourceType !== 'image') {
        res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
      }
      if (res.result !== 'ok') {
        res = await cloudinary.uploader.destroy(fullPathWithExt, { resource_type: 'raw', invalidate: true });
      }
      return res.result === 'ok';
    }

    const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    return res.result === 'ok';
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
