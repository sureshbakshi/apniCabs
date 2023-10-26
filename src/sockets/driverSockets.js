import driverSocket from './socketConfig';

const SOCKET_EVENTS = {
  get_ride_requests: 'get_ride_requests',
  active_ride: 'active_ride',
  accept_request: 'accept_request',
  decline_request: 'decline_request',
  cancel_ride: 'cancel_ride',
  driver_location: 'driver_location'
}

// listeners
export const getRideRequests = (requestData) => {
  driverSocket.on(SOCKET_EVENTS.get_ride_requests, (response) => {
    // Handle the request in the UI
    console.log(response)
  });
};

export const onActiveRide = (cb) => {
  driverSocket.on(SOCKET_EVENTS.active_ride, (res) =>{
    cb(res)
  })
}


// emitters
export const acceptRequest = (item) => {
  driverSocket.emit(SOCKET_EVENTS.accept_request, item);
};

export const declineRequest = () => {
  driverSocket.emit(SOCKET_EVENTS.decline_request);
};

export const cancelRequest = () => {
  driverSocket.emit(SOCKET_EVENTS.cancel_ride);
};

export const updateDriverLocation = () =>{
  driverSocket.emit(SOCKET_EVENTS.driver_location)
}

export const connectSocket = () => {
  driverSocket.connect()
}

export const disconnectSocket = () => {
  driverSocket.disconnect()
  driverSocket.removeAllListeners()
}



// Add other socket events as needed

export default driverSocket;
