import { Button, Modal } from "antd";
import React, { useState } from "react";
import ModalCalender from "./ModalCalendar";
import ModalCalendarRange from "./ModalCalendarRange";
import { useAuth } from "../auth/Auth";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const GetProjectModal = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [projectTitle, setProjectTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [toggleBtn, setToggleBtn] = useState(true);
  const auth = useAuth();
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

  const showModal = () => {
    setVisible(true);
  };

  const fetchSelectDate = async (data) => {
    // const response = await fetch(
    //   `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/selectdate`,
    //   {
    //     method: "post",
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   }
    // );
    // if (response.ok) {
    //   console.log("프로젝트로 이동시키기");
    //   const resData = await response.json();
    //   console.log(resData);
    //   navigate(`/project/${resData.projectId}`, { replace: false });
    // }
  };

  const fetchAllDate = async (data) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/alldate`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      console.log("프로젝트로 이동시키기");
      const resData = await response.json();
      console.log(resData);
      navigate(`/project/${resData.projectId}`, { replace: false });
    }
  };

  const handleOk = (event) => {
    // 달력 날짜 입력, 프로젝트 제목 입력 예외 처리 추가
    console.log(auth);
    event.preventDefault();
    const data = {
      projectId,
      userId: auth.user._id,
      userName: auth.user.user_name,
      userEmail: auth.user.user_email,
      startDate: setDay(startDate),
      projectTitle,
    };

    if (toggleBtn) {
      fetchAllDate(data);
    } else {
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const onChange = (event) => {
    setProjectTitle(event.target.value);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        내 프로젝트로 가져오기
      </Button>
      <Modal
        title="내 프로젝트로 가져오기"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="프로젝트에 추가하기"
        cancelText="취소"
      >
        <StyledBtnDiv>
          <StyledAllBtn
            toggleBtn={toggleBtn}
            onClick={() => setToggleBtn(true)}
          >
            전체 가져오기
          </StyledAllBtn>
          <StyledSelectBtn
            toggleBtn={toggleBtn}
            onClick={() => setToggleBtn(false)}
          >
            날짜 선택해서 가져오기
          </StyledSelectBtn>
        </StyledBtnDiv>

        {toggleBtn && (
          <form type="submit">
            <input
              type="text"
              name=""
              id=""
              placeholder="여행 제목을 입력해주세요"
              value={projectTitle}
              onChange={onChange}
            />
            <p>전체 가져오기 여행 시작 날짜 선택</p>
            <ModalCalender startDate={startDate} setStartDate={setStartDate} />
          </form>
        )}
        {!toggleBtn && (
          <form type="submit">
            <input
              type="text"
              name=""
              id=""
              placeholder="여행 제목을 입력해주세요"
              value={projectTitle}
              onChange={onChange}
            />
            <p>날짜 선택 여행 일정 선택하기</p>
            <ModalCalendarRange
              startDate={startDate}
              setStartDate={setStartDate}
            />
          </form>
        )}
      </Modal>
    </>
  );
};

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
`;

const StyledSelectBtn = styled(StyledAllBtn)`
  background-color: ${(props) => (props.toggleBtn ? "white" : "#ebebeb")};
`;

const StyledBtnDiv = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #ebebeb;
  border-bottom: 2px solid #ebebeb;
`;

export default GetProjectModal;
