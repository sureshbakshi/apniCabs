// Driver Socket Configuration
import io from 'socket.io-client';
import { store } from "../store";

// baseUrl: 'http://192.168.0.101:3000/', //rajesh IP
// const socketUri = 'http://ec2-65-0-142-176.ap-south-1.compute.amazonaws.com:8080/'
// const socketUri = "https://apnicabi.com"
// const socketUri = 'http://192.168.150.226:8080/'
const socketUri = "http://notification-service-350461574.ap-south-1.elb.amazonaws.com/"
const state = store?.getState();
const socket = io(socketUri, {
  // Additional configuration options can be set here
  auth: {
    username: 'socket_user_dev', // Replace with actual username
    password: 'L10H70KIQR97KXKNQ4VQI40IUG549114',  // Replace with actual password
    userId: state.auth?.userInfo?.id, // Replace with actual userId
    token: state.auth?.access_token
  },
  autoConnect: true, // Automatically establish a connection on creation
  reconnection: true, // Automatically reconnect on connection loss
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 50000, // Delay between reconnection attempts in milliseconds
  origins: '*',
  extraHeaders: {

  },
  // transports: ['websocket'],
  // path: '/ws/'
});

socket.on('connect_error', err => console.log({ 'connect_error': err }))
socket.on('connect_failed', err => console.log({ 'connect_failed': err }))
socket.on('disconnect', err => console.log({ 'disconnect': err }))
socket.on('*', function (packet) {
  console.log({ packet })
});
// socket.on('connect', () => {
//   const engine = socket.io.engine;
//   engine.on("packet", ({ type, data }) => {
//     // called for each packet received
//     console.log('received packet',{ type, data })
//   });
// })

export const disconnectSocket = () => {
  console.log(`============= Client disconnecting ==========`)
  socket?.disconnect()
  socket?.removeAllListeners()
}

export default socket