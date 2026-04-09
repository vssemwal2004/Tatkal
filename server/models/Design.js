const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'deployed'],
      default: 'pending'
    },
    deployment: {
      url: {
        type: String,
        default: null
      },
      username: {
        type: String,
        default: null
      },
      password: {
        type: String,
        default: null
      },
      deployedAt: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Design', designSchema);
