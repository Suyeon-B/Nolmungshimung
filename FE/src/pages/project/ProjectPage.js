import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import PlanSideBar from "../../components/sidebar/PlanSideBar";
import Search from "../search/Search";
import TextEditor from "../shareMemo/TextEditor";

const ProjectPage = (props) => {
  const { projectId } = useParams();

  return (
    <>
      <PlanSideBar />
      <Search />
      <TextEditor />
    </>
  );
};

export default ProjectPage;
