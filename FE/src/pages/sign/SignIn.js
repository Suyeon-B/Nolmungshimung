import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/auth/Auth";
// import { Modal } from "antd";
import Badge from "../../atomics/Badge";
import SignInForm from "./SignInForm";

function SignIn() {
  let navigate = useNavigate();
  const onClickSignUp = () => {
    // window.location.href = "/signup";
    navigate("/signup", { replace: true });
  };

  return (
    <Container>
      <Title src="/statics/images/signUpTitle.png" />
      <Box>
        <Btns>
          <LogInBtn>Log in</LogInBtn>
          <SignUpBtn onClick={onClickSignUp}>Sign Up</SignUpBtn>
        </Btns>
        <SignInForm />
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
  height: 577px;
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
  background: linear-gradient(90deg, #ff7a00 0%, #ffbd80 100%);
  border-radius: 30px 0px 0px 30px;
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: white;
  cursor: pointer;
`;

const SignUpBtn = styled.button`
  width: 219px;
  height: 86px;
  background: #ebebeb;
  border-radius: 0px 30px 30px 0px;
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: #4a4a4a;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 420px;
  height: 64px;
  border-radius: 30px;
  background: #ebebeb;
  padding: 20px;
  border: 0;
  padding-left: 20px;
  margin-top: 15px;
`;

const SubmitInput = styled.input`
  width: 420px;
  height: 64px;
  border-radius: 30px;
  background: linear-gradient(90deg, #ff7a00 0%, #ffa149 50%, #febc7f 100%);
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: white;
  margin-top: 15px;
  cursor: pointer;
`;
export default SignIn;
