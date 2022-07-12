import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

function SignUp() {
  let navigate = useNavigate();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onchangeId = (event) => {
    setId(event.target.value);
  };
  const onchangeName = (event) => {
    setName(event.target.value);
  };
  const onchangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onchangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const { isLoading, isError, error, mutate } = useMutation(singUpUser, {
    retry: 1,
  });

  async function singUpUser(data) {
    await fetch(`http://${process.env.REACT_APP_SERVER_IP}:8443/users/signup`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res : ", res);
        if (res.success === true) {
          console.log("Sign Up Success");
          navigate("/signin", { replace: true });
        }
      })
      .catch((err) => console.log(`err: ${err}`));
  }

  const onSubmitSignUp = (event) => {
    if (password !== confirmPassword) {
      alert("비밀번호 똑바로 ㅇㅂ력해라");
    }
    event.preventDefault();

    let userForm = {
      user_email: id,
      user_name: name,
      password: password,
    };
    console.log(`id : ${id}`);
    console.log(`name : ${name}`);
    console.log(`password : ${password}`);
    mutate(userForm);
  };
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
        <Form onSubmit={onSubmitSignUp}>
          <Input
            placeholder="jeju@island.com"
            type="text"
            value={id}
            onChange={onchangeId}
            required
          />
          <Input
            placeholder="이름"
            type="text"
            value={name}
            onChange={onchangeName}
            required
          />
          <Input
            placeholder="password"
            type="pass"
            value={password}
            onChange={onchangePassword}
            required
          />
          <Input
            placeholder="password 확인"
            type="pass"
            value={confirmPassword}
            onChange={onchangeConfirmPassword}
            required
          />
          <SubmitInput value="회원가입" type="submit" />
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
  background: #ebebeb;
  border-radius: 30px 0px 0px 30px;
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: #4a4a4a;
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
  paddingleft: 20px;
  margin-top: 15px;
`;

const SubmitInput = styled.input`
  width: 440px;
  height: 64px;
  border-radius: 30px;
  background: linear-gradient(90deg, #47b5ff 0%, #7ecbff 50%, #b3e0ff 100%);
  border: 0;
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 45px;
  color: white;
  margin-top: 15px;
`;
export default SignUp;
