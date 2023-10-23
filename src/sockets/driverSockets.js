// Driver Socket Configuration
import io from 'socket.io-client';
import Config from "react-native-config";

const driverSocket = io(Config.SOCKET_URL);

export const receiveRequest = (requestData) => {
  driverSocket.on('receive_request', (request) => {
    // Handle the request in the UI
  });
};

export const acceptRequest = () => {
  driverSocket.emit('accept_request');
};

export const declineRequest = () => {
  driverSocket.emit('decline_request');
};

export const cancelRequest = () => {
  driverSocket.emit('cancel_ride');
};

// Add other socket events as needed

export default driverSocket;
