import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";

const ProjectPage = (props) => {
  const { projectId } = useParams();

  return (
    <>
      <PlanSideBar />
      <div>ProjectPage: {projectId}</div>
    </>
  );
};

export default ProjectPage;
