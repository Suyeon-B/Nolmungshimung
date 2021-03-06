export function spotDetail(props) {
  return new Promise(async (resolve, reject) => {
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/find/` +
        props.place_id,
      {
        method: "POST", // 또는 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(props),
      }
    ) //get
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
          console.log("db에 있습니다");
          resolve(data.data);
        } else if (data.status === 206) {
          console.log("디비에 없음");
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

// function GetGoogleID(props) {
//   let url =
//     "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
//   url =
//     url +
//     "input=" +
//     encodeURI(props.input) +
//     "&inputtype=textquery" +
//     "&key=" +
//     api_key;

//   console.log(url);
//   return new Promise(async (resolve, reject) => {
//     axios
//       .get(url)
//       // .then((response) => {
//       //   console.log(response);
//       //   return response.json();
//       // })
//       .then((data) => {
//         console.log(data);
//         data = data.data;
//         if (data.status === "OK") {
//           const place = data.candidates[0].place_id;
//           console.log(place);
//           resolve(place);
//         } else resolve(null);
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//       });
//   });
// }

// function GetGooglePlace(id, props) {
//   let url =
//     "https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,photo,type,opening_hours,price_level,review,user_ratings_total&language=kr&place_id=";
//   url = url + id + "&key=" + api_key;
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url)
//       .then((data) => {
//         console.log(data);
//         data = data.data.result;
//         // console.log(data);
//         let insertForm = {
//           provider: 1,
//           place_id: props.place_id,
//           place_name: props.place_name,
//           road_address_name: props.road_address_name,
//           category_group_name: props.category_group_name,
//           phone: props.phone,
//           place_url: props.place_url,
//           photos: data.photos ? data.photos : null,
//           rating: data.rating ? data.rating : null,
//           reviews: data.reviews ? data.reviews : null,
//           user_ratings_total: data.user_ratings_total
//             ? data.user_ratings_total
//             : null,
//           opening_hours: data.opening_hours ? data.opening_hours : null,
//         };
//         // console.log(insertForm);
//         fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/travel/save`, {
//           method: "POST", // 또는 'PUT'
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(insertForm),
//         }) //get
//           .then((response) => response.json())
//           .then((data) => {
//             console.log(data);
//             resolve(data.data);
//           })
//           .catch((error) => {
//             console.log(error);
//             reject(error);
//           });
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error);
//       });
//   });
// }
