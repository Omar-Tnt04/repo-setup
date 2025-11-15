const { Job, User } = require('../models');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res, next) => {
  try {
    const {
      status,
      category,
      min_budget,
      max_budget,
      search,
      sort = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = { visibility: 'public' };

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (min_budget || max_budget) {
      filter.budget = {};
      if (min_budget) filter.budget.$gte = parseFloat(min_budget);
      if (max_budget) filter.budget.$lte = parseFloat(max_budget);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order.toUpperCase() === 'DESC' ? -1 : 1;

    // Get total count
    const total = await Job.countDocuments(filter);

    // Get jobs with client info
    const jobs = await Job.find(filter)
      .populate('client_id', 'full_name profile_photo rating total_jobs_posted')
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format response
    const formattedJobs = jobs.map(job => ({
      ...job,
      id: job._id.toString(),
      client_name: job.client_id?.full_name,
      client_photo: job.client_id?.profile_photo,
      client_rating: job.client_id?.rating,
      skills: job.required_skills
    }));

    res.json({
      success: true,
      data: {
        jobs: formattedJobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Increment view count
    await Job.findByIdAndUpdate(jobId, { $inc: { views_count: 1 } });

    // Get job with client info and submission count
    const job = await Job.findById(jobId)
      .populate('client_id', 'full_name profile_photo rating total_jobs_posted')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Get submission count
    const Submission = require('../models').Submission;
    const submissions_count = await Submission.countDocuments({ job_id: jobId });

    const formattedJob = {
      ...job,
      id: job._id.toString(),
      client_name: job.client_id?.full_name,
      client_photo: job.client_id?.profile_photo,
      client_rating: job.client_id?.rating,
      client_total_jobs: job.client_id?.total_jobs_posted,
      skills: job.required_skills,
      submissions_count
    };

    res.json({
      success: true,
      data: { job: formattedJob }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Client only)
exports.createJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create jobs'
      });
    }

    const {
      title,
      description,
      category,
      budget,
      currency = 'TND',
      deadline,
      skills = [],
      location,
      location_required = false
    } = req.body;

    // Create job
    const job = await Job.create({
      client_id: req.user.id,
      title,
      description,
      category,
      budget,
      currency,
      deadline: deadline || null,
      required_skills: skills,
      location: location || null,
      location_required
    });

    // Update user's job count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { total_jobs_posted: 1 }
    });

    // Format response
    const formattedJob = {
      ...job.toObject(),
      id: job._id.toString(),
      skills: job.required_skills
    };

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job: formattedJob }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Client - owner only)
exports.updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const { title, description, category, budget, deadline, skills, location, location_required } = req.body;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update job that is not open'
      });
    }

    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (budget) updates.budget = budget;
    if (deadline !== undefined) updates.deadline = deadline;
    if (skills) updates.required_skills = skills;
    if (location !== undefined) updates.location = location;
    if (location_required !== undefined) updates.location_required = location_required;

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updates,
      { new: true, runValidators: true }
    ).lean();

    // Format response
    const formattedJob = {
      ...updatedJob,
      id: updatedJob._id.toString(),
      skills: updatedJob.required_skills
    };

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: formattedJob }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Client - owner only)
exports.deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client_id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete job that is not open'
      });
    }

    await Job.findByIdAndDelete(jobId);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my posted jobs (for clients)
// @route   GET /api/jobs/my/posted
// @access  Private (Client)
exports.getMyPostedJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { client_id: req.user.id };
    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get jobs with submission counts
    const Submission = require('../models').Submission;
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get submission counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const submissions_count = await Submission.countDocuments({ job_id: job._id });
        const pending_submissions = await Submission.countDocuments({
          job_id: job._id,
          status: 'pending'
        });

        return {
          ...job,
          id: job._id.toString(),
          submissions_count,
          pending_submissions
        };
      })
    );

    res.json({
      success: true,
      data: { jobs: jobsWithCounts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job categories
// @route   GET /api/jobs/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'open' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};
