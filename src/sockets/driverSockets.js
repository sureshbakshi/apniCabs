import { showErrorMessage } from '../util';
import driverSocket from './socketConfig';

const SOCKET_EVENTS = {
  get_ride_requests: 'get_ride_requests',
  active_ride: 'active_ride',
  accept_request: 'accept_request',
  decline_request: 'decline_request',
  cancel_ride: 'cancel_ride',
  driver_location: 'driver_location',
  driver_status: 'driver_status'
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

export const onDriverStatus = (cb) => {
  driverSocket.on(SOCKET_EVENTS.driver_status, (res) =>{
    cb(res)
  })
}


// emitters
export const emitDriverStatus = (status, cb) => {
  driverSocket.emit(SOCKET_EVENTS.driver_status, {isOnline: status}, (res, err) => {
    if(err) {
      showErrorMessage()
    }else{
      cb(res?.isOnline)
    }
  })
}
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
  console.log(`============= Client connection ==========`)
  driverSocket.connect()
}

export const disconnectSocket = () => {
  driverSocket.disconnect()
  driverSocket.removeAllListeners()
}



// Add other socket events as needed

export default driverSocket;
