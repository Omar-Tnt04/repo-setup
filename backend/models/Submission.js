const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Submission description is required']
  },
  attachments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'revision_requested'],
    default: 'pending'
  },
  client_feedback: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  submitted_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ job_id: 1 });
submissionSchema.index({ freelancer_id: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submitted_at: -1 });

// Virtual for id
submissionSchema.virtual('id').get(function() {
  return this._id.toString();
});

submissionSchema.set('toJSON', { virtuals: true });
submissionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Submission', submissionSchema);
