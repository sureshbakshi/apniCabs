import { store } from '../store';
import driverSocket from './socketConfig';

const SOCKET_EVENTS = {
  // new Events
  add_device: 'addDevice',
  get_ride_requests: 'request',
  driver_request_update: 'driverRequestUpdate',
  // new Events end
  active_ride: 'active_ride',
  accept_request: 'accept_request',
  decline_request: 'decline_request',
  cancel_ride: 'cancel_ride',
  driver_location: 'driver_location',
  driver_status: 'driver_status'
}

// listeners
export const onGetRideRequests = (cb) => {
  driverSocket.on(SOCKET_EVENTS.get_ride_requests, (request) => {
    cb(request)
  });
};

export const connectSocket = () => {
  console.log(`============= Client connection ==========`)
  driverSocket.connect()
}

export const disconnectSocket = () => {
  console.log(`============= Client disconnecting ==========`)
  driverSocket.disconnect()
  // driverSocket.removeAllListeners()
}

// driverSocket.on('connect', () => {
//   const authStore = store.getState().auth
//   const id = authStore?.driverInfo?.id
//   if (id){
//     console.log(`============= addDevice ==========`)
//     driverSocket.emit('addDevice', id)
//   }
// })


// Add other socket events as needed

export default driverSocket;
