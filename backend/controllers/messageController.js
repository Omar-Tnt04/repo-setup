const { Message, Job, Submission, User } = require('../models');

// @desc    Get messages for a job
// @route   GET /api/messages/:jobId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    // Verify job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const isClient = job.client_id.toString() === req.user.id.toString();
    
    // Check if user is a freelancer with submission
    let isFreelancer = false;
    if (req.user.role === 'freelancer') {
      const submission = await Submission.findOne({
        job_id: jobId,
        freelancer_id: req.user.id
      });
      isFreelancer = !!submission;
    }

    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view messages for this job'
      });
    }

    // Get messages
    const messages = await Message.find({
      job_id: jobId,
      $or: [{ sender_id: req.user.id }, { receiver_id: req.user.id }]
    })
      .populate('sender_id', 'full_name profile_photo')
      .populate('receiver_id', 'full_name')
      .sort({ sent_at: 1 })
      .lean();

    // Format messages
    const formattedMessages = messages.map(msg => ({
      ...msg,
      id: msg._id.toString(),
      sender_name: msg.sender_id?.full_name,
      sender_photo: msg.sender_id?.profile_photo,
      receiver_name: msg.receiver_id?.full_name,
      created_at: msg.sent_at
    }));

    // Mark messages as read
    await Message.updateMany(
      {
        job_id: jobId,
        receiver_id: req.user.id,
        is_read: false
      },
      {
        is_read: true,
        read_at: new Date()
      }
    );

    res.json({
      success: true,
      data: { messages: formattedMessages }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message (via Socket.io primarily, but also REST endpoint)
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { job_id, receiver_id, message_text, attachments = [] } = req.body;

    // Verify job exists
    const job = await Job.findById(job_id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Verify sender is authorized
    const isClient = job.client_id.toString() === req.user.id.toString();
    
    let isFreelancer = false;
    if (req.user.role === 'freelancer') {
      const submission = await Submission.findOne({
        job_id,
        freelancer_id: req.user.id
      });
      isFreelancer = !!submission;
    }

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages for this job'
      });
    }

    // Create message
    const message = await Message.create({
      job_id,
      sender_id: req.user.id,
      receiver_id,
      message_text,
      attachments
    });

    // Populate sender and receiver details
    await message.populate([
      { path: 'sender_id', select: 'full_name profile_photo' },
      { path: 'receiver_id', select: 'full_name' }
    ]);

    // Format response
    const formattedMessage = {
      ...message.toObject(),
      id: message._id.toString(),
      sender_name: message.sender_id?.full_name,
      sender_photo: message.sender_id?.profile_photo,
      receiver_name: message.receiver_id?.full_name,
      created_at: message.sent_at
    };

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: formattedMessage }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      receiver_id: req.user.id,
      is_read: false
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender_id: req.user.id }, { receiver_id: req.user.id }]
    })
      .populate('sender_id', 'full_name profile_photo')
      .populate('receiver_id', 'full_name profile_photo')
      .populate('job_id', 'title status')
      .sort({ sent_at: -1 })
      .lean();

    // Group by job and get latest message for each
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const jobId = msg.job_id?._id?.toString();
      if (!jobId) return;

      if (!conversationsMap.has(jobId)) {
        const otherUserId = msg.sender_id._id.toString() === req.user.id.toString()
          ? msg.receiver_id
          : msg.sender_id;

        conversationsMap.set(jobId, {
          job_id: jobId,
          job_title: msg.job_id?.title,
          job_status: msg.job_id?.status,
          other_user: {
            id: otherUserId._id.toString(),
            full_name: otherUserId.full_name,
            profile_photo: otherUserId.profile_photo
          },
          last_message: {
            text: msg.message_text,
            sent_at: msg.sent_at,
            is_read: msg.is_read,
            sender_id: msg.sender_id._id.toString()
          },
          unread_count: 0
        });
      }
    });

    // Get unread counts for each conversation
    const conversations = Array.from(conversationsMap.values());
    for (const conv of conversations) {
      conv.unread_count = await Message.countDocuments({
        job_id: conv.job_id,
        receiver_id: req.user.id,
        is_read: false
      });
    }

    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:jobId/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const result = await Message.updateMany(
      {
        job_id: jobId,
        receiver_id: req.user.id,
        is_read: false
      },
      {
        is_read: true,
        read_at: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read',
      data: { count: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
