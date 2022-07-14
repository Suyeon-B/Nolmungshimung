var express = require("express");
var router = express.Router();
var OpenVidu = require("openvidu-node-client").OpenVidu;
var OpenViduRole = require("openvidu-node-client").OpenViduRole;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* CONFIGURATION */
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

/* REST API */
// Get token (add new user to session)

router.post("/api-sessions/get-token", function (req, res) {
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
    //   console.log("Existing session " + sessionName);

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
    //   console.log("New session " + sessionName);
      
      OV.createSession()
        .then((session) => {
          mapSessions[sessionName] = session;
          mapSessionNamesTokens[sessionName] = [];
          session
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
        })
        .catch((error) => {
          console.error(error);
        });
    }
});

// Remove user from session
router.post("/api-sessions/remove-user", function (req, res) {
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

module.exports = router;