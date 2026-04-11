const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null, unique: true, sparse: true },
    status: { type: String, enum: ['created', 'verified', 'failed'], default: 'created' },
    lockId: { type: mongoose.Schema.Types.ObjectId, ref: 'SeatLock', default: null },
    routeId: { type: String, default: null },
    seatId: { type: String, default: null },
    failureReason: { type: String, default: null }
  },
  { timestamps: true }
);

paymentSchema.index(
  { lockId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['created', 'verified'] }, lockId: { $type: 'objectId' } }
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
