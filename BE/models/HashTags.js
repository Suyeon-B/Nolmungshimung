const mongoose = require("mongoose");

const hashSchema = mongoose.Schema({
  hash_tag_names: {
    type: Array,
  },
});

module.exports = mongoose.model("HashTags", hashSchema);
