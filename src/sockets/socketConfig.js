// Driver Socket Configuration
import io from 'socket.io-client';

import config from '../util/config';

const socket = io('http://192.168.0.103:3000', {
  // Additional configuration options can be set here
  autoConnect: true, // Automatically establish a connection on creation
  reconnection: true, // Automatically reconnect on connection loss
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
  extraHeaders: {

  }
});

socket.on('connect_error', err => console.log({ 'connect_error': err }))
socket.on('connect_failed', err => console.log({ 'connect_failed': err }))
socket.on('disconnect', err => console.log({ 'disconnect': err }))
socket.on('*', function (packet) {
  console.log({ packet })
});
socket.on('connect', (res) => {
  console.log({ 'connect': res })
  const engine = socket.io.engine;
  engine.on("packet", ({ type, data }) => {
    // called for each packet received
    console.log('received packet',{ type, data })
  });
})

export default socket