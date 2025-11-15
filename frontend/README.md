# Tunisian Top Freelancers - Frontend

## 📋 Project Overview
Modern, responsive React application for the Tunisian Top Freelancers platform - a freelance marketplace connecting Tunisian clients with skilled freelancers. Features multilingual support (Arabic, French, English), real-time messaging, Stripe payments, and role-based dashboards.

**Technology Stack**: React 18 + Vite + React Router + Tailwind CSS + Socket.io + Stripe

---

## 🎨 Key Features

### Core Functionality
- ✅ **User Authentication**: Register, login, JWT-based sessions
- ✅ **Role-Based Dashboards**: Custom views for clients, freelancers, and admins
- ✅ **Job Management**: Post, browse, search, and filter jobs
- ✅ **Freelancer Profiles**: Browse freelancers with skills, ratings, portfolios
- ✅ **Job Applications**: Submit proposals, track status
- ✅ **Real-time Messaging**: Socket.io chat for job discussions
- ✅ **Payment Integration**: Stripe checkout for secure payments
- ✅ **Admin Panel**: User analytics, management, and moderation
- ✅ **Multilingual**: i18next (Arabic RTL, French, English)
- ✅ **Dark Theme**: Modern dark blue-green aesthetic

### User Roles & Experiences

**Clients** (employers):
- Browse freelancers by skills and ratings
- Post job listings with budget and requirements
- Review job applications
- Chat with freelancers
- Make secure payments
- Rate and review completed work

**Freelancers**:
- Browse available jobs
- Submit proposals with attachments
- Real-time chat with clients
- Receive payments
- Build profile with skills and portfolio
- Get AI-powered job recommendations

**Admins**:
- User analytics dashboard
- User management (activate/deactivate/delete)
- Growth charts and statistics
- Platform moderation

---

## 🏗️ Project Structure

```
frontend/
├── public/                        # Static assets
├── src/
│   ├── main.jsx                  # Application entry point
│   ├── App.jsx                   # Main routing & layout
│   ├── index.css                 # Global styles & Tailwind
│   │
│   ├── components/               # Reusable components
│   │   └── common/
│   │       ├── Navbar.jsx        # Navigation bar with role-based links
│   │       ├── Footer.jsx        # Site footer
│   │       └── LoadingSpinner.jsx # Loading indicator
│   │
│   ├── pages/                    # Page components
│   │   ├── LandingPage.jsx       # Home page with features
│   │   ├── Login.jsx             # Login form
│   │   ├── Signup.jsx            # Registration form
│   │   ├── JobsPage.jsx          # Browse jobs (for freelancers)
│   │   ├── JobDetails.jsx        # Single job view
│   │   ├── CreateJob.jsx         # Post new job (clients)
│   │   ├── BrowseFreelancers.jsx # Browse freelancers (clients)
│   │   ├── Profile.jsx           # User profile management
│   │   ├── MessagesPage.jsx      # Real-time chat
│   │   ├── AdminDashboard.jsx    # Admin analytics panel
│   │   ├── ClientDashboard.jsx   # Client stats (legacy)
│   │   ├── FreelancerDashboard.jsx # Freelancer stats (legacy)
│   │   └── NotFound.jsx          # 404 page
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state (user, token, login/logout)
│   │
│   ├── services/
│   │   ├── api.js                # Axios HTTP client with interceptors
│   │   └── socket.js             # Socket.io client setup
│   │
│   └── i18n/                     # Internationalization
│       ├── config.js             # i18next configuration
│       └── translations/
│           ├── en.json           # English translations
│           ├── fr.json           # French translations
│           └── ar.json           # Arabic translations
│
├── index.html                    # HTML template
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Tailwind CSS customization
├── postcss.config.js            # PostCSS for Tailwind
└── package.json                 # Dependencies and scripts
```

---

## 🎨 Design System

