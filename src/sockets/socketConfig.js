// Driver Socket Configuration
import io from 'socket.io-client';

import config from '../util/config';
// baseUrl: 'http://192.168.0.101:3000/', //rajesh IP
const socketUri = 'http://ec2-65-0-142-176.ap-south-1.compute.amazonaws.com:8080/'
// const socketUri = 'http://192.168.0.105:3000'
const socket = io(socketUri, {
  // Additional configuration options can be set here
  autoConnect: true, // Automatically establish a connection on creation
  reconnection: true, // Automatically reconnect on connection loss
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
  origins: '*',
  extraHeaders: {

  }
});

socket.on('connect_error', err => console.log({ 'connect_error': err }))
socket.on('connect_failed', err => console.log({ 'connect_failed': err }))
socket.on('disconnect', err => console.log({ 'disconnect': err }))
socket.on('*', function (packet) {
  console.log({ packet })
});
socket.on('connect', () => {
  const engine = socket.io.engine;
  engine.on("packet", ({ type, data }) => {
    // called for each packet received
    console.log('received packet',{ type, data })
  });
})

export default socket