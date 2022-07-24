import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React, { useState } from "react";

const DropDown = ({ index, routes, setSelectDate }) => {
  const [text, setText] = useState("가져갈 날짜 선택");
  const item = routes.map((el, idx) => {
    return {
      key: `${idx}`,
      label: <p>{idx + 1} Day</p>,
      onClick: (e) => {
        console.log(e.key);
        setText(`${Number(e.key) + 1} Day`);
        setSelectDate((prev) => {
          const newArr = [...prev];
          newArr[index] = Number(e.key);
          return newArr;
        });
      },
    };
  });
  const menu = <Menu items={item} />;
  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <a onClick={(e) => console.log(e)}>
          <Space>
            {text}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default DropDown;
