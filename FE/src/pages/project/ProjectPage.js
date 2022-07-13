import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";
import TextEditor from "../shareMemo/TextEditor";
import { useQuery } from "react-query";
import SpotRoute from "../spotRoute/SpotRoute";
import styled from "styled-components";

async function fetchProjectById(_id) {
  const response = await fetch(`http://localhost:8443/projects/${_id}`);
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
      />
      <PlanSection>
        {isFirstPage && (
          <Search
            itemRoutes={itemsRoute}
            setItemRoutes={setItemsRoute}
            projectId={projectId}
          />
        )}
        {!isFirstPage && (
          <SpotRoute
            item={itemsRoute}
            setItemRoute={setItemsRoute}
            itemId={items._id}
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
