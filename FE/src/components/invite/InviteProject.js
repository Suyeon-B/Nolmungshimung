import React, { useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function InviteProject(props) {
  const auth = useAuth();
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");

  // console.log(auth.user.user_email);
  useEffect(() => {
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/invite/${token}/${auth.user.user_email}`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          addUser(auth.user.user_email, res.project)
            .then((data) => {
              if (data.success === true) {
                alert(data.message);
                navigate(`/project/${res.project}`, { replace: false });
              } else {
                // error(result.message);
                alert(data.message);
                navigate("/");
              }
            })
            .catch((e) => console.log(e));
        } else {
          alert(res.message);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <ResultImage src="/statics/images/signUpBackground.png" />
    </>
  );
}

function addUser(userId, projectId) {
  // console.log(userId, projectId);
  let data = { email: userId };
  return new Promise((resolve, reject) => {
    fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/friends/${projectId}`,
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
        // {
        //   success: true,
        //   message: "이미 초대에 응한 프로젝트입니다.",
        // }
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

const ResultImage = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default InviteProject;
