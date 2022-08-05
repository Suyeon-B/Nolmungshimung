const express = require("express");
const router = express.Router();
const request = require("request");
const { User } = require(__base + "models/User");
const { authMain } = require("../../middleware/auth");
const { signupMail } = require(__base + "routes/util/mail");
const middlewares = require("../../middleware");
var cookie = require("cookie");

//=================================
//             User
//=================================

// router.get("/auth", auth, (req, res) =>{
//     res.status(200).json({
//         _id: req.user._id,
//         isAdmin: req.user.role === 0 ? false : true,
//         isAuth: true,
//         userEmail: req.user.userEmail,
//         name: req.user.name,
//         lastname: req.user.lastname,
//         role: req.user.role,
//         image: req.user.image,
//     });
// });

const accessTokenOptions = {
  sameSite: "none",
  secure: true,
};

const refreshTokenOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const deleteCookie = {
  maxAge: 0,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

function checkUserNickName(user_name) {
  return new Promise((resolve, reject) => {
    User.findOne({ user_name: user_name }, function (err, data) {
      if (err) {
        console.log("err : " + err);
        return reject(false);
      }

      return resolve(data);
    });
  });
}

function checkUserEmail(user_email) {
  return new Promise((resolve, reject) => {
    User.findOne({ user_email: user_email }, function (err, data) {
      if (err) {
        console.log("err : " + err);
        return reject(false);
      }

      return resolve(data);
    });
  });
}

// 1. 이메일 중복 여부 확인
// 2. 인증 번호 보내기
router.post("/signup", async (req, res) => {
  // 이메일 인증 번호 랜덤 생성
  console.log("Enter signup");

  const user = new User(req.body);

  if ((await checkUserEmail(user.user_email)) !== null) {
    return res.status(403).json({
      success: false,
      message: "이미 존재하는 이메일입니다!!",
      type: "EXIST_USER_EMAIL",
    });
  }

  if ((await checkUserNickName(user.user_name)) !== null) {
    return res.status(403).json({
      success: false,
      message: "닉네임이 중복되었습니다.",
      type: "EXIST_USER_NICK_NAME",
    });
  }

  user.save(async (err, data) => {
    if (err) {
      if (err.code === 11000) {
        console.log("err : " + "이미 존재하는 계정입니다!");
        return res.status(403).json({
          success: false,
          message: "이미 존재하는 이메일입니다.",
          type: "EXIST_USER_NICK_NAME",
        });
      } else {
        console.log(`err : ${err}`);
        console.log(err.code);
        console.log("회원가입 시 에러 발생!");
        return res.status(403).json({
          success: false,
          message: "회원가입 실패",
          type: "DEFAULT_ERROR",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "회원가입 인증 메일을 보냈습니다",
    });
  });
});

// router.post("/maill", signupMail);
router.post("/mail", async (req, res) => {
  // 이메일 중복 체크
  if ((await checkUserEmail(req.body.userEmail)) !== null) {
    return res.status(403).json({
      success: false,
      message: "이미 존재하는 이메일입니다!!",
    });
  }
  console.log(req.body);
  // 이메일 인증 번호 보내기!!
  var certificationNumber = Math.floor(Math.random() * (999999 - 0)) + 99999;
  try {
    if (await signupMail(certificationNumber, req.body.userEmail)) {
      return res.status(200).json({
        success: true,
        message: "인증 메일 보내기 성공했습니다! ",
        answer: certificationNumber,
      });
    }
  } catch (error) {
    console.log(`mail ERROR : ${error}`);
  }
});

router.post("/checkCertificationNumber", (req, res) => {
  console.log("checkCertificationNumber : " + JSON.stringify(req.body));

  User.findOneAndUpdate(
    {
      user_email: req.body.user_email,
      certificationNumber: req.body.certificationNumber,
    },
    {
      $set: {
        certificationNumber: "",
      },
    },
    (err, user) => {
      if (err) {
        console.log("err : " + err);
        return res.status(200).json({ success: false, message: "인증 실패!!" });
      } else if (!user) {
        return res.json({
          success: false,
          message: "존재하지 않는 인증번호 입니다",
        });
      }

      console.log("user : " + user);
      return res.status(200).json({ success: true, message: "회원가입 완료!" });
      // .json({ success: true, message: "이메일 인증 완료!" });
    }
  );
});

// 1. 성공 로그인 -> 이메일 인증 유무 확인
router.post("/signin", (req, res) => {
  // console.log("signin : " + JSON.stringify(req.body));
  // console.log("user_email : " + JSON.stringify(req.body.user_email));

  User.findOne({ user_email: req.body.user_email }, async (err, user) => {
    if (!user) {
      return res.status(403).json({
        loginSuccess: false,
        message: "존재하지 않는 아이디입니다.",
        type: "",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log("isMatch : " + isMatch);
      if (!isMatch) {
        return res.status(403).json({
          loginSuccess: false,
          message: "비밀번호를 틀렸습니다.",
        });
      }

      user.generateToken(async (err, user) => {
        if (err) {
          return res.status(400).json({
            loginSuccess: false,
            message: "토큰 생성에 실패했습니다.",
          });
        }
        console.log("Refresh res : ", user.userRefreshToken);
        console.log("Access res : ", user.userAccessToken);
        // res.cookie("w_refresh", user.userRefreshToken, refreshTokenOptions);
        res.setHeader("Set-Cookie", [
          cookie.serialize(
            "w_refresh",
            user.userRefreshToken,
            refreshTokenOptions
          ),
          cookie.serialize(
            "w_access",
            user.userAccessToken,
            accessTokenOptions
          ),
        ]);

        // console.log(
        //   res.setHeader(
        //     "Set-Cookie",
        //     cookie.serialize(
        //       "w_access",
        //       user.userAccessToken,
        //       accessTokenOptions
        //     ),
        //     2
        //   )
        // );
        res.status(200).json({
          loginSuccess: true,
          user: user,
          user_email: user.user_email,
          user_name: user.user_name,
          user_projects: user.user_projects,
          message: "성공적으로 로그인했습니다.",
        });

        // res.end();
        // res
        //   .cookie("w_access", user.userAccessToken, accessTokenOptions)
        //   .status(200)
        //   .json({
        //     loginSuccess: true,
        //     user: user,
        //     user_email: user.user_email,
        //     user_name: user.user_name,
        //     user_projects: user.user_projects,
        //     message: "성공적으로 로그인했습니다.",
        //     sameSite: "none",
        //   });
      });
    });
  });
});

router.post("/signout", (req, res) => {
  // console.log("signout req.user : ", req.body._id);
  User.findOneAndUpdate(
    { _id: req.body._id },
    { userAccessToken: "", userRefreshToken: "" },
    (err, doc) => {
      res.setHeader("Set-Cookie", [
        cookie.serialize("w_refresh", "", deleteCookie),
        cookie.serialize("w_access", "", deleteCookie),
      ]);
      if (err) {
        return res.json({
          success: false,
          message: "로그아웃 시, 에러 발생했습니다",
        });
      }

      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.get("/auth", authMain, async (req, res) => {
  // router.get("/auth", (req, res) => {
  // console.log("req.user : " + req);
  // console.log("return auth");
  return await res.status(200).json({
    // _id: req.user._id,
    // user_email: req.user.user_email,
    success: true,
    user_name: req.user,
    isAuth: true,
  });
});

router.post("/kakao", async (req, res) => {
  try {
    console.log("try" + JSON.stringify(req.body));
    let userEmail = "";
    let userNickName = "";
    console.log("데이터왔");
    const kakaoUser = JSON.stringify(req.body);
    userEmail = JSON.parse(kakaoUser).email;
    userNickName = JSON.parse(kakaoUser).profile.nickname;
    console.log(userEmail);
    if (!userEmail) {
      return res.status(400).json({
        loginSuccess: false,
        message:
          "사용자 이메일을 제공하지않을 경우 카카오 로그인이 불가능합니다.",
      });
    }

    const user = new User({
      provider: "kakao",
      user_email: userEmail,
      user_name: userNickName,
      userAccessToken: "",
      RefreshToken: "",
    });

    const c_user = await checkUserEmail(user.user_email);

    if (c_user !== null) {
      console.log(c_user);
      c_user.generateToken((err, user) => {
        if (err) {
          return res.status(400).json({
            loginSuccess: false,
            message: "토큰 생성에 실패했습니다.",
          });
        }
        // res.cookie("w_refresh", user.userRefreshToken, refreshTokenOptions);
        // res
        //   .cookie("w_access", user.userAccessToken, accessTokenOptions)
        //   .status(200)
        //   .json({
        //     loginSuccess: true,
        //     user: user,
        //     user_email: user.user_email,
        //     user_name: user.user_name,
        //     user_projects: user.user_projects,
        //     message: "성공적으로 로그인했습니다.",
        //     // token: user.userAccessToken,
        //   });
        // res.setHeader(
        //   "Set-Cookie",
        //   cookie.serialize(
        //     "w_refresh",
        //     user.userRefreshToken,
        //     refreshTokenOptions
        //   )
        // );

        // res.setHeader(
        //   "Set-Cookie",
        //   cookie.serialize("w_access", user.userAccessToken, accessTokenOptions)
        // );
        res.setHeader("Set-Cookie", [
          cookie.serialize(
            "w_refresh",
            user.userRefreshToken,
            refreshTokenOptions
          ),
          cookie.serialize(
            "w_access",
            user.userAccessToken,
            accessTokenOptions
          ),
        ]);
        res.status(200).json({
          loginSuccess: true,
          user: user,
          user_email: user.user_email,
          user_name: user.user_name,
          user_projects: user.user_projects,
          message: "성공적으로 로그인했습니다.",
        });
      });
    } else {
      console.log("없어용");
      await user.save(async (err, data) => {
        if (err) {
          if (err.code === 11000) {
            console.log("err : " + "이미 존재하는 계정입니다!");
            return res.status(403).json({
              loginSuccess: false,
              message: "중복 닉네임입니다.",
              type: "EXIST_USER_NICK_NAME",
            });
          } else {
            console.log(`err : ${err}`);
            console.log(err.code);
            console.log("회원가입 시 에러 발생!");
            return res.status(403).json({
              loginSuccess: false,
              message: "회원가입 실패",
              type: "DEFAULT_ERROR",
            });
          }
        } else {
          data.generateToken((err, user) => {
            if (err) {
              return res.status(400).json({
                loginSuccess: false,
                message: "토큰 생성에 실패했습니다.",
              });
            }
            // res.cookie("w_refresh", user.userRefreshToken, refreshTokenOptions);
            // res
            //   .cookie("w_access", user.userAccessToken, accessTokenOptions)
            //   .status(200)
            //   .json({
            //     loginSuccess: true,
            //     user_email: user.user_email,
            //     user_name: user.user_name,
            //     message: "성공적으로 로그인했습니다.",
            //     user_projects: user.user_projects,
            //     // token: user.userAccessToken,
            //   });
            // res.setHeader(
            //     "Set-Cookie",
            //     cookie.serialize(
            //       "w_refresh",
            //       user.userRefreshToken,
            //       refreshTokenOptions
            //     )
            //   );
            // res.setHeader(
            //   "Set-Cookie",
            //   cookie.serialize(
            //     "w_access",
            //     user.userAccessToken,
            //     accessTokenOptions
            //   )
            // );
            res.setHeader("Set-Cookie", [
              cookie.serialize(
                "w_refresh",
                user.userRefreshToken,
                refreshTokenOptions
              ),
              cookie.serialize(
                "w_access",
                user.userAccessToken,
                accessTokenOptions
              ),
            ]);
            res.status(200).json({
              loginSuccess: true,
              user: user,
              user_email: user.user_email,
              user_name: user.user_name,
              user_projects: user.user_projects,
              message: "성공적으로 로그인했습니다.",
            });
          });
        }
      });
    }
  } catch (err) {
    return res.status(400).json({
      loginSuccess: false,
      message: err,
    });
  }
});

router.get("/", (req, res) => {
  User.findOne({ user_email: "a" })
    .then((user) => {
      console.log(user);
      const userInfo = {
        user_name: user.user_name,
        user_projects: user.user_projects,
      };
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
