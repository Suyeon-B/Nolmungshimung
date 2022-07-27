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

  const isEmail = (email) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return emailRegex.test(email);
  };

  const success = () => {
    Modal.success({
      content: "그룹 초대 메일이 발송되었습니다.",
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
      `${process.env.REACT_APP_SERVER_IP}/projects/friends/${projectId}`,
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

  const sendInviteEmail = () => {
    if (friends.length > 1) {
      for (let i = 0; i < friends.length; i++) {
        if (friends[i] === email) {
          Modal.error({
            content: "이미 초대된 친구입니다.",
          });
          setEmail("");
          return;
        }
      }
    }
    if (!isEmail(email)) {
      Modal.error({
        content: "지대로된 이메일 넣어라",
      });
      setEmail("");
      return;
    }
    let data = { email: email, projectId: projectId };
    console.log(data);
    fetch(`${process.env.REACT_APP_SERVER_IP}/invite/mail`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          console.log(res);
          setFriends([...friends, email]);
          success();
        } else {
          error(res.message);
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
      sendInviteEmail();
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
          onClick={sendInviteEmail}
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
      <UsergroupAddOutlined style={{ fontSize: "28px" }} />
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

export default React.memo(FriendInvite);
