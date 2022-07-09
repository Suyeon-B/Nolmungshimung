import React from "react";
import "./ProjectSide.css";

function PlanSideBar() {
  return (
    <div className="side_bar">
      <div className="plan_title_wrapper">
        <h1 className="plan_title">우정 여행</h1>
        <span>접</span>
      </div>
      <div className="side_button_div">
        <p>상세 일정 보러가기</p>
      </div>
      <div className="side_plan_list_div">plan</div>
      <div>사이드바 footer</div>
    </div>
  );
}

export default PlanSideBar;
