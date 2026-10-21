const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  const primaryUri = env.MONGODB_URI;
  const localFallbackUri = 'mongodb://127.0.0.1:27017/portfolio_db';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[Database Warning] Primary connection failed (${primaryError.message}).`);
    console.log(`[Database] Failing over to local MongoDB (${localFallbackUri})...`);
    try {
      const conn = await mongoose.connect(localFallbackUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[Database] Connected to Local MongoDB Fallback: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (localError) {
      console.error(`[Database Fatal] Local fallback failed: ${localError.message}`);
      if (env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
