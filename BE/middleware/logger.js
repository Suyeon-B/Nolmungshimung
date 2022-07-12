const requestIp = require("request-ip");
const { Log } = require(__base + "models/Log");

exports.log = function (req, res) {
  return new Promise((resolve, reject) => {
    // const data = `${req.method} ${req.url}` + requestIp.getClientIp(req);
    // console.log(data);

    const log = new Log({
      ip: requestIp.getClientIp(req),
      method: req.method,
      url: req.url,
      // user : req.user._id
    });

    log.save(function (err, data) {
      if (err) {
        console.log("err : " + err);
        reject(false);
      }
      // console.log('Log : ' + data);
      resolve(true);
    });
  });
};
