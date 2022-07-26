import React, { useState, useCallback } from "react";
import styled from "styled-components";
import PlanList from "./PlanList";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { HomeFilled } from "@ant-design/icons";
import SideBarTitle from "../../atomics/SideBarTitle";
import DetailBtn from "../../atomics/DetailBtn";
import SearchBtn from "../../atomics/SearchBtn";
import PlanBtns from "./PlanBtns";

const PlanSideBar = ({
  item,
  goSearchPage,
  goDetailPage,
  isFirstPage,
  itemRoutes,
  setItemRoutes,
  setSelectedIndex,
  setIsDrage,
  setIsAddDel,
  attentionIndex,
  setAttentionIndex,
  userName,
}) => {
  const navigate = useNavigate();

  const [detailColor, setDetailColor] = useState("white");
  const [searchColor, setSearchColor] = useState("#ebebeb");
  const onClickDetail = useCallback(() => {
    goDetailPage();
    setSearchColor("white");
    setDetailColor("#ebebeb");
  }, [searchColor, detailColor]);
  const onClickSearch = useCallback(() => {
    goSearchPage();
    setSearchColor("#ebebeb");
    setDetailColor("white");
  }, [searchColor, detailColor]);
  return (
    <SideBar>
      {/* Component나누자 */}
      <SideBarTitle title={item.project_title} />
      <PlanBtns
        onClickSearch={onClickSearch}
        searchColor={searchColor}
        detailColor={detailColor}
        onClickDetail={onClickDetail}
      />
      <PlanList
        goDetailPage={onClickDetail}
        startDate={item.start_date}
        routes={itemRoutes}
        setRoutes={setItemRoutes}
        setSelectedIndex={setSelectedIndex}
        isFirstPage={isFirstPage}
        setIsDrage={setIsDrage}
        setIsAddDel={setIsAddDel}
        attentionIndex={attentionIndex}
        setAttentionIndex={setAttentionIndex}
        userName={userName}
      />
    </SideBar>
  );
};

const SideBar = styled.div`
  width: 19%;
  min-width: 300px;
  height: 100vh;
  /* background-color: #e7e7e7; */
  box-shadow: 2px 2px 0px 0px #ebebeb;
  margin-right: 2px;
`;

export default React.memo(PlanSideBar);
