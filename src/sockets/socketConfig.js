// Driver Socket Configuration
import io from 'socket.io-client';
import config from '../util/config';

const socket = io('http://192.168.1.88:3000',{
  // Additional configuration options can be set here
  autoConnect: true, // Automatically establish a connection on creation
  reconnection: true, // Automatically reconnect on connection loss
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
});

export default socket