import React from "react";
import styled from "styled-components";
import PlanList from "./PlanList";

const PlanSideBar = ({
  item,
  toggleIsPage,
  isFirstPage,
  itemRoutes,
  setItemRoutes,
  setSelectedIndex,
  setIsDrage,
}) => {
  return (
    <SideBar>
      <PlanTitleWrap>
        <PlanTitle>{item.project_title}</PlanTitle>
        <NoneStyleBtn>
          <img src="\statics\images\page_arrow.png" />
        </NoneStyleBtn>
      </PlanTitleWrap>
      <SideBarBtnDIv>
        {isFirstPage && (
          <SideBarBtn onClick={toggleIsPage}>상세 일정 보러가기</SideBarBtn>
        )}
        {!isFirstPage && (
          <SideBarBtn onClick={toggleIsPage}>장소 찾으러 가기</SideBarBtn>
        )}
      </SideBarBtnDIv>

      <PlanList
        toggleIsPage={toggleIsPage}
        startDate={item.start_date}
        term={item.term}
        routes={itemRoutes}
        setRoutes={setItemRoutes}
        setSelectedIndex={setSelectedIndex}
        isFirstPage={isFirstPage}
        setIsDrage={setIsDrage}
        // routes={item.routes}
      />

      <div>사이드바 footer</div>
    </SideBar>
  );
};

const SideBar = styled.div`
  width: 19%;
  min-width: 280px;
  height: 100vh;
  /* background-color: #e7e7e7; */
`;
const PlanTitleWrap = styled.div`
  display: flex;
  height: 82px;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 25px;
`;
const PlanTitle = styled.h1`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 48px;

  /* color: #000000; */
`;
const SideBarBtnDIv = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #ebebeb;
  justify-content: center;
  align-items: center;
`;
const NoneStyleBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
`;
const SideBarBtn = styled(NoneStyleBtn)`
  width: 100%;
  height: 100%;

  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 42px;
  color: #757575;
  background-color: #ebebeb;
`;

export default PlanSideBar;
