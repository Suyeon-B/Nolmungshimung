var express = require("express");
const { restart } = require("nodemon");

var router = express.Router();
const Project = require(__base + "models/Project");
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
const { User } = require(__base + "models/User");

router.post("/testapi", async (req, res, next) => {
  try {
    const projectId = req.body.projectId;
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const projectTitle = req.body.projectTitle;

    const getProject = await Project.findById(projectId);
    const user = await User.findById(userId);

    getProject["people"] = [[userId, user.user_name, user.user_email]];
    getProject["start_date"] = startDate;
    getProject["project_title"] = projectTitle;

    const newProject = new Project({
      people: [[userId, user.user_name, user.user_email]],
      start_date: getProject["start_date"],
      project_title: getProject["project_title"],
      routes: getProject["routes"],
      term: getProject["term"],
    });

    const response = await newProject.save();

    user["user_projects"].push(response._id);
    await user.save();

    console.log(response);
    res.status(200).send({ success: "프로젝트 가져오기 성공!" });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "프로젝트 가져오기 실패!" });
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ id: "123" });
  // res.render("index", { title: "Express" });
});

router.post("/", async (req, res) => {
  const user_date = await User.findOne({ user_email: req.body[0] });
  const project = new Project(req.body[1]);

  // project["people"].push(user_date._id.toString());
  project["people"].push([user_date._id.toString(), user_date.user_name, user_date.user_email]);

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

    userInfo.user_projects = userInfo.user_projects.filter((projectId) => projectId !== id);

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
          res.status(404).send({ success: false, message: "이미 초대된 친구입니다." });
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

router.post("/upload", async (req, res) => {
  console.log("projects upload");
  console.log(req.body);
  const info = req.body;

  // console.log("INFO", info);
  delete info._id;
  console.log(info.hashTags);
  const ProjectId = req.body._id;
  const hashTags = info.hashTags;
  console.log("hashtags", hashTags);
  const uploadProject = new UploadProject(info);
  try {
    console.log("try");
    await uploadProject.save(async (error, date) => {
      if (error) {
        console.log(`Upload FAIL ${error}`);
        return res.status(403).json({
          success: false,
          message: "알 수 없는 이유로 업로드 실패",
        });
      } else {
        try {
          // T_T
          // await HashTable.find({}).then(async (doc) => {
          //   const hashObject = doc.hashTagNames;
          //   console.log("for before");
          //   // for (let i = 0; i < hashTags.length; i++) {
          //   //   console.log("in for loop");
          //   //   console.log(hashTags);
          //   //   console.log(hashTags[i]);
          //   //   console.log(req.body._id); // undefined
          //   //   try {
          //   //     hashObject = {tag : [projectId]} <- tag변수가 안들어감
          //   //     hashObject.hashTags[i] = [Projereq.body._idctId];
          //   //     console.log("here 11");
          //   //   } catch (error) {
          //   //     hashObject = { tag: [req.body._id] };
          //   //     console.log(hashObject);
          //   //     console.log("here 222");
          //   //     hashObject.hashTags[i] = [
          //   //       ...hashObject.hashTags[i],
          //   //       req.body._id,
          //   //     ];
          //   //   }
          //   // }
          //   const hashTable = new HashTable(doc);
          //   await HashTable.findOneAndUpdate(
          //     { _id: doc._id },
          //     { $set: { hashTagNames: hashObject } },
          //     { new: true }
          //   );
          // });
          return res.status(200).json({
            success: true,
            message: "업로드 및 해시태그 저장 성공",
          });
        } catch (error) {
          console.log(`HashTags Upload ERROR: ${error}`);
          res.send(404).send({ error: "HashTags Upload Fail" });
        }
      }
    });
  } catch (error) {
    console.log(`Project Upload ERROR: ${error}`);
    res.send(404).send({ error: "project Upload Fail" });
  }
});

// User.findOne({ user_email: "a" }).then((data) => {
//   console.log(data);
// });

module.exports = router;
