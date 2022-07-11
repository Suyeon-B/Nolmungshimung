import React, { useEffect } from "react";
import styled from "styled-components";
import ButtonGo from "../atomics/ButtonGo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";

function Home() {
  const auth = useAuth();
  // useEffect(() => {
  //   console.log("dd");
  //   fetch("http://localhost:8443/users/auth", {
  //     method: "get",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     credentials: "include",
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       console.log("response : " + JSON.stringify(response));
  //       //Not Loggined in Status
  //       if (!response.isAuth) {
  //         console.log("로그인 해주세요");
  //         window.location.replace("/signin");
  //         // navigate("/signin", { replace: true });
  //         //Loggined in Status
  //       } else {
  //         console.log(`response :${response}`);
  //         auth.login(response.user_name); // isAuth가 true임이 증명되어야 화면을 나타내도록 처리
  //         //supposed to be Admin page, but not admin person wants to go inside
  //         // navigate("/", { replace: true });
  //         // window.location.replace("/");
  //       }
  //     });
  // }, []);

  // console.log("Home");
  // console.log(`auth.user in Home : ${JSON.stringify(auth.user)}`);
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
  console.log(`auth.user in HOME : ${JSON.stringify(auth.user)} `);
  return (
    <Container>
      <Main />
      <Section>
        {auth.user ? (
          <ButtonGo name="나만의 계획 만들기" onClickGo={goProject} />
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
