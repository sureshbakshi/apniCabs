const http = require('http');
const socketio = require('socket.io');

const server = http.createServer();
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (message) => {
    console.log('message:', message);
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});
server.listen(3000, () => {
  console.log('Socket.io server listening on port 3000');
});