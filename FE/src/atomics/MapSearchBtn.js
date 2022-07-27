import React from "react";
// import NomalMarker from "../../../public/statics/images/location-dot-solid.svg";
import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";

function MapSearchBtn(props) {
  return (
    <Button
      onClick={props.onClick}
      type="primary"
      shape="round"
      icon={<RedoOutlined />}
      size={"large"}
      style={{
        backgroundColor: "#ff8a3d",
        borderColor: "#ff8a3d",
        zIndex: 2,
        marginBottom: "5%",
        // position: "fixed",
        // bottom: "70px",
        // left: "1070px",
      }}
    >
      현지도에서 검색
    </Button>
  );
}

export default React.memo(MapSearchBtn);
