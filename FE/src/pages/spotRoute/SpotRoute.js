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

const SpotRouteContainer = styled.div`
  height: 100vh;
  width: calc(81% - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotRouteMap = styled.div`
  width: 47%;
  height: 100%;
  margin-left: 19px;
  border-radius: 15px;
`;

const SpotRouteSection = styled.section`
  margin-top: 37px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

export default SpotRoute;
