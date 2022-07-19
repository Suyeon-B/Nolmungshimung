import io from "socket.io-client";

const socket = io(`http://${process.env.REACT_APP_SERVER_IP}:3001`);

export default socket;
