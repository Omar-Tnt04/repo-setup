const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  getCategories
} = require('../controllers/jobController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { createJobValidation, validate } = require('../middleware/validation');
const { getJobRecommendations } = require('../services/aiRecommendation');

// Public routes
router.get('/', optionalAuth, getAllJobs);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getJobById);

// Protected routes
router.post('/', protect, authorize('client'), createJobValidation, validate, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.get('/my/posted', protect, authorize('client'), getMyPostedJobs);

// AI recommendations for freelancers
router.get('/recommendations/ai', protect, authorize('freelancer'), async (req, res, next) => {
  try {
    const recommendations = await getJobRecommendations(req.user.id);
    
    res.json({
      success: true,
      data: {
        jobs: recommendations,
        count: recommendations.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
