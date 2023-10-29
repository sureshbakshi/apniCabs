const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const mock = require('../src/mock/rideRequests');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.post('/sendRequest', (req, res) => {
  console.log('req',req)
  const {request_id, vehicle_id} = req.body;
  res
    .status(200)
    .json({data: {...mock[0], request_id, vehicle_id, status: 'Pending'}});
});

io.on('connection', socket => {
  console.log('A user connected');
  socket.on('message', message => {
    console.log(`Received message: ${message}`);
    io.emit('message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('accept_request', item => {
    activeRide(true);
  });
  socket.on('cancel_ride', item => {
    activeRide(false);
  });

  // driver events

  socket.on('driver_status', (req, cb) => {
    cb({isOnline: req?.isOnline});
  });

  // sample timer functions
  const emitDriverStatus = status => {
    socket.emit('driver_status', {isOnline: status});
  };

  const emitActiveRide = status => {
    io.emit('active_ride', status);
  };

  const emitRideRequests = () => {
    io.emit('get_ride_requests', `test_${Math.round(Math.random() * 2)}`);
  };

  const timerFunctions = () => {
    emitRideRequests();
    emitActiveRide();
    emitDriverStatus(Math.random() < 0.5);
  };

  // const interval = 5000; // 1000 milliseconds = 1 second
  // const intervalId = setInterval(timerFunctions, interval);
  // setTimeout(() => {
  //   clearInterval(intervalId);
  //   console.log('Interval stopped after 5 seconds');
  // }, 50000);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
