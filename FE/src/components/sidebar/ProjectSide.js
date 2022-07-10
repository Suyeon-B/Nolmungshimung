import React, { useState, useEffect } from "react";
import "../ProjectSide.css";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledMenu = styled(Menu)`
  position: absolute;
  width: 100px;
  height: 100vh;
  justify-content: center;
  padding: 0px;
`;

const mookProject = [
  {
    _id: "1",
    project_title: "우정여행",
  },
  {
    _id: "2",
    project_title: "가족여행",
  },
  {
    _id: "3",
    project_title: "친구여행",
  },
  {
    _id: "4",
    project_title: "효도여행",
  },
  {
    _id: "5",
    project_title: "여행여행",
  },
];

function ProjectSide() {
  const navigate = useNavigate();
  function Logo() {
    return (
      <img
        alt=""
        src="/statics/images/logo.png"
        style={{ width: "60px", objectFit: "contain" }}
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

  const Label = (title) => {
    return <h1 style={{ fontSize: "25px" }}> {title[0]}</h1>;
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const projectItems = mookProject.map((el, idx) => {
      return {
        key: idx + 1,
        label: Label(el.project_title),
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

  return (
    <StyledMenu
      theme="Light"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={[LogoObj, ...items]}
    />
  );
}

export default ProjectSide;
