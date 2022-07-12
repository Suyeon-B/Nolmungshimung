import React from "react";
import styled from "styled-components";
import PlanList from "./PlanList";

// const dragStartHandler = (e) => {
//   const img = new Image();
//   e.dataTransfer.setDragImage(img, 0, 0);

//   posX = e.clientX;
//   posY = e.clientY;

//   originalX = e.target.offsetLeft;
//   originalY = e.target.offsetTop;
// };
const PlanSideBar = ({ item, toggleIsPage, isFirstPage }) => {
  return (
    <SideBar>
      <PlanTitleWrap>
        <PlanTitle>{item.project_title}</PlanTitle>
        <span>접기</span>
      </PlanTitleWrap>
      <SideBarBtnDIv>
        {isFirstPage && (
          <button onClick={toggleIsPage}>상세 일정 보러가기</button>
        )}
        {!isFirstPage && (
          <button onClick={toggleIsPage}>장소 찾으러 가기</button>
        )}
      </SideBarBtnDIv>

      <PlanList
        startData={item.statr_data}
        term={item.term}
        routes={item.routes}
      />

      <div>사이드바 footer</div>
    </SideBar>
  );
};

const SideBar = styled.div`
  width: 288px;
  height: 100vh;
  background-color: #e7e7e7;
`;
const PlanTitleWrap = styled.div`
  display: flex;
  background-color: blue;
  justify-content: space-around;
  align-items: center;
`;
const PlanTitle = styled.h1`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 48px;

  color: #000000;
`;
const SideBarBtnDIv = styled.div`
  display: flex;
  width: 288px;
  height: 50px;
  // background-color: bisque;
  justify-content: center;
  align-items: center;
`;

export default PlanSideBar;
