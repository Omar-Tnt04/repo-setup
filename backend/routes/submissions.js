const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissionsForJob,
  getMySubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  rateSubmission
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');
const { createSubmissionValidation, validate } = require('../middleware/validation');

// Freelancer routes
router.post('/', protect, authorize('freelancer'), createSubmissionValidation, validate, createSubmission);
router.get('/my', protect, authorize('freelancer'), getMySubmissions);
router.delete('/:id', protect, authorize('freelancer'), deleteSubmission);

// Client routes
router.get('/job/:jobId', protect, getSubmissionsForJob);
router.put('/:id/status', protect, authorize('client', 'admin'), updateSubmissionStatus);
router.put('/:id/rate', protect, authorize('client'), rateSubmission);

module.exports = router;
