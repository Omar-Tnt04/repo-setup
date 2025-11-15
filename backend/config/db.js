const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tunisian_freelancers';

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    return false;
  }
};

// Test database connection (alias for compatibility)
const testConnection = connectDB;

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB Atlas connection closed through app termination');
  process.exit(0);
});

module.exports = {
  connectDB,
  testConnection,
  mongoose
};
