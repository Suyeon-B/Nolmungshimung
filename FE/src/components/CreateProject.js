import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import
import "./ProjectSide.css";

const ProjectMake = () => {
  const [value, onChange] = useState(new Date());
  return (
    <div
      className="create_project_div"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/statics/images/signUpBackground.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <input
        className="trip_title_input"
        placeholder="여행제목을 입력해주세요"
      />
      <div className="trip_calendar_select_div">
        <button className="trip_calendar_select_btn">
          <img width={"50px"} alt="" src="/statics/images/calender_start.png" />
          <span className="trip_calendar_select_span">여행 시작 날짜</span>
        </button>
        {/* <span className="line"></span> */}
        <button className="trip_calendar_select_btn">
          <img width={"50px"} alt="" src="/statics/images/calender_end.png" />
          <span className="trip_calendar_select_span">여행 종료 날짜</span>
        </button>
      </div>
      <div>
        <Calendar onChange={onChange} value={value} />
      </div>
    </div>
  );
};

export default ProjectMake;
