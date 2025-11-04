const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Store active rooms and their whiteboard states
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { elements: [] });
    }

    // Send current room state to the newly joined user
    socket.emit('room-state', rooms.get(roomId));

    // Notify others in the room
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Handle element updates
  socket.on('update-elements', ({ roomId, elements }) => {
    // Update room state
    if (rooms.has(roomId)) {
      rooms.set(roomId, { elements });
    }

    // Broadcast to all other users in the room
    socket.to(roomId).emit('elements-updated', elements);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
