import { Button, Modal } from "antd";
import React, { useState } from "react";
import ModalCalender from "../recommendModal/ModalCalendar";
// import ModalCalendarRange from "./ModalCalendarRange";
import { useAuth } from "../auth/Auth";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import DropDown from "./DropDown";
import styled from "styled-components";
import SignIn from "../../pages/sign/SignIn";
import Badge from "../../atomics/Badge";

const setDay = (value) => {
  return [
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate(),
    value.getDay(),
  ];
};

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate);
  sDate.setDate(sDate.getDate() + day);

  return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

const ModifyModal = ({ routes, title }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [projectTitle, setProjectTitle] = useState(title);
  const [startDate, setStartDate] = useState(null);
  let auth = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const setDay = (value) => {
    return [
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
      value.getDay(),
    ];
  };

  const fetchModify = async () => {
    const data = {
      startDate: setDay(startDate),
      projectTitle,
    };
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      setVisible(false);
      location.reload();
    }
  };

  const handleOk = (event) => {
    // 달력 날짜 입력, 프로젝트 제목 입력 예외 처리 추가
    event.preventDefault();
    if (projectTitle.trim() === "") {
      Badge.fail("가져오기 실패", "여행 제목을 입력해주세요");
      return;
    } else if (startDate === null) {
      Badge.fail("가져오기 실패", "여행 날짜를 선택해주세요");
      return;
    }
    fetchModify();
  };

  const showModal = () => {
    if (auth.user === undefined) {
      navigate("/signIn", {
        state: {
          page: "recommend",
        },
      });
    }
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onChange = (event) => {
    setProjectTitle(event.target.value);
  };

  return (
    <>
      <StyledGetBtn onClick={showModal}>
        <img
          alt="svgImg"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmOGEzZCI+PHBhdGggZD0iTTc1LjE4MDAxLDE0LjMzMzMzYy0zLjQzMjgzLDAgLTYuMzY3MzYsMi40MjY1OSAtNy4wMjY2OSw1Ljc5NDkybC0yLjM5MzU1LDEyLjI4OTcxYy01Ljg4MjEsMi4yMjQyNyAtMTEuMzIxMDIsNS4zMzE3NiAtMTYuMDk3LDkuMjUyMjhsLTExLjc4NTgxLC00LjA1OTI0Yy0zLjI0NjUsLTEuMTE4IC02LjgxODQxLDAuMjI0NDEgLTguNTM4NDEsMy4xOTE0MWwtMTAuODA1OTksMTguNzI4NTJjLTEuNzEyODMsMi45NzQxNyAtMS4wODk0NSw2Ljc0OTk5IDEuNDk3NzIsOS4wMDAzM2w5LjQ0ODI0LDguMjE2NDdjLTAuNDkxMzcsMy4wMTk3IC0wLjgxMTg1LDYuMDkzODIgLTAuODExODUsOS4yNTIyOGMwLDMuMTU4NDYgMC4zMjA0OCw2LjIzMjU4IDAuODExODUsOS4yNTIyOGwtOS40NDgyNCw4LjIxNjQ3Yy0yLjU4NzE3LDIuMjUwMzMgLTMuMjEwNTUsNi4wMjYxNiAtMS40OTc3Miw5LjAwMDMybDEwLjgwNTk5LDE4LjcyODUyYzEuNzEyODMsMi45NzQxNyA1LjI5MTkxLDQuMzE2MjMgOC41Mzg0MSwzLjIwNTRsMTEuNzg1ODEsLTQuMDU5MjRjNC43NzQ0MSwzLjkxODA2IDEwLjIxNzU2LDcuMDE1MDEgMTYuMDk3LDkuMjM4MjhsMi4zOTM1NSwxMi4yODk3MmMwLjY1OTMzLDMuMzY4MzMgMy41OTM4Niw1Ljc5NDkyIDcuMDI2NjksNS43OTQ5MmgyMS42Mzk5OGMzLjQzMjgzLDAgNi4zNjczNSwtMi40MjY1OSA3LjAyNjY5LC01Ljc5NDkybDIuMzkzNTYsLTEyLjI4OTcyYzUuODgyMTEsLTIuMjI0MjcgMTEuMzIxMDIsLTUuMzMxNzYgMTYuMDk3LC05LjI1MjI3bDExLjc4NTgxLDQuMDU5MjRjMy4yNDY1LDEuMTE4IDYuODE4NDEsLTAuMjE3MjQgOC41Mzg0MSwtMy4xOTE0bDEwLjgwNTk5LC0xOC43NDI1MmMxLjcxMjg0LC0yLjk3NDE3IDEuMDg5NDUsLTYuNzM1OTkgLTEuNDk3NzIsLTguOTg2MzNsLTkuNDQ4MjQsLTguMjE2NDdjMC40OTEzNywtMy4wMTk3IDAuODExODUsLTYuMDkzODIgMC44MTE4NSwtOS4yNTIyOGMwLC0zLjE1ODQ2IC0wLjMyMDQ4LC02LjIzMjU4IC0wLjgxMTg1LC05LjI1MjI4bDkuNDQ4MjQsLTguMjE2NDdjMi41ODcxNywtMi4yNTAzMyAzLjIxMDU2LC02LjAyNjE2IDEuNDk3NzIsLTkuMDAwMzNsLTEwLjgwNTk5LC0xOC43Mjg1MmMtMS43MTI4MywtMi45NzQxNyAtNS4yOTE5MSwtNC4zMTYyNCAtOC41Mzg0MSwtMy4yMDU0bC0xMS43ODU4MSw0LjA1OTI0Yy00Ljc3NDQsLTMuOTE4MDYgLTEwLjIxNzU1LC03LjAxNTAxIC0xNi4wOTcsLTkuMjM4MjhsLTIuMzkzNTYsLTEyLjI4OTcxYy0wLjY1OTMzLC0zLjM2ODMzIC0zLjU5Mzg1LC01Ljc5NDkyIC03LjAyNjY5LC01Ljc5NDkyek04Niw1Ny4zMzMzM2MxNS44MzExNywwIDI4LjY2NjY3LDEyLjgzNTUgMjguNjY2NjcsMjguNjY2NjdjMCwxNS44MzExNyAtMTIuODM1NSwyOC42NjY2NyAtMjguNjY2NjcsMjguNjY2NjdjLTE1LjgzMTE3LDAgLTI4LjY2NjY3LC0xMi44MzU1IC0yOC42NjY2NywtMjguNjY2NjdjMCwtMTUuODMxMTcgMTIuODM1NSwtMjguNjY2NjcgMjguNjY2NjcsLTI4LjY2NjY3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
        />
      </StyledGetBtn>
      <StyledModal
        title="내 여행일정 수정하기"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="여행일정 수정 완료"
        cancelText="취소"
      >
        <StyledTitleInput
          type="text"
          name=""
          id=""
          // placeholder="기존 title 가져오기"
          value={projectTitle}
          onChange={onChange}
          autoFocus="autoFocus"
        />
        <StyledP>여행 시작 날짜를 선택해주세요</StyledP>
        <ModalCalender startDate={startDate} setStartDate={setStartDate} />
      </StyledModal>
    </>
  );
};
const StyledGetBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
  cursor: pointer;
  margin-bottom: 10px;
  /* border-radius: 5px;
  background-color: #ff8a3d;
  border: none;
  color: white;
  font-size: 13px;
  font-weight: 700;
  width: 50px;
  height: 32px;
  
  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  } */
