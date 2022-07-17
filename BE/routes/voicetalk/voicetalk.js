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

  socket.on('BE-check-user', async({ roomId, userName }) => {
    let error = false;

    await io.sockets.in(roomId).allSockets((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  });

  /**
   * Join Room
   */
  socket.on('BE-join-room', async({ roomId, userName }) => {
    // Socket Join RoomName
    await socket.join(roomId);
    socketList[socket.id] = { userName, video: true, audio: true };
    console.log(`dhsi우냐? : ${JSON.stringify(socketList)}`);
    console.log(io.sockets.in(roomId).allSockets())
    console.log(await io.allSockets())
    // Set User List
    // await io.sockets.in(roomId).allSockets((err, clients) => {
    //   console.log('clients:::::: ', clients)
      try {
        const users = [];
        const clients = await io.sockets.in(roomId).allSockets();
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: socketList[client] });
        });

        socket.broadcast.to(roomId).emit('FE-user-join', users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        console.log(`BE-join-room Err ${e}`)
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
      }
    // });
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