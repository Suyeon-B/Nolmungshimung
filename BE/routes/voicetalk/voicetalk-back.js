/* JG - openVidu voicetalk */
var cors = require("cors");

var OpenVidu = require("openvidu-node-client").OpenVidu;
var OpenViduRole = require("openvidu-node-client").OpenViduRole;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Node imports
var express = require("express");
// var fs = require("fs");
// var session = require("express-session");
// var https = require("https");
var bodyParser = require("body-parser"); // Pull information from HTML POST (express4)
var path = require("path");

// const __dirname = path.resolve();

var app = express(); // Create our app with express

app.use(
  bodyParser.urlencoded({
    extended: "true",
  })
); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(
  bodyParser.json({
    type: "application/vnd.api+json",
  })
); // Parse application/vnd.api+json as json
app.use(cors({ credentials: true, origin: true }));
// Listen (start app with node server.js)
// var options = {
//   key: fs.readFileSync("openvidukey.pem"),
//   cert: fs.readFileSync("openviducert.pem"),
// };

// https.createServer(options, app).listen(7443);

// Mock datab

// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = 'https://3.36.48.148:4443';
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = 'MY_SECRET';

// Entrypoint to OpenVidu Node Client SDK
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// Collection to pair session names with OpenVidu Session objects
var mapSessions = {};
// Collection to pair session names with tokens
var mapSessionNamesTokens = {};

console.log("App listening on port 7443");

/* CONFIGURATION */

/* REST API */
// JG -> 로그인 로그아웃 기능 우선 생략 - 세션도 아직 못정함
// Login
app.get("/api", function (req, res){
    return res.status(200).send({
        'a':1
    })
})

// app.post("/api-login/login", function (req, res) {
//   // Retrieve params from POST body
//   var user = req.body.user;
//   var pass = req.body.pass;
//   console.log("Logging in | {user, pass}={" + user + ", " + pass + "}");

//   if (login(user, pass)) {
//     // Correct user-pass
//     // Validate session and return OK
//     // Value stored in req.session allows us to identify the user in future requests
//     console.log("'" + user + "' has logged in");
//     req.session.loggedUser = user;
//     res.status(200).send();
//   } else {
//     // Wrong user-pass
//     // Invalidate session and return error
//     console.log("'" + user + "' invalid credentials");
//     req.session.destroy();
//     res.status(401).send("User/Pass incorrect");
//   }
// });

// Logout
// app.post("/api-login/logout", function (req, res) {
//   console.log("'" + req.session.loggedUser + "' has logged out");
//   req.session.destroy();
//   res.status(200).send();
// });

/* REST API */

// Get token (add new user to session)
app.post("/api-sessions/get-token", function (req, res) {
    var sessionName = req.body.project_id;
    var loggedUser = req.body.loggedUser;
    var role = OpenViduRole.PUBLISHER;
    var serverData = JSON.stringify({ serverData: loggedUser });

    // console.log("Getting a token | {projectId}={" + sessionName + "}, {loggedUser}={" + loggedUser);

    var connectionProperties = {
      data: serverData,
        role: role,
    };

    if (mapSessions[sessionName]) {
      // Session already exists
      // console.log("Existing session " + sessionName);

      var mySession = mapSessions[sessionName];

      // 신규토큰 생성
      mySession
        .createConnection(connectionProperties)
        .then((connection) => {
          mapSessionNamesTokens[sessionName].push(connection.token);
          res.status(200).send({
            0: connection.token,
          });
        })
        .catch((error) => {
          console.error(error);
        });
        
    } else {
      // New session
      // console.log("New session " + sessionName);
      
      OV.createSession()
        .then((session) => {
          mapSessions[sessionName] = session;
          mapSessionNamesTokens[sessionName] = [];
          session
            .createConnection(connectionProperties)
            .then((connection) => {
              mapSessionNamesTokens[sessionName].push(connection.token);
              // console.log(connectionProperties.role);
              res.status(200).send({
                0: connection.token,
              });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
});

// Remove user from session
app.post("/api-sessions/remove-user", function (req, res) {
    var sessionName = req.body.sessionName;
    var token = req.body.token;
    // console.log(
    //   "Removing user | {sessionName, token}={" +
    //     sessionName +
    //     ", " +
    //     token +
    //     "}"
    // );

    // If the session exists
    if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
      var tokens = mapSessionNamesTokens[sessionName];
      var index = tokens.indexOf(token);

      if (index !== -1) {
        tokens.splice(index, 1);
        // console.log(sessionName + ": " + tokens.toString());
      } else {
        var msg = "Problems in the app server: the TOKEN wasn't valid";
        // console.log(msg);
        res.status(500).send(msg);
      }
      if (tokens.length == 0) {
        // Last user left: session must be removed
        // console.log(sessionName + " empty!");
        delete mapSessions[sessionName];
      }
      res.status(200).send();
    } else {
      // var msg = "Problems in the app server: the SESSION does not exist";
      // console.log(msg);
      res.status(500).send(msg);
    }
});

module.exports = app;

