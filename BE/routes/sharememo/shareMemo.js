var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");

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

server.listen(7899, function () {
  console.log("ShareMemo Socket IO server listening on port 7899");
});

const projectSchema = require("../../models/Project");

io.on("connection", (socket) => {
  socket.on("get-project", async (projectId) => {
    const project = await findProjectById(projectId);
    if (project) {
      socket.join(projectId);
      socket.emit("load-project", project.memo);

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(projectId).emit("receive-changes", delta);
      });

      socket.on("save-project", async (memo) => {
        await projectSchema.findByIdAndUpdate(projectId, { memo });
      });
    } else {
      console.log("없는 프로젝트입니다.");
    }
  });
});

async function findProjectById(id) {
  try {
    if (id == null) return;
    const project = await projectSchema.findById(id);
    console.log(project);
    if (project) return project;
  } catch (err) {
    console.log(err);
  }
}

module.exports = io;
