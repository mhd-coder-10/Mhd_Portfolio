const mongoose = require('mongoose');

const getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Momin Mahmmadbhai Portfolio API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
    },
  });
};

module.exports = {
  getHealth,
};
