const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  getUnreadCount,
  getConversations,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { sendMessageValidation, validate } = require('../middleware/validation');

// All message routes are protected
router.use(protect);

router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:jobId', getMessages);
router.post('/', sendMessageValidation, validate, sendMessage);
router.put('/:jobId/read', markAsRead);

module.exports = router;
