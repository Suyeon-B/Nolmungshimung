var express = require("express");

var router = express.Router();
const Project = require(__base + "models/Project");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", (req, res) => {
  console.log(req.body);
  const project = new Project(req.body);

  project.save(async (err, data) => {
    console.log(err, data);
    return res.status(200).json({
      success: true,
      message: "프로젝트 생성 완료",
    });
  });
});

module.exports = router;
