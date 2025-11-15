const { Payment, Submission, Job, User } = require('../models');
const stripe = require('../config/stripe');

// @desc    Create payment intent (Stripe)
// @route   POST /api/payments/intent
// @access  Private (Client only)
exports.createPaymentIntent = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create payments'
      });
    }

    const { submission_id, amount, currency = 'TND' } = req.body;

    // Get submission
    const submission = await Submission.findById(submission_id).populate('job_id');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Verify client owns the job
    if (submission.job_id.client_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create payment for this submission'
      });
    }

    // Verify submission is accepted
    if (submission.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only pay for accepted submissions'
      });
    }

    // Check if payment already exists for this submission
    const existingPayment = await Payment.findOne({ submission_id });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this submission'
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        submission_id: submission_id.toString(),
        job_id: submission.job_id._id.toString(),
        client_id: req.user.id.toString(),
        freelancer_id: submission.freelancer_id.toString()
      }
    });

    // Create payment record
    const payment = await Payment.create({
      submission_id,
      job_id: submission.job_id._id,
      client_id: req.user.id,
      freelancer_id: submission.freelancer_id,
      amount,
      currency,
      stripe_payment_intent_id: paymentIntent.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        payment_id: payment._id.toString(),
        client_secret: paymentIntent.client_secret,
        amount,
        currency
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Release payment (mark as completed)
// @route   PUT /api/payments/:id/release
// @access  Private (Client only)
exports.releasePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId)
      .populate('job_id')
      .populate('freelancer_id', 'full_name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify client owns the payment
    if (payment.client_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to release this payment'
      });
    }

    // Verify payment is pending or processing
    if (payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already released'
      });
    }

    if (payment.status === 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot release failed payment'
      });
    }

    // Update payment status
    payment.status = 'completed';
    payment.released_at = new Date();
    await payment.save();

    // Update job status to completed
    await Job.findByIdAndUpdate(payment.job_id._id, { status: 'completed' });

    // Update freelancer stats
    await User.findByIdAndUpdate(payment.freelancer_id._id, {
      $inc: { total_earned: payment.amount }
    });

    res.json({
      success: true,
      message: 'Payment released successfully',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;

    // Build query based on user role
    const query = {};

    if (req.user.role === 'client') {
      query.client_id = req.user.id;
    } else if (req.user.role === 'freelancer') {
      query.freelancer_id = req.user.id;
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get payments
    const payments = await Payment.find(query)
      .populate('job_id', 'title category')
      .populate('submission_id', 'description')
      .populate('client_id', 'full_name email')
      .populate('freelancer_id', 'full_name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format response
    const formattedPayments = payments.map(payment => ({
      ...payment,
      id: payment._id.toString(),
      job_title: payment.job_id?.title,
      client_name: payment.client_id?.full_name,
      freelancer_name: payment.freelancer_id?.full_name
    }));

    // Get total count
    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments: formattedPayments,
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

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res, next) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId)
      .populate('job_id', 'title category budget')
      .populate('submission_id', 'description attachments')
      .populate('client_id', 'full_name email profile_photo')
      .populate('freelancer_id', 'full_name email profile_photo')
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    const isClient = payment.client_id._id.toString() === req.user.id.toString();
    const isFreelancer = payment.freelancer_id._id.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    // Format response
    const formattedPayment = {
      ...payment,
      id: payment._id.toString(),
      job_title: payment.job_id?.title,
      client_name: payment.client_id?.full_name,
      freelancer_name: payment.freelancer_id?.full_name
    };

    res.json({
      success: true,
      data: { payment: formattedPayment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private
exports.getPaymentStats = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'client') {
      query.client_id = req.user.id;
    } else if (req.user.role === 'freelancer') {
      query.freelancer_id = req.user.id;
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get total payments
    const totalPayments = await Payment.countDocuments(query);

    // Get total amount
    const amountStats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
          }
        }
      }
    ]);

    // Get payment counts by status
    const statusCounts = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      total_payments: totalPayments,
      amounts: amountStats[0] || { total: 0, pending: 0, completed: 0 },
      by_status: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};
