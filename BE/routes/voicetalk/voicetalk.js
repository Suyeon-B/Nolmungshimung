var express = require("express");
var fs = require("fs");
const path = require('path');

var app = express();


const privateKey = fs.readFileSync("nolshimung-key.pem", "utf8");
const certificate = fs.readFileSync("nolshimung.pem", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: process.env.PASSPHRASE,
};

app.use(express.static(path.join(__dirname, "public")));
var server = require("https").createServer(credentials, app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

let socketList = {};


server.listen(3003, function () {
  console.log("For Voice Socket IO server listening on port 3003");
});

// Socket
io.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);
  
    socket.on('disconnect', () => {
      socket.disconnect();
      console.log('User disconnected!');
    });
  
    socket.on('BE-check-user', ({ roomId, userName }) => {
      let error = false;
  
    //   io.sockets.in(roomId).clients((err, clients) => {
        // Array.from(socket.rooms).forEach((err, clients) => {
        Array.from(socket.rooms).forEach((client) => {
          if (socketList[client] == userName) {
            error = true;
          }
        });
        socket.emit('FE-error-user-exist', { error });
    //   });
    });
  
    /**
     * Join Room
     */
    socket.on('BE-join-room', ({ roomId, userName }) => {
      // Socket Join RoomName
      socket.join(roomId);
      socketList[socket.id] = { userName, video: false, audio: true };
    console.log(`소켓 시작 , ${socket.rooms[roomId]}`);
      // Set User List
    //   io.sockets.in(roomId).clients((err, clients) => {
        // Array.from(socket.rooms).forEach((err, clients) => {
        //     console.log('p------------', clients)
        try {
          const users = [];
          Array.from(socket.rooms).forEach((client) => {
            // Add User List
            console.log('----', socketList[client], client)
            users.push({ userId: client, info: socketList[client] });
          });
          socket.broadcast.except(roomId).emit('FE-user-join', users);
          // io.sockets.in(roomId).emit('FE-user-join', users);
        } catch (e) {
          io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
        }
    //   });
      console.log('----n o')
    });
  
    socket.on('BE-call-user', ({ userToCall, from, signal }) => {
      io.to(userToCall).emit('FE-receive-call', {
        signal,
        from,
        info: socketList[socket.id],
      });
    });
  
    socket.on('BE-accept-call', ({ signal, to }) => {
      io.to(to).emit('FE-call-accepted', {
        signal,
        answerId: socket.id,
      });
    });
  
    socket.on('BE-send-message', ({ roomId, msg, sender }) => {
      io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
    });
  
    socket.on('BE-leave-room', ({ roomId, leaver }) => {
      delete socketList[socket.id];
      socket.broadcast
        .to(roomId)
        .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
      io.sockets.sockets[socket.id].leave(roomId);
    });
  
    socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
      if (switchTarget === 'video') {
        socketList[socket.id].video = !socketList[socket.id].video;
      } else {
        socketList[socket.id].audio = !socketList[socket.id].audio;
      }
      socket.broadcast
        .to(roomId)
        .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
    });
  });

module.exports = io;