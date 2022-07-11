const mongoose = require("mongoose");

const travelSchema = mongoose.Schema({
    travel_id: {
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
  photo: {
    type: Array,
  },
  photo_reference: {
    type: String ,
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
});

//useFlag 값 : 0(삭제), 1(이메일 인증 필요), 2(정상적으로 사용 가능한 상태)



const Travel = mongoose.model("Travel", travelSchema);

module.exports = { Travel };
