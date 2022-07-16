import { Drawer } from "antd";
import React from "react";
import "./Drawer.css";

function SearchDetail(props) {
  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      width={800}
      className="site-form-in-drawer-wrapper"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
}

export default SearchDetail;
