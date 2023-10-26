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

  const timerFunctions = () => {
    io.emit('get_ride_requests', `test_${Math.round(Math.random() * 2)}`)
    activeRide()
  }


  // const interval = 5000; // 1000 milliseconds = 1 second
  // const intervalId = setInterval(timerFunctions, interval);
  // setTimeout(() => {
  //   clearInterval(intervalId);
  //   console.log('Interval stopped after 5 seconds');
  // }, 50000);

  const activeRide = (status) => {
    io.emit('active_ride', status)
  }
  socket.on('accept_request', (item) => {
    activeRide(true)
  })
  socket.on('cancel_ride', (item) => {
    activeRide(false)
  })
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
