# Tunisian Top Freelancers

**Tunisian Top Freelancers** is a secure freelance marketplace where clients (local and global) post jobs paid via legally-compliant Tunisian PSPs (Konnect, Paymee, PayMaster, Zitouna, GPGCheckout), in EUR or TND, using escrow. Freelancers submit their work (screenshots/files), and funds are released only when the client accepts — all on a 0% commission platform.

## 🚀 Mission

To provide a trusted, zero-commission platform for Tunisian freelancers to work with both local and international clients, backed by legal and secure Tunisian payment infrastructure.

## 🎯 Target Users

- **Clients**: Entrepreneurs, startups, agencies, SMEs around the world who want to utilize Tunisian talent.
- **Freelancers**: Tunisian developers, designers, writers, translators, and professionals looking for remote paid work.

## ✨ Core Features

- **Job Posting**: Clients fill a form, choose budget in EUR or TND, and fund escrow using Konnect, Paymee, etc.
- **Public Job Board**: All open jobs are listed publicly, filterable by category, currency, budget, and deadline.
- **Submission System**: Freelancers upload screenshots, PDFs, ZIPs, or links to completed work.
- **Payment & Escrow**: Funds are stored in escrow via PSPs; released when job is accepted.
- **0% Platform Fee**: No fee for client or freelancer – clients pay exactly what they set, freelancers get everything (minus payment processor fee).
- **Multi-Currency Support**: Show and accept EUR and TND, with real-time conversion display.

## 💳 Payment & Escrow Infrastructure

Integrates **Konnect, Paymee, PayMaster, Zitouna Payment / IZI, GPGCheckout**.

**Payment flow:**
1. Client posts job
2. Client funds escrow via PSP
3. Freelancer submits work
4. Client accepts
5. Escrow is released — freelancer is paid

**Escrow policy**: Manual release by default, with optional auto-release after a configurable number of days.
**Transparent fee handling**: Show processor fee to client at payment, clearly stating “Platform fee: 0%, Processor fee: …”.

## ⚖️ Regulatory & Compliance

- Business must be legally registered in Tunisia (or compatible jurisdiction).
- KYC required for freelancer ID + client (especially for large amounts).
- Store data securely (HTTPS, encryption).
- Use PSPs that support holding funds (escrow).
- Comply with foreign exchange / cross-border payment rules.
- Provide Terms of Service, Privacy Policy, and Dispute Policy covering financial flows, refunds, and escrow.

## 🛠 Technical Architecture

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js / Express
- **Database**: MongoDB
- **File Storage**: S3-compatible storage with virus scanning
- **Payments**: Connect to Konnect, Paymee, PayMaster, etc. via their API / SDK
- **Hosting**: Cloud provider (DigitalOcean / AWS / GCP)

## 🛡 Trust & Dispute Mechanism

- Clients can open disputes for incorrect or incomplete work.
- **Admin reviews**: Job description, submission, metadata, conversation.
- **Decisions**: Full refund, partial refund, resubmit, or release funds.
- **Appeal**: One internal appeal allowed.

## 📈 Launch Strategy

1. **MVP phase**: Only core features + sandbox payments.
2. **Onboard initial clients and freelancers manually**.
3. **Use a landing page + outreach** (LinkedIn, FB, local communities).
4. **Once critical mass**, launch for the public.
5. **Monetize via premium/add-on services** — keep base 0% commission.

## 📚 CS324 Project Deliverables

This project was developed as part of CS324 course requirements. View detailed documentation for each deliverable:

- ✅ **[Deliverable 1: Development Environment Setup](docs/README_DELIVERABLE_1.md)**
  - React + Vite project setup
  - GitHub repository initialization
  - Dependencies installation
  - Project folder structure

- ✅ **[Deliverable 2: Static Components with Mock Data](docs/README_DELIVERABLE_2.md)**
  - Component-based architecture
  - Reusable components (Navbar, Footer, LoadingSpinner)
  - Page components with mock data
  - Props and event handling

- ✅ **[Deliverable 3: Dynamic State & API Integration](docs/README_DELIVERABLE_3.md)**
  - React Hooks (useState, useEffect, useContext)
  - Axios HTTP client integration
  - AuthContext for global state
  - React Router navigation
  - API service layer

- ✅ **[Deliverable 4: Styling & Responsive Layout](docs/README_DELIVERABLE_4.md)**
  - Tailwind CSS integration
  - Mobile-first responsive design
  - Dark theme implementation
  - Custom animations and transitions
  - Consistent design system

