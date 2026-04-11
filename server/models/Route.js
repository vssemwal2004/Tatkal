const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    seatsLeft: { type: Number, default: 12 },
    totalSeats: { type: Number, default: 40 },
    departureTime: { type: String, default: null },
    arrivalTime: { type: String, default: null },
    operator: { type: String, default: null },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

routeSchema.index({ clientId: 1, from: 1, to: 1 });

module.exports = mongoose.model('Route', routeSchema);
