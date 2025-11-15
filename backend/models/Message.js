const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
    ref: 'User',
    required: true
  },
  message_text: {
    type: String,
    required: [true, 'Message text is required'],
    maxlength: 5000
  },
  attachments: [{
    type: String
  }],
  is_read: {
    type: Boolean,
    default: false
  },
  sent_at: {
    type: Date,
    default: Date.now
  },
  read_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ job_id: 1 });
messageSchema.index({ sender_id: 1 });
messageSchema.index({ receiver_id: 1 });
messageSchema.index({ sent_at: -1 });
messageSchema.index({ is_read: 1 });

// Virtual for id
messageSchema.virtual('id').get(function() {
  return this._id.toString();
});

messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);
