const mongoose = require("mongoose");

const hashSchema = mongoose.Schema({
  hash_tag_name: {
    type: String,
  },
  project_id: {
    type: Array,
  },
});

module.exports = mongoose.model("HashTable", hashSchema);
