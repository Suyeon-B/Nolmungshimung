import React, { useState } from "react";
import { Popover, Button } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";

function FriendInvite() {
  const [email, setEmail] = useState("");
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onClickPlus = () => {
    console.log(`email  : ${email}`);
    setEmail("");
  };
  const text = <FriendInviteTitle>친구초대</FriendInviteTitle>;
  const content = (
    <div
      style={{
        width: "400px",
        height: "300px",
      }}
    >
      <InviteForm>
        {/* 텍스트 -> 이메일로 고쳐야함 */}
        <input type="text" value={email} onChange={onChangeEmail} />
        <UsergroupAddOutlined
          style={{ fontSize: "25px" }}
          onClick={onClickPlus}
        />
      </InviteForm>
      {/* 프로젝트 참가자 이름 */}
      <p>wmsrb0907@gmail.com</p>
      <p>zeroG0804@gmail.com</p>
      <p>wonyong2207@gmail.com</p>
      <p>suyeon1111@gmail.com</p>
    </div>
  );

  return (
    <Popover
      placement="rightBottom"
      title={text}
      content={content}
      trigger="click"
    >
      <UsergroupAddOutlined style={{ fontSize: "35px", color: "black" }} />
    </Popover>
  );
}

const FriendInviteTitle = styled.span`
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 59px;
  margin-left: 40%;
`;

const InviteForm = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export default FriendInvite;
