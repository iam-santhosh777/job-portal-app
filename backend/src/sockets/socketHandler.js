const { verifyToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function initializeSocket(io) {
  // Socket.io authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.error('❌ Socket authentication error: No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // Join role-based rooms for targeted messaging
    socket.join(socket.user.role);
    socket.join(`user-${socket.user.id}`);

    // Handle socket errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error.message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
    });

    // Handle custom events if needed
    socket.on('ping', () => {
      socket.emit('pong', { message: 'Server is alive', timestamp: new Date() });
    });
  });

  // Handle connection errors
  io.on('connection_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  return io;
}

module.exports = initializeSocket;

