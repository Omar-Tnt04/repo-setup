-- Add admin user functionality
-- This script creates an admin user for testing

-- First, check if admin role already exists in users table
-- The role column should support 'admin', 'client', and 'freelancer'

-- Modify role column to support admin (if using ENUM)
-- ALTER TABLE users MODIFY COLUMN role ENUM('client', 'freelancer', 'admin') NOT NULL;

-- Create a sample admin user (password: Admin@123)
-- Password hash for 'Admin@123' with bcrypt
INSERT INTO users (email, password_hash, full_name, role, is_active, preferred_language)
VALUES (
  'admin@tunisianfreelancers.com',
  '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'Platform Administrator',
  'admin',
  true,
  'en'
)
ON DUPLICATE KEY UPDATE role = 'admin';

-- Note: To generate the password hash, run this in Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('Admin@123', 10);
-- console.log(hash);
