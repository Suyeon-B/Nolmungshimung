import React from "react";
import "./Home.css";
import styled from "styled-components";
import HomeMain from "./HomeMain";
import HomeItems from "./HomeItems";
import ProjectList from "./ProjectList";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";

const HomeNew = () => {
  const auth = useAuth();

  let navigate = useNavigate();

  const goSignIn = () => {
    navigate("/signin", { replace: false });
  };
  const goProject = () => {
    navigate("/project", { replace: false });
  };
  const goSignUp = () => {
    navigate("/search", { replace: false });
  };
  const goRecommend = () => {
    navigate("/recommend", { replace: false });
  };

  const onClickLogOut = () => {
    auth.logout();
  };
  return (
    // <!--Waves Container-->
    <>
      <StyledImgDiv>
        <img src="\statics\images\main_logo.png" />
      </StyledImgDiv>
      <StyleHomeDiv>
        {auth.user ? (
          <>
            <HomeItems onClickLogOut={onClickLogOut} goRecommend={goRecommend} />
            <ProjectList goProject={goProject} />
          </>
        ) : (
          <HomeMain goRecommend={goRecommend} goSignIn={goSignIn} />
        )}

        <StyleWaveDiv>
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(115, 209, 255,0.7)" />
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(115, 209, 255,0.5)" />
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(115, 209, 255,0.3)" />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(115, 209, 255,0.2)" />
            </g>
          </svg>
        </StyleWaveDiv>
      </StyleHomeDiv>
    </>

    // <!--Waves end-->
  );
};

const StyledImgDiv = styled.div`
  position: absolute;
  left: 25px;
  top: 15px;
  z-index: 2;
`;

const StyleWaveDiv = styled.div`
  position: absolute;
  width: 100vw;
  background-color: #73d1ff;
  height: 40vh;
`;

const StyleHomeDiv = styled.div`
  background-color: #e2eef2;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-end;
`;

export default HomeNew;
