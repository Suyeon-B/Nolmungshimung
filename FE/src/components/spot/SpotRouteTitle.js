import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AlertFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Badge from "../../atomics/Badge";

function SpotRouteTitle(props) {
  let navigate = useNavigate();
  const [notifyFlag, setNotifyFlag] = useState(false);

  useEffect(() => {
    if (notifyFlag === false) return;
    // console.log(notifyFlag);
    socket.emit("attention", props.date, props.selectedIndex, props.projectId, props.userName);
    setNotifyFlag(false);
    // console.log("attention");
  }, [notifyFlag]);
  const onClcikResult = () => {
    navigate(`/project/${props.projectId}/result`, { replace: false });
  };
  const callFriends = () => {
    // console.log(`notify flag is ${notifyFlag}`);
    setNotifyFlag(true);
    Badge.success("친구들에게 알림을 보냈어요 !");
    // console.log(`notify flag is ${notifyFlag}`);
  };
  return (
    <SpotRouteTitleDiv>
      <section>
        <div className="dateAlert">
          <SpotRouteTitleDay>{props.date}</SpotRouteTitleDay>
          <AlertBtnWrapper onClick={callFriends}>
            <AlertFilled
              style={{ color: "white", fontSize: "25px" }}
              // onClick={callFriends}
            />
            <span className="alertBtnText">주목시키기</span>
          </AlertBtnWrapper>
        </div>
      </section>
      <SpotRouteTitleBtn onClick={onClcikResult}>작성 완료</SpotRouteTitleBtn>
    </SpotRouteTitleDiv>
  );
}

const AlertBtnWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 40px;
  background: #ff8a3d;
  border-radius: 5px;
  margin-left: 15px;
  color: white;
  font-weight: 800;
  cursor: pointer;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }

  .alertBtnText {
    margin-left: 5px;
  }
`;

const SpotRouteTitleDiv = styled.section`
  width: 100%;
  margin-top: 29px;
  padding-bottom: 5px;
  border-bottom: 2px solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .dateAlert {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

const SpotRouteTitleDay = styled.span`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 48px;
  color: #ff8a3d;
  margin-left: 25px;
`;

const SpotRouteTitleBtn = styled.button`
  white-space: nowrap;
  margin-right: 25px;
  // margin-bottom: 10px;
  background-color: #ff8a3d;
  border: 0;
  border-radius: 5px;
  padding: 12px 14px 14px 14px;
  color: #f8f9fa;
  font-weight: 800;
  cursor: pointer;
  height: 40px;
  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }
`;

export default React.memo(SpotRouteTitle);
