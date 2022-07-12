const { authMain } = require("./auth");
const logger = require("./logger");
const middlewares = () => async (req, res, next) => {
  console.log("!!!!!!!");
  var authResult = await authMain(req, res); // 인증 정보에 대해서 처리
  console.log("!!!!!!!TLQKF");
  console.log("authResult : " + JSON.stringify(authResult));
  authResult.success ? next() : res.status(400).json(authResult);

  await logger.log(req, res); // 로그 정보에 대해서 처리
};

module.exports = middlewares;
