const express = require("express");
const router = express.Router();
const { User } = require(__base + "models/User");
// const { signupMail } = require(__base + "utils/mail");

//=================================
//             User
//=================================

// router.get("/auth", auth, (req, res) => {
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
  var certificationNumber = Math.floor(Math.random() * (999999 - 0)) + 99999;
  req.body.certificationNumber = certificationNumber;

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

    // 이메일 인증 번호 보내기!!
    // if (!(await signupMail(certificationNumber, data.userEmail))) {
    //   // 이메일 인증 보내기 실패
    //   console.log("인증 메일 보내기 실패");
    //   return res.status(200).json({
    //     success: true,
    //     message:
    //       "인증 메일 보내기 실패했습니다! 새롭게 인증을 받기 위해서 로그인 해주세요",
    //     type: "NOT_SEND_CERTIFICATION",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "회원가입 인증 메일을 보냈습니다",
    });
  });
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
  console.log("signin : " + JSON.stringify(req.body));
  console.log("user_email : " + JSON.stringify(req.body.user_email));

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
        return res.json({
          loginSuccess: false,
          message: "비밀번호를 틀렸습니다.",
        });
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).json({
            loginSuccess: false,
            message: "토큰 생성에 실패했습니다.",
          });
        }

        res.cookie("w_refresh", user.userRefreshToken);
        res.cookie("w_access", user.userAccessToken).status(200).json({
          loginSuccess: true,
          user_email: user.user_email,
          user_name: user.user_name,
          message: "성공적으로 로그인했습니다.",
          token: user.userAccessToken,
        });
      });
    });
  });
});

router.post("/signout", (req, res) => {
  // console.log('signout req.user : ' + JSON.stringify(req.user));
  User.findOneAndUpdate(
    { _id: req.user._id },
    { userAccessToken: "", userRefreshToken: "" },
    (err, doc) => {
      if (err)
        return res.json({
          success: false,
          message: "로그아웃 시, 에러 발생했습니다",
        });

      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.get("/auth", (req, res) => {
  // console.log('req.user : ' + req.user)
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.userRole === 2 ? true : false,
    isAuth: true,
    user_email: req.user.user_email,
    user_name: req.user.user_name,
    userRole: req.user.userRole,
  });
});

module.exports = router;
