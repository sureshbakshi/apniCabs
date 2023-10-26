import driverSocket from './socketConfig';

export const getRideRequests = (requestData) => {
  driverSocket.on('get_ride_requests', (response) => {
    // Handle the request in the UI
    console.log(response)
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

export const updateDriverLocation = () =>{
  driverSocket.emit('driver_location')
}

export const connectSocket = () => {
  driverSocket.connect()
}

export const disconnectSocket = () => {
  driverSocket.disconnect()
}


// Add other socket events as needed

export default driverSocket;
