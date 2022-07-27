import io from "socket.io-client";

// const socket = io(`https://${process.env.REACT_APP_SERVER_IP}:3001`);
const socket = io(`https://${process.env.REACT_APP_SERVER_IP}:3001`, {
  closeOnBeforeunload: false,
});

export default socket;
