const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  releasePayment,
  getPaymentHistory,
  getPaymentById,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/intent', protect, authorize('client'), createPaymentIntent);
router.put('/:id/release', protect, authorize('client'), releasePayment);
router.get('/history', protect, getPaymentHistory);
router.get('/stats', protect, getPaymentStats);
router.get('/:id', protect, getPaymentById);

module.exports = router;
