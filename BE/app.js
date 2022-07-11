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
const connect = mongoose
  .connect(
    "mongodb+srv://youngji:dudwl0804@cluster0.yjqhx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(`connect err : ${err}`));

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// var db;
// const connect = mongoose
//   .connect("mongodb+srv://dnjsdud2257:mongomongo@cluster0.zqmheld.mongodb.net/?retryWrites=true&w=majority")
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => console.log(`connect err : ${err}`));

app.use(cors({ credentials: true, origin: true })); //credential은 프론트엔드의 fetch를 통해서 cookie를 넘기기 위해서 사용함. (프론트엔드에서는 "credentials:true" 설정 필요)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/travel", travelRouter);
app.use("/common", commonRouter);

// [수연][TextEditor] socket io 작업 | line 51~90
// const mongoose = require("mongoose");
// const Document = require("./models/Document");

// mongoose
//   //   .connect("mongodb+srv://tndus4243:내비번이지롱@jungle.j4qlpgi.mongodb.net/?retryWrites=true&w=majority")
//   .connect("mongodb://localhost/shareMemo")
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => console.log(`connect err : ${err}`));

// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// const defaultValue = "";

// io.on("connection", (socket) => {
//   socket.on("get-document", async (documentID) => {
//     const document = await findOrCreateDocument(documentID);
//     socket.join(documentID);
//     socket.emit("load-document", document.data);

//     socket.on("send-changes", (delta) => {
//       socket.broadcast.to(documentID).emit("receive-changes", delta);
//     });

//     socket.on("save-document", async (data) => {
//       await Document.findByIdAndUpdate(documentID, { data });
//     });
//   });
// });

// async function findOrCreateDocument(id) {
//   if (id == null) return;
//   const document = await Document.findById(id);
//   if (document) return document;
//   return await Document.create({ _id: id, data: defaultValue });
// }

module.exports = app;
