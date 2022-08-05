var redis = require("redis");
require("dotenv").config();
const Project = require(__base + "models/Project");
const HashTags = require(__base + "models/HashTags");
const uploadProject = require(__base + "models/UploadProject");
const hashtables = require(__base + "models/HashTable");
var subscriber = redis.createClient({
  url: process.env.Redis_IP
    ? `redis://${process.env.Redis_IP}:6379`
    : "redis://127.0.0.1:6379",
});

subscriber.on("reconnecting", async () => {
  console.log("subscriber reconnect again");
});

subscriber.on("error", (error) => {
  console.log("subscriber error", error);
});

subscriber.connect().then(async () => {
  console.log("subscriber connected");
  await subscriber.sendCommand([
    "CONFIG",
    "SET",
    "notify-keyspace-events",
    "Ex",
  ]);

  await subscriber.pSubscribe(["*"], async (message) => {
    console.log("* " + message);
    if (/^routes*/.test(message)) {
      let value = await publisher.get(`${message.split("/")[1]}`);
      try {
        await Project.findOneAndUpdate(
          { _id: message.split("/")[1] },
          { $set: { routes: JSON.parse(value) } },
          { new: true }
        );
      } catch (error) {
        console.log(`project update error: ${error}`);
      }
      await publisher.expire(`${message.split("/")[1]}`, 0);
    }
  });
});

var publisher = redis.createClient({
  url: process.env.Redis_IP
    ? `redis://${process.env.Redis_IP}:6379`
    : "redis://127.0.0.1:6379",
});

publisher.on("reconnecting", () => {
  console.log("publisher reconnect");
});

publisher.on("error", () => {
  console.log("publisher error");
});

publisher.connect().then(async () => {
  console.log("publisher connected");
  // 초기 세팅
  await publisher.EXPIRE("hashtags", 0);
  // let response = await uploadProject.find(
  let response = await hashtables.find(
    {},
    {_id: false, hash_tag_name: true}
  ).lean();
  // let setItem = new Set()
  for (let r of response){
    publisher.SADD("hashtags", r.hash_tag_name)
  }
    // r.hashTags.forEach(item => setItem.add(item))
    // r.hashTags.forEach(item => publisher.SADD("hashtags", item)) 
  // }
  // let responseData = await HashTags.findOne(
  //   {},
  //   { _id: false, hash_tag_names: true }
  // ).lean();

});

module.exports = { publisher, subscriber };
