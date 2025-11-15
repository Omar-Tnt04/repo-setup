# Tunisian Top Freelancers - Backend API

## 📋 Project Overview
RESTful API backend for the Tunisian Top Freelancers platform - a freelance marketplace connecting Tunisian clients with skilled freelancers across various categories (Web Development, Mobile Development, Design, Content Writing, Marketing, Video Editing).

**Technology Stack**: Node.js + Express.js + MySQL + Socket.io + Stripe + Google Gemini AI

---

## 🏗️ Architecture

### Core Technologies
- **Runtime**: Node.js v16+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0+ with mysql2 (connection pooling)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Real-time Communication**: Socket.io
- **Payment Processing**: Stripe API
- **AI Integration**: Google Gemini API
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

### Project Structure
```
backend/
├── server.js                      # Application entry point
├── package.json                   # Dependencies and scripts
├── .env                          # Environment configuration
│
├── config/
│   ├── db.js                     # MySQL connection pool & query helpers
│   └── stripe.js                 # Stripe initialization
│
├── controllers/                  # Business logic layer
│   ├── authController.js         # Authentication & user management
│   ├── adminController.js        # Admin analytics & user management
│   ├── jobController.js          # Job CRUD operations
│   ├── submissionController.js   # Job application management
│   ├── paymentController.js      # Stripe payment handling
│   └── messageController.js      # Messaging system
│
├── routes/                       # API endpoint definitions
│   ├── auth.js                   # /api/auth routes
│   ├── admin.js                  # /api/admin routes
│   ├── jobs.js                   # /api/jobs routes
│   ├── submissions.js            # /api/submissions routes
│   ├── payments.js               # /api/payments routes
│   └── messages.js               # /api/messages routes
│
├── middleware/
│   ├── auth.js                   # JWT verification & role authorization
│   ├── validation.js             # Input validation rules
│   └── errorHandler.js           # Global error handling
│
├── services/
│   └── aiRecommendation.js       # AI-powered job matching
│
├── socket/
│   └── chatHandler.js            # Real-time chat with Socket.io
│
├── database/
│   ├── schema.sql                # Database structure (8 tables)
│   ├── seed.sql                  # Demo data
│   └── missing_tables.sql        # Additional tables if needed
│
└── scripts/
    ├── setupDatabase.js          # Database initialization
    ├── seedDatabase.js           # Seed demo data
    └── createAdmin.js            # Create admin user
```

---

## 🗄️ Database Schema

### Tables Overview (8 Tables)

**1. users** - User accounts (clients, freelancers, admins)
```sql
Columns: id, email, password_hash, full_name, role, profile_photo, bio, 
         phone, location, preferred_language, rating, total_jobs_completed,
         total_jobs_posted, is_active, is_verified, created_at, updated_at
Indexes: email, role, rating
```

**2. jobs** - Job postings by clients
```sql
Columns: id, client_id (FK), title, description, category, budget, currency,
         deadline, status, visibility, required_skills, attachments,
         location_required, location, views_count, submissions_count,
         created_at, updated_at, completed_at
Indexes: client_id, status, category, created_at
Full-text: title, description
```

**3. job_skills** - Required skills for jobs (Many-to-Many)
```sql
Columns: id, job_id (FK), skill_name, created_at
Indexes: job_id, skill_name
```

**4. user_skills** - Freelancer skills (Many-to-Many)
```sql
Columns: id, user_id (FK), skill_name, proficiency_level, created_at
Indexes: user_id, skill_name
Unique: (user_id, skill_name)
```

**5. submissions** - Job applications by freelancers
```sql
Columns: id, job_id (FK), freelancer_id (FK), description, attachments,
         status, client_feedback, rating, submitted_at, updated_at
Indexes: job_id, freelancer_id, status
```

**6. payments** - Stripe payment transactions
```sql
Columns: id, job_id (FK), submission_id (FK), client_id (FK), 
         freelancer_id (FK), amount, currency, stripe_payment_intent_id,
         status, created_at, updated_at, released_at
Indexes: job_id, client_id, freelancer_id, status
```

**7. messages** - Chat messages between users
```sql
Columns: id, job_id (FK), sender_id (FK), receiver_id (FK), message_text,
         attachments, is_read, sent_at, read_at
Indexes: job_id, sender_id, receiver_id, sent_at
```

**8. notifications** - User notifications
```sql
Columns: id, user_id (FK), type, title, message, is_read, created_at
Indexes: user_id, is_read, created_at
```

---

## 🔐 Authentication & Authorization

### JWT Token System
- **Token Generation**: 7-day expiration, includes user ID
- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Storage**: Client stores in localStorage, sends in Authorization header
- **Format**: `Authorization: Bearer <token>`

### Middleware Chain
```javascript
// Protected route (requires login)
router.get('/me', protect, getMe);

// Role-restricted route (admin only)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Optional authentication (public but enhanced if logged in)
router.get('/jobs', optionalAuth, getAllJobs);
```

