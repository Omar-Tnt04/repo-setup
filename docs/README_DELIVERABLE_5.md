# Deliverable 5: Backend Development & Database Integration

## ✅ Requirements Completed

### 1. MongoDB Atlas Setup

#### Database Configuration
- ✅ MongoDB Atlas cluster created
- ✅ Database user credentials configured
- ✅ Network access whitelist configured
- ✅ Connection string integrated in `.env`

#### Environment Variables (`.env`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 2. Mongoose Schemas

#### User Schema (`models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['client', 'freelancer', 'admin'], 
    default: 'client' 
  },
  skills: [{ type: String }],
  bio: { type: String },
  hourlyRate: { type: Number },
  rating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### Job Schema (`models/Job.js`)
```javascript
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  required_skills: [{ type: String }],
  deadline: { type: Date },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open' 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now }
});
```

#### Submission Schema (`models/Submission.js`)
```javascript
const submissionSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  freelancer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  proposalText: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  estimatedDuration: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now }
});
```

#### Payment Schema (`models/Payment.js`)
```javascript
const paymentSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending' 
  },
  stripePaymentIntent: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

#### Message Schema (`models/Message.js`)
```javascript
const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true },
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

### 3. RESTful API Endpoints

#### Authentication Routes (`routes/auth.js`)
```javascript
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/profile       - Get current user profile
PUT    /api/auth/profile       - Update user profile
```

#### Jobs Routes (`routes/jobs.js`)
```javascript
GET    /api/jobs               - Get all jobs (with filters)
GET    /api/jobs/:id           - Get single job
POST   /api/jobs               - Create new job
PUT    /api/jobs/:id           - Update job
DELETE /api/jobs/:id           - Delete job
GET    /api/jobs/my-jobs       - Get user's jobs
```

#### Submissions Routes (`routes/submissions.js`)
```javascript
GET    /api/submissions/job/:jobId     - Get job submissions
POST   /api/submissions                - Submit proposal
PUT    /api/submissions/:id/status     - Update submission status
DELETE /api/submissions/:id            - Delete submission
POST   /api/submissions/:id/rate       - Rate submission
```

#### Payments Routes (`routes/payments.js`)
```javascript
POST   /api/payments/create-intent     - Create Stripe payment intent
POST   /api/payments/:id/release       - Release payment to freelancer
GET    /api/payments/:id               - Get payment details
GET    /api/payments/stats             - Get payment statistics
```

#### Messages Routes (`routes/messages.js`)
```javascript
GET    /api/messages               - Get user messages
POST   /api/messages               - Send new message
PUT    /api/messages/:id/read      - Mark message as read
DELETE /api/messages/:id           - Delete message
```

#### Admin Routes (`routes/admin.js`)
```javascript
GET    /api/admin/users            - Get all users
GET    /api/admin/stats            - Get platform statistics
PUT    /api/admin/users/:id/verify - Verify user
DELETE /api/admin/users/:id        - Delete user
```

### 4. CRUD Operations Implementation

#### Create Example (Job Creation)
```javascript
// controllers/jobController.js
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, category, required_skills, deadline } = req.body;
    
    const job = await Job.create({
      title,
      description,
      budget,
      category,
      required_skills,
      deadline,
      client: req.user.id
    });
    
    res.status(201).json({ 
      success: true, 
      job 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

#### Read Example (Get Jobs with Filters)
```javascript
exports.getAllJobs = async (req, res) => {
  try {
    const { category, minBudget, maxBudget, skills, status } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }
    if (skills) query.required_skills = { $in: skills.split(',') };
    
    const jobs = await Job.find(query)
      .populate('client', 'fullName email rating')
      .populate('freelancer', 'fullName rating')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: jobs.length,
      jobs 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

#### Update Example (Update Job)
```javascript
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found' 
      });
    }
    
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized' 
      });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      job: updatedJob 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

#### Delete Example (Delete Job)
```javascript
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found' 
      });
    }
    
    if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized' 
      });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

### 5. Middleware Implementation

#### Authentication Middleware (`middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};
```

#### Error Handler Middleware (`middleware/errorHandler.js`)
```javascript
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 6. API Testing with Postman

#### Authentication Tests
```
✅ POST /api/auth/register - Create new user
✅ POST /api/auth/login - Login and get token
✅ GET /api/auth/profile - Get profile (with token)
✅ PUT /api/auth/profile - Update profile
```

#### Jobs API Tests
```
✅ GET /api/jobs - List all jobs
✅ GET /api/jobs?category=Design&minBudget=100 - Filtered jobs
✅ POST /api/jobs - Create job (authenticated)
✅ GET /api/jobs/:id - Get single job
✅ PUT /api/jobs/:id - Update job
✅ DELETE /api/jobs/:id - Delete job
```

#### Submissions API Tests
```
✅ POST /api/submissions - Submit proposal
✅ GET /api/submissions/job/:jobId - Get job submissions
✅ PUT /api/submissions/:id/status - Accept/reject submission
```

#### Payments API Tests
```
✅ POST /api/payments/create-intent - Create Stripe payment
✅ POST /api/payments/:id/release - Release payment
✅ GET /api/payments/stats - Payment statistics
```

## 🔒 Security Features
1. ✅ Password hashing with bcrypt
2. ✅ JWT token authentication
3. ✅ Protected routes with middleware
4. ✅ Role-based access control
5. ✅ Input validation
6. ✅ CORS configuration
7. ✅ Helmet security headers
8. ✅ Rate limiting

## 📊 Database Features
1. ✅ 6 Mongoose models with relationships
2. ✅ Schema validation
3. ✅ Indexes for performance
4. ✅ Population for related documents
5. ✅ Virtual fields
6. ✅ Pre-save hooks

## ✨ Key Achievements
1. Complete MongoDB Atlas integration
2. 6 Mongoose schemas with relationships
3. 25+ RESTful API endpoints
4. Full CRUD operations
5. JWT authentication system
6. Role-based authorization
7. Stripe payment integration
8. Comprehensive error handling
9. API tested with Postman
10. Production-ready backend architecture

---
**Date Completed:** November 2025  
**Technologies:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, Stripe, Postman
