const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['TND', 'EUR'],
    default: 'TND'
  },
  type: {
    type: String,
    enum: ['escrow_deposit', 'escrow_release', 'refund', 'withdrawal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  provider: {
    type: String,
    enum: ['konnect', 'paymee', 'paymaster', 'zitouna', 'gpg', 'stripe', 'system'],
    required: true
  },
  provider_transaction_id: {
    type: String
  },
  fees: {
    platform_fee: { type: Number, default: 0 }, // Should be 0 based on requirements
    processor_fee: { type: Number, default: 0 }
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
