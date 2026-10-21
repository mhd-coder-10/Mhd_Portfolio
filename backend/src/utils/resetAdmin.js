const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/admin.model');
const env = require('../config/env');

const resetAdmin = async () => {
  try {
    console.log('[Reset Admin] Connecting to database...');
    await connectDB();

    const targetEmail = env.ADMIN_EMAIL.toLowerCase();
    const newPassword = env.ADMIN_PASSWORD;

    let admin = await Admin.findOne({ email: targetEmail });

    if (admin) {
      admin.password = newPassword;
      await admin.save();
      console.log(`[Reset Admin] ✅ Successfully updated password for admin: ${targetEmail}`);
    } else {
      admin = await Admin.create({
        name: 'Momin Mahmmadbhai',
        email: targetEmail,
        password: newPassword,
      });
      console.log(`[Reset Admin] ✅ Created new admin account for: ${targetEmail}`);
    }

    console.log(`[Reset Admin] Email: ${targetEmail}`);
    console.log(`[Reset Admin] Password: ${newPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('[Reset Admin] ❌ Error resetting admin:', err);
    process.exit(1);
  }
};

resetAdmin();
