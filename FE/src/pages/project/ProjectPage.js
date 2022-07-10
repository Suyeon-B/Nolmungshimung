import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";

const ProjectPage = (props) => {
  const { projectId } = useParams();

  return (
    <>
      <PlanSideBar />
      <Search />
    </>
  );
};

export default ProjectPage;
