# 🚀 Developer Quick Reference

Quick commands and tips for daily development on Tunisian Top Freelancers.

---

## 📦 Installation & Setup

```powershell
# Quick setup (run from project root)
.\setup.ps1

# Or manual installation
npm install                    # Install root dependencies
cd backend && npm install      # Install backend
cd ../frontend && npm install  # Install frontend

# Setup database
npm run db:setup              # Create database and schema
npm run db:seed               # Load sample data (optional)
```

---

## 🏃 Running the Application

```powershell
# Start both frontend and backend (recommended)
npm run dev

# Or start individually
npm run dev:backend           # Backend only (port 5000)
npm run dev:frontend          # Frontend only (port 3000)

# From specific directories
cd backend && npm run dev
cd frontend && npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

---

## 🧪 Test Accounts (After Seeding)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@tunisiantopfreelancers.com | Admin@123 | Platform admin |
| Client | client1@example.com | Test@123 | Employer account |
| Freelancer | freelancer1@example.com | Test@123 | Contractor account |

---

## 🛠️ Common Development Tasks

### Database Operations

```powershell
# Reset database (drops and recreates)
npm run db:setup

# Reload sample data
npm run db:seed

# Connect to MySQL CLI
mysql -u root -p tunisian_freelancers

# Backup database
mysqldump -u root -p tunisian_freelancers > backup.sql

# Restore database
mysql -u root -p tunisian_freelancers < backup.sql
```

### Code Quality

```powershell
# Run linters
npm run lint                  # Both frontend and backend
npm run lint:backend          # Backend only
npm run lint:frontend         # Frontend only

# Format code (if configured)
npm run format
```

### Testing

```powershell
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Watch mode
npm run test:watch
```

---

## 📂 Project Structure Reference

```
Project_React2025/
├── backend/
│   ├── config/              # Database, Stripe, JWT configs
│   ├── controllers/         # Route handlers (auth, jobs, payments, etc.)
│   ├── database/            # SQL files (schema.sql, seed.sql)
│   ├── middleware/          # Auth, validation, error handling
│   ├── routes/              # Express routes
│   ├── services/            # Business logic (AI recommendations)
│   ├── socket/              # Socket.io handlers
│   ├── scripts/             # Utility scripts (setup, seed)
│   ├── uploads/             # User uploaded files
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── common/      # Shared components
│   │   ├── context/         # React contexts (AuthContext)
│   │   ├── i18n/            # Translations (AR, FR, EN)
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API, Socket services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json             # Root workspace commands
├── README.md                # Full documentation
├── SETUP_GUIDE.md           # Installation guide
├── PROJECT_STATUS.md        # Feature tracking
└── QUICK_REFERENCE.md       # This file
```

---

## 🔗 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user profile
PUT    /api/auth/profile           Update profile
PUT    /api/auth/password          Change password
PUT    /api/auth/skills            Update skills (freelancers)
```

### Jobs
```
GET    /api/jobs                   List all jobs (with filters)
GET    /api/jobs/:id               Get job details
POST   /api/jobs                   Create job (clients only)
PUT    /api/jobs/:id               Update job (owner only)
DELETE /api/jobs/:id               Delete job (owner only)
GET    /api/jobs/my/posted         Get user's posted jobs
GET    /api/jobs/categories        Get all categories
GET    /api/jobs/recommendations/ai Get AI recommendations (freelancers)
```

### Submissions
```
POST   /api/submissions            Submit work to job
GET    /api/submissions/job/:id    Get submissions for job (owner only)
PUT    /api/submissions/:id/approve   Approve submission (client only)
PUT    /api/submissions/:id/reject    Reject submission (client only)
PUT    /api/submissions/:id/revision  Request revision (client only)
```

### Payments
```
POST   /api/payments/create-intent    Create Stripe payment intent
POST   /api/payments/webhook          Stripe webhook handler
POST   /api/payments/release/:id      Release escrow (admin only)
POST   /api/payments/refund/:id       Refund payment (admin only)
GET    /api/payments/history          Get payment history
```

### Messages
```
GET    /api/messages/job/:id          Get messages for job
POST   /api/messages                  Send message
GET    /api/messages/conversations    Get all conversations
GET    /api/messages/unread-count     Get unread message count
PUT    /api/messages/:id/read         Mark message as read
```

