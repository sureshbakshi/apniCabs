const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const mock = require('../src/mock/rideRequests');
const bodyParser = require('body-parser');

let driver_status = true
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
    emitActiveRide();
  });
  socket.on('cancel_ride', (item, cb) => {
    cb(item);
  });
  socket.on('decline_request', (item, cb) => {
    cb(item);
  });

  // driver events

  socket.on('driver_status', (req, cb) => {
    driver_status = req?.isOnline
    cb({isOnline: req?.isOnline});
  });

  // sample timer functions
  const emitDriverStatus = status => {
    driver_status = status
    socket.emit('driver_status', {isOnline: status});
  };

  const emitActiveRide = status => {
    io.emit('active_ride', {...getRandomMock(), active_request_id: 5});
  };

  const getRandomMock = () => {
    const max = 7, min = 0
      const index = Math.floor(Math.random() * (max - min + 1)) + min;

      return {...mock[index]}
  }
  const emitRideRequests = () => {

    if(driver_status) {
      io.emit('get_ride_requests', getRandomMock());
    }
  };

  const timerFunctions = () => {
    emitRideRequests();
    // emitActiveRide();
    // emitDriverStatus(Math.random() < 0.5);
  };

  // const interval = 1000*30; // 1000 milliseconds = 1 second
  // const intervalId = setInterval(timerFunctions, interval);
  // setTimeout(() => {
  //   clearInterval(intervalId);
  //   console.log('Interval stopped after 5 seconds');
  // }, 1000 * 60);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
