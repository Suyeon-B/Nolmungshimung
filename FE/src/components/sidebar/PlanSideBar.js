import React from "react";
import styled from "styled-components";
import PlanList from "./PlanList";
import ListTest from "./ListTest";

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

// const dragStartHandler = (e) => {
//   const img = new Image();
//   e.dataTransfer.setDragImage(img, 0, 0);

//   posX = e.clientX;
//   posY = e.clientY;

//   originalX = e.target.offsetLeft;
//   originalY = e.target.offsetTop;
// };
const PlanSideBar = () => {
  return (
    <SideBar>
      <PlanTitleWrap>
        <PlanTitle>우정 여행</PlanTitle>
        <span>접</span>
      </PlanTitleWrap>
      <SideBarBtnDIv>
        <p>상세 일정 보러가기</p>
      </SideBarBtnDIv>

      <ListTest />

      <div>사이드바 footer</div>
    </SideBar>
  );
};

export default PlanSideBar;
