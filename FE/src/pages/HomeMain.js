import React from "react";
import styled from "styled-components";

const HomeMain = ({ goSignIn }) => {
  return (
    <StyledHomeMain>
      <StyledTitle>어디로 떠나보시겠어요?</StyledTitle>
      <StyledBtn onClick={goSignIn}>프로젝트 만들기</StyledBtn>
    </StyledHomeMain>
  );
};

const StyledBtn = styled.button`
  outline: 0;
  border: none;

  font-weight: 700;
  font-size: 30px;
  background: rgba(255, 122, 0, 0.71);
  border-radius: 10px;
  width: 240px;
  height: 100px;
  /* identical to box height */

  text-align: center;

  color: #ffffff;
`;

const StyledTitle = styled.h1`
  /* font-family: 'Rounded Mplus 1c Bold'; */
  font-style: normal;
  font-weight: 900;
  font-size: 60px;
  margin-bottom: 24px;
  /* line-height: 89px; */
  text-align: center;

  color: #000000;
`;

const StyledHomeMain = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  z-index: 2;
  top: -30vh;
  left: 30vw;
  height: 60%;
`;

export default HomeMain;
