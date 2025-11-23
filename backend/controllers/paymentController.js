const { Payment, Submission, Job, User, Transaction } = require('../models');
// const stripe = require('../config/stripe'); // Keeping for reference, but using Mock PSPs

// Mock PSP Fee Configurations
const PSP_FEES = {
  konnect: 0.02, // 2%
  paymee: 0.025, // 2.5%
  paymaster: 0.02,
  zitouna: 0.015,
  gpg: 0.02,
  stripe: 0.029
};

// @desc    Initiate Escrow Funding (Client deposits funds)
// @route   POST /api/payments/fund-escrow
// @access  Private (Client only)
exports.fundEscrow = async (req, res, next) => {
  try {
    const { job_id, provider = 'konnect' } = req.body;

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.client_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (job.escrow_status === 'funded') {
      return res.status(400).json({ success: false, message: 'Escrow already funded' });
    }

    // Calculate Fees
    const amount = job.budget;
    const processorFeeRate = PSP_FEES[provider] || 0.02;
    const processorFee = amount * processorFeeRate;
    const platformFee = 0; // 0% Commission Promise
    const totalAmount = amount + processorFee;

    // Create Transaction Record
    const transaction = await Transaction.create({
      job_id: job._id,
      sender_id: req.user.id,
      amount: totalAmount,
      currency: job.currency,
      type: 'escrow_deposit',
      status: 'pending',
      provider: provider,
      fees: {
        platform_fee: platformFee,
        processor_fee: processorFee
      },
      metadata: {
        original_budget: amount
      }
    });

    // Mock Payment Gateway Response
    // In a real app, this would call Konnect/Paymee API to get a payment link
    const mockPaymentUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/mock-gateway/${transaction._id}?provider=${provider}`;

    res.status(200).json({
      success: true,
      data: {
        transaction_id: transaction._id,
        payment_url: mockPaymentUrl,
        breakdown: {
          budget: amount,
          processor_fee: processorFee,
          platform_fee: platformFee,
          total: totalAmount
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Confirm Payment (Webhook/Mock Callback)
// @route   POST /api/payments/confirm
// @access  Private (or Public for webhooks)
exports.confirmPayment = async (req, res, next) => {
  try {
    const { transaction_id, status } = req.body;

    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status === 'completed') {
      return res.status(200).json({ success: true, message: 'Already confirmed' });
    }

    if (status === 'success') {
      transaction.status = 'completed';
      transaction.provider_transaction_id = `mock_${Date.now()}`;
      await transaction.save();

      // Update Job Status
      const job = await Job.findById(transaction.job_id);
      job.escrow_status = 'funded';
      job.status = 'open'; // Job is now live
      job.payment_provider = transaction.provider;
      await job.save();

      // Create Notification for Client
      // (Notification logic here)

      return res.status(200).json({ success: true, data: transaction });
    } else {
      transaction.status = 'failed';
      await transaction.save();
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Release Escrow (Client accepts work)
// @route   POST /api/payments/release-escrow
// @access  Private (Client only)
exports.releaseEscrow = async (req, res, next) => {
  try {
    const { job_id, submission_id } = req.body;

    const job = await Job.findById(job_id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (job.escrow_status !== 'funded') {
      return res.status(400).json({ success: false, message: 'Escrow not funded or already released' });
    }

    const submission = await Submission.findById(submission_id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    // Create Release Transaction
    const transaction = await Transaction.create({
      job_id: job._id,
      sender_id: req.user.id, // Money moves from Escrow (technically Client's deposit)
      receiver_id: submission.freelancer_id,
      amount: job.budget, // Freelancer gets the full budget (0% fee)
      currency: job.currency,
      type: 'escrow_release',
      status: 'completed', // Instant release in our system
      provider: job.payment_provider,
      fees: {
        platform_fee: 0,
        processor_fee: 0 // Already paid by client during deposit
      }
    });

    // Update Job
    job.escrow_status = 'released';
    job.status = 'completed';
    await job.save();

    // Update Submission
    submission.status = 'approved'; // 'accepted' -> 'approved' to match enum
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Escrow released successfully',
      data: transaction
    });

  } catch (error) {
    next(error);
  }
};

// Legacy / Placeholder for Stripe (if needed later)
exports.createPaymentIntent = async (req, res, next) => {
  res.status(501).json({ message: 'Use /fund-escrow instead' });
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
