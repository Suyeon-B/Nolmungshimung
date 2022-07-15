import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";

import SpotRoute from "../spotRoute/SpotRoute";
import styled from "styled-components";

import io from "socket.io-client";

const socket = io(`https://${process.env.REACT_APP_SERVER_IP}:3001`);

async function fetchProjectById(_id) {
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`
  );
  return response.json();
}

const ProjectPage = (props) => {
  const { projectId } = useParams();
  const [items, setItems] = useState(null);
  const [itemsRoute, setItemsRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDrage, setIsDrage] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);

      setItems(data);
      setItemsRoute(data.routes);
      if (!isFirstPage) {
        setIsFirstPage(true);
      }
    }
    fetchInfo();
  }, [projectId]);

  useEffect(() => {
    socket.emit("projectEmit", projectId);

    socket.on(`${projectId}`, (el) => {
      // console.log(el);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      setIsDrage(false);
      console.log("project page unmount");
    };
  }, [projectId]);

  useEffect(() => {
    if (itemsRoute === null) return;
    console.log("change Route");

    async function UpdateInfo() {
      // const tmpProjectId = await fetchProjectById(projectId);
      // console.log("id", tmpProjectId);
      fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(itemsRoute),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("res : ", data);
        })
        .catch((err) => console.log(`err: ${err}`));
    }
    UpdateInfo();
    socket.emit("changeRoute", [itemsRoute, projectId]);
    setIsDrage(false);
  }, [isDrage]);

  useEffect(() => {
    socket.on("updateRoute", (itemsRoute) => {
      console.log("updateRoute");
      setItemsRoute(itemsRoute);
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

  return (
    <>
      {/* {data ? <div>is data</div> : <div>not data</div>} */}
      <PlanSideBar
        item={items}
        isFirstPage={isFirstPage}
        toggleIsPage={toggleIsPage}
        itemRoutes={itemsRoute}
        setItemRoutes={setItemsRoute}
        setSelectedIndex={setSelectedIndex}
        setIsDrage={setIsDrage}
      />
      <PlanSection>
        {isFirstPage && (
          <Search
            startDate={items.start_date}
            itemRoutes={itemsRoute}
            setItemRoutes={setItemsRoute}
            projectId={projectId}
          />
        )}
        {!isFirstPage && (
          <SpotRoute
            selectedIndex={selectedIndex}
            item={itemsRoute}
            setItemRoute={setItemsRoute}
            itemId={items._id}
            setIsDrage={setIsDrage}
          />
        )}
      </PlanSection>
    </>
  );
};
const PlanSection = styled.section`
  width: 81%;
`;

export default ProjectPage;
