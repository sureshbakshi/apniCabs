import { store } from '../store';
import { showErrorMessage } from '../util';
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

export const onDriverRequestUpdate = (cb) => {
  driverSocket.on(SOCKET_EVENTS.get_ride_requests, (request) => {
    cb(request)
  });
};

export const onActiveRide = (cb) => {
  driverSocket.on(SOCKET_EVENTS.active_ride, (res) => {
    cb(res)
  })
}

export const onDriverStatus = (cb) => {
  driverSocket.on(SOCKET_EVENTS.driver_status, (res) => {
    cb(res)
  })
}

const handleEmitCallback = (cb, res, err) => {
  if (err) {
    showErrorMessage()
  } else {
    cb(res)
  }
}

// emitters
export const emitDriverStatus = (status, cb) => {
  driverSocket.volatile.emit(SOCKET_EVENTS.driver_status, { isOnline: status }, (res, err) => handleEmitCallback(cb, res, err))
}
export const emitAcceptRequest = (item) => {
  driverSocket.volatile.emit(SOCKET_EVENTS.accept_request, item);
};

export const emitDeclineRequest = (item, cb) => {
  driverSocket.volatile.emit(SOCKET_EVENTS.decline_request, item, (res, err) => handleEmitCallback(cb, res, err));
};

export const emitCancelRequest = (activeRequest, cb) => {
  driverSocket.volatile.emit(SOCKET_EVENTS.cancel_ride, activeRequest, (res, err) => handleEmitCallback(cb, res, err));
};

export const updateDriverLocation = () => {
  driverSocket.volatile.emit(SOCKET_EVENTS.driver_location)
}

export const connectSocket = () => {
  console.log(`============= Client connection ==========`)
  driverSocket.connect()
}

export const disconnectSocket = () => {
  driverSocket.disconnect()
  driverSocket.removeAllListeners()
}

driverSocket.on('connect', () => {
  const authStore = store.getState().auth
  const id = authStore?.driverInfo?.id
  if (id){
    console.log(`============= addDevice ==========`)
    driverSocket.emit('addDevice', id)
  }
})


// Add other socket events as needed

export default driverSocket;
