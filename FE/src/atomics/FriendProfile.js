import React from "react";
import styled from "styled-components";

function FriendProfile(props) {
  const onClickMute = () => {
    console.log("음소거");
  };
  return (
    <FriendProfileContainer>
      <FriendNameText>{props.nickName.slice(-2)}</FriendNameText>
    </FriendProfileContainer>
  );
}

const FriendProfileContainer = styled.div`
  min-width: 51px;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ff8830;
  border-radius: 50%;
  border: 1.5px solid #e7e7e7;
`;
const FriendNameText = styled.span`
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  color: #ffffff;
`;

export default FriendProfile;
