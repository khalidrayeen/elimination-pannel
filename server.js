const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store the current background image (default)
let currentBackground = 'https://i.imgur.com/OhBzBjA.png';

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current background to the newly connected client
  socket.emit('set_background', currentBackground);

  // Elimination event from admin
  socket.on('eliminate', ({ team, kills, logo }) => {
    console.log(`Eliminated: ${team} | Kills: ${kills}`);
    io.emit('show_elimination', { team, kills, logo });
  });

  // Background update event from admin
  socket.on('update_background', (url) => {
    currentBackground = url;
    console.log(`Background updated: ${url}`);
    io.emit('set_background', currentBackground);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
