import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";
import { useQuery } from "react-query";
import SpotRoute from "../spotRoute/SpotRoute";
import styled from "styled-components";

async function fetchProjectById(_id) {
  const response = await fetch(`http://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`);
  // const response = await fetch(
  //   `https://438e69a6-c891-4d7e-bfd2-f30c4eba330f.mock.pstmn.io/projects/mokc`
  // );
  return response.json();
}

const ProjectPage = (props) => {
  const { projectId } = useParams();
  const [items, setItems] = useState(null);
  const [itemsRoute, setItemsRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFirstPage, setIsFirstPage] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 리액트 쿼리로 하려 했다가 실패
  // const { data, isError, error, isLoading } = useQuery(
  //   ["projectInfo", projectId],
  //   () => {
  //     fetchProjectById(projectId);
  //   }
  // );
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (isError) {
  //   return <div>isError - {error}...</div>;
  // }

  useEffect(() => {
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);

      setItems(data);
      setItemsRoute(data.routes);
    }
    fetchInfo();
  }, [projectId]);

  useEffect(() => {
    async function UpdateInfo() {
      const tmpProjectId = await fetchProjectById(projectId);
      // console.log("id", tmpProjectId._id);
      fetch(`http://${process.env.REACT_APP_SERVER_IP}:8443/projects/routes/${tmpProjectId._id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(itemsRoute),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res : ", res);
        })
        .catch((err) => console.log(`err: ${err}`));
    }
    UpdateInfo();
  }, [itemsRoute]);

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
      />
      <PlanSection>
        {isFirstPage && <Search itemRoutes={itemsRoute} setItemRoutes={setItemsRoute} projectId={projectId} />}
        {!isFirstPage && (
          <SpotRoute selectedIndex={selectedIndex} item={itemsRoute} setItemRoute={setItemsRoute} itemId={items._id} />
        )}
      </PlanSection>
    </>
  );
};
const PlanSection = styled.section`
  width: 81%;
`;

export default ProjectPage;
