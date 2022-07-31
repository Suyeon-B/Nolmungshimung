import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
// import { Modal } from "antd";
import Badge from "../../atomics/Badge";
import SignUpForm from "./SignUpForm";

function SignUp() {
  let navigate = useNavigate();
  const onClickSignIn = () => {
    navigate("/signin", { replace: true });
  };

  return (
    <Container>
      <Title src="/statics/images/signUpTitle.png" />
      <Box>
        <Btns>
          <LogInBtn onClick={onClickSignIn}>Log in</LogInBtn>
          <SignUpBtn>Sign Up</SignUpBtn>
        </Btns>
        <SignUpForm />
      </Box>
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
  flex-direction: column;
`;

const Title = styled.img`
  width: 457.78px;
  height: 175.58px;
  position: relative;
  top: 20px;
`;

const Box = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 504px;
  height: 641px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
`;

const Btns = styled.section`
  display: flex;
  justify-content: center;
`;

const LogInBtn = styled.button`
  width: 219px;
  height: 86px;
  background: #ebebeb;
  border-radius: 30px 0px 0px 30px;
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: #4a4a4a;
  cursor: pointer;
`;

const SignUpBtn = styled.button`
  width: 219px;
  height: 86px;
  background: linear-gradient(90deg, #bde5ff 0%, #41c0ff 100%);
  border-radius: 0px 30px 30px 0px;
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: white;
  cursor: pointer;
`;

export default SignUp;
