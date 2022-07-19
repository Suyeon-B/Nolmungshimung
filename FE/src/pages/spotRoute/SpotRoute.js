import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";
import CursorTest from "../shareMemo/CursorTest";
import SearchDetail from "../../components/searchMap/SearchDetail";
import useNotification from "../../atomics/Notification";
import { AlertFilled } from "@ant-design/icons";
import socket from "../../socket";

function SpotRoute({
  startDate,
  item,
  setItemRoute,
  itemId,
  selectedIndex,
  setIsDrage,
  setIsAddDel,
}) {
  const [notifyFlag, setNotifyFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState(null);
  // const [routes, setRoutes] = useState(item.routes);
  // console.log("=================");
  // console.log(item[0]);
  // console.log("=================");
  // useEffect(() => {
  const handleVisible = (value) => {
    setVisible(value);
  };
  const handleContents = (value) => {
    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/travel/` + value.id) //get
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("db에 있습니다");
          setContents(data.data);
        } else {
          console.log("디비에 없음");
        }
      })
      .catch((error) => console.log(error));
    // console.log(value.id);
    // setContents(value);
  };
  MarkMap(item[selectedIndex]);
  // }, [...item[0]]);
  const onClose = () => {
    setVisible(false);
    setContents(null);
  };

  useEffect(() => {
    if (notifyFlag === false) return;
    // console.log(notifyFlag);
    socket.emit("attention", culTripTermData(startDate, selectedIndex));
    setNotifyFlag(false);
    // console.log("attention");
  }, [notifyFlag]);

  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate.slice(0, 3));
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
  };
  const callFriends = () => {
    // console.log(`notify flag is ${notifyFlag}`);
    setNotifyFlag(true);
    // console.log(`notify flag is ${notifyFlag}`);
  };
  return (
    <SpotRouteContainer>
      <SpotRouteTitle>
        <SpotRouteTitleDay>
          {culTripTermData(startDate, selectedIndex)}
        </SpotRouteTitleDay>
        <AlertFilled
          style={{ color: "#ff8a3d", fontSize: "34px", marginLeft: "15px" }}
          onClick={callFriends}
        />
        {/* <AlertFilled
          style={{ color: "#ff8a3d", fontSize: "34px", marginLeft: "15px" }}
          onClick={triggerNotif}
        /> */}
        <span>주목시키기</span>
      </SpotRouteTitle>
      <SpotRouteSection>
        <SpotList
          selectedIndex={selectedIndex}
          dayItem={item}
          setItemRoute={setItemRoute}
          setIsDrage={setIsDrage}
          setIsAddDel={setIsAddDel}
          handleVisible={handleVisible}
          handleContents={handleContents}
        />
        <SpotRouteMap id="myMap" />
      </SpotRouteSection>

      <CursorTest project_Id={itemId} selectedIndex={selectedIndex} />
      {/* <TextEditor project_Id={itemId} selectedIndex={selectedIndex} /> */}
      {contents !== null && (
        <SearchDetail onClose={onClose} visible={visible} contents={contents} />
      )}
    </SpotRouteContainer>
  );
}

// width: calc(100% - 100px);
const SpotRouteContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotRouteMap = styled.div`
  width: 47%;
  height: 100%;
  margin-left: 19px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const SpotRouteSection = styled.section`
  margin-top: 37px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(50% - 37px);
  justify-content: center;
`;

const SpotRouteTitle = styled.section`
  width: 100%;
  margin-top: 34px;
  border-bottom: 1px solid #c1c7cd;
`;

const SpotRouteTitleDay = styled.span`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 48px;
  color: #ff8a3d;
  margin-left: 15px;
`;

const SpotRouteTitleBtn = styled.button`
  cursor: pointer;
`;

export default SpotRoute;
