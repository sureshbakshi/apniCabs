// User Socket Configuration
import io from 'socket.io-client';
import Config from "../util/config";

const userSocket = io(Config.SOCKET_URL);

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
