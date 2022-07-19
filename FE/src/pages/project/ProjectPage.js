import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";
import Sfu from "./Sfu";
import SpotRoute from "../spotRoute/SpotRoute";
import styled from "styled-components";
import { BrowserRouter as Routes, Route, Navigate } from "react-router-dom";
import Voicetalk from "../../components/voiceTalk/voiceTalk";
import { ConnectuserContext } from "../../context/ConnectUserContext";
import cloneDeep from "lodash/cloneDeep";
// import io from "socket.io-client";

// const socket = io(`https://${process.env.REACT_APP_SERVER_IP}:3001`);

import socket from "../../socket";

async function fetchProjectById(_id) {
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`
  );
  // const response = await fetch(
  //   `https://438e69a6-c891-4d7e-bfd2-f30c4eba330f.mock.pstmn.io/projects/mokc`
  // );
  return response.json();
}
const colors = ["#FF8A3D", "#8DD664", "#FF6169", "#975FFE", "#0072BC"];

const ProjectPage = (props) => {
  const { projectId } = useParams();

  const [items, setItems] = useState(null);
  const [itemsRoute, setItemsRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDrage, setIsDrage] = useState(false);
  const [isAddDel, setIsAddDel] = useState(false);
  const [connectUser, setConnectUser] = useState({});
  const userName = sessionStorage.getItem("myNickname");

  useEffect(() => {
    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);

      setItems(data);
      setItemsRoute(data.routes);

      // const joinVoice = new Sfu({projectId: projectId, });
      // // import Sfu from './Sfu'
      // // Sfu.connect()
      // joinVoice.on("onConnected", () => {
      //   // joinVoice.join(projectId)
      //   // console.log('joinVoice Start')
      //   joinVoice.connect();
      // });

      if (!isFirstPage) {
        setIsFirstPage(true);
      }
    }
    fetchInfo();
    return () => {
      // joinVoice.onLeave();
      // joinVoice.exitRoom();
    };
  }, [projectId]);

  useEffect(() => {
    socket.on("connectUser", (connectUserInfo) => {
      console.log("connectUser", connectUserInfo);
      setConnectUser(connectUserInfo);
    });
  }, []);

  useEffect(() => {
    socket.emit("projectJoin", [projectId, userName, selectedIndex]);
    // 접속한 유저에 대한 정보 저장하기

    return () => {
      socket.emit("projectLeave", [projectId, userName]);
      socket.off("connect");
      socket.off("disconnect");
      setIsDrage(false);
      // console.log("project page unmount");
    };
  }, [projectId]);

  useEffect(() => {
    if (itemsRoute === null) return;

    async function UpdateInfo() {
      // const tmpProjectId = await fetchProjectById(projectId);
      try {
        const response = await fetch(
          `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${projectId}`,
          {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(itemsRoute),
          }
        ).then((res) => res.json());
        // console.log(response);
      } catch (err) {
        console.log(err);
      }
      // console.log("UpdateInfo");
    }
    UpdateInfo();

    socket.emit("changeRoute", [itemsRoute, projectId]);
    setIsDrage(false);
    setIsAddDel(false);
  }, [isDrage, isAddDel]);

  useEffect(() => {
    socket.on("updateRoute", (itemsRoute) => {
      // console.log("updateRoute");
      setItemsRoute(itemsRoute);
    });
  }, []);

  useEffect(() => {
    socket.emit("updateUserIndex", [projectId, userName, selectedIndex]);
  }, [selectedIndex]);

  if (isLoading) {
    if (items) {
      setIsLoading(false);
    }
    return <div>isLoading....</div>;
  }

  const toggleIsPage = () => {
    setIsFirstPage(!isFirstPage);
  };

  return (
    <ConnectuserContext.Provider value={{ connectUser, setConnectUser }}>
      {/* {data ? <div>is data</div> : <div>not data</div>} */}
      <PlanSideBar
        item={items}
        isFirstPage={isFirstPage}
        toggleIsPage={toggleIsPage}
        itemRoutes={itemsRoute}
        setItemRoutes={setItemsRoute}
        setSelectedIndex={setSelectedIndex}
        setIsDrage={setIsDrage}
        setIsAddDel={setIsAddDel}
      />
      <PlanSection>
        {isFirstPage && (
          <Search
            startDate={items.start_date}
            itemRoutes={itemsRoute}
            setItemRoutes={setItemsRoute}
            projectId={projectId}
            setIsAddDel={setIsAddDel}
          />
        )}
        {!isFirstPage && (
          <SpotRoute
            selectedIndex={selectedIndex}
            item={itemsRoute}
            setItemRoute={setItemsRoute}
            itemId={items._id}
            setIsDrage={setIsDrage}
            setIsAddDel={setIsAddDel}
          />
        )}
      </PlanSection>
      <Voicetalk projectId={projectId} />
    </ConnectuserContext.Provider>
  );
};
const PlanSection = styled.section`
  width: 81%;
`;

export default ProjectPage;
