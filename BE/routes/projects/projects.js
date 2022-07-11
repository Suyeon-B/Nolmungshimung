var express = require("express");

var router = express.Router();
const Project = require(__base + "models/Project");
const { User } = require(__base + "models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", async (req, res) => {
  const user_date = await User.findOne({ user_email: "a" });
  const project = new Project(req.body[1]);

  project["people"].push(user_date._id.toString());

  project.save(async (err, data) => {
    // user_date["user_project"]
    user_date["user_projects"].push(data._id.toString());
    user_date.save();

    return res.status(200).json({
      success: true,
      message: "프로젝트 생성 완료",
      projectId: data._id.toString(),
    });
  });
});

// User.findOne({ user_email: "a" }).then((data) => {
//   console.log(data);
// });

module.exports = router;
