import React from "react";
import styled from "styled-components";

function Test() {
  return <ResultImage src="/statics/images/signUpBackground.png" />;
}

const ResultImage = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default Test;
