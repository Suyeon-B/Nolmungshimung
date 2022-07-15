var express = require("express");
var router = express.Router();
var OpenVidu = require("openvidu-node-client").OpenVidu;
var OpenViduRole = require("openvidu-node-client").OpenViduRole;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* CONFIGURATION */
var OV = new OpenVidu('https://13.125.6.251:4443', 'MY_SECRET');

// session 방에 대한 정보 .
var mapSessions = {};
// session 토큰과 관련됨.
var mapSessionNamesTokens = {};

/* REST API */
// Get token - 토큰 얻기

router.post("/api-sessions/get-token", function (req, res) {
    // 프로젝트 아이디로 방 생성, 아이디로 유저 구분
    var sessionName = req.body.project_id;
    var loggedUser = req.body.loggedUser;
    // 무조건 퍼블리셔
    var role = OpenViduRole.PUBLISHER;
    var serverData = JSON.stringify({ serverData: loggedUser });

    // console.log("Getting a token | {projectId}={" + sessionName + "}, {loggedUser}={" + loggedUser);

    var tokenOptions = {
      data: serverData,
        role: role,
          // stun, turn 서버 
          iceServers: [{
              urls: ['stun:stun.l.google.com:19302'] 
          },
          {
              urls: ['turn:numb.viagenie.ca'],
              credential: 'muazkh',
              username: 'webrtc@live.com'
          }
      ]
    }

    if (mapSessions[sessionName]) {
      // Session 이미 존재
      console.log("Existing session " + sessionName);
      var mySession = mapSessions[sessionName];

      // 신규토큰 생성
      mySession
      .generateToken(tokenOptions)
        .then(token => {
          mapSessionNamesTokens[sessionName].push(token);
          // response 하기
          console.log(`이미 있다 ! ${token}`);
          res.json({
            // sessionName: sessionName,
            0: token,
            // loggedUser: loggedUser
          })
        })
      .catch((error) => {
        console.log(`이미있는 에러`);
        console.error(error);
      });
      // mySession
      //   .createConnection(connectionProperties)
      //   .then((connection) => {
      //     mapSessionNamesTokens[sessionName].push(connection.token);
      //     res.status(200).send({
      //       0: connection.token,
      //     });
      //   })

    } else {
      //신규 세션
      // console.log("New session " + sessionName);
      OV.createSession()
        .then(session => {
          //세션 저장해두기 - 이름으로
          mapSessions[sessionName] = session;
          //토큰 저장배열 생성
          mapSessionNamesTokens[sessionName] = [];
          session
            .generateToken(tokenOptions)
            .then(token => {
              mapSessionNamesTokens[sessionName].push(token);
              res.json({
                // sessionName: sessionName,
                0: token,
                // loggedUser: loggedUser
              });
            })
            .catch((error) => {
              console.error(error);
            });
            // .createConnection(connectionProperties)
            // .then(connection => {
            //   mapSessionNamesTokens[sessionName].push(connection.token);

            //   res.status(200).send({
            //     0: connection.token,
            //   });
            // })
        })
        .catch((error) => {
          console.error(error);
        });
    }
});

// Remove user from session - 유저 나가면 삭제 처리
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

// login user data
router.get('/users', (req, res, next) => {
  res.json({users:`user`})
});

router.post('/leaveSession', (req, res, next) => {
  let {sessionName, token} = req.body.params;
  let data = {status: 200};
  if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
      let tokens = mapSessionNamesTokens[sessionName];
      let index = tokens.indexOf(token);

      // If the token exists
      if (index !== -1) {
          // Token removed
          tokens.splice(index, 1);
          console.log(sessionName + ': ' + tokens.toString());
      } else {
          let msg = 'Problems in the app server: the TOKEN wasn\'t valid';
          console.log(msg);
          data.status = 500;

      }
      if (tokens.length == 0) {
          // Last user left: session must be removed
          console.log(sessionName + ' empty!');
          delete mapSessions[sessionName];
      }
  }

  res.json(data)
});

/* GET home page. */
router.post('/connect', function (req, res, next) {

  let {id, password, sessionId} = req.body.params;
  let user = 1;
  if (user) {
      let loggedUser = id;
      let clientData = id;
      let sessionName = sessionId;
      let role = OpenViduRole.PUBLISHER;
      let serverData = JSON.stringify({serverData: loggedUser});

      let tokenOptions = {
          data: serverData,
          role: role
      };

      if (mapSessions[sessionName]) {
          let mySession = mapSessions[sessionName];

          mySession.generateToken(tokenOptions)
              .then(token => {
                  mapSessionNamesTokens[sessionName].push(token);
                  res.json({
                      sessionName: sessionName,
                      token: token,
                      nickName: clientData,
                      userName: loggedUser,
                  })
              }).catch(error => {
              console.error(error)
          })

      } else {
          console.log(`create New Session ${sessionName}`);

          OV.createSession()
              .then(session => {
                  console.log(`promise then session : ${session}`)
                  mapSessions[sessionName] = session;
                  mapSessionNamesTokens[sessionName] = [];

                  session.generateToken(tokenOptions)
                      .then(token => {
                          mapSessionNamesTokens[sessionName].push(token);
                          res.json({
                              sessionName: sessionName,
                              token: token,
                              nickName: clientData,
                              userName: loggedUser,
                          })
                      })

                      .catch(error => {
                          console.error(error)
                      })
              })

              .catch(error => {
                  console.error(error)
              })
      }
  } else {
      console.log("로그인 실패 ")
  }
});

module.exports = router;