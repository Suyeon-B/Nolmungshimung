var express = require("express");
var fs = require("fs");
const router = express.Router();
const path = require("path");

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

server.listen(3004, function () {
  console.log("For Notification Socket IO server listening on port 3004");
});

io.on("connection", (socket) => {
  console.log("============================");
  console.log(`Notification Soket Connect`);
});

module.exports = router;
