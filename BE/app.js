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

mongoose
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

// [수연] share-memo with collaborative cursors
// create and start server on 7899 port by default
var OkdbServer = require("okdb-server");
var options = {
  cors: {
    enabled: true,
  },
};
var okdb = new OkdbServer(options);

const userSchema = require("./models/User");

// sample authentication, e.g. should validate your own auth token
let nameIdx = 0;
try {
  okdb.handlers().auth((myNickname) => {
    // const users = getUserByUser_email(user_email);
    // console.log(`\n\nusers : ${users.user_email}\n\n`);
    if (myNickname) {
      console.log("auth attempt for ", myNickname, " success");
      const userName = myNickname; // 나중에 users.user_name으로 바꾸기
      const userId = "1" + nameIdx;
      nameIdx = (nameIdx + 1) % 10;
      return { id: userId, name: userName };
    }
    console.log("auth attempt for ", myNickname, " failed");
    return null;
  });
} catch (err) {
  console.log(err);
}

async function getUserByUser_email(user_email) {
  try {
    if (user_email == null) return;
    const users = await userSchema.findOne({ user_email: `${user_email}` });
    if (users) return users;
  } catch (err) {
    console.log(err);
  }
}

// Handling Ctrl-C (workaround for Windows)
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}
//graceful shutdown on Ctrl-C (all other platforms)
process.on("SIGINT", function () {
  okdb.stop(() => {
    console.log("server stopped");
    process.exit();
  });
});

module.exports = app;
