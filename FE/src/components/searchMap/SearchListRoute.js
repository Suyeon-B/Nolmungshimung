import React, { useState } from "react";
import dragFunction from "./DragAndDrop";
import styled from "styled-components";
import { v4 as uuidV4 } from "uuid";

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
  route,
  idx,
  startDate,
}) => {
  const onClickAddRoute = (event) => {
    const uRoute = { ...route };
    uRoute["uid"] = uuidV4();
    fetchAddTravelRoute(projectId, uRoute);
    itemRoutes[event.target.dataset.idx].push(uRoute);
    setItemRoutes([...itemRoutes]);
  };
  return (
    <StyledLi
      draggable
      onDragOver={(event) => {
        event.preventDefault();
        // return dragFunction(event, "over");
      }}
      onDrop={(event) => dragFunction(event, "Drop")}
      onDragEnter={(event) => dragFunction(event, "enter")}
      onDragLeave={(event) => dragFunction(event, "leave")}
      className="dragAndDrop"
      key={idx}
    >
      {/* <span>{i + 1}</span> */}
      <StyledRouteDiv>
        <StyledTile>{route.place_name}</StyledTile>
        <StyledDropDown>
          <img src="\statics\images\hanlabbong.png" />
          <div className={"dropDownMenu"}>
            {itemRoutes.map((el, idx) => {
              return (
                <StyledBtn data-idx={idx} onClick={onClickAddRoute}>
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
      <a target="_blank" href={route.place_url}>
        카카오맵에서 상세보기
      </a>
      {/* {route.road_address_name
          ? GetGooglePlaceId({
              input: route.road_address_name + "" + route.place_name,
              id: route.id,
              place_name: route.place_name,
              road_address_name: route.road_address_name,
              category_group_name: route.category_group_name,
              phone: route.phone,
              place_url: route.place_url,
            })
          : GetGooglePlaceId({
              input: route.address_name + "" + route.place_name,
              id: route.id,
              place_name: route.place_name,
              road_address_name: route.address_name,
              category_group_name: route.category_group_name,
              phone: route.phone,
              place_url: route.place_url,
            })} */}
    </StyledLi>
  );
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

const StyledDropDown = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  position: relative;
  top: -7px;
  left: -30px;
  width: 5%;

  .dropDownMenu {
    display: none;
  }
  &:hover {
    .dropDownMenu {
      display: block;
      position: absolute;
      width: 100px;
      left: -45px;
      top: 6px;
      background-color: rgb(147, 147, 147);
      border-radius: 3px;
      padding: 4px;
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
  font-size: 18px;
  font-weight: 700;
  background-color: rgb(204, 204, 204, 0);
  &:hover {
    background-color: rgb(96, 96, 96);
  }
`;
export default SearchListRoute;
