import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import styled from "styled-components";
import ModifyModal from "../components/projectModal/ModifyModal";

function SideBarTitle(props) {
  const navigate = useNavigate();
  return (
    <PlanTitleWrap>
      <div>
        <PlanHome
          onClick={() => {
            navigate("/");
          }}
        />
        <PlanTitle>{props.title}</PlanTitle>
      </div>
      <ModifyModal title={props.title} />
    </PlanTitleWrap>
  );
}

const PlanHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  margin-bottom: 12px;
  /* width: 10px' */
`;

const PlanTitleWrap = styled.div`
  display: flex;
  height: 82px;
  justify-content: flex-start;
  align-items: flex-end;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: space-between;
`;
const PlanTitle = styled.h1`
  display: inline-flex;
  font-style: normal;
  font-weight: 700;
  font-size: 2.5vh;
  line-height: 48px;
  color: #ff8a3d;
  margin-left: 10px;
  /* color: #000000; */
`;

export default React.memo(SideBarTitle);
