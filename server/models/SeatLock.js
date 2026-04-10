const mongoose = require('mongoose');

const seatLockSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    routeId: { type: String, required: true, index: true },
    seatId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['locked', 'confirmed', 'expired'], default: 'locked' },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

seatLockSchema.index({ clientId: 1, routeId: 1, seatId: 1, status: 1 });
seatLockSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { status: 'locked' }
  }
);

module.exports = mongoose.model('SeatLock', seatLockSchema);
