import React from "react";
import styled from "styled-components";
function Home() {
  return (
    <Container>
      <h1>I'm in Home</h1>
    </Container>
  );
}
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(/statics/images/signUpBackground.png);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  flexdirection: column;
`;

export default Home;
