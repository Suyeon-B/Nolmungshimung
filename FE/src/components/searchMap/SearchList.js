import React, { useEffect, useState } from "react";
import SearchListRoute from "./SearchListRoute";
import styled from "styled-components";

const SearchList = ({
  itemRoute,
  setItemRoute,
  Places,
  projectId,
  startDate,
}) => {
  function GetGooglePlaceId(props) {
    let url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
    const api_key = "AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E";
    url =
      url + "input=" + props.input + "&inputtype=textquery" + "&key=" + api_key;
    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/travel/` + props.id)
      .then((response) => response.json())
      .then((data) => {
        if (data.message != "success") {
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              if (data.candidates[0] && data.candidates[0].place_id) {
                let url =
                  "https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,photo,type,opening_hours,price_level,review,user_ratings_total&place_id=";
                fetch(url + data.candidates[0].place_id + "&key=" + api_key)
                  .then((res) => res.json())
                  .then((data) => {
                    data.id = props.id;
                    data.place_name = props.place_name;
                    data.road_address_name = props.road_address_name;
                    data.category_group_name = props.category_group_name;
                    data.phone = props.phone;
                    data.place_url = props.place_url;

                    fetch(
                      `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.id}`,
                      {
                        method: "post",
                        headers: {
                          "content-type": "application/json",
                          // "Access-Control-Allow-Origin" : '*'
                        },
                        body: JSON.stringify(data),
                        // credentials: "include",
                      }
                    ).catch((error) => console.log("error:", error));
                  })
                  .catch((error) => {
                    console.log("error:", error);
                  });
              } else {
                let kakaoData = {
                  id: props.id,
                  place_name: props.place_name,
                  road_address_name: props.road_address_name,
                  category_group_name: props.category_group_name,
                  phone: props.phone,
                  place_url: props.place_url,
                  result: null,
                };
                fetch(
                  `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.id}`,
                  {
                    method: "post",
                    headers: {
                      "content-type": "application/json",
                      // "Access-Control-Allow-Origin" : '*'
                    },
                    body: JSON.stringify(kakaoData),
                    // credentials: "include",
                  }
                ).catch((error) => console.log("error:", error));
              }
            })
            .catch((error) => {
              console.log("error:", error);
            });
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      {Places.map((item, i) => (
        <SearchListRoute
          key={i}
          itemRoutes={itemRoute}
          setItemRoutes={setItemRoute}
          projectId={projectId}
          route={item}
          idx={i}
          startDate={startDate}
        />
      ))}
    </>
  );
};

export default SearchList;
