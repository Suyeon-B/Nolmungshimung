var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
// var Client = require("mongodb").MongoClient;
const { Travel } = require(__base + "models/Travel");

/* GET home page. */
router.get("/:id", async function (req, res, next) {
  let id = req.params.id;
  let data = await Travel.findOne({ place_id: id });
  if (data) {
    return res.status(200).send(
      JSON.stringify({
        message: "success",
        data: data,
      })
    );
  }
  res.status(404).send(
    JSON.stringify({
      message: "fail",
    })
  );
});

router.post("/:id", async function (req, res, next) {
  // let query = req.query;
  let body = req.body;
  let insertForm = {
    provider: body.provider,
    place_id: body.place_id,
    place_name: body.place_name,
    road_address_name: body.road_address_name,
    category_group_name: body.category_group_name,
    phone: body.phone,
    place_url: body.place_url,
    photos: body.photos,
    rating: body.rating,
    reviews: body.reviews,
    user_ratings_total: body.user_ratings_total,
    opening_hours: body.opening_hours,
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

const getCrawl = async (id) => {
  try {
    const data = {
      reviews: [],
      img: "",
    };
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://place.map.kakao.com/" + id);
    try {
      await page.waitForSelector(".evaluation_review li", {
        timeout: 3000,
      });
      const resultRevies = await page.evaluate(() => {
        let reviews = [];
        const reviewEls = document.querySelectorAll(".evaluation_review li");
        // console.log(commentEls.length);
        if (reviewEls.length) {
          reviewEls.forEach((v) => {
            // console.log(v.innerText);
            const star = v.querySelector(".star_info").innerText.charAt(0);
            const comment = v.querySelector(".comment_info p").innerText;
            reviews.push([star, comment]);
          });
        }

        return reviews;
      });
      data.reviews = resultRevies;
    } catch (e) {
      await page.close();
      await browser.close();
      data.reviews = [0];
      return data;
    }

    const page_now = await page.$(".link_present span");
    await page_now.click();
    await page.click(".link_present span");
    try {
      await page.waitForSelector(".view_image img", {
        timeout: 500,
      });

      // console.log(await page.content());
      const resultImg = await page.evaluate(() => {
        let img = "";
        const imgEls = document.querySelector(".view_image img");
        if (imgEls) {
          img = imgEls.src;
        }
        return img;
      });

      data.img = resultImg;
    } catch (e) {
      data.img = "";
    }
    await page.close();
    await browser.close();
    return data;
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
    data: data,
  });
});

module.exports = router;
