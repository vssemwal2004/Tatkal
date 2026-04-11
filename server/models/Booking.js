const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    routeId: { type: String, required: true },
    seatId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['confirmed', 'cancelled', 'refunded'], default: 'confirmed' },
    payment: {
      orderId: { type: String, default: null },
      paymentId: { type: String, default: null }
    }
  },
  { timestamps: true }
);

bookingSchema.index({ clientId: 1, routeId: 1, seatId: 1, status: 1 });
bookingSchema.index(
  { clientId: 1, routeId: 1, seatId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'confirmed' }
  }
);
bookingSchema.index({ clientId: 1, userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