### Color Palette
```css
/* Dark Theme Colors */
--bg-primary: slate-900        /* Main background */
--bg-secondary: slate-800      /* Cards, panels */
--bg-tertiary: slate-700       /* Hover states */

--text-primary: slate-200      /* Main text */
--text-secondary: slate-300    /* Secondary text */
--text-tertiary: slate-400     /* Muted text */

--accent-cyan: cyan-500        /* Primary actions */
--accent-emerald: emerald-500  /* Success, confirmations */
--accent-purple: purple-500    /* Admin features */

--gradient: cyan-500 → emerald-500  /* Buttons, headings */
```

### Typography
- **Headings**: Bold, gradient text (cyan-emerald)
- **Body**: Inter/System fonts, slate-200/300
- **Code**: Monospace, cyan-400

### Components
- **Cards**: `bg-slate-800` with subtle borders, rounded corners
- **Buttons**: Gradient backgrounds with hover lift effects
- **Inputs**: Dark with focus cyan ring
- **Badges**: Colored backgrounds for skills, status
- **Animations**: Fade-in-up, hover-lift, smooth transitions

---

## 🔐 Authentication Flow

### Registration
```javascript
1. User fills signup form (email, password, name, role)
2. Frontend validates:
   - Email format
   - Password strength (8+ chars, mixed case, number, special char)
   - Required fields
3. POST /api/auth/register
4. Backend creates user, returns JWT token
5. Token stored in localStorage
6. User redirected to dashboard
```

### Login
```javascript
1. User enters email & password
2. POST /api/auth/login
3. Backend verifies credentials, returns JWT + user data
4. Token stored in localStorage
5. AuthContext updated with user data
6. Redirect to role-based dashboard
```

### Protected Routes
```javascript
// ProtectedRoute component wraps secured pages
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardRoute />
  </ProtectedRoute>
} />

// Checks:
- User authenticated (token exists)
- Role authorized (if allowedRoles specified)
- Redirects to /login if not authenticated
```

### Role-Based Routing
```javascript
// DashboardRoute component in App.jsx
- Admin → AdminDashboard (analytics, user management)
- Client → BrowseFreelancers (find talent)
- Freelancer → JobsPage (find work)
```

---

## 🌐 API Integration

### Axios Instance (`services/api.js`)
```javascript
// Base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor (auto-attach JWT)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized: clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Common API Calls
```javascript
// Authentication
await api.post('/auth/register', userData);
await api.post('/auth/login', credentials);
await api.get('/auth/me');

// Jobs
await api.get('/jobs', { params: { category, minBudget, maxBudget } });
await api.get(`/jobs/${id}`);
await api.post('/jobs', jobData);

// Submissions
await api.post('/submissions', proposalData);
await api.get('/submissions/my');

// Payments
await api.post('/payments/create-intent', { job_id, submission_id, amount });

// Messages
await api.get(`/messages/job/${jobId}`);
await api.post('/messages', messageData);

// Admin
await api.get('/admin/analytics/users');
await api.get('/admin/users', { params: { page, limit, role, search } });
```

---

## 💬 Real-time Chat (Socket.io)

### Connection Setup (`services/socket.js`)
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { userId: currentUser.id },
  autoConnect: false
});

export default socket;
```

### Usage in Components
```javascript
// Connect when user logs in
socket.auth = { userId: user.id };
socket.connect();

// Join job chat room
socket.emit('join:job', { job_id: jobId });

// Listen for new messages
socket.on('message:new', (message) => {
  setMessages(prev => [...prev, message]);
});

// Send message
socket.emit('message:send', {
  job_id: jobId,
  receiver_id: receiverId,
  message_text: text,
  attachments: []
});

// Disconnect when user logs out
socket.disconnect();
```

---

## 💳 Stripe Payment Integration

### Setup
```javascript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Wrap payment form with Elements provider
<Elements stripe={stripePromise}>
  <PaymentForm />
</Elements>
```

### Payment Flow
```javascript
1. Client creates payment intent
   const { client_secret } = await api.post('/payments/create-intent', {
     job_id, submission_id, amount
   });

2. Stripe.js processes payment
   const stripe = useStripe();
   const elements = useElements();
   
   const { error, paymentIntent } = await stripe.confirmCardPayment(
     client_secret,
     { payment_method: { card: elements.getElement(CardElement) } }
   );

3. Backend webhook confirms payment
   Payment status: 'pending' → 'held'

4. After work completion, admin releases payment
   await api.post(`/payments/${paymentId}/release`);
```

