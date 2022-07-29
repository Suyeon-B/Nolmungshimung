//redis
// const port_redis = 6379;
// var redis = require("redis")
//   , subscriber = redis.createClient(port_redis, 'localhost')
//   , red  = redis.createClient(port_redis, 'localhost');
// red.connect();
// subscriber.connect();
// red.configSet("notify-keyspace-events", "Ex");
// red.sendCommand(['CONFIG'. 'SET', ])
// subscriber.on("pmessage", function (pattern, channel, message) {
//     console.log("pattern : "+pattern+" channel: "+channel+" message : "+message);
// });
// subscriber.pSubscribe('*');
var redis = require("redis");
const Project = require(__base + "models/Project");
const HashTags = require(__base + "models/HashTags");
var subscriber = redis.createClient({
  url: "redis://127.0.0.1:6379",
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
  url: "redis://127.0.0.1:6379",
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
  let responseData = await HashTags.findOne(
    {},
    { _id: false, hash_tag_names: true }
  ).lean();
  // await Redis.RPUSH('abc', ['1','2','3'])
  await publisher.EXPIRE("hashtags", 0);
  await publisher.SADD("hashtags", responseData.hash_tag_names);
});

module.exports = { publisher, subscriber };
