import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
// import { Modal } from "antd";
import Badge from "../../atomics/Badge";

function SignUpForm() {
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

  const isEmail = (email) => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return emailRegex.test(email);
  };

  const onchangeId = (event) => {
    setId(event.target.value);
    setCertificationFlag(false);
    setNumberFlag(false);
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
    if (!isEmail(id)) {
      Badge.fail("유효하지 않은 이메일입니다.");
      setId("");
      return;
    }
    Badge.success("이메일이 가는 중이에요. 잠시 기다려주세요!");

    const body = {
      userEmail: id,
    };
    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/users/mail`, {
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
          Badge.fail("회원가입 실패", res.message);
          return;
        }
        Badge.success("이메일 전송 완료");
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
      Badge.success("인증번호가 확인되었습니다.");
    } else {
      Badge.fail("회원가입 실패", "인증번호가 틀렸습니다.");
    }
  };

  const { isLoading, isError, error, mutate } = useMutation(singUpUser, {
    retry: 1,
  });

  async function singUpUser(data) {
    await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/users/signup`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log("res : ", res);
        if (res.success === true) {
          Badge.success("회원가입 성공");
          // console.log("Sign Up Success");
          navigate("/signin", { replace: true });
        } else {
          Badge.fail("회원가입 실패", res.message);
        }
      })
      .catch((err) => {
        // ! 배포시 지워야함
        Badge.fail("회원가입 실패", err);
        console.log(`err: ${err}`);
      });
  }

  const onSubmitSignUp = (event) => {
    event.preventDefault();
    if (id < 4) {
      Badge.fail("회원가입 실패", "이메일을 입력해주세요.");
      return;
    }
    if (certificationFlag === false) {
      Badge.fail("회원가입 실패", "인증번호를 받아주세요.");
      return;
    }
    if (name.length === 0) {
      Badge.fail("회원가입 실패", "닉네임을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Badge.fail("회원가입 실패", "비밀번호가 일치하지 않아요.");
      return;
    }
    if (password.length < 6) {
      Badge.fail("회원가입 실패", "비밀번호를 6자 이상 입력해주세요.");
      return;
    }

    let userForm = {
      user_email: id,
      user_name: name,
      password: password,
    };
    mutate(userForm);
  };

  return (
    <Form onSubmit={onSubmitSignUp}>
      <SignUpEmailDiv>
        <SignUpEmailInput
          placeholder="jeju@island.com"
          type="email"
          value={id}
          onChange={onchangeId}
        />
        {!numberFlag && (
          <SignUpEmailBtn onClick={onClickEmail}>인증번호 받기</SignUpEmailBtn>
        )}
      </SignUpEmailDiv>
      <SignUpEmailDiv>
        <SignUpEmailInput
          placeholder="이메일 인증번호"
          type="text"
          value={certification}
          onChange={onchangeCertification}
        />
        {numberFlag && (
          <SignUpEmailBtn onClick={onClickCertification}>
            인증번호 확인
          </SignUpEmailBtn>
        )}
      </SignUpEmailDiv>

      <Input
        placeholder="닉네임"
        type="text"
        value={name}
        onChange={onchangeName}
      />
      <Input
        placeholder="password (6자 이상)"
        type="password"
        value={password}
        onChange={onchangePassword}
      />
      <Input
        placeholder="password 확인"
        type="password"
        value={confirmPassword}
        onChange={onchangeConfirmPassword}
      />
      <SubmitInput value="회원가입" type="submit" />
    </Form>
  );
}

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

export default SignUpForm;
