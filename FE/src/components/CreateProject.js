import React, { useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css"; // css import
import "./ProjectSide.css";

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

const TitleInput = styled.input`
  position: absolute;
  width: 499px;
  height: 80px;
  left: 555px;
  top: 200px;
  box-shadow: inset 2px 4px 4px rgba(0, 0, 0, 0.25);
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

  position: absolute;
  width: 614px;
  height: 100px;
  left: 497px;
  top: 300px;
  background: #ffffff;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 10px;
`;
const CalendarBtn = styled.div`
  display: flex;
  background: #ffffff;
  border: 0px;
  align-items: center;
`;
const CalendarBtnDay = styled.span`
  margin-left: 20px;
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 48px;
  /* identical to box height */

  color: #7d7a7a;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  // width: 614px;
  // height: 100px;
  left: 497px;
  top: 403px;
`;
const CreateProjectSubmit = styled.button`
  position: absolute;
  width: 220px;
  left: 1124px;
  top: 321px;
  font-size: 30px;
`;

const setDay = (value) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return [
    value.getFullYear(),
    value.getMonth() + 1,
    value.getDate(),
    value.getDay(),
  ];
};

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [showStartBtn, setShowStartBtn] = useState(false);
  const [showEndtBtn, setShowEndtBtn] = useState(false);
  const [value, onChange] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const settedStartDate = (value) => {
    setStartDate(setDay(value));
  };
  const settedEndDate = (value) => {
    setEndDate(setDay(value));
  };
  const onChangeProjectTitle = (event) => {
    setProjectTitle(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (projectTitle === "") {
      alert("여행 제목을 입력해주세요");
      return;
    }
    if (!startDate || !endDate) {
      alert("여행 일정을 선택해주세요");
      return;
    }
    const project = {
      project_title: projectTitle,
      start_date: startDate,
      end_date: endDate,
    };

    fetch("http://localhost:8443/projects", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <PageContainer>
      <form onSubmit={onSubmit}>
        <TitleInput
          placeholder="여행 제목을 입력해주세요"
          value={projectTitle}
          onChange={onChangeProjectTitle}
        />
        <CalendarBtnContainer>
          <CalendarBtn onClick={() => setShowStartBtn(!showStartBtn)}>
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
          <CalendarBtn onClick={() => setShowEndtBtn(!showEndtBtn)}>
            <img width={"50px"} alt="" src="/statics/images/calender_end.png" />
            <CalendarBtnDay>
              {endDate ? `${endDate[1]}월 ${endDate[2]}일` : "여행 종료 날짜"}
            </CalendarBtnDay>
          </CalendarBtn>
        </CalendarBtnContainer>
        <CreateProjectSubmit type="submit">프로젝트 생성</CreateProjectSubmit>
        <CalendarContainer>
          {showStartBtn && (
            <Calendar onChange={settedStartDate} value={value} />
          )}
          {showEndtBtn && <Calendar onChange={settedEndDate} value={value} />}
        </CalendarContainer>
      </form>
    </PageContainer>
  );
};

export default CreateProject;
