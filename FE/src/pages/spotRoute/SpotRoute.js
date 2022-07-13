import React from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";

function SpotRoute({ item }) {
  console.log(item);
  MarkMap(item.routes[0]);
  return (
    <SpotRouteContainer>
      <SpotRouteSection>
        <SpotList dayItem={item.routes} />
        {/* 지도 api 연결안하면 에러떠서 주석처리함 */}
        <SpotRouteMap id="myMap" />
      </SpotRouteSection>

      <TextEditor />
      {/* hyeok socket io 연결안하면 에러떠서 주석처리함 */}
    </SpotRouteContainer>
  );
}

// width: calc(100% - 100px);
const SpotRouteContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotRouteMap = styled.div`
  width: 47%;
  height: 100%;
  margin-left: 19px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const SpotRouteSection = styled.section`
  margin-top: 37px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(50% - 37px);
  justify-content: center;
`;

export default SpotRoute;
