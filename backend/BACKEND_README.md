# Backend API Documentation

## Overview
Node.js/Express REST API with MySQL database, JWT authentication, Socket.io real-time chat, Stripe payments, and Google Gemini AI recommendations for the Tunisian Top Freelancers platform.

## Tech Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MySQL 8.0+ with connection pooling
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Payments**: Stripe API
- **AI**: Google Gemini API
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure
```
backend/
├── server.js                 # Main entry point
├── config/
│   ├── db.js                 # MySQL connection pool & helpers
│   └── stripe.js             # Stripe initialization
├── controllers/              # Business logic
│   ├── authController.js     # Register, login, profile
│   ├── adminController.js    # User analytics & management
│   ├── jobController.js      # CRUD for jobs
│   ├── submissionController.js
│   ├── paymentController.js
│   └── messageController.js
├── routes/                   # API route definitions
│   ├── auth.js
│   ├── admin.js
│   ├── jobs.js
│   ├── submissions.js
│   ├── payments.js
│   └── messages.js
├── middleware/
│   ├── auth.js               # JWT verification & authorization
│   ├── validation.js         # Express-validator rules
│   └── errorHandler.js       # Global error handling
├── services/
│   └── aiRecommendation.js   # Gemini AI job matching
├── socket/
│   └── chatHandler.js        # Real-time messaging
├── database/
│   ├── schema.sql            # Database structure
│   ├── seed.sql              # Demo data
│   └── missing_tables.sql
└── scripts/
    ├── setupDatabase.js
    ├── seedDatabase.js
    └── createAdmin.js
```

## Core Architecture

### 1. Server Initialization (`server.js`)
```javascript
// Initialize Express + HTTP server + Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {...} });

// Security middleware
app.use(helmet());                    // HTTP headers security
app.use(cors({ credentials: true })); // Cross-origin requests
app.use(limiter);                     // Rate limiting (100 req/15min)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/messages', messagesRoutes);

// Error handling
app.use(notFound);        // 404 handler
app.use(errorHandler);    // Global error handler
```

### 2. Database Layer (`config/db.js`)
```javascript
// Connection pool for performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

// Query helper with error handling
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

// Transaction support
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```

### 3. Authentication Flow (`middleware/auth.js` + `authController.js`)

**Registration**:
```javascript
POST /api/auth/register
Body: { email, password, full_name, role, phone, location }

Process:
1. Validate input (express-validator)
2. Check if email exists
3. Hash password with bcrypt (10 salt rounds)
4. Insert user into database
5. Generate JWT token (7-day expiry)
6. Return user data + token
```

**Login**:
```javascript
POST /api/auth/login
Body: { email, password }

Process:
1. Find user by email
2. Check if account is active
3. Compare password with bcrypt
4. Generate JWT token
5. Return user data + token
```

**Protected Routes**:
```javascript
// Middleware chain
router.get('/me', protect, getMe);

protect middleware:
1. Extract JWT from "Authorization: Bearer <token>" header
2. Verify token with jwt.verify()
3. Query database for user
4. Check if user is active
5. Attach user object to req.user
6. Call next()
```

**Role Authorization**:
```javascript
// Admin-only routes
router.use(authorize('admin'));

authorize middleware:
1. Check if req.user.role matches allowed roles
2. Return 403 if not authorized
3. Call next() if authorized
```

### 4. Database Schema (8 Tables)

**users** - User accounts
```sql
- id, email, password_hash, full_name, role (client/freelancer/admin)
- profile_photo, bio, phone, location, preferred_language
- rating, total_jobs_completed, is_active
```

**jobs** - Job postings
```sql
- id, client_id (FK to users), title, description, category
- budget, deadline, status (open/in_progress/completed/cancelled)
- required_skills, views_count, submissions_count
```

**job_skills** - Job required skills (Many-to-Many)
```sql
- job_id (FK), skill_name
```

**user_skills** - Freelancer skills (Many-to-Many)
```sql
- user_id (FK), skill_name, proficiency_level
```

**submissions** - Job applications
```sql
- id, job_id (FK), freelancer_id (FK), description
- status (pending/approved/rejected), rating, client_feedback
```

**payments** - Stripe transactions
```sql
- id, job_id (FK), submission_id (FK), client_id (FK), freelancer_id (FK)
- amount, stripe_payment_intent_id, status (pending/held/released/refunded)
```

**messages** - Chat messages
```sql
- id, job_id (FK), sender_id (FK), receiver_id (FK)
- message_text, attachments, is_read
```

**notifications** - User notifications
```sql
- id, user_id (FK), type, title, message, is_read
```

### 5. API Routes