`;
const StyledP = styled.p`
  font-size: 22px;
  font-weight: 700;
  margin-top: 20px;
  border-bottom: 1px solid #d8d8d8;
`;

const StyledTitleInput = styled.input`
  outline: none;
  width: 100%;
  font-size: 24px;
  text-align: center;
  margin-bottom: 15px;
  border: 3px solid #ff8a3d;
  border-radius: 5px;
  padding: 8px;
  /* filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.25)); */
`;

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 22px;
    font-weight: 700;
    color: #ff8a3d;
  }
  .ant-modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ant-btn-primary {
    background-color: #ff8a3d;
    border: none;
    &:hover {
      background: rgba(255, 122, 0, 0.4);
      transition: background 0.3s ease, color 0.1s ease;
    }
    &:active {
      box-shadow: none;
    }
  }
  .ant-btn {
    border-radius: 5px;
  }
`;

const StyledAllBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
  cursor: pointer;
  width: 50%;
  height: 100%;

  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 42px;
  color: #7c8289;
  background-color: ${(props) => (props.toggleBtn ? "#ebebeb" : "white")};
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #ebebeb;
  border-bottom: 2px solid #ebebeb;
  box-shadow: ${(props) =>
    props.toggleBtn ? "inset 2px 4px 4px rgb(0 0 0 / 25%)" : ""};
`;

const StyledSelectBtn = styled(StyledAllBtn)`
  background-color: ${(props) => (props.toggleBtn ? "white" : "#ebebeb")};
  box-shadow: ${(props) =>
    props.toggleBtn ? "none" : "inset 2px 4px 4px rgb(0 0 0 / 25%)"};
`;

const StyledBtnDiv = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: white;
  justify-content: center;
  align-items: center;
  /* border-top: 2px solid #ebebeb;
  border-bottom: 2px solid #ebebeb; */
`;

export default ModifyModal;
