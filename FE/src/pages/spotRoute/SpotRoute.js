import React, { useEffect } from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";

function SpotRoute({
  item,
  setItemRoute,
  itemId,
  selectedIndex,
  setIsDrage,
  setIsAddDel,
}) {
  // const [routes, setRoutes] = useState(item.routes);
  // console.log("=================");
  // console.log(item[0]);
  // console.log("=================");
  // useEffect(() => {
  MarkMap(item[selectedIndex]);
  // }, [...item[0]]);

  return (
    <SpotRouteContainer>
      <SpotRouteSection>
        <SpotList
          selectedIndex={selectedIndex}
          dayItem={item}
          setItemRoute={setItemRoute}
          setIsDrage={setIsDrage}
          setIsAddDel={setIsAddDel}
        />
        <SpotRouteMap id="myMap" />
      </SpotRouteSection>

      <TextEditor project_Id={itemId} selectedIndex={selectedIndex} />
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
