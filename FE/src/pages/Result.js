import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Drawer, Radio, Space } from "antd";
import { useParams } from "react-router-dom";

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
      setTitle(data.project_title);
      setStartDate(data.start_date.join(".").slice(0, -2));
      // console.log(JSON.stringify(data));
      // console.log(`routes : ${JSON.stringify(data.routes)}`);
      // for (let i = 0; i < data.routes.length; i++) {
      //   console.log(data.routes[i]);
      //   test.push(data.routes[i]);
      // }
      // console.log(routes);
      // console.log(`test : ${test[0].map((el) => el.place_name)}`);
    }
    fetchInfo();
    return () => {};
  }, [projectId]);

  const showDrawer = () => {
    setVisible(true);
    console.log(routes);
  };

  const onClose = () => {
    setVisible(false);
  };

  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate);
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getFullYear()}. ${
      sDate.getMonth() + 1
    }. ${sDate.getDate()}`;
  };

  return (
    <div>
      <button
        onClick={showDrawer}
        style={{ position: "absolute", zIndex: "10" }}
      >
        OPNE
      </button>
      <Drawer
        title="전체 여행 경로"
        placement="left"
        width={500}
        onClose={onClose}
        visible={visible}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ResultProjectTitle>{title}</ResultProjectTitle>
          {/* <ResultLine /> */}
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
                    채워주세요
                    <br />
                  </ResultRoute>
                </div>
              );
            })}
        </div>
      </Drawer>
      <ResultImage src="/statics/images/signUpBackground.png" />;
    </div>
  );
}

const ResultImage = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
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

export default Result;
