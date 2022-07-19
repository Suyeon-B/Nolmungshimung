import React, { useState } from "react";
import dragFunction from "./DragAndDrop";
import styled from "styled-components";
import { v4 as uuidV4 } from "uuid";
import { overEvent, clickEvent, outEvent } from "../../pages/search/Search";
import SearchDetail from "./SearchDetail";
import "../../App.css";
import SpotDetail from "../../components/spot/SpotDetail";

const fetchAddTravelRoute = async (id, route) => {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${id}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(route),
      }
    );
    const data = await response.json();
    // return response.json();
  } catch (error) {
    console.log(error);
  }
};

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate.slice(0, 3));
  sDate.setDate(sDate.getDate() + day);
  return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

const SearchListRoute = ({
  itemRoutes,
  setItemRoutes,
  projectId,
  route, //place
  idx,
  startDate,
  setIsAddDel,
}) => {
  const onClickAddRoute = (event) => {
    const uRoute = { ...route };
    uRoute["uid"] = uuidV4();
    fetchAddTravelRoute(projectId, uRoute);
    itemRoutes[event.target.dataset.idx].push(uRoute);
    setItemRoutes([...itemRoutes]);
    setIsAddDel(true);
  };

  const [visible, setVisible] = useState(false);
  const [contests, setContents] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((current) => !current);
  };

  function GetGooglePlace(props) {
    let url = "/place-api/findplacefromtext/json?";
    const api_key = "AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E";
    url =
      url + "input=" + props.input + "&inputtype=textquery" + "&key=" + api_key;
    fetch(url) //google맵 지도 검색
      .then((response) => response.json())
      .then((data) => {
        if (data.candidates[0] && data.candidates[0].place_id) {
          let url =
            "/place-api/details/json?fields=name,rating,formatted_phone_number,photo,type,opening_hours,price_level,review,user_ratings_total&place_id=";
          fetch(url + data.candidates[0].place_id + "&key=" + api_key)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              const travel = {
                provider: 1,
                place_id: props.place_id,
                place_name: props.place_name,
                road_address_name: props.road_address_name,
                category_group_name: props.category_group_name,
                phone: props.phone,
                place_url: props.place_url,
                photos: data.result.photos ? data.result.photos : null,
                rating: data.result.rating ? data.result.rating : null,
                reviews: data.result.reviews ? data.result.reviews : null,
                user_ratings_total: data.result.user_ratings_total
                  ? data.result.user_ratings_total
                  : null,
                opening_hours: data.result.opening_hours
                  ? data.result.opening_hours
                  : null,
              };

              console.log(travel);
              fetch(
                `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.place_id}`,
                {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(travel),
                  // credentials: "include",
                }
              )
                .then(() => {
                  console.log("구글 디비 저장완");
                  setContents(travel);
                })
                .catch((error) => console.log("error:", error));
            })
            .catch((error) => {
              console.log("error:", error);
            });
        } else {
          // 못찾았을때 카카오 크롤링
          const detail = SpotDetail(route.id);
          const KakaoTravel = {
            provider: 2,
            place_id: props.place_id,
            place_name: props.place_name,
            road_address_name: props.road_address_name,
            category_group_name: props.category_group_name,
            phone: props.phone,
            place_url: props.place_url,
            photo: detail.img,
            rating: detail.reviews ? detail.reviews[0][0] : 0,
            reviews: detail.reviews ? detail.reviews : null,
            user_ratings_total: null,
            opening_hours: null,
          };

          console.log(KakaoTravel);
          fetch(
            `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/${props.place_id}`,
            {
              //post - db 저장
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(KakaoTravel),
              // credentials: "include",
            }
          )
            .then(() => {
              console.log("카카오 디비 저장완");
              setContents(KakaoTravel);
            })
            .catch((error) => console.log("error:", error));
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }

  function FindDetailContents(props) {
    //1. 디비에 있나 확인
    let result;
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/travel/` + props.place_id
    ) //get
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("db에 있습니다");
          result = data.data;
          setContents(result);
        } else {
          console.log("디비에 없음");
          GetGooglePlace(props);
        }
        setVisible(true);
      })
      .catch((error) => console.log(error));
  }

  const showDrawer = () => {
    const data = {
      input: route.road_address_name + "" + route.place_name,
      place_id: route.id,
      place_name: route.place_name,
      road_address_name: route.road_address_name
        ? route.road_address_name
        : route.address_name,
      category_group_name: route.category_group_name,
      phone: route.phone,
      place_url: route.place_url,
    };

    FindDetailContents(data);
  };

  const onClose = () => {
    setVisible(false);
    setContents(null);
  };

  return (
    <StyledLi
      // draggable
      // onDragOver={(event) => {
      //   event.preventDefault();
      //   // return dragFunction(event, "over");
      // }}
      // onDrop={(event) => dragFunction(event, "Drop")}
      // onDragEnter={(event) => dragFunction(event, "enter")}
      // onDragLeave={(event) => dragFunction(event, "leave")}
      // className="dragAndDrop"

      style={{
        backgroundColor: isActive ? "#ebebeb" : "",
      }}
      key={idx}
      onMouseOver={() => {
        overEvent(idx);
      }}
      onMouseLeave={() => {
        outEvent(idx);
      }}
      onClick={() => {
        clickEvent(idx);
        handleClick();
      }}
    >
      {/* <span>{i + 1}</span> */}
      <StyledRouteDiv>
        <StyledTile>{route.place_name}</StyledTile>
        <StyledDropDown>
          <img className="hanlabong" src="\statics\images\hanlabong.png" />
          <div className={"dropDownMenu"}>
            {itemRoutes.map((el, idx) => {
              return (
                <StyledBtn key={idx} data-idx={idx} onClick={onClickAddRoute}>
                  {culTripTermData(startDate, idx)}
                </StyledBtn>
              );
            })}
          </div>
        </StyledDropDown>
      </StyledRouteDiv>
      {route.road_address_name ? (
        <div>
          <p title={route.road_address_name}>{route.road_address_name}</p>
          {/* <p title = {route.address_name}>{route.address_name}</p> */}
        </div>
      ) : (
        <p>{route.address_name}</p>
      )}
      <p>{route.category_group_name}</p>
      <p>{route.phone}</p>
      {/* <a target="_blank" href={route.place_url} onClick={showDrawer}> */}
      <a target="_blank" onClick={showDrawer} style={{ color: "#FF8A3D" }}>
        상세보기
      </a>
      {contests !== null && (
        <SearchDetail onClose={onClose} visible={visible} contents={contests} />
      )}
    </StyledLi>
  );
};
const StyledLi = styled.li`
  border-bottom: 2px solid #ebebeb;
  padding-top: 20px;
  padding-bottom: 15px;
  padding-left: 25px;
`;

const StyledTile = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #232a3c;
  margin-bottom: 14px;
`;

const StyledDropDown = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  position: relative;
  top: -7px;
  left: -30px;
  width: 20px;

  .dropDownMenu {
    display: none;
  }
  &:hover {
    .dropDownMenu {
      text-align: center;
      line-height: 13px;
      display: block;
      position: absolute;
      width: 90px;
      // margin-right: 50px;
      left: -55px;
      top: 25px;
      background-color: rgb(147, 147, 147);
      border-radius: 3px;
      padding: 4px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }
  }
`;
const StyledRouteDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const StyledBtn = styled.button`
  outline: 0;
  padding-bottom: 5px;
  border: none;
  color: white;
  font-size: 15px;
  width: 100%;
  font-weight: 700;
  background-color: rgb(204, 204, 204, 0);
  &:hover {
    background-color: rgb(96, 96, 96);
  }
`;

export default SearchListRoute;
