const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required']
  },
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', 'admin'],
    default: 'freelancer'
  },
  profile_photo: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  preferred_language: {
    type: String,
    enum: ['ar', 'fr', 'en'],
    default: 'fr'
  },
  rating: {
    type: Number,
    default: 0.00,
    min: 0,
    max: 5
  },
  total_jobs_completed: {
    type: Number,
    default: 0
  },
  total_jobs_posted: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  skills: [{
    skill_name: String,
    proficiency_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ rating: -1 });
userSchema.index({ is_active: 1 });

// Virtual for id (to maintain compatibility with MySQL code)
userSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
