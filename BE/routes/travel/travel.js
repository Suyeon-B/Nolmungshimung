var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
// var Client = require("mongodb").MongoClient;
// const { Travel } = require(__base + "models/Travel");

/* GET home page. */
// router.get("/:id", async function (req, res, next) {
//   let id = req.params.id;
//   let data = await Travel.findOne({ travel_id: id });
//   if (data) {
//     return res.status(200).send(
//       JSON.stringify({
//         message: "success",
//       })
//     );
//   }
//   res.status(404).send(
//     JSON.stringify({
//       message: "fail",
//     })
//   );
// });

// router.post('/:id', async function(req, res, next) {
//   // let query = req.query;
//   let body = req.body;
//   let insertForm = {
//     travel_id : req.params.id,
//     place_name : body.place_name,
//     road_address_name : body.road_address_name,
//     category_group_name : body.category_group_name,
//     phone : body.phone,
//     place_url : body.place_url,
//     // photo: body.result.photos ? body.result.photos[0].html_attributions[0]: null,
//     photo: body.result ? body.result.photos : null,
//     // photo_reference: body.result.photos ? body.result.photos[0].photo_reference : null,
//     rating: body.result ? body.result.rating : null,
//     reviews: body.result ? body.result.reviews : null,
//     user_ratings_total: body.result ? body.result.user_ratings_total : null,
//     opening_hours: body.result ? body.result.opening_hours : null,
//   };

//   const travel = new Travel(insertForm);
//   travel
//     .save()
//     .then(() => {
//       return res.status(200).send(
//         JSON.stringify({
//           message: "success",
//         })
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({
//         message: "fail",
//       });
//     });
// });

const getCrawl = async (id) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://place.map.kakao.com/" + id);
    try {
      await page.waitForSelector(".evaluation_review li .comment_info p span", {
        timeout: 1000,
      });
    } catch (e) {
      await page.close();
      await browser.close();
      return [];
    }
    const result = await page.evaluate(() => {
      let reviews = [];
      const commentEls = document.querySelectorAll(
        ".evaluation_review li .comment_info p span"
      );
      if (commentEls.length) {
        commentEls.forEach((v) => {
          reviews.push(v.innerText);
        });
      }
      return reviews;
    });
    let reviews = result;
    await page.close();
    await browser.close();
    return reviews;
  } catch (e) {
    console.log(e);
    return null;
  }
};

router.post("/place", async (req, res) => {
  // console.log(req.body.data);
  data = await getCrawl(req.body.data);
  if (data === null) {
    return res.status(400).json({
      success: false,
      message: "후기없다..",
    });
  }
  // console.log(data);
  return res.status(200).send({
    success: true,
    reviews: data,
  });
});

module.exports = router;
