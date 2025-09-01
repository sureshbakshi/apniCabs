// socketConfig.js
import io from 'socket.io-client';
import { store } from "../store";
import config from '../util/config';

// URI for the socket server
const socketUri = config.SOCKET_URL

// Ensure the socket instance is created only once
let socket = null;

export const createSocketInstance = (auth = {}, onConnect) => {
  if (socket) {
    socket.disconnect();
  }
  // Replace 'YOUR_SERVER_URL' with your actual server URL
  console.log('Creating socket instance...', socket?.connected);
  socket = io(socketUri, {
    auth: {
      username: config.SOCKET_USER_NAME, // Replace with actual username
      password: config.SOCKET_PASSWORD,  // Replace with actual password
      ...auth  // Replace with actual token
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 5000,
    origins: '*',
    extraHeaders: {

    },
    // transports: ['websocket'],
    // path: '/ws/'
  });
  console.log('Socket instance created:', socket?.connected);
  socket.on('connect', () => {
    console.log('Socket connected!', socket.id);
    onConnect(socket)
  });
  socket.on('connect_error', (err) => {
    console.log('Socket connect error:', err);
  });
  return socket;
};

// Expose the socket instance or a method to get it
export const getSocketInstance = () => {
  // console.log("Getting socket instance...", socket?.id);
  return socket;
};

// Disconnect and clean up the socket instance when needed
export const disconnectSocket = () => {
  if (socket) {
    console.log('Client disconnecting...');
    socket.disconnect();
    socket.removeAllListeners();
    socket = null; // Reset socket to null so it's reinitialized on next use
  }
};

export default getSocketInstance;