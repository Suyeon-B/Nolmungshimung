import React from "react";
import MarkMap from "../components/MarkMap/MarkMap";
function Test() {
  MarkMap();
  return (
    <div>
      <h1>지도</h1>
      <div
        id="myMap"
        style={{
          width: "500px",
          height: "500px",
        }}
      ></div>
    </div>
  );
}

export default Test;
