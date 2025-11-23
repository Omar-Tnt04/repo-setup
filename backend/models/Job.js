const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: 500
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0
  },
  currency: {
    type: String,
    enum: ['TND', 'EUR'],
    default: 'TND'
  },
  escrow_status: {
    type: String,
    enum: ['unfunded', 'funded', 'released', 'disputed', 'refunded'],
    default: 'unfunded'
  },
  payment_provider: {
    type: String,
    enum: ['konnect', 'paymee', 'paymaster', 'zitouna', 'gpg', 'stripe'],
    default: 'konnect'
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  required_skills: [{
    type: String,
    trim: true
  }],
  attachments: [{
    type: String
  }],
  location_required: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: ''
  },
  views_count: {
    type: Number,
    default: 0
  },
  submissions_count: {
    type: Number,
    default: 0
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
jobSchema.index({ client_id: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' }); // Full-text search

// Virtual for id
jobSchema.virtual('id').get(function() {
  return this._id.toString();
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