---

## 🌍 Internationalization (i18next)

### Language Configuration
```javascript
// Available languages
- en: English (LTR)
- fr: French (LTR)
- ar: Arabic (RTL)

// Language switcher in Navbar
const { i18n } = useTranslation();
i18n.changeLanguage('ar'); // Changes to Arabic with RTL
```

### Usage in Components
```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
    </div>
  );
}
```

### Translation Files
```json
// en.json
{
  "welcome": {
    "title": "Welcome to Tunisian Top Freelancers",
    "description": "Find skilled professionals for your projects"
  }
}

// fr.json
{
  "welcome": {
    "title": "Bienvenue sur Tunisian Top Freelancers",
    "description": "Trouvez des professionnels qualifiés pour vos projets"
  }
}

// ar.json (RTL)
{
  "welcome": {
    "title": "مرحبا بكم في أفضل المستقلين التونسيين",
    "description": "ابحث عن محترفين مهرة لمشاريعك"
  }
}
```

---

## 📱 Page Descriptions

### Landing Page (`LandingPage.jsx`)
- Hero section with CTA buttons
- Features showcase (job posting, freelancer search, secure payments)
- How it works section
- Categories grid
- Testimonials
- Footer with social links

### Browse Jobs (`JobsPage.jsx`)
- Job cards with title, budget, deadline, category, skills
- Filters: search, category, min/max budget
- Pagination
- Stats summary (total jobs, avg budget)
- "Apply Now" buttons

### Browse Freelancers (`BrowseFreelancers.jsx`)
- Freelancer cards with avatar, name, rating, location, skills
- Filters: search, skill, minimum rating
- "View Profile" and "Contact" buttons
- Responsive grid layout

### Job Details (`JobDetails.jsx`)
- Full job description
- Client information
- Required skills
- Budget and deadline
- Submit proposal form (freelancers)
- View submissions (clients)

### Create Job (`CreateJob.jsx`)
- Multi-step form (title, description, category, budget, skills, deadline)
- Skill tags with autocomplete
- Validation with error messages
- Preview before posting

### Admin Dashboard (`AdminDashboard.jsx`)
- **Overview Tab**: User stats cards, recent users table
- **User Management Tab**: Search, filter by role, pagination, activate/deactivate, delete
- **Growth Charts Tab**: Daily and monthly registration charts

### Messages Page (`MessagesPage.jsx`)
- Job-based conversation threads
- Real-time message updates
- Typing indicators
- Read receipts
- File attachment support

### Profile Page (`Profile.jsx`)
- Edit profile information
- Update skills (freelancers)
- Change password
- Profile photo upload
- View completed jobs and ratings

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+ and npm
- Backend API running on `http://localhost:5000`

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env` file in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Start Development Server
```bash
npm run dev
```

Application runs at: `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

---

## 🧪 Testing User Flows

### As a Client (Employer)
```
1. Login: client1@example.com / Test@123
2. Dashboard → Browse Freelancers
3. Filter by skill (e.g., "React")
4. View freelancer profile
5. Post new job (Create Job page)
6. Review applications
7. Message freelancer
8. Make payment
```

### As a Freelancer
```
1. Login: freelancer1@example.com / Test@123
2. Dashboard → Browse Jobs
3. Filter by category and budget
4. View job details
5. Submit proposal with description
6. Chat with client
7. Track submission status
8. Receive payment notification
```

### As an Admin
```
1. Login: admin@tunisianfreelancers.com / Admin@123
2. View user analytics
3. Search and filter users
4. Activate/deactivate accounts
5. View growth charts
6. Manage platform
```

---

## 🎨 Styling with Tailwind CSS

### Custom Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'hover-lift': 'hoverLift 0.3s ease'
      }
    }
  }
}
```

### Common Utility Classes
```css
/* Containers */
.container-custom { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }

/* Cards */
.card { @apply bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700; }