### User Roles
- **client**: Can post jobs, hire freelancers, make payments
- **freelancer**: Can browse jobs, submit proposals, receive payments
- **admin**: Full platform management, analytics, user moderation

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Authenticate user |
| GET | `/me` | Protected | Get current user profile |
| PUT | `/update` | Protected | Update profile information |
| PUT | `/change-password` | Protected | Change password |
| PUT | `/skills` | Protected | Update user skills |

### Admin (`/api/admin`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/users` | User statistics & growth charts |
| GET | `/users` | All users (paginated, filterable) |
| GET | `/users/:role` | Users by role |
| PUT | `/users/:id/toggle-status` | Activate/deactivate account |
| DELETE | `/users/:id` | Delete user |

### Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public* | All jobs (filterable by category, budget) |
| GET | `/categories` | Public | List of job categories |
| GET | `/:id` | Public* | Single job details |
| POST | `/` | Client | Create job posting |
| PUT | `/:id` | Owner | Update job |
| DELETE | `/:id` | Owner | Delete job |
| GET | `/my/posted` | Client | My posted jobs |
| GET | `/recommendations/ai` | Freelancer | AI job recommendations |

*Enhanced with user data if authenticated

### Submissions (`/api/submissions`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Freelancer | Submit job application |
| GET | `/job/:jobId` | Client | View job submissions |
| GET | `/my` | Freelancer | My submissions |
| PUT | `/:id` | Owner | Update submission |
| PUT | `/:id/status` | Client | Approve/reject submission |
| DELETE | `/:id` | Owner | Delete submission |

### Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create-intent` | Client | Create Stripe payment |
| POST | `/webhook` | Stripe | Stripe webhook (raw body) |
| POST | `/:id/release` | Admin | Release held payment |
| POST | `/:id/refund` | Admin | Refund payment |
| GET | `/history` | Protected | Payment history |
| GET | `/:id` | Protected | Payment details |

### Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/job/:jobId` | Protected | Job-related messages |
| POST | `/` | Protected | Send message |
| PUT | `/:id/read` | Protected | Mark message as read |
| DELETE | `/:id` | Sender | Delete message |

---

## 💬 Real-time Communication (Socket.io)

### Connection Flow
```javascript
// Client connects with authentication
const socket = io('http://localhost:5000', {
  auth: { userId: currentUser.id }
});

// Server authenticates
// - Verifies user exists in database
// - Checks account is active
// - Creates personal room: "user:{userId}"
```

### Socket Events

#### Client → Server
```javascript
// Join job chat room
socket.emit('join:job', { job_id: 123 })

// Send message
socket.emit('message:send', {
  job_id: 123,
  receiver_id: 456,
  message_text: "Hello!",
  attachments: []
})

// Mark message as read
socket.emit('message:read', { message_id: 789 })

// Typing indicator
socket.emit('typing:start', { job_id: 123, receiver_id: 456 })
socket.emit('typing:stop', { job_id: 123, receiver_id: 456 })
```

#### Server → Client
```javascript
// Connection confirmed
socket.on('connected', (data) => { })

// Joined job room
socket.on('joined:job', (data) => { })

// New message received
socket.on('message:new', (message) => { })
socket.on('message:received', (message) => { })

// User typing
socket.on('typing:user', (data) => { })

// Errors
socket.on('error', (error) => { })
```

---

## 💳 Payment Integration (Stripe)

### Payment Flow
```
1. Client creates payment intent
   POST /api/payments/create-intent
   Body: { job_id, submission_id, amount }
   Returns: { client_secret, payment_id }

2. Client completes payment (frontend with Stripe.js)
   Uses client_secret to process card payment

3. Stripe sends webhook notification
   POST /api/payments/webhook
   Event: payment_intent.succeeded
   Updates status: 'pending' → 'held'

4. Work completed, admin releases payment
   POST /api/payments/:id/release
   Transfers to freelancer Stripe account
   Updates status: 'held' → 'released'
```

### Payment Statuses
- `pending`: Payment initiated, not confirmed
- `held`: Payment successful, held in escrow
- `released`: Payment transferred to freelancer
- `refunded`: Payment refunded to client
- `failed`: Payment processing failed

---

## 🤖 AI Job Recommendations (Google Gemini)

### How It Works
```
1. Freelancer requests recommendations
   GET /api/jobs/recommendations/ai

2. System gathers context:
   - Freelancer skills & proficiency levels
   - Past completed jobs & categories
   - Profile rating & experience
   - All available open jobs (last 50)

3. AI prompt constructed:
   "Given freelancer skills [JavaScript (expert), React (advanced)...]
    and available jobs [1. React Developer, 2. PHP Website...]
    recommend TOP 10 jobs based on skill match, experience, budget fit"

4. Gemini AI returns ranked job IDs: [1, 15, 3, 8, ...]

5. System fetches full job details and returns ranked list
```

### Ranking Factors
- **Skill Match** (highest priority): Required skills match user skills
- **Experience Level**: Job complexity matches user rating/completed jobs
- **Category Fit**: Similar to past successful work
- **Budget Alignment**: Appropriate for freelancer level

---

## 🔒 Security Features

