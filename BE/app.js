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
var mongodb = require("dotenv").config();

var app = express();

// mongoose
var mongoose = require("mongoose");
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function () {
  console.log("Connected");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var db;
mongoose
  // .connect("mongodb://localhost/shareMemo")
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(`connect err : ${err}`));

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
app.use("/voicetalk", voiceRouter);

// [수연][TextEditor] socket io 작업 | line 51~90
const io = require("socket.io")(3001, {
  cors: {
    origin: `http://${process.env.REACT_APP_SERVER_IP}:3000`,
    methods: ["GET", "POST"],
  },
});

const projectSchema = require("./models/Project");

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
    if (project) return project;
  } catch (err) {
    console.log(err);
  }
}

module.exports = app;
