var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
// var Client = require("mongodb").MongoClient;
const { Travel } = require(__base + "models/Travel");
const request = require("request");

/* GET home page. */
router.post("/find/:id", async function (req, res, next) {
  // console.log(req.body);
  let id = req.params.id;
  let data = await Travel.findOne({ place_id: id });
  if (data) {
    console.log("데이터 있다");
    return res.send(
      JSON.stringify({
        status: 200,
        message: "success",
        data: data,
      })
    );
  } else {
    console.log('데이터 없다.');
    let url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
  url =
    url +
    "input=" +
    encodeURI(req.body.input) +
    "&inputtype=textquery" +
    "&key=" +
    process.env.REACT_APP_GOOGLE_KEY;

  console.log(`url 은 : `, url);
  request({url: url, method: "GET"}, function (err, response, body){
    console.log(body)
    return res.send(
      JSON.stringify({
        status: 400,
        data: body,
        message: "fail",
      })
    );
  })
    
  }
});

router.post("/save", async function (req, res) {
  const travel = new Travel(req.body);
  // console.log(travel);
  await travel
    .save()
    .then(() => {
      console.log("저장완");
      return res.send(
        JSON.stringify({
          status: 206,
          message: "success",
          data: travel,
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 500,
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

module.exports = router;
