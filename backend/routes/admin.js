const express = require('express');
const router = express.Router();
const {
  getUserAnalytics,
  getAllUsers,
  getUsersByRole,
  toggleUserStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Analytics routes
router.get('/analytics/users', getUserAnalytics);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:role', getUsersByRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
