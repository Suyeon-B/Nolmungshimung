import io from 'socket.io-client';
const sockets = io(`//${process.env.REACT_APP_SERVER_IP}:3003`);
// const sockets = io('http://localhost:3001', { autoConnect: true, forceNew: true });
// // const sockets = io('/');
export default sockets;
