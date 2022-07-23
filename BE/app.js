global.__base = __dirname + "/";

var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users/users");
var projectsRouter = require("./routes/projects/projects");
var travelRouter = require("./routes/travel/travel");
var commonRouter = require("./routes/common/common");
var voiceRouter = require("./routes/voicetalk/voicetalk");
// var memoRouter = require("./routes/sharememo/shareMemo");
var mongodb = require("dotenv").config();
var fs = require("fs");

voiceRouter;
// memoRouter;

var app = express();
// [원영] 소켓 서버 추가

const privateKey = fs.readFileSync("nolshimung-key.pem", "utf8");
const certificate = fs.readFileSync("nolshimung.pem", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: process.env.PASSPHRASE,
};
var server = require("https").createServer(credentials, app);
// var server = require("http").createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

server.listen(3001, function () {
  console.log("Socket IO server listening on port 3001");
});

const colors = {
  "#FF8A3D": [],
  "#8DD664": [],
  "#FF6169": [],
  "#975FFE": [],
  "#0072BC": [],
  "#F6282B": [],
  "#FAD700": [],
  "#05FFCC": [],
  "#4A4A4A": [],
};

const projectSocketRoom = {};
const projectSchema = require("./models/Project");

// mongoose
var mongoose = require("mongoose");
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function () {
  console.log("Connected");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(`connect err : ${err}`));

io.on("connection", (socket) => {
  //connection
  console.log("UserConnected", socket.id);

  socket.on("connected", (cookie) => {
    socket.emit("entrance-message", `Say hello! to ${user_id.id}`);
  });
  socket.on("disconnect", () => {
    console.log("UserDisconnected");
  });
  socket.on("chat-message", (msg) => {
    console.log("message:", msg);
  });
  ////프로젝트 관련 소켓
  /* 프로젝트에 입장시 입장한 유저 projectSocketRoom에 저장
    프로젝트에 접속한 모든 유저에게 socket 이벤트 전송
  */
  socket.on("projectJoin", ([projectId, userName, selectedIndex]) => {
    try {
      console.log("projectJoin", projectId);
      projectSocketRoom[projectId] = {
        ...projectSocketRoom[projectId],
        [userName]: {
          selectedIndex,
        },
      };
      let colorIndex = 0;

      for (let color in colors) {
        if (!colors[color].includes(projectId)) {
          projectSocketRoom[projectId][userName].color = color;
          colors[color].push(projectId);
          break;
        }
      }
      // console.log(colors);

      // projectSocketRoom[projectId][userName].color =
      //   colors[Object.keys(projectSocketRoom[projectId]).length];

      socket.join(projectId);
      io.to(projectId).emit("connectUser", projectSocketRoom[projectId]);
    } catch (error) {
      console.log(error);
    }
    try {
      // console.log("==================");
      socket.broadcast.to(projectId).emit("notify", userName);
    } catch (error) {
      console.log(error);
    }
  });

  try {
    // console.log("========attention==========");
    socket.on("attention", (date, selectedIndex, projectId, userName) => {
      // console.log("==================");
      // console.log(`date : ${date}`);
      console.log("attention", projectId);
      // console.log(`user_name:${userName}`);
      // socket.emit("attentionPlease", [date, userName]);
      try {
        // console.log("ooooo");
        socket.broadcast.to(projectId).emit("attentionPlease", [date, userName], selectedIndex);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }

  socket.on("projectLeave", ([projectId, userName]) => {
    try {
      console.log("projectLeave", projectId);
      socket.leave(projectId);
      const userColor = projectSocketRoom[projectId][userName].color;
      colors[userColor] = colors[userColor].filter((id) => {
        return id !== projectId;
      });
      delete projectSocketRoom[projectId][userName];
      console.log(projectSocketRoom[projectId]);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("changeRoute", ([itemsRoute, projectId]) => {
    socket.broadcast.to(projectId).emit("updateRoute", itemsRoute);
  });

  //마우스 커서 관련 socket
  socket.on("detail_date_join", ([project_Id, selectedIndex]) => {
    console.log("detail_date_join", selectedIndex);
    socket.join(project_Id + selectedIndex);
  });
  socket.on("detail_date_leave", ([project_Id, userName, selectedIndex]) => {
    console.log("detail_date_leave", selectedIndex);
    socket.broadcast.to(project_Id + selectedIndex).emit("deleteCurser", userName);

    socket.leave(project_Id + selectedIndex);
  });
  socket.on("exitSharedEditing", ([projectID, selectedIndex, name]) => {
    console.log("deleteCurser", projectID, selectedIndex, name);
    socket.broadcast.to(projectID).emit("deleteCurser", name);
  });

  socket.on("mouse_move", ([projectId, mouseInfo, selectedIndex, userName]) => {
    // console.log(projectId, mouseInfo, selectedIndex, userName);
    try {
      mouseInfo[userName].color = projectSocketRoom[projectId][userName].color;
      socket.broadcast.to(projectId + selectedIndex).emit("mouse_update", mouseInfo);
    } catch (error) {
      // console.log(error);
    }
  });
  ////
  socket.on("updateUserIndex", ([projectId, userName, selectedIndex]) => {
    try {
      projectSocketRoom[projectId][userName].selectedIndex = selectedIndex;
      socket.broadcast.to(projectId).emit("connectUser", projectSocketRoom[projectId]);
    } catch (error) {
      // console.log(error);
    }
  });

  // [Hyeok] Grab Routes
  // socket.on("grabSpot", ([projectId, userName, selectedIndex])=>{});

  socket.on("save_memo", async ([projectId, quillRefEditor]) => {
    // console.log("@@@@@ save-memo @@@@@");
    // console.log(projectId, quillRefEditor);

    const project = await findProjectById(projectId);
    if (project) {
      await projectSchema.findByIdAndUpdate(projectId, { quillRefEditor });
    }

    // console.log("@@@@@ projectConnectUser @@@@@");
    // console.log(projectConnectUser);
    // console.log(socket.adapter.rooms);
    const socketRooms = socket.adapter.rooms;
    const projectConnectUser = socketRooms.get(projectId)?.size;
    console.log(projectConnectUser);
    socket.broadcast.to(projectId).emit("projectConnectUser", projectConnectUser);
  });
});

// [수연] share-memo 관련
async function findProjectById(id) {
  try {
    if (id == null) return;
    const project = await projectSchema.findById(id);
    if (project) return project;
  } catch (err) {
    console.log(err);
  }
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ credentials: true, origin: true })); //credential은 프론트엔드의 fetch를 통해서 cookie를 넘기기 위해서 사용함. (프론트엔드에서는 "credentials:true" 설정 필요)

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/travel", travelRouter);
app.use("/common", commonRouter);
// app.use("/voicetalk", voiceRouter);

module.exports = app;
