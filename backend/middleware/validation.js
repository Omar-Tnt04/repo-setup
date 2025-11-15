const { body, param, query, validationResult } = require('express-validator');

// Validation middleware wrapper
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation rules
exports.registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('full_name').trim().isLength({ min: 2 }).withMessage('Full name is required'),
  body('role').isIn(['client', 'freelancer']).withMessage('Invalid role'),
];

exports.loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Job validation rules
exports.createJobValidation = [
  body('title').trim().isLength({ min: 5, max: 500 }).withMessage('Title must be between 5 and 500 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('budget').isFloat({ min: 10 }).withMessage('Budget must be at least 10 TND'),
  body('deadline').optional().isISO8601().withMessage('Invalid date format'),
];

// Submission validation rules
exports.createSubmissionValidation = [
  body('job_id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
];

// Message validation rules
exports.sendMessageValidation = [
  body('job_id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
  body('receiver_id').isInt({ min: 1 }).withMessage('Valid receiver ID is required'),
  body('message_text').trim().isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters'),
];
