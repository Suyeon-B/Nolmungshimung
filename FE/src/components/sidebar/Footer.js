import React, { useState } from "react";
import styled from "styled-components";
import FriendProfile from "../../atomics/FriendProfile";
import FriendInvite from "../../atomics/FriendInvite";
import { AudioFilled, AudioMutedOutlined } from "@ant-design/icons";
function Footer() {
  const [mic, setMic] = useState(true); // 자신의 초기값 설정 ?
  const onClickMic = () => {
    setMic(!mic);
  };
  return (
    <FooterContainer>
      {mic ? (
        <AudioFilled style={{ fontSize: "35px" }} onClick={onClickMic} />
      ) : (
        <AudioMutedOutlined style={{ fontSize: "35px" }} onClick={onClickMic} />
      )}

      <FriendProfile nickName={"윤혁"} />
      <FriendProfile nickName={"박준규"} />
      <FriendProfile nickName={"장영지"} />
      <FriendProfile nickName={"박수연"} />
      <FriendProfile nickName={"허영원"} />
      <FriendInvite />
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  width: 250px;
  height: 86px;
  background: #e7e7e7;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  overflow: auto;
  white-space: nowrap;
  justify-content: space-between;
`;

export default Footer;
