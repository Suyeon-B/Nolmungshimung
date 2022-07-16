import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/Auth";
import { Modal } from "antd";

const kauthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=2d1c91f12a4c8020dbcc39ddb0c368b0&redirect_uri=https://${process.env.REACT_APP_SERVER_IP}:3000/kakao/signin&response_type=code`;

function SignIn() {
  const success = () => {
    Modal.success({
      content: "로그인 완료",
    });
  };

  const fail = (msg) => {
    Modal.error({
      title: "로그인 실패",
      content: msg,
    });
  };
  let navigate = useNavigate();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const onchangeId = (event) => {
    setId(event.target.value);
  };
  const onchangePassword = (event) => {
    setPassword(event.target.value);
  };
  const { isLoading, isError, error, mutate } = useMutation(singInUser, {
    retry: 1,
  });

  async function singInUser(data) {
    await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/users/signin`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("res : ", res);
        if (res.loginSuccess === true) {
          success();
          console.log("Sign In Success");
          sessionStorage.setItem("myNickname", res.user_name);
          sessionStorage.setItem("user_email", res.user_email);
          // navigate("/", { replace: true });
          window.location.href = "/";
          login({ user: id });
        } else {
          fail(res.message);
        }
      })
      .catch((err) => console.log(`err: ${err}`));
  }

  const onSubmitSignUp = (event) => {
    event.preventDefault();

    let userForm = {
      user_email: id,
      password: password,
    };
    mutate(userForm);
    // window.location.href = "/";
  };
  const onClickSignUp = () => {
    // window.location.href = "/signup";
    navigate("/signup", { replace: true });
  };

  return (
    <Container>
      <Title src="/statics/images/loginTitle.png" />
      <Box>
        <Btns>
          <LogInBtn>Log in</LogInBtn>
          <SignUpBtn onClick={onClickSignUp}>Sign Up</SignUpBtn>
        </Btns>
        <Form onSubmit={onSubmitSignUp}>
          <Input
            placeholder="jeju@island.com"
            type="text"
            value={id}
            onChange={onchangeId}
            required
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={onchangePassword}
            required
          />
          <SubmitInput value="로그인" type="submit" />
          <br />
          <a href={kauthUrl}>
            <img
              src="/statics/images/kakao_login_medium_wide.png"
              style={{
                width: "420px",
                height: "64px",
                borderRadius: "30px",
                objectFit: "contain",
              }}
            />
          </a>
        </Form>
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
`;
export default SignIn;
