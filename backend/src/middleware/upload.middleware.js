const multer = require('multer');
const path = require('path');

// Memory storage: files are held in memory as Buffers and streamed directly to Cloudinary
const storage = multer.memoryStorage();

// Media and certificate filter (Images and PDFs)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg|pdf/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowedTypes.test(ext) || allowedTypes.test(mime) || ext === 'pdf' || mime === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, SVG) and PDF documents are allowed'));
  }
};

// Resume filter (PDF only)
const resumeFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents are allowed for resumes'));
  }
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: imageFilter,
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: resumeFilter,
});

module.exports = {
  uploadImage,
  uploadResume,
};
