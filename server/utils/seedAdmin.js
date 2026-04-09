const User = require('../models/User');

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing');
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail }).select('+password');

  if (existingAdmin && (await existingAdmin.comparePassword(adminPassword))) {
    return;
  }

  if (existingAdmin) {
    existingAdmin.password = adminPassword;
    existingAdmin.role = 'admin';
    await existingAdmin.save();
  } else {
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
  }

  console.log('Admin credentials synced from environment variables');
};

module.exports = ensureAdminUser;
