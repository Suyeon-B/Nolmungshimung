import React, { useEffect, useState, useCallback, Suspense } from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import MemoRtc from "../../components/shareMemo/MemoRtc";
import Cursor from "../shareMemo/Cursor";
// import SearchDetail from "../../components/searchMap/SearchDetail";
const SearchDetail = React.lazy(() =>
  import("../../components/searchMap/SearchDetail")
);
import { spotDetail } from "../../components/spot/SpotDetail";
// import { AlertFilled } from "@ant-design/icons";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import SpotRouteTitle from "../../components/spot/SpotRouteTitle";

function SpotRoute({
  startDate,
  item,
  setItemRoute,
  itemId,
  selectedIndex,
  setIsDrage,
  setIsAddDel,
  projectId,
  userName,
}) {
  const [notifyFlag, setNotifyFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState(null);
  let navigate = useNavigate();

  const handleVisible = useCallback(
    (value) => {
      setVisible(value);
    },
    [visible]
  );
  const handleContents = useCallback(
    (value) => {
      const data = {
        input: value.road_address_name + "" + value.place_name,
        place_id: value.id,
        place_name: value.place_name,
        road_address_name: value.road_address_name
          ? value.road_address_name
          : value.address_name,
        category_group_name: value.category_group_name,
        phone: value.phone,
        place_url: value.place_url,
      };

      spotDetail(data).then(function (detail) {
        setContents(detail);
      });
    },
    [contents]
  );
  MarkMap(item, selectedIndex);

  useEffect(() => {
    console.log("item selected Index is Change");
  }, [item]);

  // }, [...item[0]]);
  const onClose = () => {
    setVisible(false);
    setContents(null);
  };
  // const userName = sessionStorage.getItem("myNickname");
  useEffect(() => {
    if (notifyFlag === false) return;
    // console.log(notifyFlag);
    socket.emit(
      "attention",
      culTripTermData(startDate, selectedIndex),
      selectedIndex,
      projectId,
      userName
    );
    setNotifyFlag(false);
    // console.log("attention");
  }, [notifyFlag]);

  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate.slice(0, 3));
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
  };
  const callFriends = () => {
    // console.log(`notify flag is ${notifyFlag}`);
    setNotifyFlag(true);
    // console.log(`notify flag is ${notifyFlag}`);
  };

  const onClcikResult = () => {
    navigate(`/project/${projectId}/result`, { replace: false });
  };
  return (
    <SpotRouteContainer>
      <SpotRouteTitle
        date={culTripTermData(startDate, selectedIndex)}
        projectId={projectId}
        selectedIndex={selectedIndex}
        userName={userName}
      />
      <SpotRouteWrapper>
        <SpotRouteSection>
          <SpotList
            selectedIndex={selectedIndex}
            dayItem={item}
            setItemRoute={setItemRoute}
            setIsDrage={setIsDrage}
            setIsAddDel={setIsAddDel}
            handleVisible={handleVisible}
            handleContents={handleContents}
            userName={userName}
          />
          <SpotRouteMap id="myMap" />
        </SpotRouteSection>
        <MemoRtc project_Id={itemId} userName={userName} />
      </SpotRouteWrapper>

      <Cursor project_Id={itemId} selectedIndex={selectedIndex} />

      {contents !== null && (
        // <Suspense fallback={<div>Loading...</div>}>
        <SearchDetail onClose={onClose} visible={visible} contents={contents} />
        // </Suspense>
      )}
    </SpotRouteContainer>
  );
}

const SpotRouteWrapper = styled.div`
  height: 100vh;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// width: calc(100% - 100px);
const SpotRouteContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpotRouteMap = styled.div`
  width: 48vw;
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
  justify-content: space-between;
  margin-bottom: 20px;
`;

export default React.memo(SpotRoute);
