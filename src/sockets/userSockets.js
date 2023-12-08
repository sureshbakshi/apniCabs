import { store } from '../store';
import userSocket from './socketConfig';

const SOCKET_EVENTS = {
  get_ride_requests: 'get_ride_requests',
  active_ride: 'active_ride',
  accept_request: 'accept_request',
  decline_request: 'decline_request',
  cancel_active_ride: 'cancel_active_ride',
  request_status: 'useRequestUpdate'
}

// listeners
export const onRequestUpdate = (cb) => {
  userSocket.on(SOCKET_EVENTS.request_status, (updatedRequest) => {
    // Handle the driver list update in the UI
    cb(updatedRequest)
  });
};

// emitters

export const connectSocket = () => {
  console.log(`============= user socket connection ==========`)
  userSocket.connect()
}

export const disconnectSocket = () => {
  userSocket.disconnect()
  userSocket.removeAllListeners()
}

// userSocket.on('connect', () => {
//   const authStore = store?.getState().auth
//   const id = authStore?.userInfo?.id
//   if (id){
//     console.log(`============= addDevice ==========`)
//     userSocket.emit('addDevice', id)
//   }
// })


// Add other socket events as needed

export default userSocket;

