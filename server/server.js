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

app.use('/api/auth', authRoutes);
app.use('/api/design', verifyToken, designRoutes);
app.use('/api/client', verifyToken, clientPortalRoutes);
app.use('/api/admin', verifyToken, requireAdmin, requestRoutes);
app.use('/api/admin', verifyToken, requireAdmin, deployRoutes);
app.use('/api/admin', verifyToken, requireAdmin, clientRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();

  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend server:', error.message);
  process.exit(1);
});
