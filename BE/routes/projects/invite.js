var express = require("express");

var router = express.Router();
const Project = require(__base + "models/Project");
const { User } = require(__base + "models/User");
const { inviteMail } = require(__base + "routes/util/mail");
const jwt = require("jsonwebtoken");

router.post("/mail", async (req, res) => {
  console.log("들어와");
  var inviteToken = jwt.sign({ userEmail: req.body.email, projectId: req.body.projectId }, "SECRETINVITE", {
    expiresIn: "1h",
  });
  try {
    if (await inviteMail(req.body.email, inviteToken, req.body.projectId)) {
      return res.status(200).json({ success: true, message: "그룹 초대 메일이 발송되었습니다." });
    }
  } catch (error) {
    console.log(`invite email err :${error}`);
  }
});

router.get("/:token/:user", async (req, res, next) => {
  let user = req.params.user;
  let token = req.params.token;
  let data;
  try {
    data = jwt.verify(token, "SECRETINVITE");
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      // console.log("토큰 기한 만료!!");
      return res.status(400).json({
        success: false,
        message: "유효기간이 지난 초대 링크입니다.",
      });
    } else if (e.name === "JsonWebTokenError") {
      // console.log("토큰이 없습니다!");
      return res.status(400).json({
        success: false,
        message: "유효하지않은 링크입니다.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "알 수 없는 이유로 인증 실패",
      });
    }
  }

  console.log(data);
  if (data.userEmail === user) {
    return res.status(200).json({
      success: true,
      message: "여행일정에 참가되었습니다.",
      project: data.projectId,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "초대받지않은 회원입니다.",
    });
  }
});

module.exports = router;
