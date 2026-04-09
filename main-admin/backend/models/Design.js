const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
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
    enum: ['draft', 'pending', 'approved', 'deployed'],
    default: 'draft'
  },
  systemType: {
    type: String,
    enum: ['travel', 'event'],
    required: false
  },
  submittedAt: {
    type: Date,
    required: false
  },
  deployedAt: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Design', designSchema);
