const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'mhd.developer10@gmail.com',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8640930770:AAGXKrQJVZbOHls3cbpkI6hrsel1pw86x6g',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  JWT_SECRET: process.env.JWT_SECRET || 'momin-portfolio-super-secure-jwt-secret-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'mhd.developer10@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@Portfolio2026!',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_FOLDER_NAME: process.env.CLOUDINARY_FOLDER_NAME || 'MHD_PORTFOLIO',
};

module.exports = env;
