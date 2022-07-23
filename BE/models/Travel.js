const mongoose = require("mongoose");

const travelSchema = mongoose.Schema({
  provider: {
    type: Number, //1은 구글 2는 카카오
  },
  place_id: {
    type: String,
    unique: true,
  },
  place_name: {
    type: String,
    // trim: true,
    // unique: 1,
  },
  road_address_name: {
    type: String,
    // minlength: 6,
  },
  category_group_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  place_url: {
    type: String,
  },
  photos: {
    type: Array,
  },
  photo: {
    type: String,
  },
  rating: {
    type: String,
  },
  reviews: {
    type: Array,
  },
  user_ratings_total: {
    type: String,
  },
  opening_hours: {
    type: Object,
  },
});

//useFlag 값 : 0(삭제), 1(이메일 인증 필요), 2(정상적으로 사용 가능한 상태)

const Travel = mongoose.model("Travel", travelSchema);

module.exports = { Travel };
