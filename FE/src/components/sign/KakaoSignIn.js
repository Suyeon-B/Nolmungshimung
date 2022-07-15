import * as React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/Auth";

const qs = require("qs");

function KakaoSignIn(props) {
  const { login } = useAuth();
  // const { isLoading, isError, error, mutate } = useMutation(singInUser, {
  //   retry: 1,
  // });
  let navigate = useNavigate();
  // const href = window.location.href;
  let params = new URL(document.URL).searchParams;
  let query = params.get("code");

  React.useEffect(() => {
    // console.log(query);
    if (query) {
      // console.log("핸들");
      getKakaoTokenHandler(query.toString());
    }
  }, []);
  const getKakaoTokenHandler = async (code) => {
    const data = {
      grant_type: "authorization_code",
      client_id: "2d1c91f12a4c8020dbcc39ddb0c368b0",
      redirect_uri: `https://${process.env.REACT_APP_SERVER_IP}:3000/kakao/signin`,
      code: code,
    };
    await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: qs.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        sendKakaoTokenToServer(data.access_token);
      });
  };

  //발급받은 access 토큰을 서버로 넘기고, 서버에서 JWT 토큰 값(추가로 user정보)을 받아 localstorage에 저장
  const sendKakaoTokenToServer = async (token) => {
    // console.log(token);
    await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/users/kakao`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loginSuccess === true) {
          console.log("Sign In Success");
          navigate("/", { replace: true });
          sessionStorage.setItem("myNickname", data.user_name);
          sessionStorage.setItem("user_email", data.user_email);
          console.log(data.token);
          login({ user: data.user_email });
        } else {
          window.alert(data.message);
          navigate("/signin");
        }
      })
      .catch((err) => console.log(`err: ${err}`));
  };

  return (
    <div>
      <h1> error </h1>
    </div>
  );
}

export default KakaoSignIn;
