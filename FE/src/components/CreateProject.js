import React, { useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css"; // css import

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
  const navigate = useNavigate();
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
    let sDate = new Date(startDate[0], startDate[1], startDate[2]).getTime();
    let eDate = new Date(endDate[0], endDate[1], endDate[2]).getTime();

    let term = (eDate - sDate) / (1000 * 60 * 60 * 24);
    const project = [
      sessionStorage.getItem("user_email"),
      {
        project_title: projectTitle,
        start_date: startDate,
        end_date: endDate,
        term,
      },
    ];

    fetch("http://localhost:8443/projects", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((res) => {
        navigate(`${res.projectId}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <PageContainer>
      <CalenderForm onSubmit={onSubmit}>
        <TitleInput
          placeholder="여행 제목을 입력해주세요"
          value={projectTitle}
          onChange={onChangeProjectTitle}
        />
        <CreateBtns>
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
            프로젝트<br></br> 생성
          </CreateProjectSubmit>
        </CreateBtns>
        <CalendarContainer>
          {showStartBtn && (
            <Calendar onChange={settedStartDate} value={value} />
          )}
          {showEndtBtn && <Calendar onChange={settedEndDate} value={value} />}
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
  width: 499px;
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
  margin-top: 20px;
`;
const CreateProjectSubmit = styled.button`
  width: 151px;
  height: 131px;
  font-size: 30px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border: 0;
  background: #ff8830;
  border-radius: 20px;
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 37px;
  text-align: center;
  color: #ffffff;
`;

const CreateBtns = styled.div`
  display: flex;
  flex-direciont: row;
  align-items: center;
  width: 810px;
  justify-content: space-between;
`;

export default CreateProject;
