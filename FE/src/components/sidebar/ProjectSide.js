import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/Auth";

const mookProject = [
  {
    _id: "62cd2a4e91c62a94ab81fd63",
    project_title: "테스트",
  },
  {
    _id: "62cda217f46641aeb3ed53ce",
    project_title: "가족여행",
  },
  {
    _id: "62cd9dbedfaa0666c2a963fd",
    project_title: "친구여행",
  },
  {
    _id: "62cd87e744942481738f578d",
    project_title: "효도여행",
  },
  {
    _id: "62cdb1eeea7abd8529793cb9",
    project_title: "여행여행",
  },
];

function ProfileDetail(props) {
  const auth = useAuth();
  // console.log(`auth.user : ${auth.user}`);
  let navigate = useNavigate();

  const goMypage = () => {
    console.log("마이페이지로 이동 넣어야함");
  };
  const onClickLogOut = () => {
    auth.logout();
    props.delBtns(false);
  };
  const onClickX = () => {
    props.delBtns(false);
  };
  return (
    <ProfileDetailContainer>
      <ProfileDetailXBtn onClick={onClickX}>X &nbsp;</ProfileDetailXBtn>
      <ProfileDetailBtn onClick={goMypage}>상세보기</ProfileDetailBtn>
      <ProfileDetailBtn onClick={onClickLogOut}>로그아웃</ProfileDetailBtn>
    </ProfileDetailContainer>
  );
}

function Profile() {
  const auth = useAuth();
  // console.log(`auth.user : ${auth.user}`);
  let navigate = useNavigate();
  const [profileView, setProfileView] = useState(false);
  const onMouseOverCircle = () => {
    setProfileView(true);
    console.log("in circle");
  };
  const onMouseOutCircle = () => {
    setProfileView(false);
    console.log("out circle");
  };
  return (
    <section>
      {auth.user ? (
        <ProfileCircle onMouseEnter={onMouseOverCircle}>
          <span>허</span>
        </ProfileCircle>
      ) : (
        <ProfileImg
          src="/statics/images/hareubang.png"
          onClick={() => {
            window.location.replace("/signin");
          }}
        />
      )}
      {profileView ? <ProfileDetail delBtns={setProfileView} /> : null}
    </section>
  );
}

function ProjectSide() {
  const navigate = useNavigate();
  function Logo() {
    return (
      <img
        alt=""
        src="/statics/images/logoTwo.png"
        style={{ width: "60px", objectFit: "contain", marginTop: "20px" }}
      />
    );
  }
  const LogoObj = {
    key: "0",
    label: <Logo />,
    title: "logo",
    style: {
      height: "70px",
    },
    onClick: () => {
      navigate("/");
    },
  };

  const Label = (el) => {
    return (
      <Link to={`project/${el._id}`}>
        <h1 style={{ fontSize: "25px" }}> {el.project_title[0]}</h1>
      </Link>
    );
  };

  const profileObj = {
    key: "10",
    label: <Profile />,
    title: "profile",
    style: {
      height: "70px",
    },
    onClick: () => {
      navigate("/");
    },
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const projectItems = mookProject.map((el, idx) => {
      return {
        key: idx + 1,
        label: Label(el),
        style: {
          height: "60px",
          textAlign: "center",
          padding: "0px",
        },
        onClick: () => {
          alert(`${idx + 1} project`);
        },
      };
    });
    setItems(projectItems);
  }, []);

  return <StyledMenu theme="Light" mode="inline" defaultSelectedKeys={["1"]} items={[LogoObj, ...items, profileObj]} />;
}

const StyledMenu = styled(Menu)`
  // position: absolute;
  width: 100px;
  height: 100vh;
  justify-content: center;
  padding: 0px;
`;

const ProfileImg = styled.img`
  height: 100px;
  width: 100px;
  object-fit: contain;
  position: fixed;
  bottom: 0;
  left: 0;
  cursor: pointer;
`;

const ProfileCircle = styled.div`
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
`;

const ProfileDetailContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  margin-left: 80px;
  margin-bottom: 70px;
  border-radius: 15px;
  display: flex;
  width: 65px;
  flex-direction: column;
  background-color: #000000;
  opacity: 0.8;
  z-index: 4;
`;

const ProfileDetailBtn = styled.span`
  border: 0px;
  color: white;
  padding: 5px;
  border-bottom: 1px solid white;
  text-align: center;
`;
const ProfileDetailXBtn = styled.span`
  border: 0px;
  color: white;
  padding: 5px;
  border-bottom: 1px solid white;
  text-align: right;
`;

export default ProjectSide;
