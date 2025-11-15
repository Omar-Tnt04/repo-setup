# Admin Analytics System Setup Guide

## Overview
Complete admin analytics system with backend APIs and frontend dashboard for managing users and viewing platform analytics.

## Backend Features

### API Endpoints

#### Admin Analytics
- **GET** `/api/admin/analytics/users` - Get comprehensive user analytics
  - Total users, clients, freelancers
  - Active/inactive user counts
  - Daily registrations (last 30 days)
  - Monthly registrations (last 12 months)
  - Recent registrations (last 10 users)

#### User Management
- **GET** `/api/admin/users` - Get all users (paginated with filters)
  - Query params: `page`, `limit`, `role`, `search`
- **GET** `/api/admin/users/:role` - Get users by role (client/freelancer)
- **PUT** `/api/admin/users/:id/toggle-status` - Activate/deactivate user
- **DELETE** `/api/admin/users/:id` - Delete user

### Security
- All admin endpoints require JWT authentication
- Role-based authorization (admin role required)
- Protected by `protect` and `authorize('admin')` middleware

## Frontend Features

### Admin Dashboard
Located at: `frontend/src/pages/AdminDashboard.jsx`

#### Three Main Tabs:

1. **Overview Tab**
   - Stats cards showing total users, clients, freelancers, active users
   - Recent registrations table
   - Color-coded role badges
   - Animated stat cards with gradient backgrounds

2. **User Management Tab**
   - Searchable and filterable user list
   - Filter by role (client/freelancer/admin)
   - Search by email or name
   - Pagination support
   - Actions: Activate/Deactivate, Delete
   - Status indicators (active/inactive)

3. **Growth Charts Tab**
   - Daily registration statistics (last 30 days)
   - Monthly registration statistics (last 12 months)
   - Breakdown by client/freelancer counts
   - Sortable tables

### Styling
- Dark blue-green theme matching platform design
- Gradient text and buttons
- Hover effects and animations
- Fully responsive (mobile, tablet, desktop)
- Tailwind CSS with custom components

## Setup Instructions

### 1. Database Setup

The users table should support the `admin` role. If using ENUM:

\`\`\`sql
ALTER TABLE users MODIFY COLUMN role ENUM('client', 'freelancer', 'admin') NOT NULL;
\`\`\`

### 2. Create Admin User

**Option A: Using the Node.js script (Recommended)**

\`\`\`bash
cd backend
node scripts/createAdmin.js
\`\`\`

Default credentials:
- Email: admin@tunisianfreelancers.com
- Password: Admin@123

**Option B: Using environment variables**

Add to `.env`:
\`\`\`env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=YourSecurePassword123
\`\`\`

Then run:
\`\`\`bash
node scripts/createAdmin.js
\`\`\`

**Option C: Manual SQL**

\`\`\`sql
-- First generate password hash in Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('YourPassword', 10);

INSERT INTO users (email, password_hash, full_name, role, is_active, preferred_language)
VALUES (
  'admin@example.com',
  '$2a$10$...',  -- Your bcrypt hash here
  'Platform Administrator',
  'admin',
  true,
  'en'
);
\`\`\`

### 3. Start Backend Server

\`\`\`bash
cd backend
npm start
\`\`\`

The admin routes will be available at:
- http://localhost:5000/api/admin

### 4. Start Frontend

\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 5. Access Admin Dashboard

1. Login with admin credentials at: http://localhost:3000/login
2. You'll be redirected to: http://localhost:3000/dashboard (which shows AdminDashboard for admin users)
3. Or navigate directly to: http://localhost:3000/admin

## Usage Guide

### Admin Navigation
- Admin users see a purple "Admin Panel" link in the navbar
- Click to access the admin dashboard
- Available on both desktop and mobile menus

### Viewing Analytics
1. Go to **Overview** tab
2. View summary statistics in stat cards
3. See recent user registrations in the table
4. Click **Growth Charts** tab for historical data

### Managing Users
1. Go to **User Management** tab
2. Use search box to find users by email/name
3. Filter by role using dropdown
4. Click **Activate/Deactivate** to toggle user status
5. Click **Delete** to remove user (with confirmation)
6. Use pagination to navigate through users

### Understanding Data
- **Total Users**: All registered users
- **Clients**: Users with client role
- **Freelancers**: Users with freelancer role
- **Active Users**: Users with is_active = true
- **Daily/Monthly Stats**: New registrations over time

## API Testing

### Get Analytics
\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/admin/analytics/users
\`\`\`

### Get All Users (with filters)
\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/admin/users?page=1&limit=10&role=client&search=john"
\`\`\`

### Toggle User Status
\`\`\`bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/admin/users/123/toggle-status
\`\`\`

### Delete User
\`\`\`bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/admin/users/123
\`\`\`

## Security Considerations

1. **Change Default Password**: Immediately change the default admin password after first login
2. **JWT Secret**: Ensure JWT_SECRET in .env is strong and unique
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Already configured in server.js
5. **Input Validation**: Implemented in middleware
6. **SQL Injection**: Protected by parameterized queries
7. **XSS Protection**: React escapes by default
8. **CORS**: Configured for your CLIENT_URL

## File Structure

### Backend
\`\`\`
backend/
├── controllers/
│   └── adminController.js      # Admin analytics & user management
├── routes/
│   └── admin.js                # Admin API routes
├── middleware/
│   └── auth.js                 # Protect & authorize middleware
├── scripts/
│   └── createAdmin.js          # Create admin user script
└── database/
    └── add_admin_user.sql      # SQL for manual admin creation
\`\`\`

### Frontend
\`\`\`
frontend/
└── src/
    ├── pages/
    │   └── AdminDashboard.jsx  # Admin dashboard page
    ├── App.jsx                 # Updated with admin routes
    └── components/
        └── common/
            └── Navbar.jsx      # Updated with admin link
\`\`\`

## Troubleshooting

### "Not authorized to access this route"
- Ensure you're logged in as admin user
- Check JWT token is valid
- Verify user role is 'admin' in database

### "User role is not authorized"
- User needs role = 'admin' in users table
- Run createAdmin.js script
- Or manually update user role in database

### Dashboard not loading
- Check browser console for errors
- Verify backend server is running
- Check API_BASE_URL in frontend .env
- Ensure CORS is configured correctly

### Empty analytics data
- Add some test users to database
- Run seed script if available
- Wait for users to register

## Production Deployment

1. **Environment Variables**:
   - Set strong JWT_SECRET
   - Update CLIENT_URL to production URL
   - Set NODE_ENV=production

2. **Database**:
   - Ensure role column supports 'admin'
   - Create admin user in production DB
   - Backup database regularly

3. **Security**:
   - Enable HTTPS
   - Use environment variables for sensitive data
   - Implement rate limiting (already configured)
   - Monitor admin access logs

4. **Performance**:
   - Consider caching analytics data
   - Index frequently queried columns
   - Implement pagination for large datasets

## Future Enhancements

Potential additions:
- Visual charts (Chart.js, Recharts)
- Export data to CSV/PDF
- Email notifications for admin actions
- Audit log for admin activities
- Bulk user operations
- Advanced filtering and sorting
- Real-time updates with WebSockets
- Dashboard widgets customization
- Role-based permissions (super admin, admin, moderator)

---

**Created**: November 2024
**Version**: 1.0.0
**Platform**: Tunisian Top Freelancers
