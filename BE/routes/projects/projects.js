var express = require("express");
const { restart } = require("nodemon");

var router = express.Router();
const Project = require(__base + "models/Project");
const { User } = require(__base + "models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ id: "123" });
  // res.render("index", { title: "Express" });
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

router.post("/title", async (req, res) => {
  const ids = req.body;
  Project.find(
    {
      _id: {
        $in: ids,
      },
    },
    function (err, data) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "프로젝트 제목을 불러오는데 실패했습니다.",
        });
      }
      if (Object.keys(data).length === 0) {
        res.status(200).json({
          success: false,
          message: "프로젝트가 없다 냥.",
        });
      } else {
        let projectInfo = [];
        data.forEach((el) => {
          let tmpObj = { _id: el._id, project_title: el.project_title };

          projectInfo.push(tmpObj);
        });
        res.status(200).json({
          success: true,
          projectInfo: projectInfo,
          message: "프로젝트 제목을 성공적으로 불러왔습니다.",
        });
      }
    }
  );
});
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  const projectInfo = await Project.findById({ _id: id });
  console.log(projectInfo);
  if (projectInfo) {
    return res.json(projectInfo);
  }

  res.status(404).send("fail");
});

// User.findOne({ user_email: "a" }).then((data) => {
//   console.log(data);
// });

module.exports = router;
