import React from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";

function SpotRoute({ item }) {
  console.log(item);
  MarkMap(item.routes[0]);
  return (
    <div
      style={{
        height: "100vh",
        width: "80vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SpotRouteSection>
        <SpotList dayItem={item.routes} />
        {/* 지도 api 연결안하면 에러떠서 주석처리함 */}
        <div
          id="myMap"
          style={{
            width: "500px",
            height: "500px",
          }}
        />
      </SpotRouteSection>
      <TextEditor />
      {/* hyeok socket io 연결안하면 에러떠서 주석처리함 */}
    </div>
  );
}

const SpotRouteSection = styled.section`
  display: flex;
  flex-direction: row;
  width: 90vw;
  justify-content: center;
`;

export default SpotRoute;
