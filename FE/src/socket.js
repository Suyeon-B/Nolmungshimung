import io from "socket.io-client";

// const socket = io(`//${process.env.REACT_APP_SERVER_IP}:3001`);
const socket = io(`//${process.env.REACT_APP_SERVER_IP}:3001`, {
  closeOnBeforeunload: false,
});

export default socket;
