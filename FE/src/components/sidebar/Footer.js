import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FriendProfile from "../../atomics/FriendProfile";
import FriendInvite from "../../atomics/FriendInvite";
import { AudioFilled, AudioMutedOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

function Footer() {
  const { projectId } = useParams();
  const [mic, setMic] = useState(true); // 자신의 초기값 설정 ?
  const [profiles, setProfiles] = useState(null);
  const [friends, setFriends] = useState([
    // "남윤혁",
    // "강동원영",
    // "지영장존",
    // "구준규",
    // "금잔디연",
  ]);
  // ! 빈배열이어야함 나중에 지울건데 예씨임
  useEffect(() => {
    // * 이거아님 보이스톡 들온 사람이 출력돼야함
    if (projectId === null) return;
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${projectId}`,
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
        setFriends([...friends, ...res.people.map((el) => el[1])]);
      })
      .catch((err) => console.log(`err: ${err}`));
  }, [projectId]);

  useEffect(() => {
    setProfiles(
      <>
        {friends.map((el, idx) => (
          <FriendProfile key={idx} nickName={el} />
        ))}
      </>
    );
  }, [friends]);

  const onClickMic = () => {
    // 누르면 마이크 음소거 OR 소거
    setMic(!mic);
  };
  return (
    <FooterContainer>
      {mic ? (
        <AudioFilled style={{ fontSize: "28px" }} onClick={onClickMic} />
      ) : (
        <AudioMutedOutlined style={{ fontSize: "28px" }} onClick={onClickMic} />
      )}
      {profiles}
      {/* <FriendProfile nickName={"윤혁"} />
      <FriendProfile nickName={"박준규"} />
      <FriendProfile nickName={"장영지"} />
      <FriendProfile nickName={"박수연"} />
      <FriendProfile nickName={"허영원"} /> */}
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
  margin-left: 10px;
  align-items: center;
  padding: 5px 15px 5px 15px;
  overflow: auto;
  white-space: nowrap;
  justify-content: space-between;
  position: absolute;
  bottom: 20px;
  min-width: 200px;
  width: 280px;
  height: 60px;
`;

export default Footer;
