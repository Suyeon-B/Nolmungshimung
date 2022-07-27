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

import socket from "../../socket";

async function fetchProjectById(_id) {
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}/projects/${_id}`
  );
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
  // const userName = sessionStorage.getItem("myNickname");

  const colors = {
    // "#FF8A3D": false,
    "#8DD664": false,
    "#FF6169": false,
    "#975FFE": false,
    "#0072BC": false,
    "#F6282B": false,
    "#FAD700": false,
    "#05FFCC": false,
    "#4A4A4A": false,
  };
  const getColor = () => {
    for (let color in colors) {
      if (!colors[color]) {
        colors[color] = true;
        return color;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      socket.emit("projectLeave", [projectId, auth.user.user_name]);
    });
  }, []);
  let userName = auth?.user?.user_name;

  useEffect(() => {
    console.log(auth);
    // if (!auth.user) {
    //   window.location.href = "/signin";
    // }
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
      // console.log("connectUser", connectUserInfo);
      // console.log(colors);
      setConnectUser((prev) => {
        let newUser = { ...prev };
        const newUserArr = Object.keys(newUser);
        const currentArr = Object.keys(connectUserInfo);

        let diff;
        //유저가 나간 경유
        if (newUserArr.length > currentArr.length) {
          diff = newUserArr.filter((el) => !currentArr.includes(el));
          colors[newUser[diff[0]].color] = false;
          delete newUser[diff[0]];
          return newUser;
        } else if (newUserArr.length === currentArr.length) {
          for (let user in newUser) {
            newUser[user].selectedIndex = connectUserInfo[user].selectedIndex;
          }
        }
        // 기존 정보가 아닌 다른 정보
        diff = currentArr.filter((el) => !newUserArr.includes(el));
        for (let user of diff) {
          newUser = {
            ...newUser,
            [user]: {
              color: getColor(),
              selectedIndex: connectUserInfo[user].selectedIndex,
            },
          };
        }
        return newUser;
      });
    });
    return () => {
      socket.removeAllListeners("connectUser");
    };
  }, []);

  useEffect(() => {
    // 접속한 유저에 대한 정보 저장하기
    if (
      auth === null ||
      auth === undefined ||
      auth.user === undefined ||
      auth.user === null
    )
      return;
    console.log("projectJoin");
    socket.emit("projectJoin", [projectId, auth.user.user_name]);
    return () => {
      socket.emit("projectLeave", [projectId, userName]);
      socket.off("connect");
      socket.off("disconnect");
      setIsDrage(false);
      console.log("project page unmount");
    };
  }, [projectId, auth]);

  useEffect(() => {
    if (itemsRoute === null) return;

    async function UpdateInfo() {
      try {
        await fetch(
          `https://${process.env.REACT_APP_SERVER_IP}/projects/routes/${projectId}`,
          {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(itemsRoute),
          }
        ).then((res) => res.json());
      } catch (err) {
        console.log(err);
      }
    }
    UpdateInfo();

    socket.emit("changeRoute", [itemsRoute, projectId]);
    setIsDrage(false);
    setIsAddDel(false);
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
      // console.log("nnn");
      // console.log(user_name);
      // console.log("i receive notify");
      // 모달 버전 크롬 알람안되면 이거씁시다.

      const openNotificationWithIcon = (type) => {
        notification[type]({
          message: "놀멍쉬멍",
          description: `${user_name}님이 입장했습니다.`,
        });
      };
      openNotificationWithIcon("success");
      // const triggerNotif = useNotification("놀멍쉬멍", {
      //   body: `${user_name}님이 입장했습니다.`,
      // });
      // triggerNotif();
      // console.log("입장");
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
          message: "놀멍쉬멍",
          description: `${user_name}님이 ${date} 페이지로 당신을 부르고 있어요!`,
        });
      };
      openNotificationWithIcon("success");
      // const triggerNotif = useNotification("놀멍쉬멍", {
      //   body: `${user_name}님이 ${date} 페이지로 당신을 부르고 있어요!`,
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
    return <div>isLoading....</div>;
  }

  // const triggerNotif = () => {
  //   useNotification("놀멍쉬멍", {
  //     body: `${auth.user?.user_name}이 입장했어요!`,
  //   });
  // };

  return (
    <ConnectuserContext.Provider value={{ connectUser, setConnectUser }}>
      <PlanSideBar
        item={items}
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
          <Suspense fallback={<div>Loading...</div>}>
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
          <Suspense fallback={<div>Loading...</div>}>
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
