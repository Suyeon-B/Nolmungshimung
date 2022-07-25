var express = require("express");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");

// infinite scroll
router.get("/", async (req, res, next) => {
  try {
    const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
    // 한 번에 7개의 프로젝트 정보만 load합니다.
    const uploadProjectInfo = await UploadProject.find({}, undefined, { skip, limit: 7 });
    res.send(uploadProjectInfo);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
