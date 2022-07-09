import React, { useState } from "react";
// import "antd/dist/antd.css";
import "./App.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

const { Header, Sider, Content } = Layout;

const Test = () => {
  return (
    <span style={{ textAlign: "center" }}>
      <img
        src="/statics/images/Group.png"
        style={{ width: "60px", objectFit: "contain" }}
      />
    </span>
  );
};

const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2 = ["#", "#", "#"].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,

    label: `${icon} 7월 ${key}일`,
    children: [
      { key: key + 1, label: `랜디스 도넛` },
      { key: key + 2, label: `웨이브사운드` },
      { key: key + 3, label: `흑돈가` },
    ],
  };
});

const App = () => {
  return (
    <>
      {/* <span className="logo" style={{ hegith: "auto" }}>
        <img
          alt=""
          src="/statics/images/Group.png"
          style={{ width: "60px", objectFit: "contain" }}
        />
      </span> */}

      <Layout>
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
          items={[
            {
              key: "2",
              label: <Test />,
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
              icon: <UploadOutlined />,
              style: {
                height: "70px",
                paddingLeft: "40%",
              },
            },
          ]}
        />
        <Sider width={200} className="site-layout-background" collapsed={false}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          ></Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
