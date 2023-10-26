const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    io.emit('message', message); // Broadcast the message to all connected clients
  });
  

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  setInterval(
    () => {
      io.emit('get_ride_requests', `test_${Math.round(Math.random()*2)}`)
    }, 10000
  )
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
