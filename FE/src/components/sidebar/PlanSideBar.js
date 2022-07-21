import React from "react";
import styled from "styled-components";
import PlanList from "./PlanList";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const PlanSideBar = ({
  item,
  toggleIsPage,
  isFirstPage,
  itemRoutes,
  setItemRoutes,
  setSelectedIndex,
  setIsDrage,
  setIsAddDel,
  attentionIndex,
  setAttentionIndex,
}) => {
  const navigate = useNavigate();
  return (
    <SideBar>
      <PlanTitleWrap>
        <NoneStyleBtn
          onClick={() => {
            navigate("/");
          }}
        >
          <img width={"35px"} src="\statics\images\homeIcon.png" />
        </NoneStyleBtn>
        <PlanTitle>{item.project_title}</PlanTitle>
      </PlanTitleWrap>
      <SideBarBtnDIv>
        {isFirstPage && (
          <SideBarBtn onClick={toggleIsPage}>
            <svg
              fill="currentColor"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32zM0 192H448V464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192zM80 256C71.16 256 64 263.2 64 272V368C64 376.8 71.16 384 80 384H176C184.8 384 192 376.8 192 368V272C192 263.2 184.8 256 176 256H80z" />
            </svg>
            <Fonts>상세 일정 보러가기</Fonts>
          </SideBarBtn>
        )}
        {!isFirstPage && (
          <SideBarBtn onClick={toggleIsPage}>
            <svg
              fill="currentColor"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
            </svg>
            <Fonts>장소 찾으러 가기</Fonts>
          </SideBarBtn>
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
        setIsAddDel={setIsAddDel}
        attentionIndex={attentionIndex}
        setAttentionIndex={setAttentionIndex}
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
const PlanTitleWrap = styled.div`
  display: flex;
  height: 82px;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 15px;
  padding-right: 15px;
`;
const PlanTitle = styled.h1`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 48px;
  color: #ff8a3d;

  /* color: #000000; */
`;
const SideBarBtnDIv = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: #ebebeb;
  justify-content: center;
  align-items: center;
`;
const NoneStyleBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
  .left_toggle_arrow {
    margin-bottom: 7px;
  }
`;
const SideBarBtn = styled(NoneStyleBtn)`
  width: 100%;
  height: 100%;

  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 42px;
  color: #7c8289;
  background-color: #ebebeb;
  text-align: left;
  margin-left: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Fonts = styled.div`
  margin-left: 10px;
  margin-top: 3px;
`;

export default PlanSideBar;
