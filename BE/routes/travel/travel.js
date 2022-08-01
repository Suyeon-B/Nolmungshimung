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
    try {
      let place = await GetGoogleID(req.body);
      let insertForm;
      if (place[0] && place[0].place_id) {
        detail = await GetGooglePlace(place[0].place_id, req.body);
        console.log("!!!!!!!!");
        insertForm = {
          provider: detail.provider,
          place_id: detail.place_id,
          place_name: detail.place_name,
          road_address_name: detail.road_address_name,
          category_group_name: detail.category_group_name,
          phone: detail.phone,
          place_url: detail.place_url,
          photos: detail.photos,
          rating: detail.rating,
          reviews: detail.reviews,
          user_ratings_total: detail.user_ratings_total,
          opening_hours: detail.opening_hours,
        };
      } else {
        const props = req.body;
        insertForm = {
          provider: 2,
          place_id: props.place_id,
          place_name: props.place_name,
          road_address_name: props.road_address_name,
          category_group_name: props.category_group_name,
          phone: props.phone,
          place_url: props.place_url,
          photo: null,
          rating: 0,
          reviews: null,
          user_ratings_total: null,
          opening_hours: null,
        };
      }

      const travel = new Travel(insertForm);
      await travel
        .save()
        .then(() => {
          console.log("구글 저장완");
          return res.send(
            JSON.stringify({
              status: 206,
              message: "success",
              data: insertForm,
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
    } catch (err) {
      console.log("에러", err);
    }
  }
});

function GetGoogleID(props) {
  let url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
  const api_key = process.env.REACT_APP_GOOGLE_KEY;
  url =
    url +
    "input=" +
    encodeURI(props.input) +
    "&inputtype=textquery" +
    "&key=" +
    api_key;
  // console.log(url, "durl?");
  // console.log(url);
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      // console.log("body: ", response.response);
      if (error) {
        reject(error);
      }
      try {
        const data = JSON.parse(body);
        const place = data.candidates;
        resolve(place);
      } catch (e) {
        reject(body);
      }
      reject(body);
    });
  });
}

function GetGooglePlace(id, props) {
  const api_key = process.env.REACT_APP_GOOGLE_KEY;
  let url =
    "https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,photo,type,opening_hours,price_level,review,user_ratings_total&language=kr&place_id=";
  url = url + id + "&key=" + api_key;
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      console.log("!!!!!!!!!!!!");
      if (error) {
        reject(error);
      }
      // console.log(body);
      // resolve(body);
      const googlePlace = JSON.parse(body).result;

      const travel = {
        provider: 1,
        place_id: props.place_id,
        place_name: props.place_name,
        road_address_name: props.road_address_name,
        category_group_name: props.category_group_name,
        phone: props.phone,
        place_url: props.place_url,
        photos: googlePlace.photos ? googlePlace.photos : null,
        rating: googlePlace.rating ? googlePlace.rating : null,
        reviews: googlePlace.reviews ? googlePlace.reviews : null,
        user_ratings_total: googlePlace.user_ratings_total
          ? googlePlace.user_ratings_total
          : null,
        opening_hours: googlePlace.opening_hours
          ? googlePlace.opening_hours
          : null,
      };
      // console.log(travel);
      resolve(travel);
    });
  });
}

// router.post("/save", async function (req, res) {
//   const travel = new Travel(req.body);
//   // console.log(travel);
//   await travel
//     .save()
//     .then(() => {
//       console.log("저장완");
//       return res.send(
//         JSON.stringify({
//           status: 206,
//           message: "success",
//           data: travel,
//         })
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send({
//         status: 500,
//         message: "fail",
//       });
//     });
// });

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
