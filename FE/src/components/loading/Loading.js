import { useState, CSSProperties } from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import styled from "styled-components";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loading = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  return (
    <StyeldBoxDiv className="sweet-loading">
      <ClimbingBoxLoader color="#FF8A3D" size={20} speedMultiplier={1} />
    </StyeldBoxDiv>
  );
};

const StyeldBoxDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export default Loading;
