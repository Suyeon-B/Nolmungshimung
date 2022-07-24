var express = require("express");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
const { User } = require(__base + "models/User");
// 임시로 사용
const Project = require(__base + "models/Project");

router.get("/", async (req, res, next) => {
  try {
    const uploadProjectInfo = await UploadProject.find();
    return res.json(uploadProjectInfo);
    // console.log(uploadProjectInfo);
  } catch (error) {
    console.log(`uploaded project find: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const projectId = req.body.projectId;
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const projectTitle = req.body.projectTitle;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;

    const getProject = await Project.findById(projectId);
    const user = await User.findById(userId);
    console.log(user);

    getProject["people"] = [[userId, userName, userEmail]];
    getProject["start_date"] = startDate;
    getProject["project_title"] = projectTitle;

    const newProject = new Project({
      people: [[userId, userName, userEmail]],
      start_date: getProject["start_date"],
      project_title: getProject["project_title"],
      routes: getProject["routes"],
      term: getProject["term"],
    });

    const response = await newProject.save();

    user["user_projects"].push(response._id);
    await user.save();

    console.log(response);
    res
      .status(200)
      .send({ success: "프로젝트 가져오기 성공!", projectId: response._id });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "프로젝트 가져오기 실패!" });
  }
});

module.exports = router;
