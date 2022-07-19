import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";
import useNotification from "../../atomics/Notification";
import { AlertFilled } from "@ant-design/icons";
import socket from "../../socket";
import { useAuth } from "../../components/auth/Auth";

function SpotRoute({
  startDate,
  item,
  setItemRoute,
  itemId,
  selectedIndex,
  setIsDrage,
  setIsAddDel,
}) {
  const auth = useAuth();
  const [notifyFlag, setNotifyFlag] = useState(false);
  // const [routes, setRoutes] = useState(item.routes);
  // console.log("=================");
  // console.log(item[0]);
  // console.log("=================");
  // useEffect(() => {
  MarkMap(item[selectedIndex]);
  // }, [...item[0]]);

  useEffect(() => {
    if (
      auth === null ||
      auth === undefined ||
      auth.user === undefined ||
      auth.user === null
    )
      return;
    if (notifyFlag === false) return;
    socket.emit("attention", culTripTermData(startDate, selectedIndex));
    setNotifyFlag(false);
    // socket.emit("attention", culTripTermData(startDate, selectedIndex), () => {
    //   setNotifyFlag(false);
    // });
    console.log("attention");
  }, [notifyFlag]);

  useEffect(() => {
    socket.on("attentionPlease", ([date, user_name]) => {
      // console.log("attention please on");
      const triggerNotif = useNotification("놀멍쉬멍", {
        body: `${user_name}님이 ${date} 페이지로 당신을 부르고 있어요!`,
      });
      triggerNotif();
      console.log("ddd");
    });
  }, []);
  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate.slice(0, 3));
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
  };
  const callFriends = () => {
    setNotifyFlag(true);
    console.log(`notify flag is ${notifyFlag}`);
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
        />
        <SpotRouteMap id="myMap" />
      </SpotRouteSection>

      {/* <TextEditor project_Id={itemId} selectedIndex={selectedIndex} /> */}
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
