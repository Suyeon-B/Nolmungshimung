const { User } = require("../models/User");
var cookie = require("cookie");

const accessTokenOptions = {
  sameSite: "none",
  secure: true,
};

const refreshTokenOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

function authCheck(req, res) {
  return new Promise(async (resolve, reject) => {
    // console.log("cookies in authCheck", JSON.stringify(req));
    let accessToken = User.verifyToken(req.cookies.w_access);
    let refreshToken = User.verifyToken(req.cookies.w_refresh);

    console.log("accessToken : " + JSON.stringify(accessToken));
    console.log("refreshToken : " + JSON.stringify(refreshToken));

    if (accessToken === null) {
      if (refreshToken === null) {
        // case1: access token과 refresh token 모두가 만료된 경우
        // 권한 없으므로, 에러 발생
        console.log("case 1!!!!");
        // throw Error('API 사용 권한이 없습니다.');
        req.user = null;
        return resolve(false);
      } else {
        // case2: access token은 만료됐지만, refresh token은 유효한 경우
        // access 토큰을 바탕으로 해당 유저를 찾아서 토큰값 갱신
        console.log("case 2!!!!");
        const user = await User.generateAccessToken(refreshToken);
        if (user === null) {
          console.log("user === null");
          req.user = null;
          return resolve(null);
        }

        req.user = user;
        // res.cookie("w_access", user.userAccessToken, accessTokenOptions);
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("w_access", user.userAccessToken, accessTokenOptions)
        );
        // req.cookies.w_access = user.userAccessToken;
        return resolve(true);
      }
    } else {
      if (refreshToken === null) {
        // case3: access token은 유효하지만, refresh token은 만료된 경우
        // refresh 토큰을 바탕으로 해당 유저를 찾아서 토큰값 갱신
        console.log("case 3!!!!");
        const user = await User.generateRefreshToken(accessToken);
        if (user === null) {
          req.user = null;
          return resolve(null);
        }

        req.user = user;
        // res.cookie("w_refresh", user.userRefreshToken, refreshTokenOptions);
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(
            "w_refresh",
            user.userRefreshToken,
            refreshTokenOptions
          )
        );
        // req.cookies.w_refresh = user.userRefreshToken;
        return resolve(true);
      } else {
        // case4: accesss token과 refresh token 모두가 유효한 경우
        console.log("case 4!!!!");
        const user = await User.findUserByToken(
          accessToken,
          req.cookies.w_access
        );
        if (user === null) {
          // console.log("case 4 user is null");
          req.user = null;
          return resolve(null);
        }
        req.user = user;
        // console.log("case 4 user is not null");
        return resolve(true);
      }
    }
  });
}

exports.authMain = async function (req, res, next) {
  // 1. 인증 정보 받아오기
  var isAuth = await authCheck(req, res);
  console.log("isAuth : ", isAuth);
  if (isAuth === null) {
    // console.log("isAuth null;");
    return res.json({ success: false, message: "로그인 해주세요." });
  } else if (!isAuth) {
    //권한 없음
    // console.log("isAuth false;");
    return res.json({
      success: false,
      message:
        "로그인을 다시 해보세요. 지속적인 문제 발생 시, 다음 전화번호로 연락 부탁드립니다. ( 010 5797 6647 )",
    });
  }
  console.log("authMain success");
  next();
  // return res.status(400).json({ success: true, message: "인증 성공" });
  // return { success: true, message: "인증 성공" };
};

// module.exports = { auth };
