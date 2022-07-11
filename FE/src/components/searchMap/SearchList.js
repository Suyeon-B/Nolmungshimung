import { resolveOnChange } from "rc-input/lib/utils/commonUtils";
import React, { useEffect, useState } from "react";
import dragFunction from "./DragAndDrop";

const SearchList = (Places) => {
  function GetGooglePlaceId(props) {
    let url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
    const api_key = "AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E";
    url =
      url + "input=" + props.input + "&inputtype=textquery" + "&key=" + api_key;
    fetch(`http://localhost:8443/travel/`+ props.id)
      .then((response) => response.json())
      .then((data) => {
        if (data.message != 'success') {
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
              
                    fetch(`http://localhost:8443/travel/${props.id}`, {
                      method: "post",
                      headers: {
                        "content-type": "application/json",
                        // "Access-Control-Allow-Origin" : '*'
                      },
                      body: JSON.stringify(data),
                      // credentials: "include",
                    })
                    .catch((error) => console.log("error:", error))
                  })
                  .catch((error) => {
                    console.log("error:", error);
                  });
              }
              else{
                let kakaoData = {
                    id : props.id,
                    place_name : props.place_name,
                    road_address_name : props.road_address_name,
                    category_group_name : props.category_group_name,
                    phone : props.phone,
                    place_url : props.place_url,
                    result : null,
                }
                fetch(`http://localhost:8443/travel/${props.id}`, {
                      method: "post",
                      headers: {
                        "content-type": "application/json",
                        // "Access-Control-Allow-Origin" : '*'
                      },
                      body: JSON.stringify(kakaoData),
                      // credentials: "include",
                    })
                    .catch((error) => console.log("error:", error))
              }
            })
            .catch((error) => {
              console.log("error:", error);
            });
        }
      })
      .catch(error => console.log(error))
  }

  function makeLI(item, i) {
    return (
      <li
        onDragOver={(event) => {
          return dragFunction(event, "over");
        }}
        onDrop={(event) => dragFunction(event, "drop")}
        onDragEnter={(event) => dragFunction(event, "enter")}
        onDragLeave={(event) => dragFunction(event, "leave")}
        className="dragAndDrop"
        key={i}
        style={{
          border: "1px solid black",
          height: "auto",
          width: "100%",
          border: "1px solid black",
        }}
      >
        {/* <span>{i + 1}</span> */}
        <h5>{item.place_name}</h5>
        {item.road_address_name ? (
          <div style={{ margin: "10px 90px 0 0" }}>
            <p title={item.road_address_name}>{item.road_address_name}</p>
            {/* <p title = {item.address_name}>{item.address_name}</p> */}
          </div>
        ) : (
          <p>{item.address_name}</p>
        )}
        <p>{item.category_group_name}</p>
        <p>{item.phone}</p>
        <a target="_blank" href={item.place_url}>
          카카오맵에서 상세보기
        </a>
        {item.road_address_name
          ? GetGooglePlaceId({
              input: item.road_address_name + "" + item.place_name,
              id: item.id,
              place_name: item.place_name,
              road_address_name: item.road_address_name,
              category_group_name: item.category_group_name,
              phone: item.phone,
              place_url: item.place_url,
            })
          : GetGooglePlaceId({
            input: item.address_name + "" + item.place_name,
            id: item.id,
            place_name: item.place_name,
            road_address_name: item.address_name,
            category_group_name: item.category_group_name,
            phone: item.phone,
            place_url: item.place_url,
          })}
      </li>
    );
  }

  return (
    <div>
      {Places.map(
        (item, i) => makeLI(item, i)
      )}
    </div>
  );
};

export default SearchList;
