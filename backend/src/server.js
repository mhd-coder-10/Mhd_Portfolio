const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const seedDatabase = require('./utils/seedData');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Ensure initial data and admin account exist
  await seedDatabase();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 Portfolio API running on port ${env.PORT} (0.0.0.0)`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`📫 Contact API: http://localhost:${env.PORT}/api/v1/contact`);
    console.log(`=========================================`);
  });

  // Graceful shutdown
  const handleExit = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleExit('SIGINT'));
  process.on('SIGTERM', () => handleExit('SIGTERM'));
};

startServer().catch((err) => {
  console.error('[Server Fatal]', err);
  process.exit(1);
});