- ✅ **[Deliverable 5: Backend Development & Database Integration](docs/README_DELIVERABLE_5.md)**
  - MongoDB Atlas setup
  - Mongoose schemas (6 models)
  - RESTful API (25+ endpoints)
  - CRUD operations
  - JWT authentication
  - Stripe payment integration
  - Postman API testing

## Features (Legacy)

- **Free Job Posting**: Clients post unlimited gigs at no cost
- **Secure Payments**: Stripe integration with escrow protection
- **AI-Powered Recommendations**: Gemini API for personalized job matching
- **Real-Time Chat**: Socket.io powered messaging
- **Multilingual**: Arabic, French, and English support
- **Role-Based Access**: Client, Freelancer, and Admin dashboards
- **Zero Scams**: Payment released only after work approval

## Tech Stack

### Backend
- Node.js + Express
- **MongoDB Atlas** (Cloud Database)
- **Mongoose ODM**
- JWT Authentication
- **Tunisian PSP Integration** (Konnect, Paymee, etc.)
- **REST API** (Pure Express endpoints)
- Gemini AI API Integration

### Frontend
- React 18+ with Hooks
- React Router v6
- Tailwind CSS
- react-i18next (Multilingual)
- Axios for API calls

## Prerequisites

- Node.js (v16 or higher)
- **MongoDB Atlas Account** (Free tier available)
- **Tunisian PSP Account** (Konnect/Paymee for payments)
- Google AI Studio Account (for Gemini API key)

## Environment Variables

Create `.env` file in backend directory:

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance_platform
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tunisian_freelancers
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
# Payment Gateway Keys (Replace with your PSP keys)
PSP_API_KEY=your_psp_api_key
PSP_SECRET_KEY=your_psp_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

**Option 1: Using MySQL CLI**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE tunisian_freelancers;
USE tunisian_freelancers;

# Run schema
source backend/database/schema.sql;

# Run seed data (optional)
source backend/database/seed.sql;
```

**Option 2: Using VS Code SQLTools Extension**
1. Install SQLTools and MySQL/MariaDB driver extension
2. Create new connection to your MySQL server
3. Open `backend/database/schema.sql`
4. Execute the SQL file
5. Open `backend/database/seed.sql` and execute

**Option 3: Using npm script**
```bash
cd backend
npm run db:setup
```

### 3. Run the Application

**Development Mode (Concurrent)**
```bash
# From root directory
npm install
npm run dev
```

**Separate Terminals**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs (if implemented)

## Project Structure

```
Project_React2025/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── submissionController.js
│   │   ├── paymentController.js
│   │   ├── messageController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── submissions.js
│   │   ├── payments.js
│   │   ├── messages.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── services/
│   │   ├── aiRecommendation.js
│   │   ├── emailService.js
│   │   └── fileUpload.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── migrations/
│   ├── socket/
│   │   └── chatHandler.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── jobs/
│   │   │   ├── submissions/
│   │   │   ├── chat/
│   │   │   ├── payments/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── FreelancerDashboard.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useSocket.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   └── helpers.js
│   │   ├── i18n/
│   │   │   ├── config.js
│   │   │   └── translations/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Client only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/recommendations` - Get AI recommendations (Freelancer)

### Submissions
- `POST /api/submissions` - Submit work for a job
- `GET /api/submissions/job/:jobId` - Get submissions for a job
- `PUT /api/submissions/:id/approve` - Approve submission (Client)
- `PUT /api/submissions/:id/reject` - Reject submission (Client)

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/history` - Get payment history

### Messages
- `GET /api/messages/:jobId` - Get messages for a job
- `POST /api/messages` - Send message (via Socket.io)

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/jobs` - Manage jobs
- `GET /api/admin/payments` - View payments

## Database Schema

See `backend/database/schema.sql` for complete schema including:
- users
- jobs
- submissions
- payments
- messages
- job_skills
- user_skills

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- Rate limiting on API endpoints
- CORS configuration
- Secure payment processing via Stripe
- File upload validation

## Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Configure MySQL database
3. Run migrations
4. Deploy application

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build production bundle: `npm run build`
2. Set environment variables
3. Deploy build folder

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - Free to use for educational and commercial purposes

## Support

For issues and questions:
- Open GitHub issue
- Email: support@tunisiantopfreelancers.com

---

**Built with ❤️ for the Tunisian freelance community**
