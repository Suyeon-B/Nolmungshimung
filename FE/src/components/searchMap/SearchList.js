import React, { useEffect, useState } from "react";
import dragFunction from "./DragAndDrop";
import styled from "styled-components";

const SearchList = (Places) => {
  function GetGooglePlaceId(props) {
    let url =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
    const api_key = "AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E";
    url =
      url + "input=" + props.input + "&inputtype=textquery" + "&key=" + api_key;
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:8443/travel/` + props.id)
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
                      `http://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.id}`,
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
                  `http://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.id}`,
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

  function makeLI(item, idx) {
    return (
      <StyledLi
        draggable
        onDragOver={(event) => {
          return dragFunction(event, "over");
        }}
        onDrop={(event) => dragFunction(event, "drop")}
        onDragEnter={(event) => dragFunction(event, "enter")}
        onDragLeave={(event) => dragFunction(event, "leave")}
        className="dragAndDrop"
        key={idx}
      >
        {/* <span>{i + 1}</span> */}
        <StyledTile>{item.place_name}</StyledTile>
        {item.road_address_name ? (
          <div>
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
        {/* {item.road_address_name
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
            })} */}
      </StyledLi>
    );
  }

  return <>{Places.map((item, i) => makeLI(item, i))}</>;
};

const StyledLi = styled.li`
  border-bottom: 2px solid #ebebeb;
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 12px;
`;

const StyledTile = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d56bc;
  margin-bottom: 14px;
`;

export default SearchList;
