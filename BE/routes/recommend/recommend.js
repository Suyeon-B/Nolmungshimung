var express = require("express");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");

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

module.exports = router;