1. **Password Security**: bcrypt hashing (10 rounds), strong password policy
2. **JWT Tokens**: Signed with secret key, 7-day expiration
3. **HTTP Security**: Helmet middleware (XSS, clickjacking protection)
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Restricted to frontend origin only
6. **Input Validation**: Express-validator on all endpoints
7. **SQL Injection**: Parameterized queries with mysql2
8. **Role-Based Access**: Middleware authorization checks
9. **Account Status**: Active/inactive flag enforcement
10. **Error Sanitization**: No sensitive data in error responses

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+ and npm
- MySQL 8.0+
- Stripe account (for payments)
- Google Gemini API key (for AI recommendations)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `.env` file in backend root:
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tunisian_freelancers

# JWT
JWT_SECRET=your_random_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup
```bash
# Option A: Automatic setup (recommended)
npm run db:setup    # Creates database and tables
npm run db:seed     # Adds demo data

# Option B: Manual setup
mysql -u root -p
CREATE DATABASE tunisian_freelancers;
USE tunisian_freelancers;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 4. Create Admin User
```bash
node scripts/createAdmin.js
# Creates: admin@tunisianfreelancers.com / Admin@123
```

### 5. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "full_name": "Test User",
    "role": "freelancer",
    "location": "Tunis"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Protected Request (use token from login)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Browse Jobs
```bash
# All jobs
curl http://localhost:5000/api/jobs

# Filter by category
curl http://localhost:5000/api/jobs?category=Web%20Development

# Filter by budget
curl "http://localhost:5000/api/jobs?minBudget=1000&maxBudget=5000"
```

---

## 📊 Demo Data

### Demo Accounts

**Clients** (can post jobs, hire freelancers):
- `client1@example.com` / `Test@123` - Ahmed Ben Salem (Tunis)
- `client2@example.com` / `Test@123` - Fatma Gharbi (Sfax)
- `client3@example.com` / `Test@123` - Mohamed Trabelsi (Sousse)

**Freelancers** (can apply for jobs):
- `freelancer1@example.com` / `Test@123` - Youssef Mansour (Developer, 4.80★)
- `freelancer2@example.com` / `Test@123` - Salma Karoui (Designer, 4.95★)
- `freelancer3@example.com` / `Test@123` - Amine Bouazizi (Writer, 4.60★)
- `freelancer4@example.com` / `Test@123` - Nadia Slimani (Marketer, 4.70★)
- `freelancer5@example.com` / `Test@123` - Karim Jlassi (Video Editor, 4.50★)

**Admin** (full platform access):
- `admin@tunisianfreelancers.com` / `Admin@123`

### Sample Data Included
- **8 Jobs**: Various categories and budgets
- **3 Submissions**: Job applications with different statuses
- **2 Payments**: Sample transactions
- **Multiple Skills**: For job-freelancer matching

---

## 🚨 Troubleshooting

### Database Connection Failed
```
Error: ER_ACCESS_DENIED_ERROR
Solution: Check DB_USER, DB_PASSWORD in .env
```

### JWT Invalid Token
```
Error: Token expired or invalid
Solution: 
1. Check JWT_SECRET matches between server restarts
2. Token expires after 7 days, re-login
3. Ensure "Bearer " prefix in Authorization header
```

### Socket.io Connection Failed
```
Error: Connection refused
Solution:
1. Check CLIENT_URL in .env matches frontend
2. Verify CORS configuration
3. Ensure userId passed in socket.handshake.auth
```

### Stripe Webhook Failed
```
Error: Webhook signature verification failed
Solution:
1. Use Stripe CLI for local testing:
   stripe listen --forward-to localhost:5000/api/payments/webhook
2. Copy webhook secret to STRIPE_WEBHOOK_SECRET
3. Ensure raw body parsing for /webhook endpoint
```

### Rate Limit Exceeded
```
Error: Too many requests
Solution: Wait 15 minutes or adjust RATE_LIMIT_MAX_REQUESTS in .env
```

---

## 📈 Performance Optimizations

- **Connection Pooling**: 10 MySQL connections maintained
- **Database Indexes**: On frequently queried columns (email, role, status)
- **Query Optimization**: JOINs instead of multiple queries
- **Transaction Support**: Atomic operations for payments
- **Async Operations**: Non-blocking I/O throughout
- **Socket.io Rooms**: Targeted event broadcasting

---

## 🔄 Available Scripts

```bash
npm start           # Start production server
npm run dev         # Start with nodemon (auto-reload)
npm run db:setup    # Initialize database
npm run db:seed     # Seed demo data
npm run db:reset    # Drop and recreate database
```

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { "id": 1, "email": "user@example.com" }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## 🛠️ Development Tools

- **Postman Collection**: Import API endpoints for testing
- **MySQL Workbench**: Visual database management
- **Stripe CLI**: Local webhook testing
- **nodemon**: Auto-restart on file changes

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Check existing documentation
- Review error logs in console
- Test with demo accounts first
- Verify environment variables

---

**Version**: 1.0.0  
**Last Updated**: November 15, 2025  
**Node Version**: 16.x or higher  
**Database**: MySQL 8.0+
