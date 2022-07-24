var express = require("express");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");

router.get("/", async (req, res, next) => {
  // const body = req.body;
  // console.log(body);
  //   console.log(UploadProject.find());

  try {
    const uploadProjectInfo = await UploadProject.find();
    console.log(uploadProjectInfo);

    // for (let i = 0; i < uploadProjectInfo.people.length; i++) {
    //   if (projectInfo.people[i][0] === body._id) {
    //     projectInfo.people.splice(i, 1);
    //   }
    // }

    // await uploadProjectInfo.save();

    // userInfo.user_projects = userInfo.user_projects.filter((projectId) => projectId !== id);

    // await userInfo.save();

    // return res.status(200).send({ success: "deleteSuccess" });
  } catch (error) {
    console.log(`uploaded project find: ${error}`);
    res.status(404).send({ error: "project not found" });
  }
});

module.exports = router;
