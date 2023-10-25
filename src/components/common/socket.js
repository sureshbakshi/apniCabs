import io from 'socket.io-client';

const socket = io('http://192.168.29.227:3000');
export default socket;