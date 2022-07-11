var express = require('express');
var router = express.Router();
var Client = require('mongodb').MongoClient;
const { Travel } = require(__base + "models/Travel");

/* GET home page. */
router.get('/:id', async function(req, res, next) {
  let query = req.query;
  let data = await Travel.findOne({ travel_id: query.id})
  console.log(data)
  let resForm = {
    status: 500,
    message: null
  }
  // if (data){
  //   resForm.status = 200
  //   resForm.message = data
  // }
  console.log('get /id');
  return res.send(JSON.stringify(resForm));
});


router.post('/:id', async function(req, res, next) {
  let query = req.query;
  let body = req.body;
  let insertForm = {
    travel_id : body.id,
    place_name : body.place_name,
    road_address_name : body.road_address_name,
    category_group_name : body.category_group_name,
    phone : body.phone,
    place_url : body.place_url,
    // photo: body.result.photos ? body.result.photos[0].html_attributions[0]: null,
    // photo_reference: body.result.photos ? body.result.photos[0].photo_reference : null,
    rating: body.result.rating,
    reviews: body.result.reviews,
    user_ratings_total: body.result.user_ratings_total
  }
  console.log(insertForm);

  let resForm = {
    status: 500,
    message: null
  }

  const travel = new Travel(insertForm);
  travel.save()
  .then(() => {
    console.log('success');
    resForm.status = 200
    resForm.message = insertForm
  })
  .catch((err) => {
    console.log(err);
  })
  
  return res.send(JSON.stringify(resForm));
});

module.exports = router;
