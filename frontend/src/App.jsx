import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobsPage from './pages/JobsPage';
import JobDetails from './pages/JobDetails';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseFreelancers from './pages/BrowseFreelancers';
import CreateJob from './pages/CreateJob';
import Profile from './pages/Profile';
import MessagesPage from './pages/MessagesPage';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Route (role-based redirect)
const DashboardRoute = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'client') {
    return <BrowseFreelancers />;
  } else if (user?.role === 'freelancer') {
    return <JobsPage />;
  } else {
    return <Navigate to="/" replace />;
  }
};

function AppContent() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-job"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:jobId"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Elements>
  );
}

export default App;
