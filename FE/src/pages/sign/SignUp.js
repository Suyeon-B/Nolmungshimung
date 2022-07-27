import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

function SignUp() {
  const success = () => {
    Modal.success({
      content: "회원가입 완료",
    });
  };
  const mailSuccess = () => {
    Modal.success({
      content: "이메일 전송 완료",
    });
  };

  const certificateSuccess = () => {
    Modal.success({
      content: "인증번호가 확인되었습니다.",
    });
  };

  const fail = (msg) => {
    Modal.error({
      title: "회원가입 실패",
      content: msg,
    });
  };
  let navigate = useNavigate();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [certification, setCertification] = useState("");
  // 인증번호 맞는 거 Flag
  const [certificationFlag, setCertificationFlag] = useState(false);
  // 인증번호 정답
  const [answer, setAnswer] = useState(null);
  // 인증번호 받기 눌렀는지
  const [numberFlag, setNumberFlag] = useState(false);

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
  const onchangeCertification = (event) => {
    setCertification(event.target.value);
  };
  const onClickEmail = (event) => {
    event.preventDefault();
    console.log(id);
    if (!id) {
      fail("이메일을 입력하라냥");
    }

    const body = {
      userEmail: id,
    };
    fetch(`//${process.env.REACT_APP_SERVER_IP}/users/mail`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === false) {
          fail(res.message);
          return;
        }
        mailSuccess();
        console.log(res);
        setNumberFlag(true);
        setAnswer(res.answer);
      });
  };

  const onClickCertification = (event) => {
    event.preventDefault();
    console.log(answer);
    console.log(certification);
    if (answer == certification) {
      setCertificationFlag(true);
      certificateSuccess();
    } else {
      fail("인증번호가 틀렸습니다.");
    }
  };

  const { isLoading, isError, error, mutate } = useMutation(singUpUser, {
    retry: 1,
  });

  async function singUpUser(data) {
    await fetch(`//${process.env.REACT_APP_SERVER_IP}/users/signup`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("res : ", res);
        if (res.success === true) {
          success();
          // console.log("Sign Up Success");
          navigate("/signin", { replace: true });
        } else {
          fail(res.message);
        }
      })
      .catch((err) => {
        // ! 배포시 지워야함
        fail(err);
        console.log(`err: ${err}`);
      });
  }

  const onSubmitSignUp = (event) => {
    event.preventDefault();
    if (id < 4) {
      fail("이메일을 입력해주세요.");
      return;
    }
    if (certificationFlag === false) {
      fail("인증번호를 받아주세요.");
      return;
    }
    if (name.length === 0) {
      fail("닉네임을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      fail("비밀번호가 일치하지 않아요.");
      return;
    }
    if (password.length < 6) {
      fail("비밀번호를 6자 이상 입력해주세요.");
      return;
    }

    let userForm = {
      user_email: id,
      user_name: name,
      password: password,
    };
    // console.log(`id : ${id}`);
    // console.log(`name : ${name}`);
    // console.log(`password : ${password}`);
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
          <SignUpEmailDiv>
            <SignUpEmailInput placeholder="jeju@island.com" type="email" value={id} onChange={onchangeId} />
            {!numberFlag && <SignUpEmailBtn onClick={onClickEmail}>인증번호 받기</SignUpEmailBtn>}
          </SignUpEmailDiv>
          <SignUpEmailDiv>
            <SignUpEmailInput
              placeholder="이메일 인증번호"
              type="text"
              value={certification}
              onChange={onchangeCertification}
            />
            {numberFlag && <SignUpEmailBtn onClick={onClickCertification}>인증번호 확인</SignUpEmailBtn>}
          </SignUpEmailDiv>

          <Input placeholder="닉네임" type="text" value={name} onChange={onchangeName} />
          <Input placeholder="password (6자 이상)" type="password" value={password} onChange={onchangePassword} />
          <Input
            placeholder="password 확인"
            type="password"
            value={confirmPassword}
            onChange={onchangeConfirmPassword}
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 420px;
  height: 54px;
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
  cursor: pointer;
`;

const SignUpEmailDiv = styled.div`
  width: 420px;
  height: 54px;
  border-radius: 30px;
  background: #ebebeb;
  padding: 20px;
  border: 0;
  paddingleft: 20px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SignUpEmailInput = styled.input`
  width: 70%;
  border: 0;
  background: #ebebeb;
  outline: none;
`;

const SignUpEmailBtn = styled.button`
  border: 0;
  cursor: pointer;
`;

export default SignUp;
