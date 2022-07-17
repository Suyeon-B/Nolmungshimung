import React, { useState } from "react";
import dragFunction from "./DragAndDrop";
import styled from "styled-components";
import { v4 as uuidV4 } from "uuid";
import { overEvent, clickEvent, outEvent } from "../../pages/search/Search";
import SearchDetail from "./SearchDetail";
import SpotDetail from "../../components/spot/SpotDetail";

const fetchAddTravelRoute = async (id, route) => {
  try {
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${id}`,
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

  const showDrawer = async () => {
    const detail = await SpotDetail(route.id);
    setContents({
      address_name: route.address_name,
      category_group_name: route.category_group_name,
      phone: route.phone,
      place_name: route.place_name,
      place_url: route.place_url,
      road_address_name: route.road_address_name,
      reivew: detail.reviews,
      img: detail.img,
    });
    setVisible(true);
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
      key={idx}
      onMouseOver={() => {
        overEvent(idx);
      }}
      onMouseLeave={() => {
        outEvent(idx);
      }}
      onClick={() => {
        clickEvent(idx);
      }}
    >
      {/* <span>{i + 1}</span> */}
      <StyledRouteDiv>
        <StyledTile>{route.place_name}</StyledTile>
        <StyledDropDown>
          <img src="\statics\images\hanlabbong.png" />
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
      <a target="_blank" onClick={showDrawer}>
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
      margin-right: 4px;
      left: -45px;
      top: 25px;
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
  width: 100%;
  font-weight: 700;
  background-color: rgb(204, 204, 204, 0);
  &:hover {
    background-color: rgb(96, 96, 96);
  }
`;
export default SearchListRoute;
