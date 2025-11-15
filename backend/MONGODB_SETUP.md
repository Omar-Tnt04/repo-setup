# MongoDB Atlas Setup Guide

## Overview
This backend now uses **MongoDB Atlas** (cloud-hosted MongoDB) instead of MySQL, as specified in CS324 Deliverable 5.

---

## 🚀 Quick Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (M0 Sandbox - 512MB storage, free forever)
3. Verify your email address

### 2. Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select cloud provider (AWS recommended)
4. Choose region closest to you (e.g., Europe - Frankfurt)
5. Name your cluster (e.g., `Cluster0`)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### 3. Configure Database Access
1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username (e.g., `adminUser`)
5. Generate a secure password or create your own
6. **IMPORTANT**: Save this password securely!
7. Set privileges to **"Atlas Admin"** or **"Read and write to any database"**
8. Click **"Add User"**

### 4. Configure Network Access
1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Option A: For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Option B: Add your current IP address only (more secure)
5. Click **"Confirm"**

### 5. Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configure Backend
1. Open `backend/.env` file
2. Replace the placeholders in your connection string:
   ```env
   MONGODB_URI=mongodb+srv://adminUser:your_password@cluster0.xxxxx.mongodb.net/tunisian_freelancers?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<cluster>` with your cluster name
   - Add `/tunisian_freelancers` after `.net` to specify database name

---

## 📦 Install Dependencies

```bash
cd backend
npm install
```

This will install `mongoose` (MongoDB ODM) instead of `mysql2`.

---

## 🌱 Seed Database

Run the seed script to populate MongoDB with demo data:

```bash
npm run db:seed
```

This creates:
- ✅ 3 Clients (Ahmed, Fatma, Mohamed)
- ✅ 5 Freelancers (Youssef, Salma, Amine, Nadia, Karim) with skills
- ✅ 6 Jobs (Web Dev, Design, Writing, etc.)
- ✅ 3 Submissions (job applications)
- ✅ 1 Payment (sample transaction)

---

## 👤 Create Admin User

```bash
node scripts/createAdmin.js
```

Creates admin account:
- **Email**: `admin@tunisianfreelancers.com`
- **Password**: `Admin@123`

---

## 🏃 Start Server

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

You should see:
```
✅ MongoDB Atlas connected successfully
   Database: tunisian_freelancers
   Host: cluster0.xxxxx.mongodb.net
🚀 Tunisian Top Freelancers Platform - Backend API
   Server: http://localhost:5000
```

---

## 📊 View Data in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. Select `tunisian_freelancers` database
4. View collections: `users`, `jobs`, `submissions`, `payments`, `messages`, `notifications`

---

## 🔍 MongoDB vs MySQL Changes

### Connection
**Before (MySQL)**:
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host, user, password, database });
```

**After (MongoDB)**:
```javascript
const mongoose = require('mongoose');
await mongoose.connect(MONGODB_URI);
```

### Data Models
**Before (MySQL)**: SQL tables with foreign keys
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  ...
);
```

**After (MongoDB)**: Mongoose schemas
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  ...
});
```

### Queries
**Before (MySQL)**:
```javascript
const users = await query('SELECT * FROM users WHERE email = ?', [email]);
const user = users[0];
```

**After (MongoDB)**:
```javascript
const user = await User.findOne({ email });
```

### IDs
- **MySQL**: Integer IDs (`id: 1, 2, 3...`)
- **MongoDB**: ObjectId strings (`_id: "507f1f77bcf86cd799439011"`)
  - Virtual `id` field added for compatibility

---

## 📁 New File Structure

```
backend/
├── models/                    # NEW: Mongoose schemas
│   ├── User.js               # User model
│   ├── Job.js                # Job model
│   ├── Submission.js         # Submission model
│   ├── Payment.js            # Payment model
│   ├── Message.js            # Message model
│   ├── Notification.js       # Notification model
│   └── index.js              # Export all models
│
├── config/
│   └── db.js                 # UPDATED: MongoDB connection
│
├── controllers/              # UPDATED: Use Mongoose models
│   ├── authController.js     # ✅ Updated
│   └── ...
│
└── middleware/
    └── auth.js               # UPDATED: Use Mongoose
```

---

## 🛠️ MongoDB Compass (Optional GUI)

Download [MongoDB Compass](https://www.mongodb.com/try/download/compass) for a visual database interface:

1. Install MongoDB Compass
2. Open Compass
3. Paste your connection string
4. Click **"Connect"**
5. Browse and edit data visually

---

## ⚠️ Common Issues

### Connection Timeout
```
Error: MongoServerSelectionError
```
**Solution**: 
- Check Network Access whitelist in Atlas
- Verify connection string is correct
- Ensure cluster is running (not paused)

### Authentication Failed
```
Error: Authentication failed
```
**Solution**:
- Verify username/password in connection string
- Check user has correct permissions
- Special characters in password must be URL-encoded

### Database Not Found
```
No collections showing
```
**Solution**:
- Run `npm run db:seed` to create collections
- MongoDB creates database on first write

---

## 📊 MongoDB Atlas Dashboard Features

- **Metrics**: Monitor performance, connections, queries
- **Real-time Performance Panel**: See live query performance
- **Backup & Restore**: Automatic backups (paid tiers)
- **Alerts**: Get notified of issues
- **Charts**: Visualize your data

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** to Git (use `.env.example`)
2. **Use strong passwords** for database users
3. **Restrict IP Access** (don't use 0.0.0.0/0 in production)
4. **Rotate credentials** periodically
5. **Enable 2FA** on MongoDB Atlas account
6. **Use read-only users** for analytics

---

## 💡 Free Tier Limits

MongoDB Atlas M0 (Free):
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Never expires
- ❌ No backups
- ❌ No performance auto-scaling

For production, upgrade to M10+ tier.

---

## 📞 Support

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB University (Free Courses): https://university.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/

---

**Last Updated**: November 15, 2025  
**MongoDB Version**: 7.0+  
**Mongoose Version**: 8.0+
