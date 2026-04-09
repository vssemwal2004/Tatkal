require('dotenv').config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { requireAdmin, verifyToken } = require('./middleware/auth');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const clientPortalRoutes = require('./routes/clientPortalRoutes');
const designRoutes = require('./routes/designRoutes');
const requestRoutes = require('./routes/requestRoutes');
const deployRoutes = require('./routes/deployRoutes');
const clientRoutes = require('./routes/clientRoutes');
const ensureAdminUser = require('./utils/seedAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'TATKAL admin backend is running' });
});

// If MongoDB is unavailable, block API calls (except health) with a clear 503.
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (app.locals.dbConnected) return next();
  return res.status(503).json({
    message:
      'Database is not connected. Start MongoDB or update MONGO_URI in server/.env (or set SKIP_DB=true to silence DB connect attempts).'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/design', verifyToken, designRoutes);
app.use('/api/client', verifyToken, clientPortalRoutes);
app.use('/api/admin', verifyToken, requireAdmin, requestRoutes);
app.use('/api/admin', verifyToken, requireAdmin, deployRoutes);
app.use('/api/admin', verifyToken, requireAdmin, clientRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  app.locals.dbConnected = await connectDB();
  if (app.locals.dbConnected) {
    await ensureAdminUser();
  } else {
    console.warn('Starting backend without MongoDB; API routes will return 503 (except /api/health).');
  }

  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend server:', error.message);
  process.exit(1);
});
