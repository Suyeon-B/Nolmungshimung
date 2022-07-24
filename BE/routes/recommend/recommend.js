var express = require("express");
const { string } = require("request-ip/lib/is");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
//redis
const Redis = require(__base + 'routes/util/redis').publisher

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
  let hashtag = JSON.parse(req.query.taglist);
  let responseData = [];
  try{
    for (const tagName of hashtag){
      let recommendProjectList = await HashTable.findOne({"hash_tag_name": tagName}, {_id:false, project_id:true}).lean();
      if (recommendProjectList?.project_id){
        console.log(recommendProjectList.project_id);
        for (const projectId of recommendProjectList.project_id){
          // let project = await Redis.get(`recommend/project/${projectId}`);
          // console.log(projectId);
          let project = await UploadProject.findById(projectId);
          if (project) responseData.push(project);
        }
      }
    };
    console.log(responseData);
    return res.status(200).send(responseData)
  }catch(e){
    console.log(`err: ${e}`)
    return res.status(404).send({status: 404, msg : e})
  }
  
})
module.exports = router;
