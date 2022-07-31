import React, { useState, useEffect } from "react";
import { Popover, Button, Modal, Space } from "antd";
import { UsergroupAddOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Badge from "./Badge";
// import InviteEmailInput from "./InviteEmailInput";

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
    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/projects/friends/${projectId}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setFriends(res.map((el) => el[2]));
      })
      .catch((err) => console.log(`err: ${err}`));
  }, []);

  const sendInviteEmail = () => {
    console.log(email);
    if (friends.length > 0) {
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
        content: "유효하지 않은 이메일입니다.",
      });
      setEmail("");
      return;
    }
    let data = { email: email, projectId: projectId };
    console.log(data);
    Badge.success("메일이 전송중입니다. 잠시 기다려주세요.");
    setFriends([...friends, email]);

    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/invite/mail`, {
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

  const deleteFriendDiv = (el) => {
    const deleteDiv = document.getElementById(el);
    deleteDiv.remove();
  };

  const onDelete = async (event) => {
    if (confirm("프로젝트 멤버에서 삭제하시겠어요?")) {
      deleteFriendDiv(event);
      console.log(projectId);
      const data = {
        email: event,
      };
      const response = await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/memberFriend/${projectId}`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
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
        <InviteEmailInput
          type="text"
          value={email}
          onChange={onChangeEmail}
          onKeyPress={handleOnKeyPress}
<<<<<<< HEAD
          placeholder="이메일을 적어주세요."
=======
          autoFocus="autofocus"
>>>>>>> 450012fe9a0ca08d10c0edb42ab664f65b166068
        />
        <UsergroupAddOutlined style={{ fontSize: "25px", color: "white" }} onClick={sendInviteEmail} />
      </InviteForm>
      <InvitedFriends>
        {friends.map((el, i) => (
          <div className="friend" key={i} id={el}>
            {el}
            <DeleteBtn
              onClick={() => {
                onDelete(el);
              }}
            />
          </div>
        ))}
      </InvitedFriends>
    </div>
  );

  return (
    <Popover placement="rightBottom" title={text} content={content} trigger="click">
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

CloseOutlined;
const InvitedFriends = styled.div`
  .friend {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin-left: 10%;
    padding: 0px 5px 0px 5px;
  }
  .friend:hover {
    background: #ebebeb;
    border-radius: 5px;
    transition: background 0.3s ease, color 0.1s ease;
  }
`;

const DeleteBtn = styled(CloseOutlined)`
  color: black;
  fontweight: normal;
  font-size: 10px;

  &:hover {
    color: red;
    transition: color 0.3s ease, color 0.1s ease;
  }
  &:active {
    font-size: 11px;
    transition: font-size 0.3s ease, color 0.1s ease;
  }
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
