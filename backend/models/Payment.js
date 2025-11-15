const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  submission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'TND'
  },
  stripe_payment_intent_id: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'held', 'released', 'refunded', 'failed'],
    default: 'pending'
  },
  released_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ job_id: 1 });
paymentSchema.index({ client_id: 1 });
paymentSchema.index({ freelancer_id: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripe_payment_intent_id: 1 });

// Virtual for id
paymentSchema.virtual('id').get(function() {
  return this._id.toString();
});

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
