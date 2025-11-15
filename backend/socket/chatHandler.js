const { query } = require('../config/db');

// Store active connections
const activeUsers = new Map();

const setupSocketHandlers = (io) => {
  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const userId = socket.handshake.auth.userId;
      
      if (!userId) {
        return next(new Error('Authentication error'));
      }

      // Verify user exists
      const users = await query('SELECT id, full_name, role FROM users WHERE id = ? AND is_active = true', [userId]);
      
      if (users.length === 0) {
        return next(new Error('User not found'));
      }

      socket.userId = userId;
      socket.userData = users[0];
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userData.full_name} (ID: ${socket.userId})`);

    // Store active user
    activeUsers.set(socket.userId, socket.id);

    // Join user to their own room
    socket.join(`user:${socket.userId}`);

    // Emit online status to user
    socket.emit('connected', {
      userId: socket.userId,
      message: 'Connected to chat server'
    });

    // Join job room
    socket.on('join:job', async (data) => {
      try {
        const { job_id } = data;

        // Verify user is authorized for this job
        const jobs = await query('SELECT client_id FROM jobs WHERE id = ?', [job_id]);
        
        if (jobs.length === 0) {
          socket.emit('error', { message: 'Job not found' });
          return;
        }

        const isClient = jobs[0].client_id === socket.userId;
        
        let isAuthorized = isClient;
        
        // Check if freelancer has submission
        if (!isClient) {
          const submissions = await query(
            'SELECT id FROM submissions WHERE job_id = ? AND freelancer_id = ?',
            [job_id, socket.userId]
          );
          isAuthorized = submissions.length > 0;
        }

        if (!isAuthorized) {
          socket.emit('error', { message: 'Not authorized for this job' });
          return;
        }

        socket.join(`job:${job_id}`);
        console.log(`User ${socket.userId} joined job room: ${job_id}`);

        socket.emit('joined:job', { job_id });
      } catch (error) {
        console.error('Join job error:', error);
        socket.emit('error', { message: 'Failed to join job room' });
      }
    });

    // Leave job room
    socket.on('leave:job', (data) => {
      const { job_id } = data;
      socket.leave(`job:${job_id}`);
      console.log(`User ${socket.userId} left job room: ${job_id}`);
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { job_id, receiver_id, message_text, attachments = [] } = data;

        // Verify authorization
        const jobs = await query('SELECT client_id FROM jobs WHERE id = ?', [job_id]);
        
        if (jobs.length === 0) {
          socket.emit('error', { message: 'Job not found' });
          return;
        }

        const isClient = jobs[0].client_id === socket.userId;
        
        let isAuthorized = isClient;
        
        if (!isClient) {
          const submissions = await query(
            'SELECT id FROM submissions WHERE job_id = ? AND freelancer_id = ?',
            [job_id, socket.userId]
          );
          isAuthorized = submissions.length > 0;
        }

        if (!isAuthorized) {
          socket.emit('error', { message: 'Not authorized to send messages' });
          return;
        }

        // Save message to database
        const result = await query(
          `INSERT INTO messages (job_id, sender_id, receiver_id, message_text, attachments)
           VALUES (?, ?, ?, ?, ?)`,
          [job_id, socket.userId, receiver_id, message_text, JSON.stringify(attachments)]
        );

        // Get saved message with user details
        const messages = await query(
          `SELECT 
            m.*,
            s.full_name as sender_name,
            s.profile_photo as sender_photo
          FROM messages m
          LEFT JOIN users s ON m.sender_id = s.id
          WHERE m.id = ?`,
          [result.insertId]
        );

        const message = messages[0];
        message.attachments = JSON.parse(message.attachments || '[]');

        // Emit to job room
        io.to(`job:${job_id}`).emit('message:new', message);

        // Emit to receiver's personal room if they're online
        if (activeUsers.has(receiver_id)) {
          io.to(`user:${receiver_id}`).emit('notification:message', {
            job_id,
            sender_id: socket.userId,
            sender_name: socket.userData.full_name,
            message_text: message_text.substring(0, 100),
            created_at: message.created_at
          });
        }

        console.log(`Message sent in job ${job_id} from ${socket.userId} to ${receiver_id}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      const { job_id, receiver_id } = data;
      
      if (activeUsers.has(receiver_id)) {
        io.to(`user:${receiver_id}`).emit('typing:user', {
          job_id,
          user_id: socket.userId,
          user_name: socket.userData.full_name,
          is_typing: true
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { job_id, receiver_id } = data;
      
      if (activeUsers.has(receiver_id)) {
        io.to(`user:${receiver_id}`).emit('typing:user', {
          job_id,
          user_id: socket.userId,
          user_name: socket.userData.full_name,
          is_typing: false
        });
      }
    });

    // Mark messages as read
    socket.on('messages:read', async (data) => {
      try {
        const { job_id } = data;

        await query(
          `UPDATE messages 
           SET is_read = true, read_at = CURRENT_TIMESTAMP 
           WHERE job_id = ? AND receiver_id = ? AND is_read = false`,
          [job_id, socket.userId]
        );

        socket.emit('messages:marked_read', { job_id });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userData.full_name} (ID: ${socket.userId})`);
      activeUsers.delete(socket.userId);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = setupSocketHandlers;
