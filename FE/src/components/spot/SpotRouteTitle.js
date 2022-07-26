import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AlertFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
function SpotRouteTitle(props) {
  let navigate = useNavigate();
  const [notifyFlag, setNotifyFlag] = useState(false);

  useEffect(() => {
    if (notifyFlag === false) return;
    // console.log(notifyFlag);
    socket.emit(
      "attention",
      props.date,
      props.selectedIndex,
      props.projectId,
      props.userName
    );
    setNotifyFlag(false);
    // console.log("attention");
  }, [notifyFlag]);
  const onClcikResult = () => {
    navigate(`/project/${props.projectId}/result`, { replace: false });
  };
  const callFriends = () => {
    // console.log(`notify flag is ${notifyFlag}`);
    setNotifyFlag(true);
    // console.log(`notify flag is ${notifyFlag}`);
  };
  return (
    <SpotRouteTitleDiv>
      <section>
        <SpotRouteTitleDay>{props.date}</SpotRouteTitleDay>
        <AlertFilled
          style={{ color: "#ff8a3d", fontSize: "34px", marginLeft: "15px" }}
          onClick={callFriends}
        />
        <span>주목시키기</span>
      </section>
      <SpotRouteTitleBtn onClick={onClcikResult}>작성 완료</SpotRouteTitleBtn>
    </SpotRouteTitleDiv>
  );
}

const SpotRouteTitleDiv = styled.section`
  width: 100%;
  margin-top: 29px;
  border-bottom: 1px solid #c1c7cd;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  white-space: nowrap;
  margin-right: 25px;
  margin-bottom: 10px;
  background-color: #ff8a3d;
  border: 0;
  border-radius: 4px;
  padding: 14px;
  color: #f8f9fa;
  font-weight: 800;
  cursor: pointer;
`;

export default React.memo(SpotRouteTitle);
