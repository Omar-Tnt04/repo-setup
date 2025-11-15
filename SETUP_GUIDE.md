# 🚀 Tunisian Top Freelancers - Setup Guide

Complete step-by-step guide to get your platform up and running.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)
- **Git** (optional) - [Download](https://git-scm.com/)

### Required Accounts (Free Tier Available)

1. **Stripe Account** - [Sign up](https://stripe.com/)
   - Get your test API keys from the Dashboard
   - Publishable Key: `pk_test_...`
   - Secret Key: `sk_test_...`

2. **Google AI Studio** (for Gemini API) - [Get API Key](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Create new API key (free tier: 60 requests/minute)

---

## 🗄️ Step 1: Database Setup

### Option A: Using MySQL Command Line

```powershell
# 1. Login to MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE tunisian_freelancers;

# 3. Use the database
USE tunisian_freelancers;

# 4. Run schema (from project root)
source backend/database/schema.sql

# 5. (Optional) Load sample data
source backend/database/seed.sql

# 6. Exit MySQL
exit
```

### Option B: Using VS Code with SQLTools Extension

1. **Install SQLTools Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "SQLTools"
   - Install "SQLTools" and "SQLTools MySQL/MariaDB"

2. **Create MySQL Connection**:
   - Click SQLTools icon in sidebar
   - Click "Add New Connection"
   - Select "MySQL"
   - Fill in:
     - Connection name: `Tunisian Freelancers Local`
     - Server: `localhost`
     - Port: `3306`
     - Database: (leave empty for now)
     - Username: `root`
     - Password: (your MySQL password)
   - Click "Test Connection" then "Save Connection"

3. **Create Database**:
   - Connect to your saved connection
   - Click "New SQL File"
   - Run: `CREATE DATABASE tunisian_freelancers;`

4. **Run Schema**:
   - Open `backend/database/schema.sql`
   - Right-click in editor → "Run on active connection"
   - Wait for completion

5. **Run Seed Data** (Optional):
   - Open `backend/database/seed.sql`
   - Right-click in editor → "Run on active connection"

### Option C: Using npm Scripts

```powershell
cd backend
npm run db:setup     # Creates database and schema
npm run db:seed      # Loads sample data (optional)
```

---

## ⚙️ Step 2: Backend Configuration

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in `backend` folder (copy from `.env.example`):

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=tunisian_freelancers

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Gemini AI Configuration
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Frontend URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**⚠️ Important**: Replace ALL placeholder values:
- `YOUR_MYSQL_PASSWORD` → Your actual MySQL password
- `YOUR_STRIPE_SECRET_KEY` → From Stripe Dashboard
- `YOUR_GEMINI_API_KEY` → From Google AI Studio
- `your_super_secret_jwt_key...` → Generate a random 32+ character string

### 3. Test Backend

```powershell
npm run dev
```

You should see:
```
✅ MySQL Database connected successfully
🚀 Server running on http://localhost:5000
```

Test API: Open browser to `http://localhost:5000/health`

---

## 🎨 Step 3: Frontend Configuration

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
```

**⚠️ Important**: Replace `YOUR_STRIPE_PUBLISHABLE_KEY` with your Stripe publishable key.

### 3. Start Frontend

```powershell
npm run dev
```

Frontend will open at `http://localhost:3000`

---

## 🚀 Step 4: Running the Full Application

### Option A: Two Separate Terminals

**Terminal 1 - Backend**:
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```powershell
cd frontend
npm run dev
```

### Option B: Single Command (from project root - setup needed)

Create `package.json` in project root:

```json
{
  "name": "tunisian-freelancers",
  "private": true,
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```powershell
npm install
npm run dev
```

---

## 🧪 Step 5: Testing the Platform

### Test Accounts (if you ran seed data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tunisiantopfreelancers.com | Admin@123 |
| Client | client1@example.com | Test@123 |
| Freelancer | freelancer1@example.com | Test@123 |

### Test Flow

1. **As Client**:
   - Login with client1@example.com
   - Go to "Post a Job"
   - Create a new job
   - View posted jobs in dashboard

2. **As Freelancer**:
   - Login with freelancer1@example.com
   - Browse jobs
   - View job details
   - Submit work (if implemented)

3. **Test Chat** (when socket is connected):
   - Open two browser windows
   - Login as client in one, freelancer in another
   - Navigate to same job
   - Test real-time messaging

---

## 🔧 Troubleshooting

### Database Connection Error

**Error**: `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solution**:
1. Verify MySQL is running:
   ```powershell
   # Windows: Check Services
   services.msc
   # Look for MySQL80 or similar
   ```

2. Test MySQL connection:
   ```powershell
   mysql -u root -p
   ```

3. Check `.env` credentials match MySQL user

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```powershell
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Missing Dependencies

**Error**: `Module not found`

**Solution**:
```powershell
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Stripe Webhook Testing

For local development, use Stripe CLI:

```powershell
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📱 Step 6: Features to Test

### ✅ Implemented Features (Basic)

- [x] User Registration (Client/Freelancer)
- [x] User Login with JWT
- [x] Protected Routes
- [x] Multilingual Support (EN/FR/AR)
- [x] Database Schema with Relations
- [x] RESTful API Endpoints
- [x] Socket.io Real-time Setup
- [x] Stripe Payment Integration Setup
- [x] Gemini AI Service Setup
- [x] Responsive UI with Tailwind

### 🚧 To Be Fully Implemented

- [ ] Complete Job Listing with Filters
- [ ] Job Detail Pages with Submission Forms
- [ ] File Upload (images, documents)
- [ ] Full Dashboard UIs
- [ ] Payment Flow (Intent → Hold → Release)
- [ ] Chat Interface UI
- [ ] AI Job Recommendations Display
- [ ] User Profile Management
- [ ] Admin Dashboard
- [ ] Email Notifications
- [ ] Advanced Search and Filters
- [ ] Rating and Review System

---

## 🎯 Next Steps

1. **Customize Branding**:
   - Update logo in `frontend/public/`
   - Modify color scheme in `tailwind.config.js`
   - Update app name in translations

2. **Implement Remaining Features**:
   - Start with Job Listing Page
   - Then Job Details and Submission
   - Payment Flow
   - Chat Interface

3. **Add More Security**:
   - Implement rate limiting per user
   - Add CAPTCHA on signup
   - Email verification
   - Password reset flow

4. **Optimize Performance**:
   - Add caching (Redis)
   - Optimize database queries
   - Image compression
   - CDN for static assets

5. **Deploy to Production**:
   - Backend: Railway, Render, Heroku
   - Frontend: Vercel, Netlify
   - Database: PlanetScale, Railway MySQL

---

## 📞 Support

- **GitHub Issues**: Create an issue in the repository
- **Email**: support@tunisiantopfreelancers.com (update as needed)
- **Documentation**: See README.md for full documentation

---

## 🎉 Success!

You should now have:
- ✅ Backend API running on http://localhost:5000
- ✅ Frontend app running on http://localhost:3000
- ✅ Database connected with sample data
- ✅ Authentication working
- ✅ Socket.io connected
- ✅ Stripe ready for payments
- ✅ Gemini AI ready for recommendations

**Happy Coding! 🚀 Made with ❤️ for the Tunisian Freelance Community**
