import React from "react";
import "./ProjectSide.css";
import { Layout, Menu } from "antd";

function Logo() {
  return (
    <img
      alt=""
      src="/statics/images/logo.png"
      style={{ width: "60px", objectFit: "contain" }}
    />
  );
}
const items = [
  {
    key: "2",
    label: <Logo />,
    title: "logo",
    style: {
      height: "70px",
    },
    onClick: () => {
      alert("logo");
    },
  },
  {
    key: "3",
    label: "테스트",
    style: {
      height: "70px",
    },
  },
];
function ProjectSide() {
  return (
    <Menu
      theme="Light"
      mode="inline"
      defaultSelectedKeys={["1"]}
      style={{
        width: "100px",
        height: "100vh",
        justifyContent: "center",
        padding: "0px",
      }}
      items={items}
    />
  );
}

export default ProjectSide;
