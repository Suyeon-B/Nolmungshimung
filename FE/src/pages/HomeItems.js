import React from "react";
import styled from "styled-components";

const HomeItems = ({ goProject, onClickLogOut }) => {
  return (
    <StyledHomeItems>
      <StyledTitle>어디로 떠나보시겠어요?</StyledTitle>
      <StyledBtnContainer>
        <StyledBtn onClick={onClickLogOut}>로그아웃</StyledBtn>
        <StyledWhiteBtn onClick={goProject}>프로젝트 만들기</StyledWhiteBtn>
      </StyledBtnContainer>
    </StyledHomeItems>
  );
};

const StyledBtnContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const StyledBtn = styled.button`
  outline: 0;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 25px;
  background: rgba(255, 122, 0, 0.6);
  border-radius: 10px;
  width: 200px;
  height: 80px;
  /* identical to box height */

  text-align: center;

  color: #ffffff;
`;

const StyledWhiteBtn = styled(StyledBtn)`
  background: rgba(255, 255, 255, 0.42);
  border-radius: 10px;
  color: #ff7a00;
  cursor: pointer;
`;

const StyledTitle = styled.h1`
  /* font-family: 'Rounded Mplus 1c Bold'; */
  font-style: normal;
  font-weight: 900;
  font-size: 50px;
  margin-bottom: 24px;
  /* line-height: 89px; */
  text-align: center;

  color: #000000;
`;

const StyledHomeItems = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  z-index: 2;
  top: -30vh;
  left: 11vw;
  height: 60%;
`;

export default HomeItems;
