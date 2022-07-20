import React, { useEffect } from "react";
import styled from "styled-components";
import ButtonGo from "../atomics/ButtonGo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";

function Home() {
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
  // console.log(`auth.user in HOME : ${JSON.stringify(auth.user)} `);
  return (
    <Container>
      <Main />
      <Section>
        {auth.user ? (
          <>
            <ButtonGo name="나만의 계획 만들기" onClickGo={goProject} />
            <div
              draggable="true"
              onDragStart={() => {
                console.log("~~~");
              }}
            >
              TEST
            </div>
          </>
        ) : (
          <ButtonGo name="로그인" onClickGo={goSignIn} />
        )}

        <ButtonGo name="추천계획 둘러보기" onClickGo={goSignUp} />
      </Section>
    </Container>
  );
}
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const Main = styled.div`
  width: calc(80% - 20px);
  height: 100vh;
  background-image: url(/statics/images/main.png);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  flexdirection: column;
`;

const Section = styled.section`
  width: 20vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export default Home;
