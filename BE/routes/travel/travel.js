var express = require("express");
var router = express.Router();
var Client = require("mongodb").MongoClient;
const { Travel } = require(__base + "models/Travel");

/* GET home page. */
router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let data = await Travel.findOne({ travel_id: id });
  if (data) {
    return res.status(200).send(
      JSON.stringify({
        message: "success",
      })
    );
  }
  res.status(404).send(
    JSON.stringify({
      message: "fail",
    })
  );
});


router.post('/:id', async function(req, res, next) {
  // let query = req.query;
  let body = req.body;
  let insertForm = {
    travel_id : req.params.id,
    place_name : body.place_name,
    road_address_name : body.road_address_name,
    category_group_name : body.category_group_name,
    phone : body.phone,
    place_url : body.place_url,
    // photo: body.result.photos ? body.result.photos[0].html_attributions[0]: null,
    photo: body.result ? body.result.photos : null,
    // photo_reference: body.result.photos ? body.result.photos[0].photo_reference : null,
    rating: body.result ? body.result.rating : null,
    reviews: body.result ? body.result.reviews : null,
    user_ratings_total: body.result ? body.result.user_ratings_total : null,
    opening_hours: body.result ? body.result.opening_hours : null,
  };

  const travel = new Travel(insertForm);
  travel
    .save()
    .then(() => {
      return res.status(200).send(
        JSON.stringify({
          message: "success",
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "fail",
      });
    });
});

module.exports = router;