#### Auth Routes (`/api/auth`)
```
POST   /register              - Create new account
POST   /login                 - Authenticate user
GET    /me                    - Get current user (protected)
PUT    /update                - Update profile (protected)
PUT    /change-password       - Change password (protected)
PUT    /skills                - Update skills (protected)
```

#### Admin Routes (`/api/admin` - Admin only)
```
GET    /analytics/users       - User statistics & charts
GET    /users                 - All users (paginated, filterable)
GET    /users/:role           - Users by role
PUT    /users/:id/toggle-status - Activate/deactivate user
DELETE /users/:id             - Delete user
```

#### Job Routes (`/api/jobs`)
```
GET    /                      - All jobs (optional auth, filterable)
GET    /categories            - Job categories list
GET    /:id                   - Single job details
POST   /                      - Create job (client only)
PUT    /:id                   - Update job (owner only)
DELETE /:id                   - Delete job (owner only)
GET    /my/posted             - My posted jobs (client only)
GET    /recommendations/ai    - AI job recommendations (freelancer only)
```

#### Submission Routes (`/api/submissions`)
```
POST   /                      - Submit application (freelancer only)
GET    /job/:jobId            - Job submissions (client only)
GET    /my                    - My submissions (freelancer only)
PUT    /:id                   - Update submission
PUT    /:id/status            - Approve/reject (client only)
DELETE /:id                   - Delete submission
```

#### Payment Routes (`/api/payments`)
```
POST   /create-intent         - Create Stripe payment (client only)
POST   /webhook               - Stripe webhook (raw body)
POST   /:id/release           - Release held payment (admin only)
POST   /:id/refund            - Refund payment (admin only)
GET    /history               - Payment history (protected)
GET    /:id                   - Payment details (protected)
```

#### Message Routes (`/api/messages`)
```
GET    /job/:jobId            - Job messages (protected)
POST   /                      - Send message (protected)
PUT    /:id/read              - Mark as read (protected)
DELETE /:id                   - Delete message (protected)
```

### 6. Real-time Chat (Socket.io)

**Connection Flow**:
```javascript
// Client connects with userId
socket.handshake.auth = { userId: 123 }

// Server authenticates
io.use(async (socket, next) => {
  1. Extract userId from handshake
  2. Verify user exists in database
  3. Attach user data to socket
  4. Call next() or reject with error
});

// On connection
- Store user in activeUsers Map
- Join user to personal room: "user:{userId}"
- Emit 'connected' event
```

**Events**:
```javascript
// Join job chat room
socket.on('join:job', { job_id })
  → Verify authorization (client or submitted freelancer)
  → Join room: "job:{job_id}"
  → Emit 'joined:job'

// Send message
socket.on('message:send', { job_id, receiver_id, message_text, attachments })
  → Verify authorization
  → Save to database
  → Emit to room: "job:{job_id}" → 'message:new'
  → Emit to receiver: "user:{receiver_id}" → 'message:received'

// Mark as read
socket.on('message:read', { message_id })
  → Update database
  → Emit to sender

// Typing indicator
socket.on('typing:start', { job_id, receiver_id })
  → Emit to receiver → 'typing:user'
```

### 7. Payment Integration (Stripe)

**Payment Flow**:
```javascript
1. Client creates payment intent
   POST /api/payments/create-intent
   Body: { job_id, submission_id, amount }
   
   Process:
   - Create Stripe PaymentIntent
   - Store in database (status: 'pending')
   - Return client_secret for frontend

2. Client completes payment (frontend with Stripe.js)

3. Stripe sends webhook
   POST /api/payments/webhook
   
   Process:
   - Verify webhook signature
   - Handle 'payment_intent.succeeded' event
   - Update payment status to 'held'
   - Notify freelancer

4. Admin releases payment after delivery
   POST /api/payments/:id/release
   
   Process:
   - Transfer funds to freelancer (Stripe Connect)
   - Update status to 'released'
   - Update user stats
```

### 8. AI Recommendations (Google Gemini)

**Job Matching Algorithm**:
```javascript
GET /api/jobs/recommendations/ai (freelancer only)

Process:
1. Fetch freelancer profile (skills, rating, completed jobs)
2. Fetch all open jobs (last 50)
3. Build AI prompt with:
   - Freelancer skills & proficiency levels
   - Job history & categories
   - Available jobs list
4. Send to Gemini AI with instruction:
   "Recommend TOP 10 jobs based on skill match, experience, budget"
5. Parse AI response (JSON array of job IDs)
6. Return ranked job list

Example prompt:
"Freelancer Skills: JavaScript (expert), React (advanced)...
 Available Jobs: [1. React Developer, 2. PHP Website...]
 Return: [1, 5, 3, ...] (job IDs in order)"
```

