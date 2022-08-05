const mongoose = require("mongoose");

const UploadProjectSchema = mongoose.Schema({
  start_date: { type: Array, required: true },
  end_date: { type: Array, required: true },
  term: { type: Number },
  project_title: { type: String, required: true },
  people: { type: Array },
  routes: { type: Array },
  quillRefEditor: { type: Object },
  log: { type: Array },
  upload_flag: { type: Array },
  trip_date: { type: Array },
  hashTags: { type: Array },
  img: { type: String },
});

module.exports = mongoose.model("UploadProject", UploadProjectSchema);
