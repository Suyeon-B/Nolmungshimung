import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";
import SearchDetail from "../../components/searchMap/SearchDetail";

function SpotRoute({
  item,
  setItemRoute,
  itemId,
  selectedIndex,
  setIsDrage,
  setIsAddDel,
}) {
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState(null);
  // const [routes, setRoutes] = useState(item.routes);
  // console.log("=================");
  // console.log(item[0]);
  // console.log("=================");
  // useEffect(() => {
  const handleVisible = (value) => {
    setVisible(value);
  };
  const handleContents = (value) => {
    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/travel/` + value.id) //get
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          console.log("db에 있습니다");
          setContents(data.data);
        } else {
          console.log("디비에 없음");
        }
      })
      .catch((error) => console.log(error));
    // console.log(value.id);
    // setContents(value);
  };
  MarkMap(item[selectedIndex]);
  // }, [...item[0]]);
  const onClose = () => {
    setVisible(false);
    setContents(null);
  };
  return (
    <SpotRouteContainer>
      <SpotRouteSection>
        <SpotList
          selectedIndex={selectedIndex}
          dayItem={item}
          setItemRoute={setItemRoute}
          setIsDrage={setIsDrage}
          setIsAddDel={setIsAddDel}
          handleVisible={handleVisible}
          handleContents={handleContents}
        />
        <SpotRouteMap id="myMap" />
      </SpotRouteSection>
      <TextEditor project_Id={itemId} selectedIndex={selectedIndex} />
      {contents !== null && (
        <SearchDetail onClose={onClose} visible={visible} contents={contents} />
      )}
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
