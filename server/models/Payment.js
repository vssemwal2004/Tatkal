const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null, unique: true, sparse: true },
    status: { type: String, enum: ['created', 'verified', 'failed'], default: 'created' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
