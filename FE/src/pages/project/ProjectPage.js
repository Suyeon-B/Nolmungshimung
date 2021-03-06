import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
// import Search from "../search/Search";
const Search = React.lazy(() => import("../search/Search"));
// import Sfu from "./Sfu";
// import SpotRoute from "../spotRoute/SpotRoute";
const SpotRoute = React.lazy(() => import("../spotRoute/SpotRoute"));
import styled from "styled-components";
import { BrowserRouter as Routes, Route, Navigate } from "react-router-dom";
import Voicetalk from "../../components/voiceTalk/voiceTalk";
import { ConnectuserContext } from "../../context/ConnectUserContext";
import { useAuth } from "../../components/auth/Auth";
import useNotification from "../../atomics/Notification";
import { notification } from "antd";
import { useQuery } from "react-query";
import Loading from "../../components/loading/Loading";

import socket from "../../socket";

async function fetchProjectById(_id) {
  const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`);
  console.log(response);
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
  const [attentionIndex, setAttentionIndex] = useState(-1);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      socket.emit("projectLeave", [projectId, auth.user.user_name]);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.emit("projectLeave", [projectId, auth.user.user_name]);
      });
    };
  }, []);
  let userName = auth?.user?.user_name;

  // console.log(connectUser);
  useEffect(() => {
    // console.log(auth);

    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);

      setItems(data);
      setItemsRoute(data.routes);

      if (!isFirstPage) {
        setIsFirstPage(true);
      }
    }
    fetchInfo();
  }, []);

  useEffect(() => {
    socket.on("connectUser", (connectUserInfo) => {
      setConnectUser(connectUserInfo);
    });

    return () => {
      socket.removeAllListeners("connectUser");
    };
  }, []);

  useEffect(() => {
    // ????????? ????????? ?????? ?????? ????????????
    if (auth === null || auth === undefined || auth.user === undefined || auth.user === null) return;
    // console.log("projectJoin");
    socket.emit("projectJoin", [projectId, auth.user.user_name]);
    return () => {
      socket.emit("projectLeave", [projectId, userName]);
      socket.off("connect");
      socket.off("disconnect");
      setIsDrage(false);
      console.log("project page unmount");
    };
  }, []);

  useEffect(() => {
    if (itemsRoute === null) return;
    if (isAddDel || isDrage) {
      console.log("socket ?????????");
      async function UpdateInfo() {
        try {
          await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${projectId}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            // credentials: "include",
            body: JSON.stringify(itemsRoute),
          }).then((res) => res.json());
        } catch (err) {
          console.log(err);
        }
      }
      UpdateInfo();
      // console.log(itemsRoute);
      socket.emit("changeRoute", [itemsRoute, projectId]);
      if (isDrage) setIsDrage(false);
      if (isAddDel) setIsAddDel(false);
    }
  }, [isDrage, isAddDel]);

  useEffect(() => {
    socket.on("updateRoute", (resItemsRoute) => {
      setItemsRoute(resItemsRoute);
    });
    return () => {
      socket.removeAllListeners("updateRoute");
    };
  }, []);

  useEffect(() => {
    socket.emit("updateUserIndex", [projectId, userName, selectedIndex]);
  }, [selectedIndex]);

  useEffect(() => {
    socket.on("notify", (user_name) => {
      const openNotificationWithIcon = (type) => {
        notification[type]({
          message: "????????????",
          description: `${user_name}?????? ??????????????????.`,
        });
      };
      openNotificationWithIcon("success");
    });
    return () => {
      socket.removeAllListeners("notify");
    };
  }, []);

  useEffect(() => {
    socket.on("attentionPlease", ([date, user_name], attentionIdx) => {
      setAttentionIndex(attentionIdx);
      const openNotificationWithIcon = (type) => {
        notification[type]({
          message: "????????????",
          description: `${user_name}?????? ${date} ???????????? ????????? ????????? ?????????!`,
        });
      };
      openNotificationWithIcon("success");
      // const triggerNotif = useNotification("????????????", {
      //   body: `${user_name}?????? ${date} ???????????? ????????? ????????? ?????????!`,
      // });
      // triggerNotif();
    });
    return () => {
      socket.removeAllListeners("attentionPlease");
    };
  }, []);

  const goSearchPage = useCallback(() => {
    setIsFirstPage(true);
  }, [isFirstPage]);
  const goDetailPage = useCallback(() => {
    setIsFirstPage(false);
  }, [isFirstPage]);

  if (isLoading) {
    if (items) {
      setIsLoading(false);
    }
    return <Loading />;
  }

  // const triggerNotif = () => {
  //   useNotification("????????????", {
  //     body: `${auth.user?.user_name}??? ???????????????!`,
  //   });
  // };

  return (
    <ConnectuserContext.Provider value={{ connectUser, setConnectUser }}>
      <PlanSideBar
        projectTitle={items.project_title}
        startDate={items.start_date}
        goSearchPage={goSearchPage}
        goDetailPage={goDetailPage}
        isFirstPage={isFirstPage}
        itemRoutes={itemsRoute}
        setItemRoutes={setItemsRoute}
        setSelectedIndex={setSelectedIndex}
        setIsDrage={setIsDrage}
        setIsAddDel={setIsAddDel}
        attentionIndex={attentionIndex}
        setAttentionIndex={setAttentionIndex}
        userName={userName}
      />
      <PlanSection>
        {isFirstPage && (
          <Suspense fallback={<Loading />}>
            <Search
              startDate={items.start_date}
              itemRoutes={itemsRoute}
              setItemRoutes={setItemsRoute}
              projectId={projectId}
              setIsAddDel={setIsAddDel}
            />
          </Suspense>
        )}
        {!isFirstPage && (
          <Suspense fallback={<Loading />}>
            <SpotRoute
              projectId={projectId}
              startDate={items.start_date}
              selectedIndex={selectedIndex}
              item={itemsRoute}
              setItemRoute={setItemsRoute}
              itemId={items._id}
              setIsDrage={setIsDrage}
              setIsAddDel={setIsAddDel}
              userName={userName}
            />
          </Suspense>
        )}
      </PlanSection>
      {auth.user && <Voicetalk projectId={projectId} auth={auth.user} />}
    </ConnectuserContext.Provider>
  );
};
const PlanSection = styled.section`
  width: 81%;
`;

export default React.memo(ProjectPage);
