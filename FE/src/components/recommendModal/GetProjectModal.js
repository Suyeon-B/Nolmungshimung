import { Button, Modal } from "antd";
import React, { useState } from "react";
import ModalCalender from "./ModalCalendar";
import ModalCalendarRange from "./ModalCalendarRange";
import { useAuth } from "../auth/Auth";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DropDown from "./DropDown";
import styled from "styled-components";
import SignIn from "../../pages/sign/SignIn";
import Badge from "../../atomics/Badge";

const setDay = (value) => {
  return [value.getFullYear(), value.getMonth() + 1, value.getDate(), value.getDay()];
};

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate);
  sDate.setDate(sDate.getDate() + day);

  return `${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

const GetProjectModal = ({ routes }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectDate, setSelectDate] = useState([]);
  const [toggleBtn, setToggleBtn] = useState(true);
  let auth = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchSelectDate = async (data) => {
    data["selectDate"] = selectDate;
    console.log(data);
    console.log(selectDate);

    const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/selectdate`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
    if (response.ok) {
      const resData = await response.json();
      window.location.href = `/project/${resData.projectId}`;
      // navigate(`/project/${resData.projectId}`, { replace: false });
    }
  };

  const fetchAllDate = async (data) => {
    const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/alldate`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
      //이동 후 다시 목록을 불러오지 않음
      window.location.href = `/project/${resData.projectId}`;
      // navigate(`/project/${resData.projectId}`, { replace: false });
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
      fetchSelectDate(data);
    }
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
      <StyledGetBtn onClick={showModal}>가져오기</StyledGetBtn>
      <StyledModal
        title="내 여행일정으로 가져오기"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="여행일정에 추가하기"
        cancelText="취소"
      >
        <StyledTitleInput
          autoFocus="autofocus"
          type="text"
          name=""
          id=""
          placeholder="여행 제목을 입력해주세요"
          value={projectTitle}
          onChange={onChange}
        />
        <StyledBtnDiv>
          <StyledAllBtn toggleBtn={toggleBtn} onClick={() => setToggleBtn(true)}>
            전체 가져오기
          </StyledAllBtn>
          <StyledSelectBtn toggleBtn={toggleBtn} onClick={() => setToggleBtn(false)}>
            날짜 선택해서 가져오기
          </StyledSelectBtn>
        </StyledBtnDiv>

        {toggleBtn && (
          <>
            <StyledP>여행 시작 날짜 선택</StyledP>
            <ModalCalender startDate={startDate} setStartDate={setStartDate} />
          </>
        )}
        {!toggleBtn && (
          <>
            <StyledP>여행 기간 선택하기</StyledP>
            <ModalCalendarRange setSelectDate={setSelectDate} setStartDate={setStartDate} />

            {selectDate.map((el, index) => {
              return (
                <p>
                  {culTripTermData(startDate, index)}{" "}
                  <DropDown key={index} index={index} setSelectDate={setSelectDate} routes={routes} />
                </p>
              );
            })}
          </>
        )}
      </StyledModal>
    </>
  );
};
const StyledGetBtn = styled.button`
  border-radius: 5px;
  background-color: #ff8a3d;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 700;
  width: 84px;
  height: 32px;
  cursor: pointer;
  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }
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
  box-shadow: ${(props) => (props.toggleBtn ? "inset 2px 4px 4px rgb(0 0 0 / 25%)" : "")};
`;

const StyledSelectBtn = styled(StyledAllBtn)`
  background-color: ${(props) => (props.toggleBtn ? "white" : "#ebebeb")};
  box-shadow: ${(props) => (props.toggleBtn ? "none" : "inset 2px 4px 4px rgb(0 0 0 / 25%)")};
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

export default GetProjectModal;
