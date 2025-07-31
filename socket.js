const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

// Setup
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '')));
app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: ["https://voicecallwebapp.onrender.com", "*"], 
    methods: ["GET", "POST"]
  }
});

// Serve static HTML (if any)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'socket.html'));
});

// In-memory user map: { socket.id: username }
const users = {};

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Register user
  socket.on('register', (username) => {
    users[socket.id] = username;
    io.emit('user-list', getUserList());
    console.log(`🆔 ${username} registered with ID: ${socket.id}`);
  });

  // Handle call request
  socket.on('call-user', ({ to, from }) => {
    console.log(`📞 ${from} is calling ${to}`);
    io.to(to).emit('incoming-call', { from, fromName: users[from] });
  });

  // Handle call accept
  socket.on('accept-call', ({ to, from }) => {
    console.log(`✅ ${from} accepted call from ${to}`);
    io.to(to).emit('call-accepted', { from });
  });

  // Handle signaling (offer/answer/candidates)
  socket.on('signal', ({ to, data }) => {
    console.log(`📶 Signal from ${socket.id} to ${to}: ${data?.type || 'ICE'}`);
    io.to(to).emit('signal', { from: socket.id, data });
  });

  // Handle call ended
  socket.on('call-ended', ({ to }) => {
    console.log(`🔚 Call ended by ${socket.id}`);
    io.to(to).emit('call-ended', { from: socket.id });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit('user-list', getUserList());
  });
});

// Utility
function getUserList() {
  return Object.keys(users).map((id) => ({
    id,
    username: users[id]
  }));
}

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server running at http://localhost:${PORT}`);
});
