import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/auth/Auth";
import Badge from "../../atomics/Badge";

const kauthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=2d1c91f12a4c8020dbcc39ddb0c368b0&redirect_uri=https://${process.env.REACT_APP_CLIENT_IP}/kakao/signin&response_type=code`;

function SignInForm() {
  let navigate = useNavigate();
  const location = useLocation();
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
      .then(async (res) => {
        console.log("res : ", res);
        if (res.loginSuccess === true) {
          // success();
          console.log("Sign In Success");
          sessionStorage.setItem("myNickname", res.user_name);
          sessionStorage.setItem("user_email", res.user_email);
          // navigate("/", { replace: true });
          // console.log(location);
          // console.log(res.user);
          if (location.state?.page === "recommend") {
            navigate(-1, {
              state: {
                page: "signin",
              },
            });
          } else {
            // console.log(res);
            await login(res.user);
            // window.location.href = "/";
            navigate("/", { replace: true });
          }
        } else {
          Badge.fail("로그인 실패", res.message);
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

  return (
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
export default SignInForm;
