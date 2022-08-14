var express = require("express");
const { restart } = require("nodemon");

var router = express.Router();
const Project = require(__base + "models/Project");
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
const { Travel } = require(__base + "models/Travel");
const HashTags = require(__base + "models/HashTags");
const { User } = require(__base + "models/User");

const Redis = require(__base + "routes/util/redis").publisher;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ id: "123" });
  // res.render("index", { title: "Express" });
});

router.post("/", async (req, res) => {
  const user_date = await User.findOne({ user_email: req.body[0] });
  const project = new Project(req.body[1]);

  // project["people"].push(user_date._id.toString());
  project["people"].push([
    user_date._id.toString(),
    user_date.user_name,
    user_date.user_email,
  ]);

  // 여행지 경로에 배열 추가하기
  for (let i = 0; i <= project["term"]; i++) {
    project["routes"].push([]);
  }

  project.save(async (err, data) => {
    // user_date["user_project"]
    user_date["user_projects"].push(data._id.toString());
    user_date.save();

    return res.status(200).json({
      success: true,
      message: "여행일정 생성 완료",
      projectId: data._id.toString(),
    });
  });
});

router.post("/upload", async (req, res) => {
  // console.log("projects upload");
  // console.log(req.body);
  const info = req.body;

  if (info.travelId) {
    let travelId = info.travelId;
    // console.log(travelId);
    let travel = await Travel.findOne({ place_id: travelId });
    delete info.travelId;
    if (travel && travel.photos.length > 0) {
      const api_key = process.env.REACT_APP_GOOGLE_KEY;
      let img = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${travel.photos[0]["photo_reference"]}&sensor=false&key=${api_key}`;
      // console.log(img);
      info.img = img;
    }
  }
  // console.log("INFO", info);
  // const projectId = req.body._id;
  delete info._id;
  let originHashTags = info.hashTags;
  const reqHashTags = [...new Set([...originHashTags])];
  // console.log(reqHashTags);
  reqHashTags.map((el) => el.value !== "");
  info.hashTags = reqHashTags;

  //redis
  if (reqHashTags.length) await Redis.SADD("hashtags", reqHashTags);
  // console.log("hashtags", hashTags);
  const uploadProject = new UploadProject(info);
  let projectId;
  try {
    const uploadProjectInfo = await uploadProject.save();

    projectId = uploadProjectInfo._id;
  } catch (error) {
    console.log(`Project Upload ERROR: ${error}`);
    return res.send(404).send({ error: "project Upload Fail" });
  }
  try {
    // console.log("twice TRY projectId", projectId);
    for (let i = 0; i < reqHashTags.length; i++) {
      let updateHashTable = await HashTable.findOne({
        hash_tag_name: reqHashTags[i],
      });
      // console.log(updateHashTable);
      if (updateHashTable) {
        // hashTag가 이미 존재하는 경우
        // console.log(projectId);
        await HashTable.findOneAndUpdate(
          {
            hash_tag_name: reqHashTags[i],
          },
          { $push: { project_id: projectId } },
          { new: true }
        );
      } else {
        // hashTag가 존재하지 않는 경우
        const hashTable = new HashTable({
          hash_tag_name: reqHashTags[i],
          project_id: [projectId],
        });
        try {
          await hashTable.save();
        } catch (error) {
          console.log(`Hash table ${i}번째 error : ${error}`);
          return res
            .send(404)
            .send({ error: `hash table ${i}번째 upload Fail` });
        }
      }
    }

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(`Hash Table Save ERROR ${error}`);
    return res.send(404).send({ error: "hash table upload Fail" });
  }
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
          message: "여행일정 제목을 불러오는데 실패했습니다.",
        });
      }
      if (Object.keys(data).length === 0) {
        res.status(200).json({
          success: false,
          message: "여행일정이 없습니다.",
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
          message: "여행일정 제목을 성공적으로 불러왔습니다.",
        });
      }
    }
  );
});

router.post("/routes/:id", async (req, res) => {
  const body = req.body;
  return res.status(200).send(null);
  try {
    const projectInfo = await Project.findById(req.params.id);
    projectInfo.routes[0].push(body);
    const project = new Project(projectInfo);
    await project.save();

    res.send(projectInfo);
  } catch (error) {
    console.log(`project route find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.patch("/routes/:id", async (req, res) => {
  try {
    //redis
    // console.log(req.body);
    req.body.map((day) => {
      day.map((route) => {
        route.user_name = null;
        route.lock = "white";
      });
    });

    await Redis.setEx(`routes/${req.params.id}`, 10, "");
    await Redis.set(`${req.params.id}`, JSON.stringify(req.body));
    res.status(200).send({ success: true });
  } catch (e) {
    console.log(`redis Error : ${e}`);
  }

  // try {
  //   const updateProject = await Project.findOneAndUpdate(
  //     { _id: req.params.id },
  //     { $set: { routes: req.body } },
  //     { new: true }
  //   );
  //   res.status(200).send({ success: true });
  // } catch (error) {
  //   console.log(`project update error: ${error}`);
  //   res.status(404).send({ error: "routes update error!" });
  // }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    //redis
    const projectInfo = await Project.findById({ _id: id });
    let routes = await Redis.get(`${req.params.id}`);
    if (routes) {
      projectInfo.routes = JSON.parse(routes);
    }
    await Redis.setEx(`${req.params.id}`, 10, JSON.stringify(projectInfo.routes))
    return res.json(projectInfo);
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});
// 프로젝트 삭제
router.post("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const projectInfo = await Project.findById({ _id: id });
    const userInfo = await User.findById({ _id: body._id });

    // console.log(projectInfo);
    for (let i = 0; i < projectInfo.people.length; i++) {
      if (projectInfo.people[i][0] === body._id) {
        projectInfo.people.splice(i, 1);
      }
    }

    userInfo.user_projects = userInfo.user_projects.filter(
      (projectId) => projectId !== id
    );

    await userInfo.save();

    return res.status(200).send({ success: "deleteSuccess" });
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.patch("/:id", async (req, res, next) => {
  const projectTitle = req.body.projectTitle;
  const startDate = req.body.startDate;
  try {
    const projectInuser = await Project.updateOne(
      { _id: req.params.id },
      { project_title: projectTitle, start_date: startDate }
    );
    res.status(200).send({
      success: true,
      message: "수정 완료",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/friends/:id", async (req, res, next) => {
  const { id } = req.params;
  // console.log("프로젝트", id);
  // console.log(req.body.email);

  // const test = await Project.findById(id);
  // console.log(test);
  try {
    const userInfo = await User.findOne({ user_email: req.body.email });
    const projectInuser = await Project.findOne({
      _id: id,
      // people: [userInfo._id, userInfo.user_name, userInfo.user_email],
    });
    // console.log(projectInuser)
    if (projectInuser.people) {
      for (let n = 0; n < projectInuser.people.length; n++) {
        if (projectInuser.people[n][2] == userInfo.user_email) {
          res.status(200).send({
            success: true,
            message: "이미 초대에 응한 여행일정입니다.",
          });
          return;
        }
      }
    }

    try {
      await Project.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            people: [userInfo._id, userInfo.user_name, userInfo.user_email],
          },
        },
        { new: true }
      );
      await User.findOneAndUpdate(
        { user_email: userInfo.user_email },
        {
          $push: {
            user_projects: id.toString(),
          },
        }
      );

      res.status(200).send({ success: true, message: "수락완!" });
    } catch (error) {
      console.log(error);
      // 이메일 존재하지만 추가 못함
      res.status(404).send({
        success: false,
        message: "알 수 없는 이유로 여행일정 추가를 실패했습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/friends/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectInfo = await Project.findById({ _id: id });
    return res.json(projectInfo.people);
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

// 초대된 친구 삭제
router.post("/memberFriend/:id", async (req, res, next) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const projectInfo = await Project.findById({ _id: id });
    // console.log(projectInfo.people);

    if (
      projectInfo.people.length === 1 ||
      projectInfo.people[0][2] === body.email
    ) {
      return res.status(202).send({
        success: "요청을 수신하였지만, 그에 응하여 행동할 수 없습니다.",
      });
    }

    for (let i = 1; i < projectInfo.people.length; i++) {
      if (projectInfo.people[i][2] === body.email) {
        projectInfo.people.splice(i);
        console.log(projectInfo.people);
      }
    }
    console.log(projectInfo.people);

    await projectInfo.save();

    return res.status(200).send({ success: "deleteSuccess" });
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.get("/memo/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectInfo = await Project.findById({ _id: id });
    return res.json(projectInfo.quillRefEditor);
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

// User.findOne({ user_email: "a" }).then((data) => {
//   console.log(data);
// });
module.exports = router;
