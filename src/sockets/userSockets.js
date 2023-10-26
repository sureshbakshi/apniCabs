// User Socket Configuration
import userSocket from './socketConfig';

export const sendRequest = (requestData) => {
  userSocket.emit('send_request', requestData);
};

export const cancelRequest = () => {
  userSocket.emit('cancel_ride');
};

export const getDrivers = () => {
  userSocket.on('get_drivers', (driverList) => {
    // Handle the driver list update in the UI
  });
};

// Add other socket events as needed

export default userSocket;
