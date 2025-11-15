# 🚀 Quick Start Guide - MongoDB Atlas Backend

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free tier)
- Internet connection

---

## Step 1: MongoDB Atlas Setup (3 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create M0 FREE cluster
4. Create database user (save credentials!)
5. Whitelist IP: 0.0.0.0/0 (Allow all for development)
6. Click "Connect" → "Connect your application"
7. Copy connection string

---

## Step 2: Backend Configuration (1 minute)

```bash
cd backend

# Copy environment file
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Other variables (keep defaults or update)
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_key
CLIENT_URL=http://localhost:3000
```

**IMPORTANT**: Replace `YOUR_USER`, `YOUR_PASSWORD`, and cluster URL!

---

## Step 3: Install & Run (1 minute)

```bash
# Install dependencies (includes mongoose)
npm install

# Seed demo data
npm run db:seed

# Create admin user
npm run admin:create

# Start server
npm run dev
```

---

## ✅ Success Indicators

You should see:
```
✅ MongoDB Atlas connected successfully
   Database: tunisian_freelancers
   Host: cluster0.xxxxx.mongodb.net
🚀 Tunisian Top Freelancers Platform - Backend API
   Server: http://localhost:5000
```

---

## 🧪 Test Your Setup

### 1. Health Check
```bash
curl http://localhost:5000/api
```

Expected: `{"success":true,"message":"API is running"}`

### 2. Login with Demo Account
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client1@example.com",
    "password": "Test@123"
  }'
```

Expected: JWT token in response

### 3. View Jobs
```bash
curl http://localhost:5000/api/jobs
```

Expected: List of 6 jobs

---

## 👥 Demo Accounts

### Clients
- client1@example.com / Test@123
- client2@example.com / Test@123
- client3@example.com / Test@123

### Freelancers
- freelancer1@example.com / Test@123
- freelancer2@example.com / Test@123
- freelancer3@example.com / Test@123
- freelancer4@example.com / Test@123
- freelancer5@example.com / Test@123

### Admin
- admin@tunisianfreelancers.com / Admin@123

---

## 📊 Database Content After Seeding

- ✅ 8 Users (3 clients + 5 freelancers)
- ✅ 6 Jobs (various categories)
- ✅ 3 Submissions
- ✅ 1 Payment

---

## 🛠️ Common Issues

### Issue: "MongoServerSelectionError"
**Solution**: Check MONGODB_URI in .env file and network access in Atlas

### Issue: "Authentication failed"
**Solution**: Verify username/password in connection string

### Issue: "Cannot find module 'mongoose'"
**Solution**: Run `npm install` to install dependencies

### Issue: Port 5000 already in use
**Solution**: Change PORT in .env file or kill process using port 5000

---

## 📦 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server (production) |
| `npm run dev` | Start with nodemon (development) |
| `npm run db:seed` | Populate database with demo data |
| `npm run admin:create` | Create admin account |

---

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - List all jobs
- GET `/api/jobs/:id` - Get job details
- POST `/api/jobs` - Create job (client only)
- PUT `/api/jobs/:id` - Update job
- DELETE `/api/jobs/:id` - Delete job

### Submissions
- POST `/api/submissions` - Submit to job (freelancer)
- GET `/api/submissions/job/:jobId` - View submissions
- PUT `/api/submissions/:id/status` - Accept/Reject

### Messages
- GET `/api/messages/:jobId` - Get messages
- POST `/api/messages` - Send message

### Payments
- POST `/api/payments/intent` - Create payment (Stripe)
- GET `/api/payments/history` - Payment history

### Admin
- GET `/api/admin/users` - List all users
- GET `/api/admin/analytics/users` - User analytics
- PUT `/api/admin/users/:id/toggle-status` - Activate/Deactivate user

---

## 🔍 View Database

### Option 1: MongoDB Atlas Web UI
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. View collections: users, jobs, submissions, payments, messages

### Option 2: MongoDB Compass (Desktop App)
1. Download from https://www.mongodb.com/try/download/compass
2. Connect using your MONGODB_URI
3. Visual interface to browse and edit data

---

## 📚 Next Steps

1. ✅ Backend is ready - test all API endpoints
2. 🎨 Start frontend development (React + Vite)
3. 🔒 Update security settings in production
4. 🚀 Deploy to cloud platform (Render, Railway, etc.)

---

## 📖 Documentation

- **Complete Setup**: `MONGODB_SETUP.md`
- **Migration Details**: `MIGRATION_COMPLETE.md`
- **Backend README**: `BACKEND_README.md`
- **API Reference**: See Backend README

---

## 💡 Pro Tips

1. **MongoDB Compass**: Install for visual database management
2. **Postman**: Use for API testing
3. **Environment Variables**: Never commit `.env` to Git
4. **Free Tier Limit**: 512MB storage on M0 cluster
5. **Connection String**: Keep it secret, keep it safe!

---

## 🆘 Need Help?

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- Atlas Support: https://www.mongodb.com/support

---

**Ready to Go!** 🎉

Your backend is now running with MongoDB Atlas. The platform complies with CS324 Deliverable 5 requirements.

Happy coding! 💻
