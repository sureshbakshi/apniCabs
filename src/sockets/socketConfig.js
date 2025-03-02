// socketConfig.js
import io from 'socket.io-client';
import { store } from "../store";
import config from '../util/config';

// URI for the socket server
const socketUri = config.SOCKET_URL

// Ensure the socket instance is created only once
let socket = null;

const createSocketInstance = () => {
  if (!socket) {
    const state = store?.getState(); // Access state to get user info
    socket = io(socketUri, {
      auth: {
        username: config.SOCKET_USER_NAME, // Replace with actual username
        password: config.SOCKET_PASSWORD,  // Replace with actual password
        userId: state.auth?.userInfo?.id,  // Replace with actual userId
        token: state.auth?.access_token,  // Replace with actual token
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

    socket.on('connect_error', err => console.log('connect_error:', err));
    socket.on('error', err => console.log('error:', err));
    socket.on('welcome', data => console.log('welcome:', data));
    socket.on('disconnect', err => console.log('disconnected:', err));
  }

  return socket;
};

// Expose the socket instance or a method to get it
export const getSocketInstance = () => {
  return createSocketInstance();
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