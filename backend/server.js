require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser (except for webhook route)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/messages', require('./routes/messages'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Tunisian Top Freelancers API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      jobs: '/api/jobs',
      submissions: '/api/submissions',
      payments: '/api/payments',
      messages: '/api/messages',
      health: '/health'
    }
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════════');
      console.log('  🚀 Tunisian Top Freelancers Platform - Backend API');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Server: http://localhost:${PORT}`);
      console.log(`  Health: http://localhost:${PORT}/health`);
      console.log(`  API Type: REST API Only`);
      console.log('═══════════════════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Closing server gracefully...');
  process.exit(0);
});

startServer();
