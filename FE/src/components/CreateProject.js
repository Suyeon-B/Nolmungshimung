import React, { useState } from "react";

import styled from "styled-components";
import "react-calendar/dist/Calendar.css"; // css import
import CalendarTwo from "./CalendarTwo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";
import Badge from "../atomics/Badge";

const setDay = (value) => {
  return [
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate(),
    value.getDay(),
  ];
};

const CreateProject = () => {
  const auth = useAuth();
  let navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const settedDate = (startDate, endDate) => {
    setStartDate(setDay(startDate));
    setEndDate(setDay(endDate));
  };

  const onChangeProjectTitle = (event) => {
    setProjectTitle(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (projectTitle === "") {
      Badge.fail("생성 실패", "여행 제목을 입력해주세요");
      return;
    }
    if (!startDate || !endDate) {
      Badge.fail("생성 실패", "여행 일정을 선택해주세요");
      return;
    }
    const sDate = new Date(startDate[0], startDate[1], startDate[2]).getTime();
    const eDate = new Date(endDate[0], endDate[1], endDate[2]).getTime();

    const term = parseInt((eDate - sDate) / (1000 * 60 * 60 * 24));
    const project = [
      // sessionStorage.getItem("user_email"),
      auth.user.user_email,
      {
        project_title: projectTitle,
        start_date: startDate,
        end_date: endDate,
        term,
      },
    ];

    fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/projects`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((res) => {
        navigate(`/project/${res.projectId}`, { replace: false });
        // window.location.href = `project/${res.projectId}`;
      })
      .catch((err) => console.log(err));
  };

  const goHome = () => {
    navigate("/", { replace: false });
  };

  return (
    <PageContainer>
      <CreateHomeImg src="\statics\images\main_logo.png" onClick={goHome} />
      <CalenderForm onSubmit={onSubmit}>
        <TitleInput
          maxLength="10"
          placeholder="여행 제목을 입력해주세요"
          value={projectTitle}
          onChange={onChangeProjectTitle}
        />
        <CreateBtns>
          <CalendarBtnContainer>
            <CalendarBtn onClick={() => setShowCalendar(!showCalendar)}>
              <img
                width={"50px"}
                alt=""
                src="/statics/images/calender_start.png"
              />
              <CalendarBtnDay>
                {startDate
                  ? `${startDate[1]}월 ${startDate[2]}일`
                  : "여행 시작 날짜"}
              </CalendarBtnDay>
            </CalendarBtn>
            <CalendarBtn onClick={() => setShowCalendar(!showCalendar)}>
              <img
                width={"50px"}
                alt=""
                src="/statics/images/calender_end.png"
              />
              <CalendarBtnDay>
                {endDate ? `${endDate[1]}월 ${endDate[2]}일` : "여행 종료 날짜"}
              </CalendarBtnDay>
            </CalendarBtn>
          </CalendarBtnContainer>
          <CreateProjectSubmit type="submit">
            여행일정<br></br> 생성
          </CreateProjectSubmit>
        </CreateBtns>
        <CalendarContainer>
          {showCalendar && <CalendarTwo settedDate={settedDate} />}
        </CalendarContainer>
      </CalenderForm>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(statics/images/signUpBackground.png);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const CalenderForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TitleInput = styled.input`
  margin-bottom: 20px;
  width: 812px;
  height: 80px;
  box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
  border: 0;
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 71px;
  text-align: center;
  color: #7d7a7a;
  background: #ffffff;
  border-radius: 10px;
`;
const CalendarBtnContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 614px;
  height: 100px;
  left: 497px;
  top: 300px;
  background: #ffffff;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 10px;
  cursor: pointer;
`;
const CalendarBtn = styled.div`
  display: flex;
  background: #ffffff;
  border: 0px;
  align-items: center;
  cursor: pointer;
`;
const CalendarBtnDay = styled.span`
  margin-left: 20px;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 48px;
  /* identical to box height */
  color: #7d7a7a;
  cursor: pointer;
`;
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;
const CreateProjectSubmit = styled.button`
  width: 166px;
  height: 100px;
  font-size: 30px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border: 0;
  background: #ff8a3d;
  border-radius: 20px;
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 37px;
  text-align: center;
  color: #ffffff;
  &:hover {
    background: rgb(255, 170, 117);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }
`;

const CreateBtns = styled.div`
  display: flex;
  /* flex-direction: row; */
  align-items: center;
  width: 810px;
  justify-content: space-between;
  cursor: pointer;
`;

const CreateHomeImg = styled.img`
  position: absolute;
  left: 25px;
  top: 15px;
  z-index: 2;
  cursor: pointer;
`;

export default CreateProject;