### 9. Validation Layer

**Input Validation** (express-validator):
```javascript
// Registration
- email: Valid email format
- password: Min 8 chars, uppercase, lowercase, number, special char
- full_name: Min 2 chars
- role: Must be 'client' or 'freelancer'

// Job Creation
- title: 5-500 chars
- description: Min 20 chars
- category: Required
- budget: Min 10 TND
- deadline: ISO8601 date format

// Submissions
- description: Min 20 chars
- job_id: Valid integer

// Messages
- message_text: 1-5000 chars
- job_id, receiver_id: Valid integers
```

### 10. Error Handling

**Global Error Handler**:
```javascript
errorHandler(err, req, res, next) {
  // MySQL errors
  - ER_DUP_ENTRY → 400 "Duplicate entry"
  - ER_NO_REFERENCED_ROW_2 → 404 "Resource not found"
  
  // JWT errors
  - JsonWebTokenError → 401 "Invalid token"
  - TokenExpiredError → 401 "Token expired"
  
  // Default → 500 "Server Error"
  
  Response format:
  {
    success: false,
    message: "Error message",
    stack: "..." (development only)
  }
}
```

## Environment Variables (.env)
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tunisian_freelancers

# JWT
JWT_SECRET=your_random_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup Database
```bash
# Create database and tables
npm run db:setup

# Seed demo data (3 clients, 5 freelancers, 8 jobs)
npm run db:seed

# Create admin user
node scripts/createAdmin.js
```

### 4. Start Server
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

## API Testing

### Health Check
```bash
GET http://localhost:5000/health
Response: { success: true, message: "Server is running" }
```

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123",
  "full_name": "Test User",
  "role": "freelancer",
  "location": "Tunis"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123"
}

Response: { token: "eyJhbGc...", user: {...} }
```

### Protected Request
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGc...

Response: { success: true, data: { user: {...} } }
```

## Security Features

1. **Password Security**: bcrypt hashing (10 rounds)
2. **JWT Tokens**: 7-day expiry, secret key verification
3. **HTTP Security**: Helmet middleware (XSS, CSRF protection)
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Configured for specific frontend origin
6. **Input Validation**: Express-validator on all inputs
7. **SQL Injection**: Parameterized queries with mysql2
8. **Role-Based Access**: Middleware authorization checks
9. **Account Status**: Active/inactive flag enforcement
10. **Error Sanitization**: No stack traces in production

## Performance Optimizations

1. **Connection Pooling**: MySQL pool (10 connections)
2. **Database Indexes**: On email, role, rating, status, created_at
3. **Transaction Support**: Atomic operations for payments
4. **Query Optimization**: JOIN queries, LIMIT clauses
5. **Async/Await**: Non-blocking operations
6. **Socket.io Rooms**: Targeted message broadcasting

## Common Operations

### Create Admin User
```bash
node scripts/createAdmin.js
# Creates: admin@tunisianfreelancers.com / Admin@123
```

### Reset Database
```bash
# Drop all tables and recreate
mysql -u root -p tunisian_freelancers < database/schema.sql
mysql -u root -p tunisian_freelancers < database/seed.sql
```

### View Logs
Server logs all:
- Database connections
- Socket.io connections/disconnections
- API requests (in development)
- Errors with stack traces

## Troubleshooting

**Database Connection Failed**:
- Check MySQL is running: `mysql -u root -p`
- Verify .env credentials
- Check database exists: `SHOW DATABASES;`

**JWT Invalid Token**:
- Token expired (7 days)
- Wrong JWT_SECRET in .env
- Token not sent in header

**Socket.io Not Connecting**:
- Check CORS configuration
- Verify userId in handshake.auth
- Check user exists and is active

**Stripe Webhook Failed**:
- Verify STRIPE_WEBHOOK_SECRET
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:5000/api/payments/webhook`

## Demo Accounts

**Clients**:
- client1@example.com / Test@123 (Ahmed Ben Salem)
- client2@example.com / Test@123 (Fatma Gharbi)
- client3@example.com / Test@123 (Mohamed Trabelsi)

**Freelancers**:
- freelancer1@example.com / Test@123 (Youssef Mansour - Developer)
- freelancer2@example.com / Test@123 (Salma Karoui - Designer)
- freelancer3@example.com / Test@123 (Amine Bouazizi - Writer)

**Admin**:
- admin@tunisianfreelancers.com / Admin@123

---

**Documentation Version**: 1.0.0  
**Last Updated**: November 15, 2025  
**API Version**: v1
