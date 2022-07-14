import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/Auth";

function ProfileDetail(props) {
  const auth = useAuth();

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
  const [profileView, setProfileView] = useState(false);

  const onMouseOverCircle = () => {
    setProfileView(true);
  };
  // console.log(`auth.user:${JSON.stringify(auth.user.user_name)}`);
  return (
    <section>
      {auth.user ? (
        <ProfileCircle onMouseEnter={onMouseOverCircle}>
          <span>{sessionStorage.getItem("myName")}</span>
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
        <h1 style={{ fontSize: "25px" }}> {el.project_title.slice(0, 2)}</h1>
      </Link>
    );
  };

  const [items, setItems] = useState([]);
  const auth = useAuth();
  let projectsInfo = null;
  useEffect(() => {
    if (auth.user === undefined || auth.user === null) return;
    // auth.user 불러오질 못함.
    // 세션은 ..? 안됨
    // -> auth.user가 변경될때마다 재랜더링 ㄲ
    let projects = auth.user?.user_projects;

    fetch(`${window.location.protocol}//${window.location.hostname}:8443/projects/title`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(projects),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          projectsInfo = res.projectInfo;
          const projectItems = projectsInfo.map((el, idx) => {
            return {
              key: idx + 1,
              label: Label(el),
              style: {
                height: "60px",
                textAlign: "center",
                padding: "0px",
              },
            };
          });
          setItems(projectItems);
        }
      })
      .catch((err) => console.log(`err: ${err}`));
  }, [auth.user]);

  return (
    <>
      <StyledMenu
        theme="Light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[LogoObj, ...items]}
      />
      <Profile />
    </>
  );
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
  left: 20px;
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
