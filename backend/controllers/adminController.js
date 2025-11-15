const { User } = require('../models');

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get clients count
    const totalClients = await User.countDocuments({ role: 'client' });

    // Get freelancers count
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });

    // Get active users count
    const activeUsers = await User.countDocuments({ is_active: true });

    // Get user registration by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationsByDate = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          clients: {
            $sum: { $cond: [{ $eq: ['$role', 'client'] }, 1, 0] }
          },
          freelancers: {
            $sum: { $cond: [{ $eq: ['$role', 'freelancer'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
          clients: 1,
          freelancers: 1
        }
      },
      { $sort: { date: -1 } }
    ]);

    // Get user registration by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const registrationsByMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          count: { $sum: 1 },
          clients: {
            $sum: { $cond: [{ $eq: ['$role', 'client'] }, 1, 0] }
          },
          freelancers: {
            $sum: { $cond: [{ $eq: ['$role', 'freelancer'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
          clients: 1,
          freelancers: 1
        }
      },
      { $sort: { month: -1 } }
    ]);

    // Get recent registrations (last 10)
    const recentRegistrations = await User.find()
      .select('email full_name role createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Convert _id to id for compatibility
    const recentRegistrationsFormatted = recentRegistrations.map(user => ({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      created_at: user.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalClients,
          totalFreelancers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers
        },
        registrationsByDate,
        registrationsByMonth,
        recentRegistrations: recentRegistrationsFormatted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role; // Optional role filter
    const search = req.query.search; // Optional search term

    // Build query filter
    const filter = {};

    // Add role filter
    if (role && (role === 'client' || role === 'freelancer')) {
      filter.role = role;
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalUsers = await User.countDocuments(filter);

    // Get users with pagination
    const users = await User.find(filter)
      .select('email full_name role phone location is_active createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format response with id field
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      location: user.location,
      is_active: user.is_active,
      created_at: user.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/admin/users/:role
// @access  Private/Admin
exports.getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    if (role !== 'client' && role !== 'freelancer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "client" or "freelancer"'
      });
    }

    const users = await User.find({ role })
      .select('email full_name role phone location is_active createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Format response with id field
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      location: user.location,
      is_active: user.is_active,
      created_at: user.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get current user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Toggle status
    user.is_active = !user.is_active;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
      data: {
        is_active: user.is_active
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting yourself
    if (id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
