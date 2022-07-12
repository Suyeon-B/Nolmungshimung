const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  // object_id: mongoose.Schema.Types.object_id,
  start_date: { type: Array, required: true },
  end_date: { type: Array, required: true },
  term: { type: Number },
  project_title: { type: String, required: true },
  people: { type: Array },
  routes: { type: Array },
  memo: { type: Object },
  log: { type: Array },
  upload_flag: { type: Array },
});

module.exports = mongoose.model("Project", projectSchema);
