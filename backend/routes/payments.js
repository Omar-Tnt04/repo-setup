const express = require('express');
const router = express.Router();
const {
  fundEscrow,
  confirmPayment,
  releaseEscrow,
  createPaymentIntent // Legacy
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Escrow Routes
router.post('/fund-escrow', protect, authorize('client'), fundEscrow);
router.post('/confirm', protect, confirmPayment); // Can be public for webhooks, but protected for mock
router.post('/release-escrow', protect, authorize('client'), releaseEscrow);

// Legacy / Stats (To be implemented if needed)
// router.get('/history', protect, getPaymentHistory);

module.exports = router;