---

## 🌐 Socket.io Events

### Client → Server
```javascript
// Join a job's chat room
socket.emit('join:job', { job_id: 123 });

// Send a message
socket.emit('message:send', {
  job_id: 123,
  receiver_id: 456,
  message_text: 'Hello!',
  attachments: []
});

// Typing indicators
socket.emit('typing:start', { job_id: 123 });
socket.emit('typing:stop', { job_id: 123 });
```

### Server → Client
```javascript
// New message received
socket.on('message:new', (message) => {});

// User typing
socket.on('typing:start', ({ user_id, job_id }) => {});
socket.on('typing:stop', ({ user_id, job_id }) => {});

// Room joined confirmation
socket.on('room:joined', ({ job_id }) => {});

// Errors
socket.on('error', ({ message }) => {});
```

---

## 🎨 Frontend Development Tips

### Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) return <Login />;
  
  return <div>Welcome {user.full_name}</div>;
}
```

### Making API Calls
```jsx
import api from '../services/api';

// GET request
const jobs = await api.get('/jobs');

// POST request
const newJob = await api.post('/jobs', { title: 'New Job', ... });

// Error handling
try {
  const data = await api.get('/jobs');
} catch (error) {
  console.error(error.response?.data?.message);
}
```

### Using Socket Service
```jsx
import socketService from '../services/socket';

// Connect (usually in AuthContext)
socketService.connect(user.user_id);

// Join job room
socketService.joinJob(jobId);

// Send message
socketService.sendMessage(jobId, receiverId, messageText);

// Listen for messages
socketService.onNewMessage((message) => {
  console.log('New message:', message);
});

// Disconnect
socketService.disconnect();
```

### Translations
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </div>
  );
}
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tunisian_freelancers
JWT_SECRET=your_secret_key_32_chars_min
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GEMINI_API_KEY=AIza...
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🐛 Debugging Tips

### Backend Debugging

```javascript
// Enable detailed SQL query logging
// In config/db.js, log queries:
pool.on('connection', (connection) => {
  console.log('DB Connection established');
});
```

```powershell
# Check backend logs
npm run dev            # Shows console output

# Check database connections
mysql -u root -p -e "SHOW PROCESSLIST;"
```

### Frontend Debugging

```jsx
// Check auth state
console.log('Auth State:', useAuth());

// Check API calls in browser
// Open DevTools → Network → XHR

// Check socket connection
socketService.socket?.connected  // true if connected
```

### Common Issues

**Port already in use:**
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database connection failed:**
```powershell
# Check MySQL is running
services.msc          # Look for MySQL80

# Test connection
mysql -u root -p
```

**CORS errors:**
- Check CLIENT_URL in backend/.env matches frontend URL
- Restart backend after changing .env

---

## 📦 Useful npm Scripts

```powershell
# Root (run from project root)
npm run dev                    # Start both servers
npm run install:all            # Install all dependencies
npm run db:setup               # Setup database
npm run db:seed                # Seed sample data

# Backend (from backend/)
npm run dev                    # Start with nodemon
npm start                      # Production start
npm run db:setup               # Run setup script
npm run db:seed                # Run seed script

# Frontend (from frontend/)
npm run dev                    # Start Vite dev server
npm run build                  # Production build
npm run preview                # Preview production build
```

---

## 🚀 Deployment Quick Start

### Railway (Recommended)

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Add environment variables in Railway dashboard
# Then deploy frontend separately to Vercel/Netlify
```

### Vercel (Frontend)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

---

## 📚 External Resources

- **Stripe Docs**: https://stripe.com/docs
- **Socket.io Docs**: https://socket.io/docs/v4/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **i18next**: https://www.i18next.com/
- **Gemini API**: https://ai.google.dev/docs

---

## 🆘 Getting Help

1. Check `README.md` for comprehensive documentation
2. Check `SETUP_GUIDE.md` for installation issues
3. Check `PROJECT_STATUS.md` for feature status
4. Search issues in project repository
5. Check browser console for frontend errors
6. Check terminal for backend errors

---

**Happy Coding! 🎉**
