import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import FriendProfile from "../../atomics/FriendProfile";
import FriendInvite from "../../atomics/FriendInvite";
import { AudioFilled, AudioMutedOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { ConnectuserContext } from "../../context/ConnectUserContext";

function Footer(props) {
  const { projectId } = useParams();
  const users = props.users;
  const [mic, setMic] = useState(true); // 자신의 초기값 설정 ?
  const [profiles, setProfiles] = useState(null);
  const { connectUser, setConnectUser } = useContext(ConnectuserContext);
  const [friends, setFriends] = useState([
    // "남윤혁",
    // "강동원영",
    // "지영장존",
    // "구준규",
    // "금잔디연",
  ]);
  // ! 빈배열이어야함 나중에 지울건데 예씨임
  console.log("Footer");
  console.log(connectUser);

  useEffect(() => {
    // 이거아님 보이스톡 들온 사람이 출력돼야함
    if (projectId === null) return;
    // console.log("!!!!!!!!!!!!", props.users);
    if (!users.length) {
      // console.log("비어있다.");
      setFriends([]);
    } else setFriends([...friends, ...users.map((el) => el.nickName)]);
    // setFriends([users.user_name])
  }, [props.users]);

  useEffect(() => {
    // console.log("friends 바뀜", friends);
    setProfiles(
      <>
        <FriendProfile key={1} nickName={props.myNickName} color="#ff8a3d" />
        {Object.keys(connectUser).map((userName, idx) => {
          if (props.myNickName === userName) return;
          // console.log(connectUser, userName);
          return (
            <FriendProfile
              key={idx + 1}
              nickName={userName}
              color={connectUser[userName].color}
            />
          );
        })}
      </>
    );
  }, [connectUser]);

  const onClickMic = () => {
    // 누르면 마이크 음소거 OR 소거
    setMic(!mic);
    console.log("마이크 끄기!");
    props.toggleCameraAudio();
  };
  return (
    <FooterContainer>
      {mic ? (
        <AudioFilled style={{ fontSize: "35px" }} onClick={onClickMic} />
      ) : (
        <AudioMutedOutlined style={{ fontSize: "35px" }} onClick={onClickMic} />
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
  background: #e7e7e7;
  border-radius: 50px;
  display: flex;
  /* margin-left: 8.5%; */
  align-items: center;
  padding: 5px 15px 5px 15px;
  overflow: auto;
  white-space: nowrap;
  justify-content: space-between;
  position: fixed;
  bottom: 20px;
  min-width: 200px;
  width: 280px;
  /* width: auto; */
  height: 60px;
  white-space: nowrap;
  left: 7vw;

  ::-webkit-scrollbar {
    /* width: 0px;
    height: 7px; */
    display: none;
  }

  //::-webkit-scrollbar-thumb {
  //height: 1%; /* 스크롤바의 길이 */
  //background: #ff8a3d; /* 스크롤바의 색상 */
  //border-radius: 10px;
  //}

  //::-webkit-scrollbar-track {
  //background: rgba(33, 122, 244, 0.1); /*스크롤바 뒷 배경 색상*/
  //}
`;

export default Footer;
