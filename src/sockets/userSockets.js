import userSocket from './socketConfig';

const SOCKET_EVENTS = {
  get_ride_requests: 'get_ride_requests',
  active_ride: 'active_ride',
  accept_request: 'accept_request',
  decline_request: 'decline_request',
  cancel_active_ride: 'cancel_active_ride',
  request_status: 'request_status'
}

// listeners
export const onRequestUpdate = (cb) => {
  userSocket.on(SOCKET_EVENTS.request_status, (updatedRequest) => {
    // Handle the driver list update in the UI
    cb(updatedRequest)
  });
};

export const onActiveRide = (cb) => {
  userSocket.on(SOCKET_EVENTS.active_ride, (res) =>{
    cb(res)
  })
}

export const onCanceActiveRide = (cb) => {
  userSocket.on(SOCKET_EVENTS.cancel_active_ride, (res) =>{
    cb(res)
  })
}

// emitters

export const connectSocket = () => {
  userSocket.connect()
}

export const disconnectSocket = () => {
  userSocket.disconnect()
  userSocket.removeAllListeners()
}



// Add other socket events as needed

export default userSocket;

