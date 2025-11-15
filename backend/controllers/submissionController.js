const { Submission, Job, User } = require('../models');

// @desc    Create submission for a job
// @route   POST /api/submissions
// @access  Private (Freelancer only)
exports.createSubmission = async (req, res, next) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can submit work'
      });
    }

    const { job_id, description, attachments = [] } = req.body;

    // Check if job exists and is open
    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting submissions'
      });
    }

    // Check if freelancer already submitted
    const existing = await Submission.findOne({
      job_id,
      freelancer_id: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted work for this job'
      });
    }

    // Create submission
    const submission = await Submission.create({
      job_id,
      freelancer_id: req.user.id,
      description,
      attachments
    });

    // Populate freelancer details
    await submission.populate('freelancer_id', 'full_name profile_photo rating');

    // Format response
    const formattedSubmission = {
      ...submission.toObject(),
      id: submission._id.toString(),
      freelancer_name: submission.freelancer_id?.full_name,
      freelancer_photo: submission.freelancer_id?.profile_photo,
      freelancer_rating: submission.freelancer_id?.rating
    };

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: { submission: formattedSubmission }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions for a job
// @route   GET /api/submissions/job/:jobId
// @access  Private (Client - job owner, or Freelancer - own submissions)
exports.getSubmissionsForJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Authorization check
    const isClient = req.user.role === 'client' && job.client_id.toString() === req.user.id.toString();
    const isFreelancer = req.user.role === 'freelancer';
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions'
      });
    }

    // Build query
    const query = { job_id: jobId };

    // If freelancer, only show their own submissions
    if (isFreelancer) {
      query.freelancer_id = req.user.id;
    }

    const submissions = await Submission.find(query)
      .populate('freelancer_id', 'full_name profile_photo rating total_jobs_completed')
      .sort({ submitted_at: -1 })
      .lean();

    // Format response
    const formattedSubmissions = submissions.map(sub => ({
      ...sub,
      id: sub._id.toString(),
      freelancer_name: sub.freelancer_id?.full_name,
      freelancer_photo: sub.freelancer_id?.profile_photo,
      freelancer_rating: sub.freelancer_id?.rating,
      freelancer_completed_jobs: sub.freelancer_id?.total_jobs_completed
    }));

    res.json({
      success: true,
      data: { submissions: formattedSubmissions }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get freelancer's submissions
// @route   GET /api/submissions/my
// @access  Private (Freelancer only)
exports.getMySubmissions = async (req, res, next) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can access this route'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { freelancer_id: req.user.id };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await Submission.find(query)
      .populate({
        path: 'job_id',
        select: 'title budget category client_id',
        populate: {
          path: 'client_id',
          select: 'full_name profile_photo'
        }
      })
      .sort({ submitted_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format response
    const formattedSubmissions = submissions.map(sub => ({
      ...sub,
      id: sub._id.toString(),
      job_title: sub.job_id?.title,
      job_budget: sub.job_id?.budget,
      job_category: sub.job_id?.category,
      client_name: sub.job_id?.client_id?.full_name,
      client_photo: sub.job_id?.client_id?.profile_photo
    }));

    res.json({
      success: true,
      data: { submissions: formattedSubmissions }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id/status
// @access  Private (Client - job owner only)
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, accepted, or rejected'
      });
    }

    // Get submission
    const submission = await Submission.findById(id).populate('job_id');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization (client must own the job)
    if (submission.job_id.client_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this submission'
      });
    }

    // Update submission
    submission.status = status;
    if (feedback) {
      submission.feedback = feedback;
    }

    // If accepted, update job status and freelancer stats
    if (status === 'accepted') {
      // Update job status to in_progress
      await Job.findByIdAndUpdate(submission.job_id._id, { status: 'in_progress' });

      // Increment freelancer's completed jobs
      await User.findByIdAndUpdate(submission.freelancer_id, {
        $inc: { total_jobs_completed: 1 }
      });
    }

    await submission.save();

    res.json({
      success: true,
      message: 'Submission status updated successfully',
      data: { submission }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private (Freelancer - own submission only)
exports.deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get submission
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    if (submission.freelancer_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this submission'
      });
    }

    // Can only delete pending submissions
    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending submissions'
      });
    }

    await Submission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate submission (by client after completion)
// @route   PUT /api/submissions/:id/rate
// @access  Private (Client - job owner only)
exports.rateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Get submission
    const submission = await Submission.findById(id).populate('job_id');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check authorization
    if (submission.job_id.client_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this submission'
      });
    }

    // Check if submission is accepted
    if (submission.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate accepted submissions'
      });
    }

    // Update submission rating
    submission.rating = rating;
    if (review) {
      submission.review = review;
    }
    await submission.save();

    // Update freelancer's average rating
    const freelancerSubmissions = await Submission.find({
      freelancer_id: submission.freelancer_id,
      rating: { $exists: true, $ne: null }
    });

    if (freelancerSubmissions.length > 0) {
      const avgRating = freelancerSubmissions.reduce((sum, sub) => sum + sub.rating, 0) / freelancerSubmissions.length;
      await User.findByIdAndUpdate(submission.freelancer_id, {
        rating: avgRating.toFixed(2)
      });
    }

    res.json({
      success: true,
      message: 'Submission rated successfully',
      data: { submission }
    });
  } catch (error) {
    next(error);
  }
};
