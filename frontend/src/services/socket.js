import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        userId: userId
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connected', (data) => {
      console.log('Socket connected:', data);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinJob(jobId) {
    if (this.socket) {
      this.socket.emit('join:job', { job_id: jobId });
    }
  }

  leaveJob(jobId) {
    if (this.socket) {
      this.socket.emit('leave:job', { job_id: jobId });
    }
  }

  sendMessage(jobId, receiverId, messageText, attachments = []) {
    if (this.socket) {
      this.socket.emit('message:send', {
        job_id: jobId,
        receiver_id: receiverId,
        message_text: messageText,
        attachments
      });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('message:new', callback);
    }
  }

  onMessageNotification(callback) {
    if (this.socket) {
      this.socket.on('notification:message', callback);
    }
  }

  startTyping(jobId, receiverId) {
    if (this.socket) {
      this.socket.emit('typing:start', { job_id: jobId, receiver_id: receiverId });
    }
  }

  stopTyping(jobId, receiverId) {
    if (this.socket) {
      this.socket.emit('typing:stop', { job_id: jobId, receiver_id: receiverId });
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('typing:user', callback);
    }
  }

  markMessagesAsRead(jobId) {
    if (this.socket) {
      this.socket.emit('messages:read', { job_id: jobId });
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