/* Buttons */
.btn-primary { @apply bg-gradient-to-r from-cyan-500 to-emerald-500 
                      text-white font-semibold py-2 px-4 rounded-lg
                      hover:shadow-lg hover:-translate-y-0.5 transition-all; }

/* Inputs */
.input { @apply w-full px-4 py-2 bg-slate-700 border border-slate-600
               rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500; }

/* Text */
.gradient-text { @apply bg-gradient-to-r from-cyan-400 to-emerald-400
                        bg-clip-text text-transparent; }

/* Animations */
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
.hover-lift { @apply hover:-translate-y-1 transition-transform; }
```

---

## 🚀 Performance Optimizations

- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Lazy loading, responsive images
- **API Caching**: React Query or SWR (future enhancement)
- **Bundle Size**: Vite tree-shaking, minimal dependencies
- **CSS Purging**: Tailwind removes unused styles in production

---

## 🔄 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (dist/ folder)
npm run preview  # Preview production build locally
npm start        # Alias for npm run dev
```

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📂 Key Files Explained

### `main.jsx`
Application entry point, wraps App with AuthProvider and i18n

### `App.jsx`
Main routing configuration with protected routes and role-based dashboards

### `AuthContext.jsx`
Global authentication state management (user, token, login, logout, register)

### `api.js`
Axios HTTP client with interceptors for authentication and error handling

### `socket.js`
Socket.io client setup for real-time communication

### `index.css`
Global styles, Tailwind directives, custom animations

---

## 🎯 Future Enhancements

- [ ] Profile photo upload to cloud storage (Cloudinary/S3)
- [ ] Advanced search with Elasticsearch
- [ ] Portfolio showcase for freelancers
- [ ] Video call integration (WebRTC)
- [ ] Mobile app (React Native)
- [ ] Push notifications (Service Workers)
- [ ] Analytics dashboard for freelancers
- [ ] Dispute resolution system
- [ ] Referral program
- [ ] Multi-currency support

---

## 🐛 Common Issues & Solutions

### API Connection Failed
```
Error: Network Error
Solution: 
1. Ensure backend is running (http://localhost:5000)
2. Check VITE_API_URL in .env
3. Verify CORS configuration in backend
```

### Socket.io Not Connecting
```
Error: Socket connection failed
Solution:
1. Check VITE_SOCKET_URL in .env
2. Ensure user is logged in (userId required)
3. Verify backend Socket.io configuration
```

### Tailwind Styles Not Applied
```
Error: Classes not working
Solution:
1. Ensure Tailwind installed: npm install -D tailwindcss
2. Check tailwind.config.js content paths
3. Verify index.css has @tailwind directives
```

### Build Fails
```
Error: Build errors
Solution:
1. Clear node_modules: rm -rf node_modules && npm install
2. Clear Vite cache: rm -rf .vite
3. Check for TypeScript errors (if using TS)
```

---

## 📞 Development Tips

- Use React DevTools for component debugging
- Check Network tab for API call issues
- Use Redux DevTools if adding state management
- Test responsive design with browser DevTools
- Use Lighthouse for performance audits

---

## 📄 Dependencies

### Core
- `react` (18.2.0): UI library
- `react-dom` (18.2.0): React DOM rendering
- `react-router-dom` (6.20.1): Client-side routing
- `vite` (5.0.8): Build tool and dev server

### Styling
- `tailwindcss` (3.3.6): Utility-first CSS
- `autoprefixer` (10.4.16): CSS vendor prefixes
- `postcss` (8.4.32): CSS processing

### API & Real-time
- `axios` (1.6.2): HTTP client
- `socket.io-client` (4.6.0): WebSocket client

### Payments
- `@stripe/stripe-js` (2.2.0): Stripe library
- `@stripe/react-stripe-js` (2.4.0): Stripe React components

### Internationalization
- `i18next` (23.7.6): i18n framework
- `react-i18next` (13.5.0): React integration

### Forms
- `react-hook-form` (7.49.2): Form validation

---

**Version**: 1.0.0  
**Last Updated**: November 15, 2025  
**React Version**: 18.2.0  
**Node Version**: 16.x or higher
