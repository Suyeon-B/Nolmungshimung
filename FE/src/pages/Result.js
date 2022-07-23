import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ResultMap from "../components/MarkMap/resultMap";
import { CloseOutlined } from "@ant-design/icons";

function Result() {
  const { projectId } = useParams();
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [routes, setRoutes] = useState(null); // routes -> [[route],[route],[route]...]
  // route -> [{spotInfo},{spotInfo},{spotInfo}...]
  async function fetchProjectById(_id) {
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`
    );
    return response.json();
  }

  useEffect(() => {
    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);
      setRoutes(data.routes);
      // console.log(data.routes);
      setTitle(data.project_title);
      setStartDate(data.start_date.join(".").slice(0, -2));
    }
    fetchInfo();
    return () => {};
  }, [projectId]);

  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate);
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getFullYear()}. ${
      sDate.getMonth() + 1
    }. ${sDate.getDate()}`;
  };

  return (
    <ResultWhole>
      <ResultContainer>
        <div>
          <CloseOutlined
            style={{ color: "red", fontWeight: "900", fontSize: "30px" }}
            onClick={() => {
              window.history.back();
            }}
          />
          <ResultXTitle> &nbsp;&nbsp;&nbsp;전체 여행 경로</ResultXTitle>
        </div>
        <br />
        <br />
        <ResultProjectTitle>{title}</ResultProjectTitle>
        {routes &&
          routes.map((route, idx) => {
            return route.length !== 0 ? (
              <div key={idx + 1}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1} | {culTripTermData(startDate, idx)}
                  <br />
                </ResultTitle>{" "}
                {route.map((el, index) => (
                  <ResultRoute key={el.uid}>
                    {el.place_name}
                    <br />
                  </ResultRoute>
                ))}
              </div>
            ) : (
              <div key={idx + 1}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1} | {culTripTermData(startDate, idx)}
                  <br />
                </ResultTitle>
                <ResultRoute key={idx + 991}>
                  쉬는 날 🌱
                  <br />
                </ResultRoute>
              </div>
            );
          })}
      </ResultContainer>
      <ResultMap routes={routes} />
    </ResultWhole>
  );
}

const ResultWhole = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ResultImage = styled.img`
  right: 0;
  top: 0;
  width: calc(100vw-400px);
  height: 100vh;
  resize: cover;

  background-repeat: no-repeat;
`;

const ResultProjectTitle = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 900;
  font-size: 35px;
  line-height: 36px;
  color: #ff8a3d;
`;

const ResultXTitle = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`;

const ResultTitle = styled.section`
  font-family: "Inter";
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  line-height: 36px;
  margin-bottom: 12px;
`;

const ResultLine = styled.div`
  border-bottom: 4px solid lightgray;
  margin-bottom: 25px;
  margin-top: 20px;
`;

const ResultRoute = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 29px;
  marign-bottom: 9px;
`;

const ResultContainer = styled.div`
  display: flex;
  width: 400px;
  min-width: 400px;
  padding: 25px;
  height: 100vh;
  box-shadow: 5px 5px 5px 15px lightgray;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

export default Result;
