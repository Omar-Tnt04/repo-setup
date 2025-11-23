# Deliverable 6: Authentication & Authorization

## ✅ Requirements Completed

### 6. Authentication & Authorization
- ✅ **User Registration & Login**: Implemented secure registration and login endpoints.
- ✅ **Password Security**: Used `bcryptjs` for hashing passwords before storage.

### 7. JWT Authentication Mechanisms
- ✅ **Token Generation**: Implemented JSON Web Token (JWT) generation upon successful login.
- ✅ **Protected Routes**: Created middleware (`auth.js`) to verify tokens for protected API endpoints.
- ✅ **Session Management**: Frontend stores tokens securely and attaches them to requests via Axios interceptors.

### 8. Role-Based Access Control (RBAC)
- ✅ **Role Definition**: Defined roles: `client`, `freelancer`, `admin`.
- ✅ **Permission Logic**: Implemented role-based permissions (e.g., only clients can post jobs, only admins can manage users).
- ✅ **Authorization Middleware**: Added `authorize(...)` middleware to restrict access to specific roles.

## 🛠 Implementation Details

### Backend
- **Controllers**: `authController.js` handles registration, login, and profile management.
- **Middleware**: 
  - `protect`: Verifies JWT token.
  - `authorize`: Checks user role against allowed roles.
- **Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.

### Frontend
- **Context**: `AuthContext.jsx` manages global authentication state.
- **Protected Routes**: `ProtectedRoute` component redirects unauthenticated users.
- **Role-Based Redirects**: `DashboardRoute` directs users to their specific dashboard based on role.
