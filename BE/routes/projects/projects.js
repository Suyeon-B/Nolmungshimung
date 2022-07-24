var express = require("express");
const { restart } = require("nodemon");

var router = express.Router();
const Project = require(__base + "models/Project");
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
const HashTags = require(__base + "models/HashTags");
const { User } = require(__base + "models/User");

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
      message: "프로젝트 생성 완료",
      projectId: data._id.toString(),
    });
  });
});

router.post("/upload", async (req, res) => {
  // console.log("projects upload");
  // console.log(req.body);
  const info = req.body;

  // console.log("INFO", info);
  // const projectId = req.body._id;
  delete info._id;
  // console.log("?????", info.hashTags);
  // console.log("?!", projectId);
  const reqHashTags = info.hashTags;
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
        try {
          // category save
          // find -> push -> save
          const hashTags = await HashTags.find();
          // console.log(hashTags[0].hash_tag_names);
          hashTags[0].hash_tag_names.push(reqHashTags[i]);
          // console.log(hashTags[0].hash_tag_names);
          await hashTags[0].save();
        } catch (error) {
          console.log(`Hash tag ${i}번째 error : ${error}`);
          return res.send(404).send({ error: `hash tag ${i}번째 save Fail` });
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

router.post("/routes/:id", async (req, res) => {
  const body = req.body;
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
  // console.log("I'm in routes/:id");
  // console.log("REQ PARAMS : ", req.params.id);
  // console.log("========body=====");
  console.log("patch routes");

  try {
    const updateProject = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { routes: req.body } },
      { new: true }
    );
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(`project update error: ${error}`);
    res.status(404).send({ error: "routes update error!" });
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  console.log(":id find", id);

  try {
    const projectInfo = await Project.findById({ _id: id });
    return res.json(projectInfo);
  } catch (error) {
    console.log(`project find id: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

router.post("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  console.log(body);

  try {
    const projectInfo = await Project.findById({ _id: id });
    const userInfo = await User.findById({ _id: body._id });

    // console.log(projectInfo);

    for (let i = 0; i < projectInfo.people.length; i++) {
      if (projectInfo.people[i][0] === body._id) {
        projectInfo.people.splice(i, 1);
      }
    }

    await projectInfo.save();

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

router.post("/friends/:id", async (req, res, next) => {
  const { id } = req.params;
  // console.log(req.body.email);
  // console.log(id);
  // const test = await Project.findById(id);
  // console.log(test);
  try {
    const userInfo = await User.findOne({ user_email: req.body.email });
    // console.log([userInfo._id, userInfo.user_name, userInfo.user_email, id]);
    // 중복체크 ,....
    const projectInuser = await Project.findOne({
      _id: id,
      // people: [userInfo._id, userInfo.user_name, userInfo.user_email],
    });
    // console.log(projectInuser)
    if (projectInuser.people) {
      for (let n = 0; n < projectInuser.people.length; n++) {
        if (projectInuser.people[n][2] == userInfo.user_email) {
          res
            .status(404)
            .send({ success: false, message: "이미 초대된 친구입니다." });
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

      res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      // 이메일 존재하지만 추가 못함
      res.status(404).send({
        success: false,
        message: "알 수 없는 이유로 친구추가를 실패했습니다.",
      });
    }
  } catch (error) {
    console.log(error);
    // 회원가입하지 않은 유저 -> 유저에게 이메일 전송
    // console.log(`plz send email`);
    res.status(404).send({
      success: false,
      message: "회원가입하지 않은 유저입니다. 이메일 전송을 구현해주세요.",
    });
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
