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
import { useAuth } from "../../components/auth/Auth";
import useNotification from "../../atomics/Notification";

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

const ProjectPage = (props) => {
  const { projectId } = useParams();
  const auth = useAuth();

  const [items, setItems] = useState(null);
  const [itemsRoute, setItemsRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDrage, setIsDrage] = useState(false);
  const [isAddDel, setIsAddDel] = useState(false);
  const [connectUser, setConnectUser] = useState({});
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
    if (
      auth === null ||
      auth === undefined ||
      auth.user === undefined ||
      auth.user === null
    )
      return;
    socket.emit("projectJoin", [projectId, auth.user.user_name]);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      setIsDrage(false);
      // console.log("project page unmount");
    };
  }, [projectId, auth]);

  useEffect(() => {
    if (itemsRoute === null) return;
    console.log("socket: change Route");

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
    socket.on("notify", (user_name) => {
      console.log("nnn");
      console.log(user_name);
      console.log("i receive notify");
      // triggerNotif(user_name);
      const triggerNotif = useNotification("놀멍쉬멍", {
        body: `${user_name}님이 입장했습니다.`,
      });
      triggerNotif();
      console.log("입장");
    });
  }, []);

  if (isLoading) {
    if (items) {
      setIsLoading(false);
    }
    return <div>isLoading....</div>;
  }

  const toggleIsPage = () => {
    setIsFirstPage(!isFirstPage);
  };

  // const triggerNotif = () => {
  //   useNotification("놀멍쉬멍", {
  //     body: `${auth.user?.user_name}이 입장했어요!`,
  //   });
  // };

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
            startDate={items.start_date}
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
      {/* <button onClick={triggerNotif}>ㅇㅇ </button> */}
    </ConnectuserContext.Provider>
  );
};
const PlanSection = styled.section`
  width: 81%;
`;

export default ProjectPage;
