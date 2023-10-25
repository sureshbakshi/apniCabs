import io from 'socket.io-client';
const SERVER_URL = 'http://192.168.1.88:3000'; // Change this to your server's URL
const socket = io(SERVER_URL);
export default socket;