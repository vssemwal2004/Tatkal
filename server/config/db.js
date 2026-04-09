const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const getMongoUri = () => {
  return process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
};

const isTruthy = (value) => {
  if (!value) return false;
  return ['1', 'true', 'yes', 'y', 'on'].includes(String(value).trim().toLowerCase());
};

const connectDB = async () => {
  if (isTruthy(process.env.SKIP_DB)) {
    console.warn('MongoDB connection skipped (SKIP_DB=true)');
    return false;
  }

  const mongoUri = getMongoUri();
  if (!mongoUri) {
    console.error(
      'MongoDB connection not configured. Set MONGO_URI (or MONGODB_URI / DATABASE_URL) in server/.env'
    );
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Fix by starting MongoDB locally or updating MONGO_URI in server/.env');
    return false;
  }
};

module.exports = connectDB;
