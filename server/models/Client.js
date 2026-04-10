const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
      sparse: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      enum: ['travel', 'event'],
      required: true,
      default: 'travel'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Client', clientSchema);
