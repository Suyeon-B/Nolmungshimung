import React, { useState, useCallback, Suspense } from "react";
import styled from "styled-components";
import { v4 as uuidV4 } from "uuid";
import { overEvent, clickEvent, outEvent } from "../../pages/search/Search";
// import SearchDetail from "./SearchDetail";
const SearchDetail = React.lazy(() => import("./SearchDetail"));
import "../../App.css";
import { PlusCircleTwoTone, PrinterFilled } from "@ant-design/icons";
import CommonBtn from "../../atomics/CommonBtn";
import { spotDetail } from "../spot/SpotDetail";

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate.slice(0, 3));
  sDate.setDate(sDate.getDate() + day);
  return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

const SearchListRoute = ({
  id,
  itemRoutes,
  setItemRoutes,
  projectId,
  route, //place
  idx,
  startDate,
  setIsAddDel,
  selected,
  handleSelect,
}) => {
  const onClickAddRoute = (event) => {
    const uRoute = { ...route };
    uRoute["uid"] = uuidV4();
    // fetchAddTravelRoute(projectId, uRoute);
    // console.log(uRoute);
    uRoute.lock = null; // 색들어감 (락기능)
    uRoute.user_name = null; // 잡고있는 유저의 닉네임이 들어갈것임 (락 푸는 기능)
    // console.log(uRoute);
    itemRoutes[event.target.dataset.idx].push(uRoute);
    setItemRoutes([...itemRoutes]);
    setIsAddDel(true);
  };

  const [visible, setVisible] = useState(false);
  const [contests, setContents] = useState(null);

  const showDrawer = async () => {
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

    var detail = await spotDetail(data);

    if (detail) {
      setContents(detail);
      setVisible(true);
    }
  };

  const onClose = useCallback(() => {
    setVisible(false);
    setContents(null);
  }, []);

  return (
    <StyledLi
      id={id}
      style={{
        backgroundColor: selected ? "#ebebeb" : "",
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
        handleSelect(idx);
      }}
    >
      {/* <span>{i + 1}</span> */}
      <StyledRouteDiv>
        <StyledTile>{route.place_name}</StyledTile>
        <StyledDropDown>
          {/* <img className="hanlabong" src="\statics\images\hanlabong.png" /> */}
          {/* <PlusCircleTwoTone
            style={{ fontSize: "30px" }}
            twoToneColor="#FF8A3D"
          /> */}
          <CommonBtn
            icon={PlusCircleTwoTone}
            // style={{ fontSize: "30px" }}
            fontSize="30"
            twoToneColor="#FF8A3D"
          />
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
          <p title={route.road_address_name}>
            {route.road_address_name.substr(8)}
          </p>
          {/* <p title = {route.address_name}>{route.address_name}</p> */}
        </div>
      ) : (
        <p>{route.address_name.substr(8)}</p>
      )}
      <p>{route.category_group_name}</p>
      <p>{route.phone}</p>
      {/* <a target="_blank" href={route.place_url} onClick={showDrawer}> */}
      <a target="_blank" onClick={showDrawer} style={{ color: "#FF8A3D" }}>
        상세보기
      </a>
      {contests !== null && (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchDetail
            onClose={onClose}
            visible={visible}
            contents={contests}
          />
        </Suspense>
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
  left: -15px;
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
      z-index: 2;
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
  cursor: pointer;
  &:hover {
    background-color: rgb(96, 96, 96);
  }
`;

export default React.memo(SearchListRoute);
