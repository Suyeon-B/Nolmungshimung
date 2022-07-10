const { User } = require("../models/User");

function auth(req, res) {
  return new Promise(async (resolve, reject) => {
    let accessToken = User.verifyToken(req.cookies.w_access);
    let refreshToken = User.verifyToken(req.cookies.w_refresh);

    // console.log("accessToken : " + JSON.stringify(accessToken));
    // console.log("refreshToken : " + JSON.stringify(refreshToken));

    if (accessToken === null) {
      if (refreshToken === null) {
        // case1: access token과 refresh token 모두가 만료된 경우
        // 권한 없으므로, 에러 발생
        // console.log('case 1!!!!');
        // throw Error('API 사용 권한이 없습니다.');
        req.user = null;
        return resolve(false);
      } else {
        // case2: access token은 만료됐지만, refresh token은 유효한 경우
        // access 토큰을 바탕으로 해당 유저를 찾아서 토큰값 갱신
        // console.log("case 2!!!!");
        const user = await User.generateAccessToken(refreshToken);
        if (user === null) {
          req.user = null;
          return resolve(null);
        }

        req.user = user;
        res.cookie("w_access", user.userAccessToken);
        req.cookies.w_access = user.userAccessToken;
        return resolve(true);
      }
    } else {
      if (refreshToken === null) {
        // case3: access token은 유효하지만, refresh token은 만료된 경우
        // refresh 토큰을 바탕으로 해당 유저를 찾아서 토큰값 갱신
        // console.log('case 3!!!!')
        const user = await User.generateRefreshToken(accessToken);
        if (user === null) {
          req.user = null;
          return resolve(null);
        }

        req.user = user;
        res.cookie("w_refresh", user.userRefreshToken);
        req.cookies.w_refresh = user.userRefreshToken;
        return resolve(true);
      } else {
        // case4: accesss token과 refresh token 모두가 유효한 경우
        // console.log('case 4!!!!')
        const user = await User.findUserByToken(
          accessToken,
          req.cookies.w_access
        );
        if (user === null) {
          req.user = null;
          return resolve(null);
        }

        req.user = user;
        return resolve(true);
      }
    }
  });
}
module.exports = { auth };
