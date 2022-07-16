import React, { useState, useEffect } from "react";
import { Popover, Button, Modal, Space } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function FriendInvite() {
  const { projectId } = useParams();
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState([
    // "dbsgur98@gmail.com",
    // "wmsrb0907@gmail.com",
    // "zeroG0804@gmail.com",
    // "wonyong2207@gmail.com",
    // "suyeon1111@gmail.com",
  ]);

  const success = () => {
    Modal.success({
      content: "친구 초대완료",
    });
  };

  const error = (msg) => {
    Modal.error({
      title: "친구 초대 실패",
      content: msg,
    });
  };

  useEffect(() => {
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/friends/${projectId}`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setFriends(res.map((el) => el[2]));
      })
      .catch((err) => console.log(`err: ${err}`));
  }, []);

  const onClickPlus = () => {
    let data = { email };
    console.log("friends:", friends);
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/friends/${projectId}`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log("res : ", res);
        if (res.success === true) {
          console.log("-====--0=--=-=");
          console.log(res);
          setFriends([...friends, email]);
          success();
          // console.log("추가 완료");
        } else {
          error(res.message);
          // console.log(res.message);
        }
        setEmail("");
      })
      .catch((err) => console.log(`err: ${err}`));
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickPlus();
    }
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
        <InviteEmailText>Email</InviteEmailText>
        {/* 텍스트 -> 이메일로 고쳐야함 */}
        <InviteEmailInput
          type="text"
          value={email}
          onChange={onChangeEmail}
          onKeyPress={handleOnKeyPress}
        />
        <UsergroupAddOutlined
          style={{ fontSize: "25px", color: "white" }}
          onClick={onClickPlus}
        />
      </InviteForm>
      {friends.map((el, i) => (
        <p key={i}>{el}</p>
      ))}
    </div>
  );

  return (
    <Popover
      placement="rightBottom"
      title={text}
      content={content}
      trigger="click"
    >
      <UsergroupAddOutlined style={{ fontSize: "35px" }} />
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
  background-color: black;
  width: 80%;
  margin-left: 10%;
  border-radius: 50px;
  background: rgba(27, 25, 25, 0.7);
  border: 0;
  margin-bottom: 20px;
`;

const InviteEmailText = styled.span`
  color: white;
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
`;

const InviteEmailInput = styled.input`
  width: 60%;
  background: transparent;
  border: 0;
  color: white;
  outline: none;
`;

export default FriendInvite;
