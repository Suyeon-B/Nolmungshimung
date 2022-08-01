import React from "react";
import styled from "styled-components";

const HomeMain = ({ goRecommend, goSignIn }) => {
  return (
    <StyledHomeMain>
      <StyledTitle>어디로 떠나보시겠어요?</StyledTitle>
      <BtnWrapper>
        <StyledWhiteBtn onClick={goSignIn}>여행일정 만들기</StyledWhiteBtn>
        <StyledBtn onClick={goRecommend}>추천계획 둘러보기</StyledBtn>
      </BtnWrapper>
    </StyledHomeMain>
  );
};

const StyledBtn = styled.button`
  outline: 0;
  border: none;

  font-weight: 700;
  font-size: 27px;
  background: rgba(255, 122, 0, 0.71);
  border-radius: 10px;
  width: 240px;
  height: 100px;
  /* identical to box height */

  text-align: center;
  margin: 10px;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }
`;

const StyledWhiteBtn = styled(StyledBtn)`
  background: rgba(255, 255, 255, 0.52);
  border-radius: 10px;
  color: #ff7a00;
  cursor: pointer;
  box-shadow: 3px 3px 3px #aaaaaa;

  &:hover {
    background: rgba(255, 122, 0, 0.22);
  }
  &:active {
    width: 239px;
    height: 99px;
    box-shadow: none;
  }
`;

const StyledTitle = styled.h1`
  font-style: normal;
  font-weight: 900;
  font-size: 60px;
  margin-bottom: 24px;
  /* line-height: 89px; */
  text-align: center;

  color: #232a3c;
`;

const StyledHomeMain = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  z-index: 2;
  top: -25vh;
  left: 30vw;
  height: 60%;
`;

const BtnWrapper = styled.div`
  display: flex;
`;

export default HomeMain;
