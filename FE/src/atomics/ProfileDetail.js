import React from "react";
import { Popover, Button } from "antd";
import styled from "styled-components";
import { useAuth } from "../components/auth/Auth";

function ProfileDetailComponent() {
  const auth = useAuth();

  const goMypage = () => {
    console.log("마이페이지로 이동 넣어야함");
  };
  const onClickLogOut = () => {
    auth.logout();
  };
  const content = (
    <div>
      <ProfileBtn onClick={goMypage}>마이페이지</ProfileBtn>
      <ProfileBtn onClick={onClickLogOut}>로그아웃</ProfileBtn>
    </div>
  );

  return (
    <Popover
      content={content}
      // title={`My Email : ${sessionStorage?.getItem("user_email")}`}
      title={`My Email : ${auth.user?.user_email}`}
      trigger="hover"
      placement="rightBottom"
    >
      {/* <ProfileHoverBtn>혁</ProfileHoverBtn> */}
      <ProfileHoverBtn>{auth.user?.user_name.slice(0, 3)}</ProfileHoverBtn>
    </Popover>
  );
}

const ProfileBtn = styled.p`
  cursor: pointer;
`;

const ProfileHoverBtn = styled.div`
  background-color: green;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  position: fixed;
  bottom: 0;
  margin-bottom: 20px;
  left: 20px;
`;

export default ProfileDetailComponent;
