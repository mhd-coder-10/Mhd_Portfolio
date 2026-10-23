const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (!env.MONGODB_URI) {
    console.error('[Database Fatal] MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Fatal] MongoDB Atlas connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
