var express = require("express");
const { string } = require("request-ip/lib/is");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
const { User } = require(__base + "models/User");
// 임시로 사용
const Project = require(__base + "models/Project");
const HashTags = require(__base + "models/HashTags");

//redis
const Redis = require(__base + "routes/util/redis").publisher;

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

// infinite scroll
router.get("/infinite", async (req, res, next) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    // 한 번에 8개의 여행일정 정보만 load합니다.
    const uploadProjectInfo = await UploadProject.find({}, undefined, {
      skip,
      limit: 8,
    }).sort(res._id);

    res.send(uploadProjectInfo);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/alldate", async (req, res, next) => {
  try {
    const { projectId, userId, startDate, projectTitle, userName, userEmail } =
      req.body;

    const getProject = await UploadProject.findById(projectId);
    const user = await User.findById(userId);

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

    user["user_projects"].push(response._id.toString());
    await user.save();

    res
      .status(200)
      .send({ success: "여행일정 가져오기 성공!", projectId: response._id });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "여행일정 가져오기 실패!" });
  }
});

router.post("/selectdate", async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      projectId,
      userId,
      startDate,
      projectTitle,
      userName,
      userEmail,
      selectDate,
    } = req.body;

    const getProject = await UploadProject.findById(projectId);
    const user = await User.findById(userId);

    getProject["people"] = [[userId, userName, userEmail]];
    getProject["start_date"] = startDate;
    getProject["project_title"] = projectTitle;
    // console.log(getProject["routes"][0]);
    const newRoutes = [];
    for (let idx of selectDate) {
      if (idx !== null) {
        newRoutes.push(getProject["routes"][idx]);
      } else {
        newRoutes.push([]);
      }
    }

    const newProject = new Project({
      people: [[userId, userName, userEmail]],
      start_date: getProject["start_date"],
      project_title: getProject["project_title"],
      routes: newRoutes,
      term: selectDate.length,
    });
    console.log(newProject);

    const response = await newProject.save();

    user["user_projects"].push(response._id.toString());
    await user.save();

    res
      .status(200)
      .send({ success: "여행일정 가져오기 성공!", projectId: response._id });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "여행일정 가져오기 실패!" });
  }
});

router.get("/projects/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const projectInfo = await UploadProject.findById({ _id: id });
    return res.json(projectInfo);
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.get("/hashtag", async (req, res, next) => {
  let hashtag = JSON.parse(req.query.taglist).split(",");
  let responseData = [];
  try {
    for (const tagName of hashtag) {
      let recommendProjectList = await HashTable.findOne(
        { hash_tag_name: tagName },
        { _id: false, project_id: true }
      ).lean();
      if (recommendProjectList?.project_id) {
        for (const projectId of recommendProjectList.project_id) {
          let project = await UploadProject.findById(projectId);
          if (project) responseData.push(project);
        }
      }
    }
    return res.status(200).send(responseData);
  } catch (e) {
    console.log(`err: ${e}`);
    return res.status(404).send({ status: 404, msg: e });
  }
});

router.get("/hashtags", async (req, res, next) => {
  try {
    const redisData = await Redis.SMEMBERS(`hashtags`, 0, -1);
    // const redisData = await Redis.LRANGE(`hashtags`, 0, -1);
    // if (redisData.length) return res.status(200).send(redisData)
    return res.status(200).send(redisData);
  } catch (error) {
    console.log(`HashTag가 존재하지 않아유 ~`);
    return res.status(403).send({ status: 403, msg: error });
  }
});

module.exports = router;
