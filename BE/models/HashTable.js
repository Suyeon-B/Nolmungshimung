const mongoose = require("mongoose");

const hashSchema = mongoose.Schema({
  hashTagNames: {
    type: Object,
  },
});

module.exports = mongoose.model("HashTable", hashSchema);
