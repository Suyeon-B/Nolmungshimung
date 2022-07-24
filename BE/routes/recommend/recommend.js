var express = require("express");
var router = express.Router();
const UploadProject = require(__base + "models/UploadProject");
const HashTable = require(__base + "models/HashTable");
//redis
const Redis = require(__base + 'routes/util/redis').publisher
function defaultObject() {
  this.get = function (key) {
      if (this.hasOwnProperty(key)) {
          return key;
      } else {
          return 0;
      }
  }
}

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

router.get("/hashtag", async (req, res, next) => {
  let hashtag = JSON.parse(req.query.taglist);
  let responseData = [];
  try{
    await hashtag.forEach(async tagName => {
      let recommendProjectList = await HashTable.findOne({hash_tag_name: tagName}, {_id:false, project_id:true}).lean();
      if(recommendProjectList?.project_id){
        await (recommendProjectList.project_id).forEach(async projectId => {
          // let project = await Redis.get(`recommend/project/${projectId}`);
          let project = await UploadProject.findById(projectId);
          console.log(project);
          responseData.push(project);
        })
      }
    });
  }catch(e){
    console.log(`err: ${e}`)
    return res.status(404).send({status: 404, msg : e})
  }
  
  return res.status(200).send(JSON.stringify(responseData))
})
module.exports = router;
