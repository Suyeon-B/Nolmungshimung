const mongoose = require("mongoose");

/**
 * Log 관련
 */
const logSchema = mongoose.Schema(
  {
    ip: {
      type: String,
    },
    method: {
      type: String,
    },
    url: {
      type: String,
    },
    type: {
      type: String,
      default: "LOG",
    },
    content: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

logSchema.methods.saveContent = function (cb) {
  var log = this;

  log.save(function (err, data) {
    if (err) {
      cb(err);
    }
    cb(null, log);
  });
};

const Log = mongoose.model("Log", logSchema);

module.exports = { Log };
